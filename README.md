# E-commerce Website Testing with Cypress

Automated test suite for e-commerce website validation using Cypress and TypeScript.

## Setup

```bash
npm install
```

## Running Tests

```bash
# Open Cypress Test Runner
npm run cy:open

# Run tests headlessly
npm run cy:run
```

## Technologies

- **Cypress** 15.6.0
- **TypeScript** 5.9.3
- **@faker-js/faker** 10.1.0

## Design Patterns

- **Page Object Model (POM)**: Page interactions encapsulated in classes with extracted selectors
- **DRY Principle**: Shared setup logic in `e2e.ts`, reusable page methods, centralized routes
- **Factory Pattern**: `userFactory` generates unique test data with faker
- **Single Responsibility**: Each page object handles one page, methods have focused purposes
- **Separation of Concerns**: Tests, page objects, and data generation are clearly separated

## Target Website

Tests are configured for: `https://xstore.8theme.com/elementor3/electronic-mega-market/`
