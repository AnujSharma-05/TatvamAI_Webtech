import React, { useState, useEffect } from 'react';
import { checkAuthStatus, checkCookies } from '../config/axios';

const AuthDebugger: React.FC = () => {
  const [authStatus, setAuthStatus] = useState<any>(null);
  const [cookies, setCookies] = useState<any>(null);

  const checkStatus = () => {
    const status = checkAuthStatus();
    setAuthStatus(status);
    setCookies(checkCookies());
  };

  useEffect(() => {
    checkStatus();
  }, []);

  return (
    <div className="fixed bottom-4 right-4 bg-slate-800 p-4 rounded-lg text-white text-sm max-w-md z-50">
      <h3 className="font-bold mb-2">🔍 Auth Debugger</h3>
      
      <div className="space-y-2">
        <div>
          <strong>LocalStorage:</strong> {authStatus?.hasLocalTokens ? '✅' : '❌'}
        </div>
        <div>
          <strong>Cookies:</strong> {authStatus?.hasCookies ? '✅' : '❌'}
        </div>
        <div>
          <strong>Cookie Count:</strong> {cookies?.allCookies?.length || 0}
        </div>
        <div>
          <strong>Document Cookies:</strong> {document.cookie ? '✅' : '❌'}
        </div>
      </div>
      
      <button 
        onClick={checkStatus}
        className="mt-2 bg-blue-500 px-2 py-1 rounded text-xs"
      >
        Refresh
      </button>
    </div>
  );
};

export default AuthDebugger; 