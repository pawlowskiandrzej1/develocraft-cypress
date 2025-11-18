import { LoginPayload } from '../../e2e';
import { Routes } from '../../routes';

class LoginPage {
  readonly selectors = {
    loginForm: 'form.woocommerce-form-login',
    usernameInput: 'input[name="username"]',
    passwordInput: 'input[name="password"]',
    loginButton: 'button[name="login"]',
    errorMessage: '.woocommerce-error',
  };

  visit() {
    cy.visit(Routes.MY_ACCOUNT);
  }

  /**
   * Fills login form with provided credentials.
   * @param credentials - Login credentials (email and password)
   */
  fillCredentials(credentials: LoginPayload) {
    cy.get(this.selectors.usernameInput).clear().type(credentials.email);
    cy.get(this.selectors.passwordInput).clear().type(credentials.password);
  }

  submit() {
    cy.get(this.selectors.loginButton).click();
  }

  /**
   * Asserts successful login by verifying URL change.
   * 
   * Note: Login functionality in this demo app is mocked and doesn't actually work.
   * The authentication system is for display only - it doesn't validate credentials or manage sessions.
   * Tests are simplified to only verify URL changes. In a real app, we would also check:
   * - Success message display
   * - Redirect to homepage
   * - User session state
   * - User profile visibility
   */
  assertSuccessfulLogin() {
    cy.url().should('not.include', Routes.MY_ACCOUNT);
  }

  /**
   * Asserts that login error message is displayed.
   * @param message - Optional expected error message text
   */
  assertLoginError(message?: string) {
    cy.get(this.selectors.errorMessage).should('be.visible');
    if (message) {
      cy.get(this.selectors.errorMessage).should('contain', message);
    }
  }
}

export default LoginPage;
