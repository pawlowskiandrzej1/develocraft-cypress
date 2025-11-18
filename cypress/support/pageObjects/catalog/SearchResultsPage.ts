import { Routes } from '../../routes';

const selectors = {
  productCards: '.woocommerce.columns-4 .etheme-product-grid-item.product',
  productTitle: 'h2.woocommerce-loop-product__title a',
  productLink: 'h2.woocommerce-loop-product__title a',
  priceElement: '.etheme-product-grid-content .price',
  priceFilterHeading: '.widget_price_filter h4.widget-title',
  minPriceInput: 'input[name="min_price"]',
  maxPriceInput: 'input[name="max_price"]',
  applyButton: '.widget_price_filter button[type="submit"]',
  searchInput: 'input[name="s"].etheme-search-form-input',
  searchButton: 'button[type="submit"]',
} as const;

class SearchResultsPageActions {
  /**
   * Performs product search.
   * @param term - Search term
   */
  search(term: string) {
    cy.get(selectors.searchInput).first().clear().type(term);
    cy.contains(selectors.searchButton, 'Search').first().click();
    const searchParam = term.split(' ')[0];
    cy.url().should('include', `s=${searchParam}`);
    this.getProductCards().should('exist').should('have.length.greaterThan', 0);
  }

  /**
   * Applies price filter with validation.
   * @param minPrice - Minimum price (must be less than maxPrice)
   * @param maxPrice - Maximum price (must be greater than minPrice)
   * @throws Error if minPrice >= maxPrice
   */
  applyPriceFilter(minPrice: number, maxPrice: number) {
    if (minPrice >= maxPrice) {
      throw new Error(`Invalid price range: minPrice (${minPrice}) must be less than maxPrice (${maxPrice})`);
    }

    cy.contains(selectors.priceFilterHeading, /filter by price/i).should('be.visible');
    
    cy.get(selectors.minPriceInput).clear().type(minPrice.toString());
    cy.get(selectors.maxPriceInput).clear().type(maxPrice.toString());
    
    cy.contains(selectors.applyButton, 'Apply').click();
    this.getProductCards().should('exist');
  }

  getProductCards() {
    return cy.get(selectors.productCards);
  }

  getProductTitleAt(index: number = 0) {
    return this.getProductCards().eq(index).find(selectors.productTitle);
  }

  /**
   * Opens product page by clicking on product at specified index.
   * @param index - Product index (default: 0)
   */
  openProductAt(index: number = 0) {
    this.getProductCards().eq(index).find(selectors.productLink).first().click();
  }
}

class SearchResultsPageAssertions {
  /**
   * Gets product cards element (private helper method).
   * @returns Cypress chainable with product cards
   */
  private getProductCards() {
    return cy.get(selectors.productCards);
  }

  /**
   * Asserts that search results are displayed.
   * @param term - Search term
   */
  assertSearchResults(term: string) {
    this.getProductCards().should('exist').and('have.length.greaterThan', 0);
  }

  /**
   * Asserts that price filter was applied (checks URL parameters).
   * @param minPrice - Minimum price
   * @param maxPrice - Maximum price
   */
  assertPriceFilterApplied(minPrice: number, maxPrice: number) {
    cy.url().should('include', `min_price=${minPrice}`).and('include', `max_price=${maxPrice}`);
    this.getProductCards().should('exist');
  }

  /**
   * Asserts that all visible products match the search term (case-insensitive).
   * @param searchTerm - The search term to match against product titles
   */
  assertProductsMatchSearchTerm(searchTerm: string) {
    this.getProductCards().then(($cards) => {
      cy.wrap($cards).each(($card) => {
        cy.wrap($card).within(() => {
          cy.get(selectors.productTitle)
            .invoke('text')
            .should('match', new RegExp(searchTerm, 'i'));
        });
      });
    });
  }

  /**
   * Asserts that all visible products have prices within the specified range.
   * @param minPrice - Minimum price (optional)
   * @param maxPrice - Maximum price (optional)
   */
  assertProductsMatchPriceRange(minPrice?: number, maxPrice?: number) {
    if (minPrice === undefined && maxPrice === undefined) {
      throw new Error('At least one of minPrice or maxPrice must be provided');
    }

    this.getProductCards().then(($cards) => {
      cy.wrap($cards).each(($card) => {
        cy.wrap($card).within(() => {
          cy.get(selectors.priceElement)
            .first()
            .invoke('text')
            .then((priceText) => {
              const priceMatch = priceText.trim().match(/[\d,]+\.?\d*/);
              expect(priceMatch).to.exist;
              
              const price = parseFloat(priceMatch![0].replace(/,/g, ''));
              
              if (minPrice !== undefined) {
                expect(price).to.be.at.least(minPrice);
              }
              if (maxPrice !== undefined) {
                expect(price).to.be.at.most(maxPrice);
              }
            });
        });
      });
    });
  }

  /**
   * Asserts that all visible products match the provided criteria.
   * Combines search term and price range validation.
   * @param options - Criteria to match (searchTerm, minPrice, maxPrice)
   */
  assertProductsMatchCriteria(options: { searchTerm?: string; minPrice?: number; maxPrice?: number }) {
    if (options.searchTerm) {
      this.assertProductsMatchSearchTerm(options.searchTerm);
    }
    
    if (options.minPrice !== undefined || options.maxPrice !== undefined) {
      this.assertProductsMatchPriceRange(options.minPrice, options.maxPrice);
    }
  }
}

export { SearchResultsPageActions, SearchResultsPageAssertions };
