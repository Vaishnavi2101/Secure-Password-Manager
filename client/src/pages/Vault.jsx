import React, { useState, useEffect } from 'react';
import { encryptData, decryptData } from '../services/crypto';

const Vault = () => {
  const [site, setSite] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [vaultItems, setVaultItems] = useState([]);

  const encryptionKey = sessionStorage.getItem('encryptionKey');
  const token = sessionStorage.getItem('token');

  // 🔽 Fetch saved credentials from backend on mount
  useEffect(() => {
    const fetchVaultItems = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/vault", {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        const data = await response.json();
        setVaultItems(data);
      } catch (err) {
        console.error("Error fetching vault data:", err);
        alert("Failed to load vault items");
      }
    };

    fetchVaultItems();
  }, [token]);

  // ➕ Handle Add Button
  const handleAdd = async () => {
    if (!encryptionKey || !token) {
      alert("Session expired. Please log in again.");
      return;
    }

    const encryptedPassword = encryptData(password, encryptionKey);

    try {
      const response = await fetch("http://localhost:5000/api/vault", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          site,
          username,
          passwordEncrypted: encryptedPassword
        })
      });

      const data = await response.json();

      if (!response.ok) {
        alert(data.message || "Error saving item");
        return;
      }

      // Update UI
      setVaultItems(prev => [...prev, {
        site,
        username,
        passwordEncrypted: encryptedPassword
      }]);

      // Clear form
      setSite('');
      setUsername('');
      setPassword('');
    } catch (err) {
      console.error(err);
      alert("Failed to save item");
    }
  };

  return (
    <div style={{ padding: '2rem' }}>
      <h2>🔐 Your Vault</h2>

      {/* Add Credential */}
      <div>
        <input
          type="text"
          placeholder="Site"
          value={site}
          onChange={e => setSite(e.target.value)}
        />{' '}
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={e => setUsername(e.target.value)}
        />{' '}
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={e => setPassword(e.target.value)}
        />{' '}
        <button onClick={handleAdd}>Add</button>
      </div>

      <hr />

      {/* Vault List */}
      <table border="1" cellPadding="8" style={{ marginTop: '2rem' }}>
        <thead>
          <tr>
            <th>Site</th>
            <th>Username</th>
            <th>Password (Decrypted)</th>
          </tr>
        </thead>
        <tbody>
          {vaultItems.map((item, index) => (
            <tr key={index}>
              <td>{item.site}</td>
              <td>{item.username}</td>
              <td>{decryptData(item.passwordEncrypted, encryptionKey)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Vault;

