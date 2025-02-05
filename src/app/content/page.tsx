import { ContentRenderer } from '@/components/contentRender';

export default function ContentPage() {
  return (
    <div className="px-6 sm:px-6 sm:text-xs md:text-base py-6 max-w-4xl mx-auto text-justify">
      <header className="p-4 bg-white shadow-sm">
        <ContentRenderer />
      </header>
    </div>
  );
}