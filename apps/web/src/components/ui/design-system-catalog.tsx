/**
 * Design-system visual smoke catalog.
 * Used by Playwright visual checks and local review at /app/library/design-system (dev).
 */
'use client';

import { useState } from 'react';
import {
  Badge,
  Button,
  Card,
  DataTable,
  EmptyState,
  Input,
  Modal,
  Select,
  SegmentedControl,
  Sheet,
  Skeleton,
  StatCard,
  Switch,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
  Tooltip,
} from '@/components/ui';

export function DesignSystemCatalog() {
  const [modalOpen, setModalOpen] = useState(false);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [seg, setSeg] = useState('a');
  const [sw, setSw] = useState(true);

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
          <Badge variant="info">Info</Badge>
          <Badge variant="primary">Primary</Badge>
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
          <Switch label="Notifications" checked={sw} onCheckedChange={setSw} />
        </div>
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-semibold">Tabs & segmented</h2>
        <Tabs defaultValue="one">
          <TabsList>
            <TabsTrigger value="one">One</TabsTrigger>
            <TabsTrigger value="two">Two</TabsTrigger>
          </TabsList>
          <TabsContent value="one">Tab one content</TabsContent>
          <TabsContent value="two">Tab two content</TabsContent>
        </Tabs>
        <SegmentedControl
          aria-label="Segment demo"
          options={[
            { value: 'a', label: 'A' },
            { value: 'b', label: 'B' },
          ]}
          value={seg}
          onChange={setSeg}
        />
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-semibold">Overlays</h2>
        <div className="flex flex-wrap gap-3">
          <Button variant="secondary" onClick={() => setModalOpen(true)}>
            Open modal
          </Button>
          <Button variant="secondary" onClick={() => setSheetOpen(true)}>
            Open sheet
          </Button>
          <Tooltip content="Tooltip content">
            <Button variant="ghost">Hover me</Button>
          </Tooltip>
        </div>
        <Modal open={modalOpen} onClose={() => setModalOpen(false)} title="Sample modal">
          <p className="text-sm text-muted">Modal body with scrollable content on mobile.</p>
        </Modal>
        <Sheet open={sheetOpen} onClose={() => setSheetOpen(false)} title="Sample sheet">
          <p className="text-sm text-muted">Sheet becomes a bottom sheet on small screens.</p>
        </Sheet>
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

      <section className="space-y-3">
        <h2 className="text-lg font-semibold">Data table</h2>
        <DataTable
          columns={[
            { key: 'name', header: 'Name', priority: true },
            { key: 'amount', header: 'Amount', priority: true },
            { key: 'status', header: 'Status' },
          ]}
          data={[
            { name: 'Rent', amount: '$2,100', status: 'Paid' },
            { name: 'Groceries', amount: '$186', status: 'Pending' },
          ]}
          keyExtractor={(r) => r.name}
          mobilePresentation="cards"
        />
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
