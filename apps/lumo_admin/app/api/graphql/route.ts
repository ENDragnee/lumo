// /app/api/graphql/route.ts
import { ApolloServer } from '@apollo/server';
import { startServerAndCreateNextHandler } from '@as-integrations/next';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth'; // Your NextAuth config
import { typeDefs } from './schema';
import { resolvers } from './resolvers';

interface ContextValue {
  session?: Awaited<ReturnType<typeof getServerSession>>;
}

const server = new ApolloServer<ContextValue>({
  typeDefs,
  resolvers,
});

const handler = startServerAndCreateNextHandler(server, {
  context: async (req) => {
    const session = await getServerSession(authOptions);
    return { session };
  },
});


export { handler as GET, handler as POST };
