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
    # Index name.
    name: String!
    # Index creation date.
    createdAt: Date!
    # Date of last update.
    updatedAt: Date!
    # Number of records contained in the index.
    entries: Int!
    # Number of bytes of the index in minified format.
    dataSize: Int!
    # Number of bytes of the index binary file.
    fileSize: Int!
    # Last build time in seconds.
    lastBuildTimeS: Int!
    # Number of pending indexing operations.
    numberOfPendingTasks: Int!
    # A boolean which says whether the index has pending tasks.
    pendingTask: Boolean!

    settings: Settings
    synonyms(query: String, types: [SynonymType], page: Int, hitsPerPage: Int): SynonymList!
  }

  enum CopyScope {
    settings
    synonyms
    # as in Query Rules
    rules
  }

  extend type Mutation {
    # Delete an index and all its settings, including replicas.
    deleteIndex(indexName: String!): Boolean!

    # Make a copy of an index, including its objects, settings, synonyms, and query rules.
    copyIndex(
      # Name of the source index to copy.
      indexNameSrc: String!
      # Name of the destination index.
      indexNameDest: String!
      # If you omit the scope parameter, then all objects and all scope items are copied.
      scope: [CopyScope!]
    ): Boolean!

    # Rename an index. Normally used to reindex your data atomically, without any down time.
    moveIndex(
      # Index name of the index to move.
      indexNameSrc: String!
      # Index name of the destination index.
      indexNameDest: String!
    ): Boolean!

    # Clear the records of an index without affecting its settings.
    clearIndex(
      # Name of the index to clear.
      indexName: String!
    ): Boolean
  }
`;

const wrapAsyncAlgoliaTask = (promise, algoliaIndex) =>
  promise
    .then(({ taskID }) => algoliaIndex.waitTask(taskID))
    .then(() => true)
    .catch(err => {
      throw err.message;
    });

const resolvers = {
  Index: {
    createdAt: index => new Date(index.createdAt),
    updatedAt: index => new Date(index.createdAt),
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
  },
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
  Mutation: {
    deleteIndex: (_, { indexName }, { algoliaClient }) => {
      return wrapAsyncAlgoliaTask(
        algoliaClient.deleteIndex(indexName),
        algoliaClient.initIndex(indexName)
      );
    },
    copyIndex: (_, { indexNameSrc, indexNameDest, scope }, { algoliaClient }) => {
      return wrapAsyncAlgoliaTask(
        algoliaClient.copyIndex(indexNameSrc, indexNameDest, scope),
        algoliaClient.initIndex(indexNameSrc)
      );
    },
    moveIndex: (_, { indexNameSrc, indexNameDest }, { algoliaClient }) => {
      return wrapAsyncAlgoliaTask(
        algoliaClient.moveIndex(indexNameSrc, indexNameDest),
        algoliaClient.initIndex(indexNameSrc)
      );
    },
    clearIndex: (_, { indexName }, { algoliaClient }) => {
      return wrapAsyncAlgoliaTask(
        algoliaClient.clearIndex(indexName),
        algoliaClient.initIndex(indexName)
      );
    }
  }
};

module.exports = { typeDef, resolvers };
