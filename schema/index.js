// See https://dev-blog.apollodata.com/modularizing-your-graphql-schema-code-d7f71d5ed5f2
const { gql } = require("apollo-server");
const merge = require("lodash/merge");

const { typeDef: Index, resolvers: indexResolvers } = require("./algoliaIndex");
const { typeDef: Settings, resolvers: settingsResolvers } = require("./settings");
const { typeDef: Synonym, resolvers: synonymResolvers } = require("./synonym");
const { typeDef: ApiKey, resolvers: apiKeyResolvers } = require("./apiKey");
const { typeDef: Date, resolvers: dateResolvers } = require("./date");

const Query = gql`
  type Query {
    _empty: String
  }

  type Mutation {
    _empty: String
  }
`;

module.exports = {
  typeDefs: [Query, Date, Synonym, Index, Settings, ApiKey],
  resolvers: merge(
    {},
    dateResolvers,
    synonymResolvers,
    indexResolvers,
    settingsResolvers,
    apiKeyResolvers
  )
};
