const { gql } = require("apollo-server");

const typeDef = gql`
  extend type Query {
    searchSynonyms(
      query: String
      types: [SynonymType]
      page: Int
      hitsPerPage: Int
    ): SynonymResults!
  }

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

  type SynonymResults {
    hits: [Synonym]!
    nbHits: Int
  }
`;

const resolvers = {
  Query: {
    searchSynonyms: (_obj, args, { algoliaIndex }) => {
      const { query = "", types, page = 0, hitsPerPage = 100 } = args;
      const type = types ? types.join(",") : undefined;
      return algoliaIndex.searchSynonyms({ query, type, page, hitsPerPage });
    }
  },
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
