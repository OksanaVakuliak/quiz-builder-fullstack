import { RouteModal } from '@/components/ui/RouteModal';
import { AppLoader } from '@/components/ui/AppLoader';

export default function ModalQuizDetailLoadingPage() {
  return (
    <RouteModal>
      <AppLoader
        compact
        title="Loading quiz details..."
        subtitle="Preparing modal content"
      />
    </RouteModal>
  );
}
