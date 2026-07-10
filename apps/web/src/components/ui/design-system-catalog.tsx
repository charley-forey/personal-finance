/**
 * Design-system visual smoke catalog.
 * Used by Playwright visual checks and local review at /app/library/design-system (dev).
 */
import { Badge, Button, Card, EmptyState, Input, Select, Skeleton, StatCard } from '@/components/ui';

export function DesignSystemCatalog() {
  return (
    <div className="space-y-8" data-testid="design-system-catalog">
      <section className="space-y-3">
        <h2 className="text-lg font-semibold">Buttons</h2>
        <div className="flex flex-wrap gap-3">
          <Button>Primary</Button>
          <Button variant="secondary">Secondary</Button>
          <Button variant="ghost">Ghost</Button>
          <Button variant="danger">Danger</Button>
          <Button size="sm">Small</Button>
          <Button size="lg">Large</Button>
          <Button disabled>Disabled</Button>
        </div>
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-semibold">Badges</h2>
        <div className="flex flex-wrap gap-2">
          <Badge>Default</Badge>
          <Badge variant="success">Success</Badge>
          <Badge variant="warning">Warning</Badge>
          <Badge variant="danger">Danger</Badge>
        </div>
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-semibold">Inputs</h2>
        <div className="grid gap-4 max-w-md">
          <Input label="Email" placeholder="you@example.com" />
          <Input label="With error" error="Required" />
          <Select
            label="Plan"
            options={[
              { value: 'free', label: 'Free' },
              { value: 'pro', label: 'Pro' },
            ]}
          />
        </div>
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-semibold">Cards & stats</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <StatCard title="Net worth" value="$128,400" change={{ value: '+2.4%', trend: 'up' }} />
          <Card title="Sample card">
            <p className="text-sm text-muted">Card body uses design tokens.</p>
          </Card>
          <Skeleton className="h-24 rounded-xl" />
        </div>
      </section>

      <section>
        <EmptyState
          title="Nothing here yet"
          description="Empty states share one vocabulary across the app."
          action={<Button size="sm">Get started</Button>}
        />
      </section>
    </div>
  );
}
