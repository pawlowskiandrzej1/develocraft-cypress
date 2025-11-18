import SearchResultsPage from '../support/pageObjects/catalog/SearchResultsPage';
import ProductPage from '../support/pageObjects/catalog/ProductPage';
import CartPage from '../support/pageObjects/cart/CartPage';
import { Routes } from '../support/routes';

describe('Adding Items to Cart', () => {
  const searchResultsPage = new SearchResultsPage();
  const productPage = new ProductPage();
  const cartPage = new CartPage();

  const SEARCH_TERM = 'google nest';

  it('should add product to cart and verify cart updates', () => {
    cy.visit(Routes.SHOP);

    searchResultsPage.search(SEARCH_TERM);
    searchResultsPage.assertSearchResults(SEARCH_TERM);

    // Capture product name using Cypress alias for better timing handling
    searchResultsPage.getProductCards()
      .first()
      .find(searchResultsPage.selectors.productTitle)
      .invoke('text')
      .then((name) => name.trim())
      .as('productName');

    searchResultsPage.openProductAt(0);

    productPage.addToCart();
    cartPage.openCart();

    cy.get<string>('@productName').then((productName) => {
      cartPage.assertCartContainsProduct(productName);
      cartPage.assertCartNotEmpty();
    });
  });
});
