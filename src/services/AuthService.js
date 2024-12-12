// src/services/AuthService.js
const axios = require('axios');

class AuthService {
  constructor() {
    this.baseUrl = 'http://52.86.181.195:8080';
    this.graphqlEndpoint = `${this.baseUrl}/graphql`;
    this.token = null;
  }

  async register(userData) {
    try {
      const graphqlMutation = {
        query: `
          mutation Register($input: RegisterInput!) {
            register(input: $input) {
              message
              user {
                user_id
                first_name
                last_name
                email
                role_id
              }
            }
          }
        `,
        variables: {
          input: userData
        }
      };

      const response = await axios.post(this.graphqlEndpoint, graphqlMutation);

      if (response.data.errors) {
        throw new Error(response.data.errors[0].message);
      }

      return response.data.data.register;
    } catch (error) {
      console.error('Registration error:', error.message);
      throw error;
    }
  }

  async login(credentials) {
    try {
      const graphqlMutation = {
        query: `
          mutation Login($input: LoginInput!) {
            login(input: $input) {
              token
              user {
                user_id
                first_name
                last_name
                email
                role_id
              }
            }
          }
        `,
        variables: {
          input: credentials
        }
      };

      console.log('Sending login request:', JSON.stringify(graphqlMutation, null, 2));
      const response = await axios.post(this.graphqlEndpoint, graphqlMutation);

      if (response.data.errors) {
        throw new Error(response.data.errors[0].message);
      }

      const loginData = response.data.data.login;
      this.token = loginData.token;

      return loginData;
    } catch (error) {
      console.error('Login error:', error.message);
      throw error;
    }
  }

  async getDashboard(role_id) {
    try {
      if (!this.token) {
        throw new Error('No authentication token available');
      }

      const query = {
        query: `
          query GetDashboard {
            ${role_id === 1 ? 'teacherDashboard' : 'studentDashboard'}
          }
        `
      };

      const response = await axios.post(
        this.graphqlEndpoint,
        query,
        {
          headers: {
            'Authorization': `Bearer ${this.token}`
          }
        }
      );

      if (response.data.errors) {
        throw new Error(response.data.errors[0].message);
      }

      return {
        studentDashboard: response.data.data.studentDashboard,
        teacherDashboard: response.data.data.teacherDashboard
      };

    } catch (error) {
      console.error('GetDashboard error:', error.message);
      throw error;
    }
  }
}

module.exports = AuthService;