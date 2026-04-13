describe('Role-based Access Control', () => {
  it('should restrict Agent from accessing Analytics and Workforce', () => {
    cy.login('agent@acme.com');
    // Wait for the nav to be visible
    cy.get('nav').should('be.visible');
    
    // Check sidebar links specifically in the nav section
    cy.get('nav').contains('Reports').should('not.exist');
    cy.get('nav').contains('Workforce').should('not.exist');
    
    // Try visiting directly - should stay on inbox or redirect
    cy.visit('/analytics', { failOnStatusCode: false });
    cy.url().should('not.include', '/analytics');
  });

  it('should allow Supervisor to access Analytics and Workforce, but not Automation', () => {
    cy.login('supervisor@acme.com');
    
    cy.contains('Reports').click();
    cy.url().should('include', '/analytics');
    
    cy.contains('Workforce').click();
    cy.url().should('include', '/workforce');
    
    cy.get('nav').contains('Automation').should('not.exist');
    cy.visit('/settings/routing', { failOnStatusCode: false });
    cy.url().should('not.include', '/settings/routing');
  });

  it('should allow Admin to access Audit Logs, Connectors, and Automation', () => {
    cy.login('admin@acme.com');
    
    cy.contains('Audit Logs').should('exist');
    cy.contains('Integrations').should('exist');
    cy.contains('Automation').should('exist');
    
    cy.visit('/audit');
    cy.get('h1').contains('Command Audit Trail').should('exist');
    
    cy.visit('/connectors');
    cy.get('h1').contains('Channel Connectors').should('exist');

    cy.visit('/settings/routing');
    cy.get('h1').contains('Intelligent Routing').should('exist');
  });

  it('should allow Superadmin to access the Admin Portal', () => {
    cy.login('superadmin@omnichat.com', 'admin123');
    
    cy.url().should('include', '/inbox'); // Superadmin also lands in inbox but with restricted sidebar
    cy.contains('Superadmin Portal').should('exist');
    cy.visit('/admin');
    cy.get('h1').contains('Platform Overview').should('exist');
  });
});
