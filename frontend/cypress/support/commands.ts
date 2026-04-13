/// <reference types="cypress" />

declare namespace Cypress {
  interface Chainable {
    login(email: string, password?: string): Chainable<void>;
  }
}

Cypress.Commands.add('login', (email, password = 'password123') => {
  cy.visit('/login');
  cy.get('#email').type(email);
  cy.get('#password').type(password);
  cy.get('button[type="submit"]').click();
  
  // Wait for the redirect and for the UI to be interactable
  cy.url().should('include', '/inbox');
  cy.get('h2').contains('Inbox', { timeout: 10000 }).should('be.visible');
});
