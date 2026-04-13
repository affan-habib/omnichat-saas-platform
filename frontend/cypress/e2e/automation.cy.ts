describe('Automation - Routing Rules', () => {
  beforeEach(() => {
    cy.login('admin@acme.com');
    cy.visit('/settings/routing');
  });

  it('should create and delete a routing rule', () => {
    const ruleName = `Rule ${Date.now()}`;
    
    cy.contains('Establish Rule').click();
    
    cy.get('input[placeholder="WhatsApp Support Assignment"]').type(ruleName);
    cy.get('input[type="number"]').clear().type('10');
    
    // Select first team if any
    cy.get('select').last().select(1); // The team assignment select
    
    cy.contains('Activate Routing Node').click();
    
    cy.contains(ruleName).should('exist');
    
    // Deactivate (Delete)
    cy.contains(ruleName).parents('.rounded-\[2\.5rem\]').within(() => {
       cy.contains('Deactivate').click();
    });
    
    // Handle window:confirm
    cy.on('window:confirm', () => true);
    
    cy.contains(ruleName).should('not.exist');
  });
});