import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from './AuthContext';


function Chats() {
  const {profile}=useAuth();
  const Id= sessionStorage.getItem('userId');
  const token = sessionStorage.getItem('Token');
  const Rtoken= sessionStorage.getItem('RefreshToken');
  return (
    <div className="container">
      <h2>Logged In</h2>
    <div>
        Welcome your: {profile.firstName} {profile.lastName} <br />
        Bio : {profile.bio}
    </div>
      <p>
        <Link to="/forgotpassword">Forgot Password?</Link>
        <br/><br/>
        <Link to="/">Login</Link>
      </p>
    </div>
  );
}
export default Chats;