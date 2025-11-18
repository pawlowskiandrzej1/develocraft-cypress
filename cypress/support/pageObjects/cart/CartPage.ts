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

  openCart() {
    cy.get(selectors.cartButton).first().click();
  }
}

class CartPageAssertions {
  assertCartContainsProduct(productName: string) {
    cy.get(selectors.cartItems).should('exist');
    cy.get(selectors.cartItems).first().should('contain.text', productName);
  }

  assertCartItemCount(count: number) {
    cy.get(selectors.cartItems).should('have.length', count);
  }

  assertCartNotEmpty() {
    cy.get(selectors.cartItems).should('have.length.greaterThan', 0);
  }
}

export { CartPageActions, CartPageAssertions };
