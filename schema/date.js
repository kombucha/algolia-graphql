const { gql } = require("apollo-server");
const { GraphQLScalarType, Kind } = require("graphql");

const typeDef = gql`
  scalar Date
`;

// https://www.apollographql.com/docs/graphql-tools/scalars.html
const resolvers = {
  Date: new GraphQLScalarType({
    name: "Date",
    description: "Date custom scalar type",
    parseValue(value) {
      return new Date(value);
    },
    serialize(value) {
      return value.toISOString();
    },
    parseLiteral(ast) {
      return ast.kind === Kind.STRING ? new Date(ast.value) : null;
    }
  })
};

module.exports = { typeDef, resolvers };
