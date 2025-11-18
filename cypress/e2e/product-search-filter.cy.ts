import { SearchResultsPageActions, SearchResultsPageAssertions } from '../support/pageObjects/catalog/SearchResultsPage';
import { Routes } from '../support/routes';

describe('Product Searching and Filtering', () => {
  const searchResultsActions = new SearchResultsPageActions();
  const searchResultsAssertions = new SearchResultsPageAssertions();

  const SEARCH_TERM = 'google nest';

  beforeEach(() => {
    cy.visit(Routes.SHOP);
  });

  it('should search for google nest and display relevant products', () => {
    searchResultsActions.search(SEARCH_TERM);
    searchResultsAssertions.assertSearchResults(SEARCH_TERM);
    searchResultsAssertions.assertProductsMatchCriteria({ searchTerm: SEARCH_TERM });
  });

  it('should apply price filter on shop page and verify products are within range', () => {
    const minPrice = 2699;
    const maxPrice = 2750;
    
    searchResultsActions.applyPriceFilter(minPrice, maxPrice);
    searchResultsAssertions.assertPriceFilterApplied(minPrice, maxPrice);
    searchResultsAssertions.assertProductsMatchCriteria({ minPrice, maxPrice });
  });

  it('should search for google nest, apply price filters and verify products match both criteria', () => {
    const minPrice = 50;
    const maxPrice = 100;
    
    searchResultsActions.search(SEARCH_TERM);
    searchResultsAssertions.assertSearchResults(SEARCH_TERM);
    searchResultsAssertions.assertProductsMatchCriteria({ searchTerm: SEARCH_TERM });
    
    searchResultsActions.applyPriceFilter(minPrice, maxPrice);
    searchResultsAssertions.assertPriceFilterApplied(minPrice, maxPrice);
    searchResultsAssertions.assertProductsMatchCriteria({ searchTerm: SEARCH_TERM, minPrice, maxPrice });
  });
});
