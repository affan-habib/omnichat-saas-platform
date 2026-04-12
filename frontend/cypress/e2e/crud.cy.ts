describe('CRUD Operations - Canned Responses', () => {
  beforeEach(() => {
    cy.login('admin@acme.com');
    cy.visit('/canned-responses');
  });

  it('should create a new canned response', () => {
    const title = `Test Response ${Date.now()}`;
    const shortCode = `/test${Date.now()}`;
    const content = 'This is a test content';

    cy.contains('Create Template').click();
    
    cy.get('input[placeholder="e.g. Welcome Message"]').type(title);
    cy.get('input[placeholder="/welcome"]').type(shortCode);
    cy.get('textarea[placeholder="Enter the automated response text..."]').type(content);
    
    cy.contains('Save Template').click();
    
    cy.contains(title).should('exist');
    cy.contains(shortCode).should('exist');
  });

  it('should search for a canned response', () => {
    const searchTerm = 'Welcome'; // Assuming there's one with 'Welcome'
    cy.get('input[placeholder*="Search responses"]').type(searchTerm);
    
    cy.get('.grid').children().should('have.length.at.least', 1);
  });

  it('should delete a canned response', () => {
    // First create one to delete
    const titleToDelete = `Delete Me ${Date.now()}`;
    cy.contains('Create Template').click();
    cy.get('input[placeholder="e.g. Welcome Message"]').type(titleToDelete);
    cy.get('input[placeholder="/welcome"]').type('/del');
    cy.get('textarea[placeholder="Enter the automated response text..."]').type('Delete this');
    cy.contains('Save Template').click();
    
    cy.contains(titleToDelete).should('exist');
    
    // Click delete on the card with this title
    cy.contains(titleToDelete).parents('.rounded-2xl').within(() => {
      // Find the button with text-destructive class (trash icon)
      cy.get('button.text-destructive').click({ force: true });
    });
    
    cy.contains(titleToDelete).should('not.exist');
  });
});
