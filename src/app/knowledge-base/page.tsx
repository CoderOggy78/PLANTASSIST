import KnowledgeBaseList from '@/components/plant-assist/knowledge-base-list';
import { diseases } from '@/lib/data';

export default function KnowledgeBasePage() {
  return (
    <div className="container mx-auto max-w-3xl py-4">
      <header className="text-center mb-6">
        <h1 className="text-3xl font-bold text-primary font-headline">Disease Knowledge Base</h1>
        <p className="text-muted-foreground">Search our database for common plant diseases and their remedies.</p>
      </header>
      <KnowledgeBaseList diseases={diseases} />
    </div>
  );
}
