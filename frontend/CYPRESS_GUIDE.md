# Cypress E2E Testing Guide

This directory contains end-to-end tests for the OmniChat frontend using Cypress.

## Prerequisites

- Frontend running on `http://localhost:3000`
- Backend running on `http://localhost:5000` (or your configured port)
- Database seeded with test users (e.g., `agent1@acme.com`, `admin@acme.com`)

## Installation

If you haven't already:
```bash
npm install
```

## Running Tests

### 1. Interactive Mode (UI)
This opens the Cypress Test Runner.
```bash
npm run cypress:open
```

### 2. Headless Mode (CLI)
This runs all tests in the terminal.
```bash
npm run cypress:run
```

## Test Structure

- `cypress/e2e/auth.cy.ts`: Tests for login, logout, and invalid credentials.
- `cypress/e2e/rbac.cy.ts`: Tests for role-based access control (Agent vs Admin).
- `cypress/e2e/crud.cy.ts`: Tests for CRUD operations on Canned Responses.

## Writing New Tests

Add new files in `cypress/e2e/` with the `.cy.ts` extension. Use the `cy.login(email, password)` custom command for quick authentication.

```typescript
describe('My New Test', () => {
  it('should do something', () => {
    cy.login('admin@acme.com');
    cy.visit('/some-page');
    // ... assertions
  });
});
```
