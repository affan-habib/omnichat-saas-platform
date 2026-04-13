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

  it('should navigate to registration and create a workspace', () => {
    cy.contains('Create One').click();
    cy.url().should('include', '/register');
    
    const company = `Test Corp ${Date.now()}`;
    cy.get('#tenantName').type(company);
    cy.get('#fullName').type('Test Admin');
    cy.get('#email').type(`admin@test${Date.now()}.com`);
    cy.get('#password').type('password123');
    
    cy.get('button[type="submit"]').click();
    cy.get('li').contains('successful').should('exist');
  });

  it('should navigate to forgot password', () => {
    cy.contains('Forgot Password?').click();
    cy.url().should('include', '/forgot-password');
    cy.get('input[type="email"]').type('test@example.com');
    cy.get('button[type="submit"]').click();
    cy.get('li').should('exist');
  });

  it('should login successfully as an agent', () => {
    cy.get('#email').type('agent@acme.com');
    cy.get('#password').type('password123');
    cy.get('button[type="submit"]').click();
    
    cy.url().should('include', '/inbox');
    cy.get('h2').contains('Inbox').should('exist');
  });

  it('should logout successfully', () => {
    cy.login('agent@acme.com');
    
    // Open settings dropdown
    cy.get('button').find('svg.lucide-settings').parent().click();
    
    // Click logout
    cy.contains('Logout Account').click();
    cy.url().should('include', '/login');
  });
});
