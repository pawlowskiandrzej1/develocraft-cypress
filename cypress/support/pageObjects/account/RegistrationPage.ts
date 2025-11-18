import { SignupPayload } from '../../e2e';
import { Routes } from '../../routes';

const selectors = {
  registerTabButton: 'span.woocommerce-Button.button',
  emailInput: '#reg_email',
  passwordInput: '#reg_password',
  registerButton: 'button[name="register"]',
} as const;

class RegistrationPageActions {
  visit() {
    cy.visit(Routes.MY_ACCOUNT);
    this.openRegisterTab();
  }

  /**
   * @param user - Partial fields are allowed for validation tests.
   */
  fillForm(user: Partial<SignupPayload> = {}) {
    if (user.email) {
      cy.get(selectors.emailInput).clear().type(user.email);
    }
    if (user.password) {
      cy.get(selectors.passwordInput).clear().type(user.password);
    }
  }

  submit() {
    cy.get(selectors.registerButton).click();
  }

  openRegisterTab() {
    cy.get(selectors.registerTabButton).contains('Register').click();
  }
}

class RegistrationPageAssertions {
  /**
   * Asserts that email input shows HTML5 validation error for invalid email format.
   * @param expectedMessagePart - Text fragment that should be present in the validation message
   */
  assertEmailValidationMessage(expectedMessagePart: string = `Please include an '@'`) {
    cy.get(selectors.emailInput).then(($input) => {
      const input = $input[0] as HTMLInputElement;
      expect(input.validity.valid).to.be.false;
      expect(input.validationMessage).to.not.be.empty;
      expect(input.validationMessage).to.include(expectedMessagePart);
    });
  }

  private assertFieldRequired(selector: string) {
    cy.get(selector).then(($input) => {
      const input = $input[0] as HTMLInputElement;
      expect(input.validity.valueMissing).to.be.true;
    });
  }

  assertRequiredFieldValidation() {
    this.assertFieldRequired(selectors.emailInput);
    this.assertFieldRequired(selectors.passwordInput);
  }

  /**
   * Asserts successful registration by verifying URL change.
   */
  assertSuccessfulRegistration() {
    cy.url().should('not.include', Routes.MY_ACCOUNT);
  }
}

export { RegistrationPageActions, RegistrationPageAssertions };
