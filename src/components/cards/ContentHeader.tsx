// /components/cards/ContentHeader.tsx (NEW)
import { IContent } from "@/models/Content"; // Use your content type
import { Card, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Wifi, BookOpen } from 'lucide-react';

interface ContentHeaderProps {
  content: Pick<IContent, 'title' | 'difficulty' | 'tags' | 'contentType'>;
}

// This is a simple display component, perfect as a Server Component.
export function ContentHeader({ content }: ContentHeaderProps) {
  return (
    <Card className="shadow-apple-md">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-responsive-h3">{content.title}</CardTitle>
            <div className="flex items-center gap-2 mt-2">
              <Badge variant="secondary">{content.difficulty || 'Standard'}</Badge>
              {content.tags?.slice(0, 2).map(tag => (
                  <Badge key={tag} variant="outline">{tag}</Badge>
              ))}
            </div>
          </div>
          <Badge className="bg-blue-100 text-blue-800 border border-blue-200 py-1 px-3 capitalize">
            {content.contentType === 'static' ? 
              <BookOpen className="w-4 h-4 mr-2" /> : 
              <Wifi className="w-4 h-4 mr-2" />
            }
            {content.contentType} Content
          </Badge>
        </div>
      </CardHeader>
    </Card>
  );
}
