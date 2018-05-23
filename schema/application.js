const { gql } = require("apollo-server");
const { FAKE_APP, FAKE_USER } = require("./_fakeData");

const typeDef = gql`
  type Plan {
    name: String!
    label: String!
    team: Boolean!
  }

  type Application {
    id: ID!
    name: String
    owner: User!
    type: String!
    plan: Plan!
  }

  extend type Query {
    currentApp: Application
  }
`;

const resolvers = {
  Query: {
    currentApp: () => FAKE_APP
  },
  Application: {
    owner: () => FAKE_USER
  }
};

module.exports = { typeDef, resolvers, FAKE_APP };
