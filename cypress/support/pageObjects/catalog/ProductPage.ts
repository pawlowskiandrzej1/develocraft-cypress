const selectors = {
  addToCartButton: 'button.single_add_to_cart_button.button.alt',
  productTitle: 'h1.product_title',
  price: '.price',
} as const;

class ProductPageActions {
  addToCart() {
    cy.get(selectors.addToCartButton).first().should('be.visible').click();
  }
}

class ProductPageAssertions {
  assertProductTitleContains(expected: string) {
    cy.get(selectors.productTitle).should('contain', expected);
  }

  assertPriceVisible() {
    cy.get(selectors.price).first().should('be.visible');
  }
}

export { ProductPageActions, ProductPageAssertions };
