import React, { useState } from 'react';
import axios from '../config/axios';
import { checkCookies } from '../config/axios';

const CookieTest: React.FC = () => {
  const [testResult, setTestResult] = useState<string>('');

  const testCookieEndpoint = async () => {
    try {
      console.log('🧪 Testing cookie endpoint...');
      const response = await axios.get('/users/test-cookies');
      console.log('Test response:', response);
      
      // Check cookies after a short delay
      setTimeout(() => {
        const cookieStatus = checkCookies();
        console.log('Cookie status after test:', cookieStatus);
        setTestResult(`Test completed. Cookies found: ${cookieStatus.allCookies.length}`);
      }, 1000);
      
    } catch (error) {
      console.error('Test failed:', error);
      setTestResult('Test failed');
    }
  };

  const testLoginEndpoint = async () => {
    try {
      console.log('🧪 Testing login endpoint...');
      const response = await axios.post('/users/login', {
        email: 'test@example.com',
        password: 'testpassword'
      });
      console.log('Login test response:', response);
      
      // Check cookies after a short delay
      setTimeout(() => {
        const cookieStatus = checkCookies();
        console.log('Cookie status after login test:', cookieStatus);
        setTestResult(`Login test completed. Cookies found: ${cookieStatus.allCookies.length}`);
      }, 1000);
      
    } catch (error) {
      console.error('Login test failed:', error);
      setTestResult('Login test failed');
    }
  };

  return (
    <div className="fixed top-4 right-4 bg-slate-800 p-4 rounded-lg text-white text-sm max-w-md z-50">
      <h3 className="font-bold mb-2">🧪 Cookie Test</h3>
      
      <div className="space-y-2">
        <button 
          onClick={testCookieEndpoint}
          className="bg-blue-500 px-2 py-1 rounded text-xs mr-2"
        >
          Test Cookie Endpoint
        </button>
        
        <button 
          onClick={testLoginEndpoint}
          className="bg-green-500 px-2 py-1 rounded text-xs"
        >
          Test Login Endpoint
        </button>
        
        <div className="mt-2 text-xs">
          {testResult && <p>Result: {testResult}</p>}
        </div>
      </div>
    </div>
  );
};

export default CookieTest; 