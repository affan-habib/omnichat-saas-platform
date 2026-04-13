describe('Landing Page', () => {
  it('should load the landing page and navigate to login', () => {
    cy.visit('/landing');
    cy.contains('Unified Support').should('exist');
    cy.contains('WhatsApp, Messenger, and Instagram').should('exist');
    
    // Check for login button
    cy.contains('Start for Free').click();
    cy.url().should('include', '/login');
  });

  it('should redirect / to /login if not authenticated', () => {
    cy.visit('/');
    cy.url().should('include', '/login');
  });

  it('should redirect / to /inbox if authenticated', () => {
    cy.login('agent@acme.com');
    cy.visit('/');
    cy.url().should('include', '/inbox');
  });
});