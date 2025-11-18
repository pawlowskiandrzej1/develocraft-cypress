import { faker } from '@faker-js/faker';
import { SignupPayload } from '../e2e';

export interface UserAccount extends SignupPayload {}

export const buildUser = (overrides: Partial<UserAccount> = {}): UserAccount => {
  const timestamp = Date.now();
  const randomString = faker.string.alphanumeric(6).toLowerCase();

  return {
    email: `testuser_${timestamp}_${randomString}@example.com`,
    password: `Test123!${faker.string.alphanumeric(5)}`,
    ...overrides,
  };
};
