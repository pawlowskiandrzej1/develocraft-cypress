import { Routes } from '../../routes';

class CartPage {
  readonly selectors = {
    cartItems: '.woocommerce-cart-form tr.cart_item',
    cartButton: 'a[href*="/cart/"]',
    productNameCell: 'td.product-name',
  };

  visit() {
    cy.visit(Routes.CART);
  }

  /**
   * Opens cart page by clicking cart button.
   */
  openCart() {
    cy.get(this.selectors.cartButton).first().click();
  }

  /**
   * Asserts that cart contains a product with the specified name.
   * @param productName - Expected product name
   */
  assertCartContainsProduct(productName: string) {
    cy.get(this.selectors.cartItems).should('exist');
    cy.get(this.selectors.cartItems).first().should('contain.text', productName);
  }

  /**
   * Asserts that cart contains exactly the specified number of items.
   * @param count - Expected number of cart items
   */
  assertCartItemCount(count: number) {
    cy.get(this.selectors.cartItems).should('have.length', count);
  }

  getCartItems() {
    return cy.get(this.selectors.cartItems);
  }

  /**
   * Asserts that cart is not empty (contains at least one item).
   */
  assertCartNotEmpty() {
    cy.get(this.selectors.cartItems).should('have.length.greaterThan', 0);
  }
}

export default CartPage;
