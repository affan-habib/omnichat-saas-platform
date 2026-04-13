describe('Connectors - Channel Integrations', () => {
  beforeEach(() => {
    cy.login('admin@acme.com');
    cy.visit('/connectors');
  });

  it('should create and delete a mock connector', () => {
    const name = `Mock Connector ${Date.now()}`;
    
    cy.contains('Add Connector').click();
    
    // Select WhatsApp
    cy.contains('WhatsApp Business').click();
    
    cy.get('input[placeholder="e.g. WhatsApp Business - Main"]').clear().type(name);
    cy.get('input[placeholder="From Meta Developer Console"]').type('12345678');
    cy.get('input[placeholder="Permanent token from Meta"]').type('access_token_mock');
    cy.get('input[placeholder="WhatsApp Business Account ID"]').type('87654321');
    cy.get('input[placeholder="Any secret string you choose"]').type('verify_token_mock');
    
    cy.contains('Create Connector').click();
    
    cy.contains(name).should('exist');
    
    // Delete connector
    cy.contains(name).parents('.rounded-\[2rem\]').within(() => {
       // Trash icon
       cy.get('button').find('svg.lucide-trash2').parent().click({ force: true });
    });
    
    // Handle window:confirm
    cy.on('window:confirm', () => true);
    
    cy.contains(name).should('not.exist');
  });

  it('should test a connector', () => {
    // If there is any connector seeded
    cy.get('.grid').then(($grid) => {
       if ($grid.children().length > 0) {
          cy.contains('Test').first().click();
          // It will either show success or error toast
          cy.get('li').should('exist'); // sonner toast
       }
    });
  });
});