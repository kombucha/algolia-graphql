// See https://dev-blog.apollodata.com/modularizing-your-graphql-schema-code-d7f71d5ed5f2
const { gql } = require("apollo-server");
const merge = require("lodash/merge");

const { typeDef: Synonym, resolvers: synonymResolvers } = require("./synonym.js");

const Query = gql`
  type Query {
    _empty: String
  }
`;

module.exports = {
  typeDefs: [Query, Synonym],
  resolvers: merge({}, synonymResolvers)
};
