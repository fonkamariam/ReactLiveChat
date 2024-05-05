import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import LoginPage from './LoginPage';
import SignUpPage from './SignUpPage';
import ForgotPasswordPage from './ForgotPasswordPage';
import VerifySignUp from "./VerifySignUp";
import Chats from "./Chats"
import VerifyForgottenPassword from './VerifyForgottenPassword';
import InsertProfile from './InsertProfile';
import EditProfile from './EditProfile';
function App() {
  return (
    <Router>
      <div>
        <Routes>
          <Route path='/editProfile' element={<EditProfile />} />
          <Route path= "/insertProfile" element={<InsertProfile />} />
          <Route path= "/verifyForgottenPassword" element={<VerifyForgottenPassword />} />
          <Route path= "/chats" element={<Chats />} />
          <Route path="/verifySignUp" element={<VerifySignUp />} />
          <Route path="/signup" element={<SignUpPage />} />
          <Route path="/forgotpassword" element={<ForgotPasswordPage />} />
          <Route path="/" element={<LoginPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
