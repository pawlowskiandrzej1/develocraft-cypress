const selectors = {
  addToCartButton: 'button.single_add_to_cart_button.button.alt',
  productTitle: 'h1.product_title',
  price: '.price',
} as const;

class ProductPageActions {
  /**
   * Adds current product to cart.
   */
  addToCart() {
    cy.get(selectors.addToCartButton).first().should('be.visible').click();
  }
}

class ProductPageAssertions {
  /**
   * Asserts that the current product title contains the expected text.
   */
  assertProductTitleContains(expected: string) {
    cy.get(selectors.productTitle).should('contain', expected);
  }

  /**
   * Asserts that the product price is visible.
   */
  assertPriceVisible() {
    cy.get(selectors.price).first().should('be.visible');
  }
}

export { ProductPageActions, ProductPageAssertions };
