import { AppLoader } from '@/components/ui/AppLoader';

export default function QuizDetailLoadingPage() {
  return <AppLoader title="Loading quiz details..." subtitle="Collecting questions and answers" />;
}