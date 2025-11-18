Cypress.on('uncaught:exception', (err) => {
  if (err.message.includes('e.indexOf is not a function') || err.message.includes('smart-product-viewer')) {
    return false;
  }
  return true;
});

// Global setup: clear cookies and localStorage before each test
beforeEach(() => {
  cy.clearCookies();
  cy.clearLocalStorage();
});

export interface SignupPayload {
  email: string;
  password: string;
}

export interface LoginPayload {
  email: string;
  password: string;
}
