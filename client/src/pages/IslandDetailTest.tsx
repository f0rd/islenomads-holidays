import { useRoute } from 'wouter';
import { trpc } from '@/lib/trpc';

export default function IslandDetailTest() {
  const [, params] = useRoute('/island/:id');
  const id = params?.id ? parseInt(params.id as string, 10) : null;
  
  const { data: guides = [], isLoading: guidesLoading, error: guidesError } = trpc.islandGuides.list.useQuery();

  return (
    <div style={{ padding: '20px', fontFamily: 'monospace', whiteSpace: 'pre-wrap' }}>
      <h1>Island Detail Test</h1>
      <p>ID from URL: {id}</p>
      <p>Guides Loading: {guidesLoading ? 'yes' : 'no'}</p>
      <p>Guides Error: {guidesError ? JSON.stringify(guidesError) : 'none'}</p>
      <p>Guides Count: {guides.length}</p>
      <p>Guides Data:</p>
      <pre>{JSON.stringify(guides, null, 2)}</pre>
    </div>
  );
}
