"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Folder, FileText } from "lucide-react";

interface OrderItem {
  _id: string;
  title: string;
  type: 'collection' | 'content';
}

interface OrderListViewProps {
  collections: OrderItem[];
  content: OrderItem[];
}

export function OrderListView({ collections, content }: OrderListViewProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      <Card>
        <CardHeader>
          <CardTitle>Collections Sequence</CardTitle>
          <CardDescription>This is the current order of sub-collections.</CardDescription>
        </CardHeader>
        <CardContent>
          {collections.length > 0 ? (
            <ol className="space-y-3 list-decimal list-inside">
              {collections.map(item => (
                <li key={item._id} className="flex items-center bg-background p-3 border rounded-lg">
                  <Folder className="h-5 w-5 text-blue-500 mr-3 flex-shrink-0" />
                  <span className="font-medium">{item.title}</span>
                </li>
              ))}
            </ol>
          ) : <p className="text-muted-foreground text-sm">No collections to order.</p>}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Content Sequence</CardTitle>
          <CardDescription>This is the current order of content items.</CardDescription>
        </CardHeader>
        <CardContent>
          {content.length > 0 ? (
            <ol className="space-y-3 list-decimal list-inside">
              {content.map(item => (
                <li key={item._id} className="flex items-center bg-background p-3 border rounded-lg">
                  <FileText className="h-5 w-5 text-green-500 mr-3 flex-shrink-0" />
                  <span className="font-medium">{item.title}</span>
                </li>
              ))}
            </ol>
          ) : <p className="text-muted-foreground text-sm">No content to order.</p>}
        </CardContent>
      </Card>
    </div>
  );
}
