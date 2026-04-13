describe('Superadmin Portal', () => {
  beforeEach(() => {
    cy.login('superadmin@omnichat.com', 'admin123');
    cy.visit('/admin');
  });

  it('should view platform overview and navigation', () => {
    cy.get('h1').contains('Platform Overview').should('exist');
    
    // Check cards
    cy.contains('Total Tenants').should('exist');
    cy.contains('Total Users').should('exist');
    
    // Check navigation
    cy.contains('Tenants').click();
    cy.url().should('include', '/admin/tenants');
    
    cy.contains('Global Settings').click();
    cy.url().should('include', '/admin/settings');
    
    cy.contains('System Logs').click();
    cy.url().should('include', '/admin/logs');
  });

  it('should create and delete a tenant', () => {
    cy.visit('/admin/tenants');
    const tenantName = `Tenant ${Date.now()}`;
    const domain = `tenant${Date.now()}`;
    
    cy.contains('New Tenant').click();
    
    cy.get('input[placeholder="Acme Corp"]').type(tenantName);
    cy.get('input[placeholder="acme"]').type(domain);
    cy.get('input[placeholder="admin@acme.com"]').type(`admin@${domain}.com`);
    
    cy.contains('Establish Infrastructure').click();
    
    cy.contains(tenantName).should('exist');
    
    // Delete tenant
    cy.contains(tenantName).parents('tr').within(() => {
       cy.get('button').find('svg.lucide-trash2').parent().click({ force: true });
    });
    
    cy.on('window:confirm', () => true);
    cy.contains(tenantName).should('not.exist');
  });

  it('should view global settings and system logs', () => {
     cy.visit('/admin/settings');
     cy.get('h1').contains('Global Infrastructure Settings').should('exist');
     cy.contains('System Mode').should('exist');
     
     cy.visit('/admin/logs');
     cy.get('h1').contains('Master Audit Stream').should('exist');
     cy.get('table').should('exist');
  });
});