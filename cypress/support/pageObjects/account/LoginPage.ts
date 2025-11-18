import { LoginPayload } from '../../e2e';
import { Routes } from '../../routes';

const selectors = {
  loginForm: 'form.woocommerce-form-login',
  usernameInput: 'input[name="username"]',
  passwordInput: 'input[name="password"]',
  loginButton: 'button[name="login"]',
  errorMessage: '.woocommerce-error',
} as const;

class LoginPageActions {
  visit() {
    cy.visit(Routes.MY_ACCOUNT);
  }

  fillCredentials(credentials: LoginPayload) {
    cy.get(selectors.usernameInput).clear().type(credentials.email);
    cy.get(selectors.passwordInput).clear().type(credentials.password);
  }

  submit() {
    cy.get(selectors.loginButton).click();
  }
}

class LoginPageAssertions {
  /**
   * Asserts successful login by verifying URL change.
   */
  assertSuccessfulLogin() {
    cy.url().should('not.include', Routes.MY_ACCOUNT);
  }

  /**
   * @param message - Optional expected error message text
   */
  assertLoginError(message?: string) {
    cy.get(selectors.errorMessage).should('be.visible');
    if (message) {
      cy.get(selectors.errorMessage).should('contain', message);
    }
  }
}

export { LoginPageActions, LoginPageAssertions };
