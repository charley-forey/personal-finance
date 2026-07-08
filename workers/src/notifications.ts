import type { Database } from '@pf/database';
import { notifications, userPreferences, organizationMembers, users, insights, dailyOrgSnapshots } from '@pf/database';
import { eq, desc, and, gte } from 'drizzle-orm';
import { getNetWorth } from '@pf/sync';

export async function sendEmail(to: string, subject: string, body: string) {
  const apiKey = process.env.SENDGRID_API_KEY;
  if (!apiKey) {
    console.log(`[email] To: ${to}, Subject: ${subject}`);
    return { sent: false, reason: 'SendGrid not configured' };
  }

  try {
    const res = await fetch('https://api.sendgrid.com/v3/mail/send', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        personalizations: [{ to: [{ email: to }] }],
        from: { email: process.env.SENDGRID_FROM_EMAIL ?? 'noreply@personalfinance.os' },
        subject,
        content: [{ type: 'text/html', value: body }],
      }),
    });
    return { sent: res.ok };
  } catch {
    return { sent: false, reason: 'SendGrid request failed' };
  }
}

export async function createInAppNotification(
  db: Database,
  orgId: string,
  data: { type: string; title: string; body: string; userId?: string },
) {
  const [n] = await db
    .insert(notifications)
    .values({
      orgId,
      userId: data.userId,
      channel: 'in_app',
      type: data.type,
      title: data.title,
      body: data.body,
      sentAt: new Date(),
    })
    .returning();
  return n;
}

type NotificationJob = {
  type?: string;
  orgId?: string;
  userId?: string;
  email?: string;
  subject?: string;
  title?: string;
  body?: string;
  notificationType?: string;
  sendEmail?: boolean;
  createInApp?: boolean;
};

export async function handleNotificationJob(db: Database, job: { data: NotificationJob }) {
  const data = job.data;
  const orgId = data.orgId;
  if (!orgId) {
    console.warn('Notification job missing orgId', data);
    return;
  }

  if (data.type === 'weekly_digest') {
    await sendWeeklyDigestForOrg(db, orgId);
    return;
  }

  const title = data.title ?? data.subject ?? 'Notification';
  const body = data.body ?? '';
  const notifType = data.notificationType ?? data.type ?? 'general';
  const prefs = data.userId ? await getUserNotificationPrefs(db, data.userId) : null;
  const wantsEmail = data.sendEmail !== false && (prefs?.email !== false);
  const wantsInApp = data.createInApp !== false && (prefs?.inApp !== false);

  if (wantsInApp) {
    await createInAppNotification(db, orgId, {
      type: notifType,
      title,
      body,
      userId: data.userId,
    });
  }

  if (wantsEmail && data.email) {
    await sendEmail(data.email, data.subject ?? title, body);
  }
}

async function getUserNotificationPrefs(db: Database, userId: string) {
  const [prefs] = await db
    .select({ notificationSettingsJson: userPreferences.notificationSettingsJson })
    .from(userPreferences)
    .where(eq(userPreferences.userId, userId))
    .limit(1);
  return (prefs?.notificationSettingsJson ?? {}) as {
    email?: boolean;
    inApp?: boolean;
    weeklyDigest?: boolean;
    sms?: boolean;
  };
}

export async function sendWeeklyDigestForOrg(db: Database, orgId: string) {
  const members = await db
    .select({
      userId: organizationMembers.userId,
      role: organizationMembers.role,
      email: users.email,
    })
    .from(organizationMembers)
    .innerJoin(users, eq(organizationMembers.userId, users.id))
    .where(eq(organizationMembers.orgId, orgId));

  const owner = members.find((m) => m.role === 'owner') ?? members[0];
  if (!owner) return;

  const prefs = await getUserNotificationPrefs(db, owner.userId);
  if (prefs.weeklyDigest === false) return;

  const nw = await getNetWorth(db, orgId);
  const weekAgo = new Date();
  weekAgo.setDate(weekAgo.getDate() - 7);
  const weekAgoStr = weekAgo.toISOString().split('T')[0]!;

  const [priorSnapshot] = await db
    .select()
    .from(dailyOrgSnapshots)
    .where(and(eq(dailyOrgSnapshots.orgId, orgId), gte(dailyOrgSnapshots.snapshotDate, weekAgoStr)))
    .orderBy(dailyOrgSnapshots.snapshotDate)
    .limit(1);

  const priorNetWorth = priorSnapshot?.netWorth ? parseFloat(priorSnapshot.netWorth) : nw.netWorth;
  const change = nw.netWorth - priorNetWorth;

  const recentInsights = await db
    .select({ title: insights.title })
    .from(insights)
    .where(eq(insights.orgId, orgId))
    .orderBy(desc(insights.generatedAt))
    .limit(5);

  const summary = {
    netWorth: nw.netWorth,
    change,
    insights: recentInsights.map((i) => i.title),
  };

  const body = `
    <h2>Your Weekly Financial Digest</h2>
    <p>Net Worth: $${summary.netWorth.toFixed(2)} (${summary.change >= 0 ? '+' : ''}$${summary.change.toFixed(2)})</p>
    <h3>Insights</h3>
    <ul>${summary.insights.length ? summary.insights.map((i) => `<li>${i}</li>`).join('') : '<li>No new insights this week</li>'}</ul>
  `;

  if (prefs.email !== false && owner.email) {
    await sendEmail(owner.email, 'Your Weekly Financial Digest', body);
  }

  if (prefs.inApp !== false) {
    await createInAppNotification(db, orgId, {
      type: 'weekly_digest',
      title: 'Weekly Financial Digest',
      body: `Net worth: $${summary.netWorth.toFixed(2)} (${summary.change >= 0 ? '+' : ''}$${summary.change.toFixed(2)}). ${summary.insights.length} insight(s).`,
      userId: owner.userId,
    });
  }
}
