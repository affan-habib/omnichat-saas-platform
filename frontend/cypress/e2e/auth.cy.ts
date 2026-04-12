describe('Authentication', () => {
  beforeEach(() => {
    cy.visit('/login');
  });

  it('should show error with invalid credentials', () => {
    cy.get('#email').type('wrong@example.com');
    cy.get('#password').type('wrongpassword');
    cy.get('button[type="submit"]').click();
    
    // Check for toast notification (sonner usually has role="status" or specific classes)
    cy.get('li').should('exist');
  });

  it('should login successfully as an agent', () => {
    cy.get('#email').type('agent1@acme.com');
    cy.get('#password').type('password123');
    cy.get('button[type="submit"]').click();
    
    cy.url().should('include', '/inbox');
    cy.get('h2').contains('Inbox').should('exist');
  });

  it('should logout successfully', () => {
    cy.login('agent1@acme.com');
    
    // Open settings dropdown
    cy.get('button').find('svg').filter('.lucide-settings').parent().click();
    
    // Click logout
    cy.contains('Logout Account').click();
    cy.url().should('include', '/login');
  });
});
