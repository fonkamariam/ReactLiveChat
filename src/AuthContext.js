// Create a context to manage authentication data
import React, { createContext, useContext, useState } from 'react';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [authData, setAuthData] = useState({ email: '', password: '' });
  const [forgotPassword,setForgotPassword]=useState({email:''});
  
  return (
    <AuthContext.Provider value={{ authData, setAuthData,forgotPassword,setForgotPassword}}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}