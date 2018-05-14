const { ApolloServer } = require("apollo-server");
const algoliasearch = require("algoliasearch");

const { typeDefs, resolvers } = require("./schema");

const context = () => {
  const algoliaClient = algoliasearch(process.env.APP_ID, process.env.API_KEY);
  return { algoliaClient };
};

const enableEngine = !!process.env.ENGINE_API_KEY;

new ApolloServer({
  typeDefs,
  resolvers,
  context,
  enableIntrospection: true,
  tracing: enableEngine
})
  .listen({ port: process.env.PORT, engine: enableEngine })
  .then(
    serverInfo => {
      console.log(`Server started: ${serverInfo.url}`);
      console.log(`Engine enabled: ${enableEngine}`);
    },
    reason => console.log(`Failed to start server: ${reason}`)
  );
