const { gql } = require("apollo-server");

const typeDef = gql`
  # extend type Query {
  # }

  type QueryRule {
    
  }
`;

const resolvers = {};

module.exports = { typeDef, resolvers };
