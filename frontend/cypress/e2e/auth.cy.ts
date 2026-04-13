describe('Authentication Flow', () => {
  it('should navigate to login and authenticate as an agent', () => {
    cy.visit('/login');
    
    // Check for hero image/split screen layout
    cy.get('img[alt="Login Hero"]').should('exist');
    
    cy.get('#email').type('agent@acme.com');
    cy.get('#password').type('password123');
    cy.get('button[type="submit"]').click();

    // Verify redirect to inbox
    cy.url().should('include', '/inbox');
    cy.get('h2').contains('Inbox').should('be.visible');
    
    // Check if user name is visible in sidebar
    cy.contains('Andy Agent', { timeout: 15000 }).should('be.visible');
  });

  it('should allow superadmin login', () => {
    cy.visit('/login');
    cy.get('#email').type('superadmin@omnichat.com');
    cy.get('#password').type('admin123');
    cy.get('button[type="submit"]').click();

    // Verify admin portal access
    cy.url().should('include', '/admin');
    cy.get('h1').contains('Platform Overview').should('be.visible');
  });

  it('should logout successfully', () => {
    cy.login('agent@acme.com');
    
    // Check if sidebar is collapsed, if so we might need to expand it or just click the avatar
    // But assuming it's open for now.
    // Click the settings gear to open dropdown
    cy.get('button').find('svg.lucide-settings').parent().click();
    
    // Now click logout
    cy.contains('Logout Account').click();
    
    // Verify redirect to login
    cy.url().should('include', '/login');
    cy.contains('Sign In').should('be.visible');
  });
});
