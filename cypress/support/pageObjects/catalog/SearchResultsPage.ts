import { Routes } from '../../routes';

class SearchResultsPage {
  readonly selectors = {
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
  };

  /**
   * Performs product search and waits for results to load.
   * @param term - Search term
   */
  search(term: string) {
    cy.get(this.selectors.searchInput).first().clear().type(term);
    cy.contains(this.selectors.searchButton, 'Search').first().click();
    const searchParam = term.split(' ')[0];
    cy.url().should('include', `s=${searchParam}`);
    // Wait for products to load
    this.getProductCards().should('exist').should('have.length.greaterThan', 0);
  }

  /**
   * Asserts that search results are displayed.
   * @param term - Search term (for logging purposes)
   */
  assertSearchResults(term: string) {
    this.getProductCards().should('exist').and('have.length.greaterThan', 0);
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

    cy.contains(this.selectors.priceFilterHeading, /filter by price/i).should('be.visible');
    
    cy.get(this.selectors.minPriceInput).clear().type(minPrice.toString());
    cy.get(this.selectors.maxPriceInput).clear().type(maxPrice.toString());
    
    cy.contains(this.selectors.applyButton, 'Apply').click();
    // Wait for filtered products to load
    this.getProductCards().should('exist');
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

  getProductCards() {
    return cy.get(this.selectors.productCards);
  }

  /**
   * Asserts that all visible products match the search term (case-insensitive).
   * @param searchTerm - The search term to match against product titles
   */
  assertProductsMatchSearchTerm(searchTerm: string) {
    this.getProductCards().then(($cards) => {
      cy.log(`Checking ${$cards.length} products match search term: "${searchTerm}"`);
      
      cy.wrap($cards).each(($card) => {
        cy.wrap($card).within(() => {
          cy.get(this.selectors.productTitle)
            .invoke('text')
            .then((title) => {
              cy.log(`Checking product title: "${title.trim()}" matches "${searchTerm}"`);
            })
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
      cy.log(`Checking ${$cards.length} products match price range: ${minPrice ?? 'no min'} - ${maxPrice ?? 'no max'}`);
      
      cy.wrap($cards).each(($card) => {
        cy.wrap($card).within(() => {
          cy.get(this.selectors.priceElement)
            .first()
            .invoke('text')
            .then((priceText) => {
              const trimmedPriceText = priceText.trim();
              cy.log(`Found price text: "${trimmedPriceText}"`);
              
              // Match price pattern (handles formats like $1,234.56 or 1234.56)
              const priceMatch = trimmedPriceText.match(/[\d,]+\.?\d*/);
              expect(priceMatch, `Could not extract price from: "${trimmedPriceText}". Expected format: number with optional commas and decimals.`).to.exist;
              
              const price = parseFloat(priceMatch![0].replace(/,/g, ''));
              cy.log(`Parsed price: ${price} (expected range: ${minPrice ?? 'no min'} - ${maxPrice ?? 'no max'})`);
              
              if (minPrice !== undefined) {
                expect(price, `Product price ${price} should be at least ${minPrice}`).to.be.at.least(minPrice);
              }
              if (maxPrice !== undefined) {
                expect(price, `Product price ${price} should be at most ${maxPrice}`).to.be.at.most(maxPrice);
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

  /**
   * Opens product page by clicking on product at specified index.
   * @param index - Product index (default: 0)
   */
  openProductAt(index: number = 0) {
    this.getProductCards().eq(index).find(this.selectors.productLink).first().click();
  }
}

export default SearchResultsPage;
