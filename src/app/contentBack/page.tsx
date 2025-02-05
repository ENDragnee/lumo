"use client";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import 'katex/dist/katex.min.css';
import { BlockMath, InlineMath } from 'react-katex';
import { LoaderContainer, Loader } from "@/components/ui/StyledComponent";
import ErrorMessage from "@/components/ErrorMessage";
import { Suspense, ReactNode } from "react";
import { createElement } from 'react';

interface ContentItem {
  type: string;
  props?: {
    className?: string;
    children?: (ContentItem | string)[] | string;
    math?: string;
    [key: string]: any;
  };
}

interface ContentResponse {
  content: ContentItem[];
}

const ContentComponent = () => {
  const [content, setContent] = useState<ContentItem[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const searchParams = useSearchParams();
  
  const grade = searchParams.get('grade');
  const course = searchParams.get('course');
  const chapter = searchParams.get('chapter');
  const subChapter = searchParams.get('subChapter');

  useEffect(() => {
    const fetchContent = async () => {
      setIsLoading(true);
      setError(null);
      setContent(null);

      if (!grade || !course || !chapter || !subChapter) {
        setError("Missing query parameters");
        setIsLoading(false);
        return;
      }

      try {
        const res = await fetch(
          `/api/nav/content?grade=${grade}&course=${course}&chapter=${chapter}&subChapter=${subChapter}`
        );
        if (!res.ok) {
          throw new Error(`Error: ${res.status}`);
        }
        const data: ContentResponse = await res.json();
        setContent(data.content);
      } catch (err: unknown) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError("An unknown error occurred");
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchContent();
  }, [grade, course, chapter, subChapter]);

  const renderContent = (item: ContentItem): ReactNode => {
    if (!item.type) return null;

    // Handle special components
    if (item.type === "BlockMath") {
      return createElement(BlockMath, {
        key: Math.random(),
        math: item.props?.math || ''
      });
    }

    if (item.type === "InlineMath") {
      return createElement(InlineMath, {
        key: Math.random(),
        math: item.props?.math || ''
      });
    }

    // Prepare props
    const elementProps: { [key: string]: any } = {
      key: Math.random(),
      ...item.props
    };

    // Handle children
    if (item.props?.children) {
      if (Array.isArray(item.props.children)) {
        elementProps.children = item.props.children.map(child => 
          typeof child === 'string' ? child : renderContent(child as ContentItem)
        );
      } else {
        elementProps.children = item.props.children;
      }
    }

    return createElement(item.type, elementProps);
  };

  if (isLoading) {
    return (
      <LoaderContainer>
        <Loader />
      </LoaderContainer>
    );
  }

  if (error) {
    return (
      <div className="px-6 py-10 max-w-4xl mx-auto">
        <ErrorMessage type="error" message={error} />
      </div>
    )
  }

  if (!content) {
    return (
      <div className="px-6 py-10 max-w-4xl mx-auto">
        <ErrorMessage type="info" message="No content available." />
      </div>
    )
  }

  return (
    <div className="px-6 py-10 max-w-4xl mx-auto text-justify">
      {content.map((item) => renderContent(item))}
    </div>
  );
};

const Content = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ContentComponent />
    </Suspense>
  );
};

export default Content;