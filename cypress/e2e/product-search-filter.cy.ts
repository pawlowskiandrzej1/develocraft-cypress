import SearchResultsPage from '../support/pageObjects/catalog/SearchResultsPage';
import { Routes } from '../support/routes';

describe('Product Searching and Filtering', () => {
  const searchResultsPage = new SearchResultsPage();

  // Using search function to find a specific electronic product.
  // The search operates on product names, so we use a concrete product name
  // to demonstrate search functionality and validate results.
  const SEARCH_TERM = 'google nest';

  describe('Product Search', () => {
    it('should search for google nest and display relevant products', () => {
      const searchTerm = SEARCH_TERM;
      
      cy.visit(Routes.SHOP);
      searchResultsPage.search(searchTerm);
      searchResultsPage.assertSearchResults(searchTerm);
      searchResultsPage.assertProductsMatchCriteria({ searchTerm });
    });
  });

  describe('Price Filtering', () => {
    it('should apply price filter on shop page and verify products are within range', () => {
      const minPrice = 2699;
      const maxPrice = 2750;
      
      cy.visit(Routes.SHOP);
      searchResultsPage.applyPriceFilter(minPrice, maxPrice);
      searchResultsPage.assertPriceFilterApplied(minPrice, maxPrice);
      searchResultsPage.assertProductsMatchCriteria({ minPrice, maxPrice });
    });
  });

  describe('Search with Filters', () => {
    it('should search for google nest, apply price filters and verify products match both criteria', () => {
      const searchTerm = SEARCH_TERM;
      const minPrice = 50;
      const maxPrice = 100;
      
      cy.visit(Routes.SHOP);
      searchResultsPage.search(searchTerm);
      searchResultsPage.assertSearchResults(searchTerm);
      searchResultsPage.assertProductsMatchCriteria({ searchTerm });
      
      searchResultsPage.applyPriceFilter(minPrice, maxPrice);
      searchResultsPage.assertPriceFilterApplied(minPrice, maxPrice);
      searchResultsPage.assertProductsMatchCriteria({ searchTerm, minPrice, maxPrice });
    });
  });

});
