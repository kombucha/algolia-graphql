const { gql } = require("apollo-server");

const typeDef = gql`
  enum SortFacetValuesBy {
    count
    alpha
  }

  enum TypoTolerance {
    TRUE
    FALSE
    MIN
    STRICT
  }

  enum QueryType {
    prefixLast
    prefixAll
    prefixNone
  }

  enum RemoveWordsIfNoResults {
    none
    lastWords
    firstWords
    allOptional
  }

  enum ExactOnSingleWordQuery {
    attribute
    none
    word
  }

  type DecompoundedAttributes {
    de: [String]
    nl: [String]
    fi: [String]
  }

  type Settings {
    # Attributes
    searchableAttributes: [String]
    attributesForFaceting: [String]
    unretrievableAttributes: [String]
    attributesToRetrieve: [String]

    # Ranking
    ranking: [String]
    customRanking: [String]
    replicas: [String]

    # Faceting
    maxValuesPerFacet: Int!
    sortFacetValuesBy: SortFacetValuesBy

    # Highlighting / Snippeting
    attributesToHighlight: [String]
    attributesToSnippet: [String]
    highlightPreTag: String
    highlightPostTag: String
    snippetEllipsisText: String
    restrictHighlightAndSnippetArrays: Boolean

    # Pagination
    # default 20
    hitsPerPage: Int!
    # default 1000
    paginationLimitedTo: Int!

    # Typos
    minWordSizeForApprox1: Int!
    minWordSizeForApprox2: Int!
    typoTolerance: TypoTolerance!
    allowTyposOnNumericTokens: Boolean!
    ignorePlurals: [String]
    disableTypoToleranceOnAttributes: [String]
    disableTypoToleranceOnWords: [String]
    separatorsToIndex: String

    # Query Strategy
    queryType: QueryType
    removeWordsIfNoResults: RemoveWordsIfNoResults
    advancedSyntax: Boolean
    optionalWords: [String]
    # FIXME: Can't model it :/
    # removeStopWords: [String]
    disablePrefixOnAttributes: [String]
    disableExactOnAttributes: [String]
    exactOnSingleWordQuery: ExactOnSingleWordQuery

    # Query rules
    # default true
    enableRules: Boolean!

    # Performance
    numericAttributesForFiltering: [String]
    allowCompressionOfIntegerArray: Boolean!

    # Advanced
    attributeForDistinct: String
    minProximity: Int!
    responseFields: [String]
    maxFacetHits: Int!
    camelCaseAttributes: [String]
    decompoundedAttributes: DecompoundedAttributes
    distinct: Int!
    replaceSynonymsInHighlight: Boolean!
  }
`;

const resolvers = {};

module.exports = { typeDef, resolvers };
