import { Routes } from '../../routes';

const selectors = {
  cartItems: '.woocommerce-cart-form tr.cart_item',
  cartButton: 'a[href*="/cart/"]',
  productNameCell: 'td.product-name',
} as const;

class CartPageActions {
  visit() {
    cy.visit(Routes.CART);
  }

  /**
   * Opens cart page by clicking cart button.
   */
  openCart() {
    cy.get(selectors.cartButton).first().click();
  }
}

class CartPageAssertions {
  /**
   * Asserts that cart contains a product with the specified name.
   * @param productName - Expected product name
   */
  assertCartContainsProduct(productName: string) {
    cy.get(selectors.cartItems).should('exist');
    cy.get(selectors.cartItems).first().should('contain.text', productName);
  }

  /**
   * Asserts that cart contains exactly the specified number of items.
   * @param count - Expected number of cart items
   */
  assertCartItemCount(count: number) {
    cy.get(selectors.cartItems).should('have.length', count);
  }

  /**
   * Asserts that cart is not empty (contains at least one item).
   */
  assertCartNotEmpty() {
    cy.get(selectors.cartItems).should('have.length.greaterThan', 0);
  }
}

export { CartPageActions, CartPageAssertions };
