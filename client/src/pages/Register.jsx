import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { deriveKey } from '../services/crypto'; // Import your key derivation function
import './Register.css';

const Register = () => {
  const [formData, setFormData] = useState({
    email: '',
    masterPassword: '',
    confirmPassword: ''
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: null
      });
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }
    
    if (!formData.masterPassword) {
      newErrors.masterPassword = 'Password is required';
    } else if (formData.masterPassword.length < 12) {
      newErrors.masterPassword = 'Password must be at least 12 characters';
    } else if (!/[A-Z]/.test(formData.masterPassword)) {
      newErrors.masterPassword = 'Password must contain at least one uppercase letter';
    } else if (!/[0-9]/.test(formData.masterPassword)) {
      newErrors.masterPassword = 'Password must contain at least one number';
    } else if (!/[^A-Za-z0-9]/.test(formData.masterPassword)) {
      newErrors.masterPassword = 'Password must contain at least one special character';
    }
    
    if (formData.masterPassword !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      setIsSubmitting(true);
      
      try {
        // First derive the encryption key
        const encryptionKey = await deriveKey(formData.masterPassword);
        
        const response = await fetch("http://localhost:5000/api/auth/register", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: formData.email,
            masterPassword: formData.masterPassword,
            encryptionKey: encryptionKey // Send derived key to server
          }),
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Registration failed");
        }

        // Store the encryption key locally
        sessionStorage.setItem("encryptionKey", encryptionKey);
        sessionStorage.setItem("userEmail", formData.email);
        sessionStorage.setItem("token", data.token);

        alert("✅ Registration successful. You are now logged in.");
        navigate('/vault');
      } catch (err) {
        console.error("Registration error:", err);
        alert(err.message || "An error occurred during registration");
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  const handleGoogleSignUp = () => {
    window.location.href = "http://localhost:5000/api/auth/google";
  };

  return (
    <div className="register-container">
      <div className="register-card">
        <div className="register-header">
          <h2>Create Your Account</h2>
          <p>Secure your digital life with end-to-end encryption</p>
        </div>

        <button 
          className="google-btn"
          onClick={handleGoogleSignUp}
          disabled={isSubmitting}
        >
          <img src="https://upload.wikimedia.org/wikipedia/commons/5/53/Google_%22G%22_Logo.svg" alt="Google logo" />
          Sign up with Google
        </button>

        <div className="divider">
          <span>or</span>
        </div>

        <form onSubmit={handleSubmit} noValidate>
          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className={errors.email ? 'error' : ''}
              placeholder="your@email.com"
              disabled={isSubmitting}
            />
            {errors.email && <span className="error-message">{errors.email}</span>}
          </div>

          <div className="form-group">
            <label>Master Password</label>
            <input
              type="password"
              name="masterPassword"
              value={formData.masterPassword}
              onChange={handleChange}
              className={errors.masterPassword ? 'error' : ''}
              placeholder="Create a strong password (min 12 chars)"
              disabled={isSubmitting}
            />
            {errors.masterPassword && (
              <span className="error-message">{errors.masterPassword}</span>
            )}
          </div>

          <div className="form-group">
            <label>Confirm Password</label>
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              className={errors.confirmPassword ? 'error' : ''}
              placeholder="Confirm your password"
              disabled={isSubmitting}
            />
            {errors.confirmPassword && (
              <span className="error-message">{errors.confirmPassword}</span>
            )}
          </div>

          <div className="password-strength">
            <p>Password must contain:</p>
            <ul>
              <li className={formData.masterPassword?.length >= 12 ? 'valid' : ''}>
                At least 12 characters
              </li>
              <li className={/[A-Z]/.test(formData.masterPassword) ? 'valid' : ''}>
                At least one uppercase letter
              </li>
              <li className={/[0-9]/.test(formData.masterPassword) ? 'valid' : ''}>
                At least one number
              </li>
              <li className={/[^A-Za-z0-9]/.test(formData.masterPassword) ? 'valid' : ''}>
                At least one special character
              </li>
            </ul>
          </div>

          <button
            type="submit"
            className="register-btn"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <span className="spinner"></span> Creating Account...
              </>
            ) : (
              'Create Account'
            )}
          </button>
        </form>

        <div className="login-link">
          Already have an account? <a href="/">Log in</a>
        </div>
      </div>
    </div>
  );
};

export default Register;