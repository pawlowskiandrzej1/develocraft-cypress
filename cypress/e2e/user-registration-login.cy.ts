import { buildUser } from '../support/data/userFactory';
import { RegistrationPageActions, RegistrationPageAssertions } from '../support/pageObjects/account/RegistrationPage';
import { LoginPageActions, LoginPageAssertions } from '../support/pageObjects/account/LoginPage';

// Note: This demo app doesn't have real authentication - users aren't created and sessions aren't managed.
// Tests verify UI behavior (form validation, URL changes) rather than actual login/registration functionality.

describe('User Registration and Login', () => {
  const registrationActions = new RegistrationPageActions();
  const registrationAssertions = new RegistrationPageAssertions();
  const loginActions = new LoginPageActions();
  const loginAssertions = new LoginPageAssertions();

  describe('User Registration', () => {
    it('should register a new user with valid credentials', () => {
      const testUser = buildUser();
      registrationActions.visit();

      registrationActions.fillForm(testUser);
      registrationActions.submit();
      registrationAssertions.assertSuccessfulRegistration();
    });

    it('should handle input validations when submitting empty form', () => {
      registrationActions.visit();
      registrationActions.submit();
      registrationAssertions.assertRequiredFieldValidation();
    });

    it('should show HTML5 validation for invalid email format', () => {
      registrationActions.visit();
      registrationActions.fillForm({ email: 'invalid-email-without-at' });
      registrationActions.submit();
      registrationAssertions.assertEmailValidationMessage();
    });
  });

  describe('User Login', () => {
    it('should login with valid credentials and redirect to homepage', () => {
      const testUser = buildUser();
      
      registrationActions.visit();
      registrationActions.fillForm(testUser);
      registrationActions.submit();
      registrationAssertions.assertSuccessfulRegistration();
      
      loginActions.visit();
      loginActions.fillCredentials(testUser);
      loginActions.submit();
      loginAssertions.assertSuccessfulLogin();
    });

    it('should show error message when login with invalid credentials', () => {
      loginActions.visit();
      loginActions.fillCredentials({
        email: 'unknown@example.com',
        password: 'wrongpassword',
      });
      loginActions.submit();
      loginAssertions.assertLoginError('Unknown email address. Check again or try your username.');
    });
  });
});
