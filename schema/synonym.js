const { gql } = require("apollo-server");

const typeDef = gql`
  enum SynonymType {
    synonym
    oneWaySynonym
    altCorrection1
    altCorrection2
    placeholder
  }

  interface Synonym {
    objectID: ID!
    type: SynonymType!
  }

  type TwoWaySynonym implements Synonym {
    objectID: ID!
    type: SynonymType!
    synonyms: [String]!
  }

  type OneWaySynonym implements Synonym {
    objectID: ID!
    type: SynonymType!
    input: String!
    synonyms: [String]!
  }

  type AlternativeCorrection implements Synonym {
    objectID: ID!
    type: SynonymType!
    word: String!
    corrections: [String]!
  }

  type Placeholder implements Synonym {
    objectID: ID!
    type: SynonymType!
    placeholder: String!
    replacements: [String]!
  }
`;

const resolvers = {
  Synonym: {
    __resolveType: obj => {
      const type = obj ? obj.type : "";
      switch (type) {
        case "synonym":
          return "TwoWaySynonym";
        case "oneWaySynonym":
          return "OneWaySynonym";
        case "altCorrection1":
        case "altCorrection2":
          return "AlternativeCorrection";
        case "placeholder":
          return "Placeholder";
        default:
          console.warn(`Unknown type: ${type}`);
          return "Synonym";
      }
    }
  }
};

module.exports = { typeDef, resolvers };
