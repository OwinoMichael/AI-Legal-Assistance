import axios from 'axios';
import { CustomError } from './CustomError';

const API_URL = 'http://localhost:8080';

axios.defaults.headers.common['Content-Type'] = 'application/json';
axios.defaults.withCredentials = true;

class AuthService {
  login(email: string, password: string) {
  console.log('Login attempt for:', email);
  
  return axios
    .post(`${API_URL}/login`, {
      email,
      password,
    })
    .then((response: { data: { token: string; email: string; verified: boolean } }) => {
      console.log('Login response:', response);
      
      if (response.data && response.data.token) {
        localStorage.setItem(
          'user',
          JSON.stringify({
            token: response.data.token,
            email: response.data.email,
            verified: response.data.verified
          })
        );
        console.log('User stored in localStorage');
      } else {
        console.warn('No token found in response:', response.data);
        throw new Error('No authentication token received');
      }
      
      return response.data;
    })
    .catch((error: any) => {
      console.error('Login error in AuthService:', error);
      
      const status = error.response?.status;
      const errorData = error.response?.data;
      
      // Handle account not verified (403)
      if (status === 403 && 
          (errorData?.error === 'ACCOUNT_NOT_VERIFIED' || 
           (typeof errorData === 'string' && errorData.toLowerCase().includes('not verified')))) {
        throw new CustomError(
          'Account not verified',
          'ACCOUNT_NOT_VERIFIED',
          errorData
        );
      }
      
      // Handle invalid credentials (401)
      if (status === 401 && 
          (errorData?.error === 'INVALID_CREDENTIALS' || 
           errorData === 'Invalid Credentials' ||
           (typeof errorData === 'string' && errorData.toLowerCase().includes('invalid')))) {
        throw new CustomError(
          'Invalid email or password',
          'INVALID_CREDENTIALS',
          errorData
        );
      }
      
      throw error;
    });
}

  logout() {
    localStorage.removeItem('user');
    console.log('User logged out, localStorage cleared');
  }

  signup(firstName: string, lastName: string, email: string, password: string) {
  console.log('Signup request for:', email);

  return axios
    .post(`${API_URL}/createNewUser`, {
      firstName,
      lastName,
      email,
      password,
    })
    .then(() => {
      // Store a minimal user object in localStorage for unverified users
      localStorage.setItem(
        'user',
        JSON.stringify({
          email,
          verified: false,
        })
      );
    });
  }


  getCurrentUser() {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      try {
        return JSON.parse(userStr);
      } catch (error) {
        console.error('Error parsing user from localStorage:', error);
        this.logout();
        return null;
      }
    }
    return null;
  }
  isUserVerified() {
    const user = this.getCurrentUser();
    return user?.verified === true;
  }


  getAuthHeader() {
    const user = this.getCurrentUser();
    if (user && user.token) {
      return { Authorization: `Bearer ${user.token}` };
    } else {
      return { Authorization: '' };
    }
  }

  resendVerification(email: string) {
    return axios.post(`${API_URL}/resend-verification`, { email });
  }
}

export default new AuthService();



