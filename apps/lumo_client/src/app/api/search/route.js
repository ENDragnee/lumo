// /app/api/search/route.js

import { NextResponse } from 'next/server';
import { Client } from '@elastic/elasticsearch';

// Create an Elasticsearch client instance.
const esClient = new Client({
  node: process.env.ELASTICSEARCH_NODE || 'http://localhost:9200',
  auth: {
    username: process.env.ELASTICSEARCH_USER || 'elastic',
    password: process.env.ELASTICSEARCH_PASSWORD || 'yourpassword'
  }
});

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('query');

    if (!query || query.trim().length < 2) {
      return NextResponse.json(
        { success: false, error: 'Search query must be at least 2 characters' },
        { status: 400 }
      );
    }

    // --- Search the "contents" index ---
    const contentResponse = await esClient.search({
      index: 'contents',
      body: {
        query: {
          bool: {
            should: [
              {
                multi_match: {
                  query,
                  fields: [
                    'tags^2', 
                    'content_text',
                    'subject', 
                    'institution'
                  ],
                  fuzziness: 'AUTO'
                }
              }
            ]
          }
        },
        size: 10
      }
    });
    
    if (!contentResponse.hits) {
      console.error('Unexpected response structure:', contentResponse);
      return NextResponse.json(
        { success: false, error: 'Invalid response structure from Elasticsearch' },
        { status: 500 }
      );
    }    

    // Transform content results.
    const contentHits = contentResponse.hits.hits;
    const transformedContent = contentHits.map((hit) => {
      const source = hit._source;
      let parsedData;
      try {
        parsedData = JSON.parse(source.data);
      } catch (e) {
        parsedData = source.data;
      }
      return {
        ...source,
        data: parsedData,
        _id: hit._id,
        type: 'content',
        score: hit._score
      };
    });

    // --- Search the "users" index ---
    // In the users index search
    const userResponse = await esClient.search({
      index: 'users',
      body: {
        query: {
          bool: {
            should: [
              { match: { userTag: { query, fuzziness: 'AUTO' } } }, // Changed from username to userTag
              { match: { name: { query, fuzziness: 'AUTO' } } }
            ]
          }
        },
        size: 5
      }
    });

    const userHits = userResponse.hits.hits;

    // For each matching user, fetch the content they created.
    const transformedUsers = await Promise.all(
      userHits.map(async (hit) => {
        const userSource = hit._source;
        const userId = hit._id;

        const userContentResponse = await esClient.search({
          index: 'contents',
          body: {
            query: {
              term: { createdBy: userId }
            },
            size: 10
          }
        });

        const userContentHits = userContentResponse.hits.hits;
        const transformedUserContent = userContentHits.map((uHit) => {
          const uSource = uHit._source;
          let parsedData;
          try {
            parsedData = JSON.parse(uSource.data);
          } catch (e) {
            parsedData = uSource.data;
          }
          return {
            ...uSource,
            data: parsedData,
            _id: uHit._id,
            type: 'userContent',
            score: uHit._score
          };
        });

        return {
          ...userSource,
          _id: userId,
          type: 'user',
          content: transformedUserContent,
          score: hit._score
        };
      })
    );
    // Inside the GET function (after fetching contentResponse and userResponse)
    console.log('Content Response:', JSON.stringify(contentResponse, null, 2));
    console.log('User Response:', JSON.stringify(userResponse, null, 2));

    // Return combined results.
    return NextResponse.json({
      success: true,
      data: {
        content: transformedContent,
        users: transformedUsers
      }
    });
  } catch (error) {
    console.error('Search error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  } 
}
