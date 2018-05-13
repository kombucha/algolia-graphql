const { gql } = require("apollo-server");

const typeDef = gql`
  # extend type Query {
  # }

  type Index {
    name: String!
    createdAt: String! # really it's a date
    updatedAt: String! # really it's a date
    entries: Int!
    dataSize: Int!
    fileSize: Int!
    lastBuildTimeS: Int!
    numberOfPendingTasks: Int!
    pendingTask: Boolean!
  }
`;

const resolvers = {};

module.exports = { typeDef, resolvers };
