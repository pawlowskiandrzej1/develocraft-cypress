import { buildUser } from '../support/data/userFactory';
import RegistrationPage from '../support/pageObjects/account/RegistrationPage';
import LoginPage from '../support/pageObjects/account/LoginPage';

describe('User Registration and Login', () => {
  const registrationPage = new RegistrationPage();
  const loginPage = new LoginPage();

  describe('User Registration', () => {
    it('should register a new user with valid credentials', () => {
      const testUser = buildUser();
      registrationPage.visit();

      registrationPage.fillForm(testUser);
      registrationPage.submit();
      registrationPage.assertSuccessfulRegistration();
    });

    it('should handle input validations when submitting empty form', () => {
      registrationPage.visit();
      registrationPage.submit();
      registrationPage.assertRequiredFieldValidation();
    });

    it('should show HTML5 validation for invalid email format', () => {
      registrationPage.visit();
      registrationPage.fillForm({ email: 'invalid-email-without-at' });
      registrationPage.submit();
      registrationPage.assertEmailValidationMessage();
    });
  });

  describe('User Login', () => {
    it('should login with valid credentials and redirect to homepage', () => {
      const testUser = buildUser();
      
      registrationPage.visit();
      registrationPage.fillForm(testUser);
      registrationPage.submit();
      registrationPage.assertSuccessfulRegistration();
      
      loginPage.visit();
      loginPage.fillCredentials(testUser);
      loginPage.submit();
      loginPage.assertSuccessfulLogin();
    });

    it('should show error message when login with invalid credentials', () => {
      loginPage.visit();
      loginPage.fillCredentials({
        email: 'unknown@example.com',
        password: 'wrongpassword',
      });
      loginPage.submit();
      loginPage.assertLoginError('Unknown email address. Check again or try your username.');
    });
  });
});
