describe('Inbox Functionality', () => {
  beforeEach(() => {
    cy.login('agent@acme.com');
  });

  it('should load conversations and send a message', () => {
    // Wait for initial animation
    cy.get('h2').contains('Inbox').should('be.visible');
    
    // Select the seeded conversation (John Smith)
    cy.get('[data-testid="convo-item"]').first().click();
    
    // Ensure the chat window opens and message feed appears
    cy.get('textarea[placeholder*="Secure direct reply"]', { timeout: 10000 }).should('be.visible');
    
    // Type and send
    const message = `Cypress Automated Test Response ${Date.now()}`;
    cy.get('textarea[placeholder*="Secure direct reply"]').type(message);
    cy.contains('Send Reply').click();
    
    // Check if message appears in the feed
    cy.contains(message, { timeout: 8000 }).should('be.visible');
  });

  it('should filter conversations by status', () => {
    // Click RESOLVED tab
    cy.get('button').contains('RESOLVED').click();
    // Wait for the empty state or data refresh
    cy.get('button').contains('RESOLVED').should('have.class', 'bg-background');
    
    // Switch back to OPEN
    cy.get('button').contains('OPEN').click();
    cy.get('[data-testid="convo-item"]').should('exist');
  });

  it('should toggle a tag on a conversation', () => {
    cy.get('[data-testid="convo-item"]').first().click();
    
    // Look for tags in the right sidebar
    cy.contains('Attributes', { timeout: 10000 }).should('be.visible');
    
    // Find a tag badge and click it
    // Using a more generic selector for the tag buttons
    cy.get('button').contains('VIP').then(($btn) => {
       cy.wrap($btn).click();
       // Toast notification logic or just wait for state
       toastCheck('Tag updated');
    });
  });
});

function toastCheck(msg: string) {
  // Simple helper to check for sonner/toast success messages
  cy.contains(msg, { timeout: 5000 }).should('exist');
}