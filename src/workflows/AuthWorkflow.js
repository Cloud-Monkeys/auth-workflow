const EventEmitter = require('events');
const AuthService = require('../services/AuthService');

class AuthWorkflow extends EventEmitter {
  constructor() {
    super();
    this.authService = new AuthService();
    this.states = {
      INIT: 'INIT',
      REGISTERING: 'REGISTERING',
      AUTHENTICATING: 'AUTHENTICATING',
      ACCESSING_DASHBOARD: 'ACCESSING_DASHBOARD',
      COMPLETED: 'COMPLETED',
      ERROR: 'ERROR'
    };
    this.currentState = this.states.INIT;
  }

  async executeRegistrationFlow(userData) {
    try {
      this.setState(this.states.REGISTERING);
      const registerResult = await this.authService.register(userData);
      console.log('Registration result:', registerResult);
      
      return this.executeLoginFlow({
        user_id: userData.user_id,
        password: userData.password
      });
    } catch (error) {
      this.handleError('registration', error);
    }
  }

  async executeLoginFlow(credentials) {
    try {
      this.setState(this.states.AUTHENTICATING);
      const loginResult = await this.authService.login(credentials);
      console.log('Login result:', loginResult);

      this.setState(this.states.ACCESSING_DASHBOARD);
      const dashboard = await this.authService.getDashboard(loginResult.role_id);
      
      this.setState(this.states.COMPLETED);
      return {
        token: loginResult.token,
        role_id: loginResult.role_id,
        dashboard
      };
    } catch (error) {
      this.handleError('login', error);
    }
  }

  setState(state) {
    this.currentState = state;
    this.emit('stateChange', state);
    console.log(`Workflow State: ${state}`);
  }

  handleError(step, error) {
    this.setState(this.states.ERROR);
    this.emit('error', { step, error });
    throw error;
  }
}

module.exports = AuthWorkflow;