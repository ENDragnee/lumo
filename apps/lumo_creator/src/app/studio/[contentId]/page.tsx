// @/app/studio/[contentId]/page.tsx
import { StudioComponent } from "@/components/studio/StudioCompoent";

type StudioParam = {
  params: Promise<{
    contentId: string
  }>
}

export default async function StudioPage({ params }: StudioParam) {
  const { contentId } = await params;

  return (
    <div className="flex h-screen bg-muted/40">
      {/* Main editor content area */}
      <main className="flex-1 flex flex-col overflow-hidden">
        <StudioComponent contentId={contentId} />
      </main>
    </div>
  );
}
