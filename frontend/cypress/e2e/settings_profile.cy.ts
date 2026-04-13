describe('Settings and Profile', () => {
  beforeEach(() => {
    cy.login('admin@acme.com');
  });

  it('should view and update profile', () => {
    cy.visit('/profile');
    cy.get('h1').contains('Account').should('exist');
    
    cy.contains('Refine Identity').click();
    cy.get('input[placeholder*="New Display Name"]').clear().type('Admin Refined');
    cy.contains('Apply Changes').click();
    
    cy.get('li').should('exist'); // sonner toast
    cy.contains('Admin Refined').should('exist');
  });

  it('should view settings sections', () => {
    cy.visit('/settings/general');
    cy.get('h1').contains('System Settings').should('exist');
    
    const sections = ['Notifications', 'Security & Auth', 'Organization (SaaS)', 'Chat Preferences'];
    sections.forEach(section => {
      cy.contains(section).click();
      cy.get('h2').should('exist');
    });
  });

  it('should update organization settings as admin', () => {
    cy.visit('/settings/general');
    cy.contains('Organization (SaaS)').click();
    
    cy.get('input[placeholder="Acme Corp"]').clear().type('Acme Updated');
    cy.get('input[placeholder="#6366f1"]').clear().type('#00ff00');
    
    cy.contains('Commit Identity Changes').click();
    cy.get('li').should('exist');
  });

  it('should manage tags', () => {
    cy.visit('/settings/tags');
    cy.get('h1').contains('Taxonomy Manager').should('exist');
    
    const tagName = `Tag ${Date.now()}`;
    cy.contains('Create New Tag').click();
    cy.get('input[placeholder="e.g. VIP Customer"]').type(tagName);
    cy.contains('Establish Tag').click();
    
    cy.contains(tagName).should('exist');
    
    // Delete tag
    cy.contains(tagName).parents('tr').within(() => {
       cy.get('button').find('svg.lucide-trash2').parent().click({ force: true });
    });
    
    cy.on('window:confirm', () => true);
    cy.contains(tagName).should('not.exist');
  });
});