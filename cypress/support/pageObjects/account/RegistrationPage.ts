import { SignupPayload } from '../../e2e';
import { Routes } from '../../routes';

class RegistrationPage {
  readonly selectors = {
    registerTabButton: 'span.woocommerce-Button.button',
    emailInput: '#reg_email',
    passwordInput: '#reg_password',
    registerButton: 'button[name="register"]',
  };

  visit() {
    cy.visit(Routes.MY_ACCOUNT);
    this.openRegisterTab();
  }

  /**
   * Fills registration form with provided user data.
   * @param user - User data (email and/or password). Partial fields are allowed for validation tests.
   */
  fillForm(user: Partial<SignupPayload> = {}) {
    if (user.email) {
      cy.get(this.selectors.emailInput).clear().type(user.email);
    }
    if (user.password) {
      cy.get(this.selectors.passwordInput).clear().type(user.password);
    }
  }

  submit() {
    cy.get(this.selectors.registerButton).click();
  }

  openRegisterTab() {
    cy.get(this.selectors.registerTabButton).contains('Register').click();
  }

  /**
   * Asserts that email input shows HTML5 validation error for invalid email format.
   */
  assertEmailValidationMessage() {
    cy.get(this.selectors.emailInput).then(($input) => {
      const input = $input[0] as HTMLInputElement;
      expect(input.validity.valid).to.be.false;
      expect(input.validationMessage).to.not.be.empty;
    });
  }

  /**
   * Asserts that a field is required (HTML5 validation).
   * @param selector - CSS selector for the input field
   */
  private assertFieldRequired(selector: string) {
    cy.get(selector).then(($input) => {
      const input = $input[0] as HTMLInputElement;
      expect(input.validity.valueMissing).to.be.true;
    });
  }

  /**
   * Asserts that both email and password fields show required validation.
   */
  assertRequiredFieldValidation() {
    this.assertFieldRequired(this.selectors.emailInput);
    this.assertFieldRequired(this.selectors.passwordInput);
  }

  /**
   * Asserts successful registration by verifying URL change.
   * 
   * Note: Registration functionality in this demo app is mocked and doesn't actually work.
   * The authentication system is for display only - it doesn't create accounts or manage sessions.
   * Tests are simplified to only verify URL changes. In a real app, we would also check:
   * - Success message display
   * - Redirect to login page
   * - User session state
   */
  assertSuccessfulRegistration() {
    cy.url().should('not.include', Routes.MY_ACCOUNT);
  }
}

export default RegistrationPage;
