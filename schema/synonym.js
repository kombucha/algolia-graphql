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

  input SynonymInput {
    objectID: ID!
    type: SynonymType!

    input: String
    placeholder: String
    word: String

    corrections: [String!]
    replacements: [String!]
    synonyms: [String!]
  }

  extend type Mutation {
    # Create or update multiple synonyms.
    upsertSynonyms(
      indexName: String!
      synonyms: [SynonymInput!]!
      forwardToReplica: Boolean
    ): [Synonym]

    # Remove a single synonym from an index using its object id.
    deleteSynonym(indexName: String!, forwardToReplica: Boolean, objectID: ID!): Boolean

    # Remove all synonyms from an index.
    deleteAllSynonyms(indexName: String!, forwardToReplica: Boolean): Boolean
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
  },
  Mutation: {
    upsertSynonyms: (_, { indexName, synonyms, forwardToReplicas }, { algoliaClient }) => {
      const algoliaIndex = algoliaClient.initIndex(indexName);

      return algoliaIndex
        .batchSynonyms(synonyms, { forwardToReplicas })
        .then(({ taskID }) => algoliaIndex.waitTask(taskID))
        .then(() => synonyms)
        .catch(err => {
          throw err.message;
        });
    },
    deleteSynonym: (_, { indexName, forwardToReplicas, objectID }, { algoliaClient }) => {
      const algoliaIndex = algoliaClient.initIndex(indexName);

      return algoliaIndex
        .deleteSynonym(objectID, { forwardToReplicas })
        .then(({ taskID }) => algoliaIndex.waitTask(taskID))
        .then(() => true)
        .catch(err => {
          throw err.message;
        });
    },
    deleteAllSynonyms: (_, { indexName, forwardToReplicas }, { algoliaClient }) => {
      const algoliaIndex = algoliaClient.initIndex(indexName);

      return algoliaIndex
        .clearSynonyms({ forwardToReplicas })
        .then(({ taskID }) => algoliaIndex.waitTask(taskID))
        .then(() => true)
        .catch(err => {
          throw err.message;
        });
    }
  }
};

module.exports = { typeDef, resolvers };
