const { gql } = require("apollo-server");

const typeDef = gql`
  # extend type Query {
  # }

  enum SortFacetValuesBy {
    count
    alpha
  }

  type Settings {
    # Attributes
    searchableAttributes: [String]!
    attributesForFaceting: [String]!
    unretrievableAttributes: [String]!
    attributesToRetrieve: [String]!

    # Ranking
    ranking: [String]!
    customRanking: [String]!
    replicas: [String]!

    # Faceting
    maxValuesPerFacet: Int!
    sortFacetValuesBy: SortFacetValuesBy

    # Highlighting / Snippeting
    # TODO

    # Pagination
    hitsPerPage: Int! # default 20
    paginationLimitedTo: Int! # default 1000
    # Typos
    # TODO

    # Query Strategy
    # TODO

    # Query rules
    enableRules: Boolean! # default true
  }
`;

const resolvers = {};

module.exports = { typeDef, resolvers };
