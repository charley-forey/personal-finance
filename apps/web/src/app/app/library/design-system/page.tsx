import { AppPageHeader } from '@/components/ui';
import { DesignSystemCatalog } from '@/components/ui/design-system-catalog';

export default function DesignSystemPage() {
  return (
    <div>
      <AppPageHeader
        title="Design System"
        description="Visual catalog of shared UI primitives for local review and visual smoke checks."
      />
      <DesignSystemCatalog />
    </div>
  );
}
