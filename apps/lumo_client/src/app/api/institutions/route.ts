import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Institution from '@/models/Institution';
import redis from '@/lib/redis';

// Define a cache key for the full, unfiltered list
const INSTITUTIONS_CACHE_KEY = 'institutions:all';
const CACHE_EXPIRATION_SECONDS = 300; // 5 minutes

export async function GET(request: Request) {
  try {
    // Get search query from the URL, e.g., /api/institutions?search=university
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search');

    await connectDB();

    // If a search term is provided, query the DB directly
    if (search) {
      console.log(`DB SEARCH: Searching for institutions with term "${search}".`);
      const searchResults = await Institution.find({
        // Use a regular expression for a case-insensitive "contains" search
        name: { $regex: search, $options: 'i' },
      })
      .select('name branding members _id')
      .lean();
      
      return NextResponse.json(searchResults);
    }
    
    // If no search term, use the caching logic
    // 1. Check Redis Cache First
    const cachedInstitutions = await redis.get(INSTITUTIONS_CACHE_KEY);
    if (cachedInstitutions) {
      console.log('CACHE HIT: Returning all institutions from Redis.');
      return NextResponse.json(JSON.parse(cachedInstitutions));
    }

    // 2. If not in cache, fetch from MongoDB
    console.log('CACHE MISS: Fetching all institutions from MongoDB.');
    const institutions = await Institution.find({})
      .select('name branding members _id')
      .lean();

    // 3. Store the full list in Redis for future requests
    await redis.set(
      INSTITUTIONS_CACHE_KEY,
      JSON.stringify(institutions),
      'EX',
      CACHE_EXPIRATION_SECONDS
    );

    // 4. Return the freshly fetched data
    return NextResponse.json(institutions);

  } catch (error) {
    console.error('Failed to fetch institutions:', error);
    return NextResponse.json(
      { message: "An error occurred while fetching institutions.", error: (error as Error).message },
      { status: 500 }
    );
  }
}
