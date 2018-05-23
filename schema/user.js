const { gql } = require("apollo-server");
const { FAKE_USER } = require("./_fakeData");

const typeDef = gql`
  type User {
    id: ID!
    name: String
    avatar: String
    email: String
    applications: [Application]
  }

  extend type Query {
    currentUser: User
  }
`;

const resolvers = {
  Query: {
    currentUser: () => FAKE_USER
  }
};

module.exports = { typeDef, resolvers };
