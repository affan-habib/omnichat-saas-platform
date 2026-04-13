describe('Analytics and Audit Logs', () => {
  beforeEach(() => {
    cy.login('admin@acme.com');
  });

  it('should load analytics and switch tabs', () => {
    cy.visit('/analytics');
    cy.get('h1').contains('Reporting Engine').should('exist');
    
    cy.contains('Agent Performance').click();
    cy.get('input[placeholder*="Search agents"]').should('exist');
    
    cy.contains('System Messages').click();
    cy.get('input[placeholder*="Search messages"]').should('exist');
  });

  it('should load audit logs and search', () => {
    cy.visit('/audit');
    cy.get('h1').contains('Command Audit Trail').should('exist');
    
    // Type in search
    cy.get('input[placeholder*="Filter by action"]').type('USER');
    
    // Check if results are filtered (at least the list should exist)
    cy.get('.space-y-4').should('exist');
  });
});