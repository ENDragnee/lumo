import { useRouter } from 'next/router';

export const handleCardClick = (id: string) => {
    const router = useRouter();
    router.push(`/content?id=${id}`);
  };