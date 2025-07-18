import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { deriveKey } from '../services/crypto';
import './Login.css';

const Kindle3DLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    
    try {
      const response = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ email, masterPassword: password })
      });

      const data = await response.json();

      if (!response.ok) {
        alert(data.message || "Login failed");
        return;
      }

      const key = deriveKey(password);
      sessionStorage.setItem("encryptionKey", key);
      sessionStorage.setItem("userEmail", email);
      sessionStorage.setItem("token", data.token);

      navigate("/vault");
    } catch (err) {
      console.error(err);
      alert("Server error");
    }
  };

  const handleGoogleLogin = () => {
    // Redirect to your backend Google OAuth endpoint
    window.location.href = "http://localhost:5000/api/auth/google";
  };

  return (
    <div className="kindle3d-container">
      <div className="kindle3d-login-card">
        <div className="kindle3d-header">
          <h1>PassVault</h1>
          <h2>Welcome!</h2>
          <p>Log in continue to PassVault.</p>
        </div>

        <div className="social-login">
          <button 
            className="social-btn google"
            onClick={handleGoogleLogin}
          >
            <span className="checkbox"></span>
            Log in with Google
          </button>
        </div>

        <div className="divider">
          <span>or</span>
        </div>

        <form onSubmit={handleLogin}>
          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              placeholder="Your email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              placeholder="Your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <div className="forgot-password">
            <a href="/forgot-password">Forgot password? <span>😊</span></a>
          </div>

          <button type="submit" className="login-btn">Login</button>
        </form>

        <div className="signup-link">
          Don't have an account? <a href="/Register">Sign up</a>
        </div>
      </div>
    </div>
  );
};

export default Kindle3DLogin;