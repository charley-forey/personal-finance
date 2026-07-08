'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Bell } from 'lucide-react';
import { PageHeader, Card } from '@/components/app-shell';
import { Badge, Button, EmptyState, Skeleton } from '@/components/ui';
import { api, type Notification } from '@/lib/api';
import { formatDate } from '@/lib/format';

function NotificationCard({
  notification,
  onMarkRead,
  marking,
}: {
  notification: Notification;
  onMarkRead: (id: string) => void;
  marking: boolean;
}) {
  const unread = !notification.readAt;

  return (
    <Card className={unread ? 'border-primary/30 bg-primary/5' : undefined}>
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="font-medium text-foreground">{notification.title}</h3>
            {unread && <Badge variant="primary">Unread</Badge>}
            <Badge variant="default">{notification.type}</Badge>
          </div>
          <p className="mt-1 text-sm text-muted">{notification.body}</p>
          {notification.readAt && (
            <p className="mt-2 text-xs text-muted">Read {formatDate(notification.readAt)}</p>
          )}
        </div>
        {unread && (
          <Button
            variant="secondary"
            size="sm"
            disabled={marking}
            onClick={() => onMarkRead(notification.id)}
          >
            Mark read
          </Button>
        )}
      </div>
    </Card>
  );
}

function NotificationGroup({
  title,
  count,
  notifications,
  onMarkRead,
  markingId,
}: {
  title: string;
  count: number;
  notifications: Notification[];
  onMarkRead: (id: string) => void;
  markingId: string | null;
}) {
  if (notifications.length === 0) return null;

  return (
    <section className="space-y-3">
      <div className="flex items-center gap-2">
        <h2 className="text-sm font-medium text-muted uppercase tracking-wide">{title}</h2>
        <Badge variant={title === 'Unread' ? 'primary' : 'default'}>{count}</Badge>
      </div>
      {notifications.map((n) => (
        <NotificationCard
          key={n.id}
          notification={n}
          onMarkRead={onMarkRead}
          marking={markingId === n.id}
        />
      ))}
    </section>
  );
}

export default function NotificationsPage() {
  const qc = useQueryClient();

  const { data: notifications, isLoading, error } = useQuery({
    queryKey: ['notifications'],
    queryFn: () => api.notifications(),
  });

  const markRead = useMutation({
    mutationFn: (id: string) => api.markNotificationRead(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['notifications'] }),
  });

  const unread = (notifications ?? []).filter((n) => !n.readAt);
  const read = (notifications ?? []).filter((n) => n.readAt);

  return (
    <div>
      <PageHeader
        title="Notifications"
        description="Alerts and reminders"
        actions={
          unread.length > 0 ? (
            <Badge variant="warning">{unread.length} unread</Badge>
          ) : undefined
        }
      />

      {error && (
        <Card className="mb-6 border-danger/50">
          <p className="text-danger text-sm">{error.message}</p>
        </Card>
      )}

      {isLoading && (
        <div className="space-y-3">
          <Skeleton className="h-24 w-full" />
          <Skeleton className="h-24 w-full" />
        </div>
      )}

      {!isLoading && !error && notifications?.length === 0 && (
        <EmptyState
          icon={Bell}
          title="All caught up"
          description="You have no notifications right now. Alerts about budgets, bills, and insights will appear here."
        />
      )}

      {!isLoading && notifications && notifications.length > 0 && (
        <div className="space-y-8">
          <NotificationGroup
            title="Unread"
            count={unread.length}
            notifications={unread}
            onMarkRead={(id) => markRead.mutate(id)}
            markingId={markRead.isPending ? (markRead.variables ?? null) : null}
          />
          <NotificationGroup
            title="Read"
            count={read.length}
            notifications={read}
            onMarkRead={(id) => markRead.mutate(id)}
            markingId={markRead.isPending ? (markRead.variables ?? null) : null}
          />
        </div>
      )}
    </div>
  );
}
