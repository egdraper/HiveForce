import { getGreeting } from '../support/app.po';

describe('hive-force', () => {
  beforeEach(() => cy.visit('/'));

  it('should display welcome message', () => {
    getGreeting().contains('Welcome to hive-force!');
  });
});
