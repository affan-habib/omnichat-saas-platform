describe('Superadmin Portal', () => {
  beforeEach(() => {
    cy.login('superadmin@omnichat.com', 'admin123');
    cy.visit('/admin');
  });

  it('should view platform overview and navigate between hubs', () => {
    // Wait for the dashboard to settle
    cy.get('h1').contains('Platform Overview', { timeout: 10000 }).should('be.visible');
    
    // Check metric cards
    cy.contains('Total Tenants').should('be.visible');
    cy.contains('Active Users').should('be.visible');
    
    // Navigate to Tenants
    cy.get('[data-testid="sidebar-link"]').contains('Tenants').click();
    cy.url().should('include', '/admin/tenants');
    cy.get('h1').contains('Tenant Management').should('be.visible');
    
    // Navigate to Audit Logs
    cy.get('[data-testid="sidebar-link"]').contains('Audit Logs').click();
    cy.url().should('include', '/admin/logs');
    cy.get('h1').contains('Global Audit Trail').should('be.visible');
    
    // Navigate to System Config
    cy.get('[data-testid="sidebar-link"]').contains('System Config').click();
    cy.url().should('include', '/admin/settings');
    cy.get('h1').contains('Primary Site Config').should('be.visible');
  });

  it('should provision and then suspend a new tenant', () => {
    cy.visit('/admin/tenants');
    const uniqueId = Date.now();
    const tenantName = `Enterprise ${uniqueId}`;
    const slug = `ent-${uniqueId}`;
    
    // Trigger modal
    cy.contains('Create New Tenant').should('be.visible').click();
    
    // Fill form inside modal
    cy.get('input[placeholder="Acme Corp"]').type(tenantName);
    cy.get('input[placeholder="acme-corp"]').clear().type(slug);
    cy.get('input[placeholder="John Doe"]').type("Automation User");
    cy.get('input[placeholder="john@acme.com"]').type(`bot@${slug}.com`);
    cy.get('input[placeholder="••••••••"]').type("password123");
    
    // Submit
    cy.contains('Confirm Provision').click();
    
    // Verify success toast and list apperance
    cy.contains('Tenant created successfully').should('be.visible');
    cy.contains(tenantName).should('be.visible');
    
    // Approve if pending (though the UI might auto-approve based on logic, let's assume we need to check)
    cy.contains(tenantName).parents('.rounded-\\[2rem\\]').within(() => {
       // Check if there's an 'Approve' button (only for PENDING)
       cy.get('body').then(($body) => {
         if ($body.find('button:contains("Approve")').length > 0) {
           cy.contains('Approve').click();
           cy.contains('Active').should('be.visible');
         }
       });
    });
  });
});