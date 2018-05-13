const { ApolloServer } = require("apollo-server");
const algoliasearch = require("algoliasearch");

const { typeDefs, resolvers } = require("./schema");

const context = () => {
  const algoliaClient = algoliasearch(process.env.APP_ID, process.env.API_KEY);
  const algoliaIndex = algoliaClient.initIndex(process.env.INDEX_NAME);

  return { algoliaIndex, algoliaClient };
};

new ApolloServer({
  typeDefs,
  resolvers,
  context,
  enableIntrospection: true,
  tracing: true
})
  .listen({ port: process.env.PORT, engine: true })
  .then(
    serverInfo => console.log(`Server started at ${serverInfo.url}`),
    reason => console.log(`Failed to start server: ${reason}`)
  );
