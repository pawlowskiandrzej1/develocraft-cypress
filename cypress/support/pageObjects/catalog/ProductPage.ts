class ProductPage {
  readonly selectors = {
    addToCartButton: 'button.single_add_to_cart_button.button.alt',
    productTitle: 'h1.product_title',
    price: '.price',
  };

  /**
   * Adds current product to cart.
   */
  addToCart() {
    cy.get(this.selectors.addToCartButton).first().should('be.visible').click();
  }

  /**
   * Gets product name text.
   * @returns Cypress chainable with product name text
   */
  getProductName() {
    return cy.get(this.selectors.productTitle).invoke('text');
  }

  /**
   * Gets product price text.
   * @returns Cypress chainable with product price text
   */
  getProductPrice() {
    return cy.get(this.selectors.price).first().invoke('text');
  }
}

export default ProductPage;
