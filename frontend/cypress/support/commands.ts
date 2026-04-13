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
  cy.wait(1000);
  
  // Wait for the redirect and for the UI to be interactable
  cy.url().should((url) => {
    expect(url).to.match(/\/(inbox|admin)/);
  });
  
  // Wait for either the Inbox or Portal header to be visible
  cy.get('h1, h2').contains(/(Inbox|Platform Overview)/, { timeout: 15000 }).should('be.visible');
});
