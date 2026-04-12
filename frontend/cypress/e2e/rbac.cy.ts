describe('Role-based Access Control', () => {
  it('should restrict Agent from accessing Analytics and Workforce', () => {
    cy.login('agent1@acme.com');
    // Wait for the nav to be visible
    cy.get('nav').should('be.visible');
    
    // Check sidebar links specifically in the nav section
    cy.get('nav').contains('Reports').should('not.exist');
    cy.get('nav').contains('Workforce').should('not.exist');
    
    // Try visiting directly - should stay on inbox or redirect
    cy.visit('/analytics', { failOnStatusCode: false });
    cy.url().should('not.include', '/analytics');
  });

  it('should allow Supervisor to access Analytics', () => {
    // Assuming supervisor login
    cy.login('admin@acme.com'); // Using admin as it has supervisor roles too
    // Note: The mock login for supervisor in login page uses admin@acme.com
    
    cy.contains('Reports').click();
    cy.url().should('include', '/analytics');
    cy.get('h1').contains('Analytics').should('exist');
  });

  it('should allow Admin to access Audit Logs and Connectors', () => {
    cy.login('admin@acme.com');
    
    cy.contains('Audit Logs').should('exist');
    cy.contains('Integrations').should('exist');
    
    cy.visit('/audit');
    cy.get('h1').contains('Audit Log').should('exist');
    
    cy.visit('/connectors');
    cy.get('h1').contains('Connectors').should('exist');
  });
});
