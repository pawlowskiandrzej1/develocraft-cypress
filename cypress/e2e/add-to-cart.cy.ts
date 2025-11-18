import { SearchResultsPageActions, SearchResultsPageAssertions } from '../support/pageObjects/catalog/SearchResultsPage';
import { ProductPageActions } from '../support/pageObjects/catalog/ProductPage';
import { CartPageActions, CartPageAssertions } from '../support/pageObjects/cart/CartPage';
import { Routes } from '../support/routes';

describe('Adding Items to Cart', () => {
  const searchResultsActions = new SearchResultsPageActions();
  const searchResultsAssertions = new SearchResultsPageAssertions();
  const productPageActions = new ProductPageActions();
  const cartPageActions = new CartPageActions();
  const cartPageAssertions = new CartPageAssertions();

  const SEARCH_TERM = 'google nest';

  it('should add product to cart and verify cart updates', () => {
    cy.visit(Routes.SHOP);

    searchResultsActions.search(SEARCH_TERM);
    searchResultsAssertions.assertSearchResults(SEARCH_TERM);

    searchResultsActions
      .getProductTitleAt(0)
      .invoke('text')
      .then((name) => name.trim())
      .as('productName');

    searchResultsActions.openProductAt(0);

    productPageActions.addToCart();
    cartPageActions.openCart();

    cy.get<string>('@productName').then((productName) => {
      cartPageAssertions.assertCartContainsProduct(productName);
      cartPageAssertions.assertCartNotEmpty();
    });
  });
});
