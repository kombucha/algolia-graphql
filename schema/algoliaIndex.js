const { gql } = require("apollo-server");

const typeDef = gql`
  extend type Query {
    index(name: String!): Index
    indexes(indexPrefix: String, page: Int): [Index]
  }

  type SynonymList {
    nodes: [Synonym]!
    total: Int
  }

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

    settings: Settings
    synonyms(query: String, types: [SynonymType], page: Int, hitsPerPage: Int): SynonymList!
  }
`;

const resolvers = {
  Query: {
    index: (_obj, args, context) => {
      const { algoliaClient } = context;
      const { name } = args;

      return new Promise((resolve, reject) => {
        algoliaClient._jsonRequest({
          method: "GET",
          url: `/1/indexes?prefix=${encodeURIComponent(name)}`,
          hostType: "write",
          callback: (err, data) =>
            err ? reject(err) : resolve(data && data.items ? data.items[0] : null)
        });
      });
    },
    indexes: (_obj, args, context) => {
      const { algoliaClient } = context;
      const { indexPrefix = "", page = 0 } = args;

      return new Promise((resolve, reject) => {
        algoliaClient._jsonRequest({
          method: "GET",
          url: `/1/indexes?prefix=${encodeURIComponent(indexPrefix)}&page=${page}`,
          hostType: "write",
          callback: (err, data) => (err ? reject(err) : resolve(data ? data.items : []))
        });
      });
    }
  },
  Index: {
    synonyms: (index, args, { algoliaClient }) => {
      const { query = "", types, page = 0, hitsPerPage = 100 } = args;
      const type = types ? types.join(",") : undefined;
      const algoliaIndex = algoliaClient.initIndex(index.name);

      return algoliaIndex
        .searchSynonyms({ query, type, page, hitsPerPage })
        .then(data => ({ nodes: data.hits, total: data.nbHits }));
    },
    settings: (index, args, { algoliaClient }) => {
      const algoliaIndex = algoliaClient.initIndex(index.name);
      return algoliaIndex.getSettings().then(settings => ({
        ...settings,
        typoTolerance: String(settings.typoTolerance || true).toUpperCase(),
        optionalWords: [].concat(settings.optionalWords || []),
        ignorePlurals: settings.ignorePlurals ? settings.ignorePlurals : [],
        distinct: Number(settings.distinct)
      }));
    }
  }
};

module.exports = { typeDef, resolvers };
