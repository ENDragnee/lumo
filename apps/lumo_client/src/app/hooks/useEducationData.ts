import { useReducer, useEffect, useCallback } from 'react';

interface CacheItem {
  data: any;
  timestamp: number;
}

interface State {
  grade: string;
  course: string;
  chapter: string;
  subchapter: string;
  loading: boolean;
  error: string | null;
  cache: Map<string, CacheItem>;
}

type Action =
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_GRADE'; payload: string }
  | { type: 'SET_COURSE'; payload: string }
  | { type: 'SET_CHAPTER'; payload: string }
  | { type: 'SET_SUBCHAPTER'; payload: string }
  | { type: 'SET_ERROR'; payload: string }
  | { type: 'CLEAR_ERROR' };

const initialState: State = {
  grade: '',
  course: '',
  chapter: '',
  subchapter: '',
  loading: false,
  error: null,
  cache: new Map(),
};

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    case 'SET_GRADE':
      return { ...state, grade: action.payload };
    case 'SET_COURSE':
      return { ...state, course: action.payload };
    case 'SET_CHAPTER':
      return { ...state, chapter: action.payload };
    case 'SET_SUBCHAPTER':
      return { ...state, subchapter: action.payload };
    case 'SET_ERROR':
      return { ...state, error: action.payload };
    case 'CLEAR_ERROR':
      return { ...state, error: null };
    default:
      return state;
  }
}

export const useEducationData = () => {
  const [state, dispatch] = useReducer(reducer, initialState);

  const getCacheKey = (endpoint: string, params: Record<string, string>) => {
    return `${endpoint}?${new URLSearchParams(params).toString()}`;
  };

  const getCachedData = (key: string) => {
    const cached = state.cache.get(key);
    if (!cached) return null;

    if (Date.now() - cached.timestamp > 5 * 60 * 1000) {
      state.cache.delete(key);
      return null;
    }
    return cached.data;
  };

  const setCachedData = (key: string, data: any) => {
    state.cache.set(key, { data, timestamp: Date.now() });
  };

  const fetchData = async (endpoint: string, params: Record<string, string>) => {
    const cacheKey = getCacheKey(endpoint, params);
    const cachedData = getCachedData(cacheKey);

    if (cachedData) {
      return cachedData;
    }

    dispatch({ type: 'SET_LOADING', payload: true });
    dispatch({ type: 'CLEAR_ERROR' });

    try {
      const response = await fetch(`/api/nav/${endpoint}?${new URLSearchParams(params)}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setCachedData(cacheKey, data);
      return data;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An error occurred';
      dispatch({ type: 'SET_ERROR', payload: errorMessage });
      throw error;
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const setGrade = (grade: string) => {
    dispatch({ type: 'SET_GRADE', payload: grade });
  };

  const setCourse = (course: string) => {
    dispatch({ type: 'SET_COURSE', payload: course });
  };

  const setChapter = (chapter: string) => {
    dispatch({ type: 'SET_CHAPTER', payload: chapter });
  };

  const setSubchapter = (subchapter: string) => {
    dispatch({ type: 'SET_SUBCHAPTER', payload: subchapter });
  };

  const fetchSubchapters = useCallback(async (grade: string, course: string, chapter: string) => {
    try {
      const data = await fetchData('subchapters', { grade, course, chapter });
      console.log('Subchapters:', data);
    } catch (error) {
      console.error('Error fetching subchapters:', error);
    }
  }, []);

  const fetchChapters = useCallback(async (grade: string, course: string) => {
    try {
      const data = await fetchData('chapters', { grade, course });
      console.log('Chapters:', data);
    } catch (error) {
      console.error('Error fetching chapters:', error);
    }
  }, []);

  const fetchCourses = useCallback(async (grade: string) => {
    try {
      const data = await fetchData('courses', { grade });
      console.log('Courses:', data);
    } catch (error) {
      console.error('Error fetching courses:', error);
    }
  }, []);

  const preloadNextData = useCallback(async (grade: string, course?: string, chapter?: string) => {
    if (course && chapter) {
      fetchSubchapters(grade, course, chapter);
    } else if (course) {
      fetchChapters(grade, course);
    } else {
      fetchCourses(grade);
    }
  }, [fetchSubchapters, fetchChapters, fetchCourses]);

  return {
    grade: state.grade,
    course: state.course,
    chapter: state.chapter,
    subchapter: state.subchapter,
    loading: state.loading,
    error: state.error,
    setGrade,
    setCourse,
    setChapter,
    setSubchapter,
    fetchSubchapters,
    fetchChapters,
    fetchCourses,
    preloadNextData,
  };
};
