const { gql } = require("apollo-server");

// https://stackoverflow.com/questions/48277651/graphql-how-to-avoid-duplicate-code-between-input-and-output-types
// https://github.com/graphql/graphql-js/issues/599
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

  input DecompoundedAttributesInput {
    de: [String]
    nl: [String]
    fi: [String]
  }

  type Settings {
    # Attributes

    # List of attributes eligible for textual search.
    searchableAttributes: [String]
    # List of attributes you want to use for faceting.
    attributesForFaceting: [String]
    # List of attributes that cannot be retrieved at query time.
    unretrievableAttributes: [String]
    # List of object attributes you want to retrieve.
    attributesToRetrieve: [String]

    # Ranking

    # Controls the way results are sorted.
    ranking: [String]
    # Specifies the custom ranking criterion.
    customRanking: [String]

    # The current index primary (if this index is a replica)
    primary: String
    # List of indices to which you want to replicate all write operations.
    replicas: [String]

    # Faceting

    # Maximum number of facet values returned for each facet.
    maxValuesPerFacet: Int!
    # Controls how facet values are sorted.
    sortFacetValuesBy: SortFacetValuesBy

    # Highlighting / Snippeting

    # List of attributes to highlight.
    attributesToHighlight: [String]
    # List of attributes to snippet, with an optional maximum number of words to snippet.
    attributesToSnippet: [String]
    # String inserted before highlighted parts in highlight and snippet results.
    highlightPreTag: String
    # String inserted after highlighted parts in highlight and snippet results.
    highlightPostTag: String
    # String used as an ellipsis indicator when a snippet is truncated.
    snippetEllipsisText: String
    # Restrict arrays in highlight and snippet results to items that matched the query.
    restrictHighlightAndSnippetArrays: Boolean

    # Pagination

    # Set the number of hits per page.
    hitsPerPage: Int
    # Set the maximum number of hits accessible via pagination.
    paginationLimitedTo: Int

    # Typos

    # Minimum number of characters a word in the query string must contain to accept matches with one typo.
    minWordSizefor1Typo: Int
    # Minimum number of characters a word in the query string must contain to accept matches with two typos.
    minWordSizefor2Typos: Int
    # Controls whether typo tolerance is enabled and how it is applied
    typoTolerance: TypoTolerance
    # Whether to allow typos on numbers (“numeric tokens”) in the query string.
    allowTyposOnNumericTokens: Boolean
    # Consider singular, plurals, and declensions as matching terms with no typo.
    ignorePlurals: [String]
    # List of attributes on which you want to disable typo tolerance
    disableTypoToleranceOnAttributes: [String]
    # List of words on which typo tolerance will be disabled.
    disableTypoToleranceOnWords: [String]
    # Separators (all non-alphanumeric characters except space) to index.
    separatorsToIndex: String

    # Query Strategy

    # Controls if and how query words are interpreted as prefixes.
    queryType: QueryType
    # Selects a strategy to remove words from the query when it doesn’t match any hits.
    removeWordsIfNoResults: RemoveWordsIfNoResults
    # Enables the advanced query syntax.
    advancedSyntax: Boolean
    # List of words that should be considered as optional when found in the query.
    optionalWords: [String]
    # FIXME: Can't model it :/
    # Remove stop words from the query before executing it.
    # removeStopWords: [String]

    # List of attributes on which you want to disable prefix matching
    disablePrefixOnAttributes: [String]
    # List of attributes on which you want to disable computation of the exact ranking criterion
    disableExactOnAttributes: [String]
    # Controls how the exact ranking criterion is computed when the query contains only one word.
    exactOnSingleWordQuery: ExactOnSingleWordQuery

    # Query rules

    # Whether rules should be globally enabled.
    enableRules: Boolean

    # Performance

    # List of numeric attributes that can be used as numerical filters.
    numericAttributesForFiltering: [String]
    # Enables compression of large integer arrays.
    allowCompressionOfIntegerArray: Boolean

    # Advanced

    # Name of the de-duplication attribute for the distinct feature.
    attributeForDistinct: String
    # Precision of the proximity ranking criterion.
    minProximity: Int
    # Choose which fields the response will contain. Applies to search and browse queries.
    responseFields: [String]
    # Maximum number of facet hits to return during a search for facet values.
    maxFacetHits: Int
    # List of attributes on which to do a decomposition of camel case words.
    camelCaseAttributes: [String]
    # Specify on which attributes in your index we should apply word-splitting (“decompounding”).
    decompoundedAttributes: DecompoundedAttributes
    # Controls de-duplication of results.
    distinct: Int
    # Whether to replace words matched via synonym expansion by the matched synonym in highlight and snippet results.
    replaceSynonymsInHighlight: Boolean
  }

  input SettingsInput {
    # Attributes

    # List of attributes eligible for textual search.
    searchableAttributes: [String]
    # List of attributes you want to use for faceting.
    attributesForFaceting: [String]
    # List of attributes that cannot be retrieved at query time.
    unretrievableAttributes: [String]
    # List of object attributes you want to retrieve.
    attributesToRetrieve: [String]

    # Ranking

    # Controls the way results are sorted.
    ranking: [String]
    # Specifies the custom ranking criterion.
    customRanking: [String]

    # List of indices to which you want to replicate all write operations.
    replicas: [String]

    # Faceting

    # Maximum number of facet values returned for each facet.
    maxValuesPerFacet: Int
    # Controls how facet values are sorted.
    sortFacetValuesBy: SortFacetValuesBy

    # Highlighting / Snippeting

    # List of attributes to highlight.
    attributesToHighlight: [String]
    # List of attributes to snippet, with an optional maximum number of words to snippet.
    attributesToSnippet: [String]
    # String inserted before highlighted parts in highlight and snippet results.
    highlightPreTag: String
    # String inserted after highlighted parts in highlight and snippet results.
    highlightPostTag: String
    # String used as an ellipsis indicator when a snippet is truncated.
    snippetEllipsisText: String
    # Restrict arrays in highlight and snippet results to items that matched the query.
    restrictHighlightAndSnippetArrays: Boolean

    # Pagination

    # Set the number of hits per page.
    hitsPerPage: Int
    # Set the maximum number of hits accessible via pagination.
    paginationLimitedTo: Int

    # Typos

    # Minimum number of characters a word in the query string must contain to accept matches with one typo.
    minWordSizefor1Typo: Int
    # Minimum number of characters a word in the query string must contain to accept matches with two typos.
    minWordSizefor2Typos: Int
    # Controls whether typo tolerance is enabled and how it is applied
    typoTolerance: TypoTolerance
    # Whether to allow typos on numbers (“numeric tokens”) in the query string.
    allowTyposOnNumericTokens: Boolean
    # Consider singular, plurals, and declensions as matching terms with no typo.
    ignorePlurals: [String]
    # List of attributes on which you want to disable typo tolerance
    disableTypoToleranceOnAttributes: [String]
    # List of words on which typo tolerance will be disabled.
    disableTypoToleranceOnWords: [String]
    # Separators (all non-alphanumeric characters except space) to index.
    separatorsToIndex: String

    # Query Strategy

    # Controls if and how query words are interpreted as prefixes.
    queryType: QueryType
    # Selects a strategy to remove words from the query when it doesn’t match any hits.
    removeWordsIfNoResults: RemoveWordsIfNoResults
    # Enables the advanced query syntax.
    advancedSyntax: Boolean
    # List of words that should be considered as optional when found in the query.
    optionalWords: [String]
    # FIXME: Can't model it :/
    # Remove stop words from the query before executing it.
    # removeStopWords: [String]

    # List of attributes on which you want to disable prefix matching
    disablePrefixOnAttributes: [String]
    # List of attributes on which you want to disable computation of the exact ranking criterion
    disableExactOnAttributes: [String]
    # Controls how the exact ranking criterion is computed when the query contains only one word.
    exactOnSingleWordQuery: ExactOnSingleWordQuery

    # Query rules

    # Whether rules should be globally enabled.
    enableRules: Boolean

    # Performance

    # List of numeric attributes that can be used as numerical filters.
    numericAttributesForFiltering: [String]
    # Enables compression of large integer arrays.
    allowCompressionOfIntegerArray: Boolean

    # Advanced

    # Name of the de-duplication attribute for the distinct feature.
    attributeForDistinct: String
    # Precision of the proximity ranking criterion.
    minProximity: Int
    # Choose which fields the response will contain. Applies to search and browse queries.
    responseFields: [String]
    # Maximum number of facet hits to return during a search for facet values.
    maxFacetHits: Int
    # List of attributes on which to do a decomposition of camel case words.
    camelCaseAttributes: [String]
    # Specify on which attributes in your index we should apply word-splitting (“decompounding”).
    decompoundedAttributes: DecompoundedAttributesInput
    # Controls de-duplication of results.
    distinct: Int
    # Whether to replace words matched via synonym expansion by the matched synonym in highlight and snippet results.
    replaceSynonymsInHighlight: Boolean
  }

  extend type Mutation {
    # Create or change an index’s settings.
    updateSettings(
      # The index for which you're gonna change the settings
      indexName: String!
      # A mapping of settings parameters you can use on an index.
      settings: SettingsInput!
      # Whether to forward the same settings to the replica indices.
      forwardToReplicas: Boolean
    ): Settings
  }
`;

const resolvers = {
  Mutation: {
    updateSettings(_, { indexName, settings, forwardToReplicas = false }, { algoliaClient }) {
      const algoliaIndex = algoliaClient.initIndex(indexName);
      return algoliaIndex
        .setSettings(settings, { forwardToReplicas })
        .then(({ taskID }) => algoliaIndex.waitTask(taskID))
        .then(() => algoliaIndex.getSettings())
        .catch(err => {
          throw err.message;
        });
    }
  }
};

module.exports = { typeDef, resolvers };
