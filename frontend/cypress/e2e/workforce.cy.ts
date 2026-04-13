describe('Workforce Management', () => {
  beforeEach(() => {
    cy.login('admin@acme.com');
    cy.visit('/workforce');
  });

  it('should invite a new staff member', () => {
    const name = `New Agent ${Date.now()}`;
    const email = `agent${Date.now()}@acme.com`;
    
    cy.contains('Add Staff Member').click();
    
    cy.get('input[placeholder="Johnathan Doe"]').type(name);
    cy.get('input[placeholder="john@acme.com"]').type(email);
    cy.get('input[placeholder="password123"]').clear().type('password123');
    
    cy.contains('Send Invite').click();
    
    cy.contains(name).should('exist');
    cy.contains(email).should('exist');
  });

  it('should create and delete a team', () => {
    const teamName = `Support Team ${Date.now()}`;
    
    cy.contains('teams').click();
    cy.contains('Add Team Profile').click();
    
    cy.get('input[placeholder="e.g. Technical Support"]').type(teamName);
    cy.get('input[value="#6366f1"]').clear().type('#ff0000');
    
    cy.contains('Create Team').click();
    
    cy.contains(teamName).should('exist');
    
    // Delete team
    cy.contains(teamName).parents('.rounded-\[2\.5rem\]').within(() => {
      cy.get('button').find('svg.lucide-trash2').parent().click({ force: true });
    });
    
    cy.contains(teamName).should('not.exist');
  });
});