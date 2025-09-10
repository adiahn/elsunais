// Simple API test utility
import { authService } from '../services/authService';

export const testLoginAPI = async () => {
  try {
    console.log('Testing login API...');
    const result = await authService.login({
      email: 'ammuhammad7535@gmail.com',
      password: '030518'
    });
    console.log('Login successful:', result);
    return result;
  } catch (error) {
    console.error('Login failed:', error);
    throw error;
  }
};

// Uncomment the line below to test the API when the app loads
// testLoginAPI();

// Test function to check API connectivity
export const testAPIConnectivity = async () => {
  try {
    const response = await fetch('https://flask-management-api.onrender.com/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: 'test@example.com',
        password: 'wrongpassword'
      })
    });
    
    console.log('API Response Status:', response.status);
    console.log('API Response Headers:', Object.fromEntries(response.headers.entries()));
    
    if (response.status === 401) {
      console.log('✅ API is reachable and responding (401 expected for wrong credentials)');
    } else {
      console.log('✅ API is reachable and responding');
    }
    
    return true;
  } catch (error) {
    console.error('❌ API connectivity test failed:', error);
    return false;
  }
};
