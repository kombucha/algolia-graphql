const { gql } = require("apollo-server");

const typeDef = gql`
  enum ACL {
    search
    browse
    addObject
    deleteObject
    deleteIndex
    settings
    editSettings
    analytics
    listIndexes
    logs
    seeUnretrievableAttributes
  }

  type ApiKey {
    value: String!
    createdAt: Int! # really: a date
    acl: [ACL]!
    validity: Int!
  }
`;

const resolvers = {};

module.exports = { typeDef, resolvers };
