const { ApolloServer } = require("apollo-server");
const algoliasearch = require("algoliasearch");

const { typeDefs, resolvers } = require("./schema");

const context = () => {
  const algoliaClient = algoliasearch(process.env.APP_ID, process.env.API_KEY);
  const algoliaIndex = algoliaClient.initIndex(process.env.INDEX_NAME);

  console.info(`Instantiated algolia client ${process.env.APP_ID}/${process.env.INDEX_NAME}`);

  return { algoliaIndex, algoliaClient };
};

console.log(process.env);
new ApolloServer({ typeDefs, resolvers, context })
  .listen({ port: process.env.PORT })
  .then(
    serverInfo => console.log(`Server started at ${serverInfo.url}`),
    reason => console.log(`Failed to start server: ${reason}`)
  );
