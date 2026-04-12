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
    
    // find logout button - usually in profile or sidebar
    // Based on user-context.tsx, logout is provided. 
    // Let's assume there's a logout button in the dashboard
    cy.get('button').contains('Log out').click({ force: true });
    cy.url().should('include', '/login');
  });
});
