// LoginPage.tsx
import React from 'react';

const LoginPage: React.FC = () => {
  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    // In a real application, you would handle authentication here.
    // This is a placeholder for demonstration purposes.
    alert('Login button clicked!');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100vh' }}>
      <h2>Login</h2>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', width: '300px' }}>
        <label htmlFor="username">Username:</label>
        <input type="text" id="username" name="username" style={{ marginBottom: '10px', padding: '5px' }} />

        <label htmlFor="password">Password:</label>
        <input type="password" id="password" name="password" style={{ marginBottom: '10px', padding: '5px' }} />

        <button type="submit" style={{ padding: '10px', backgroundColor: '#4CAF50', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>Login</button>
      </form>
    </div>
  );
};

export default LoginPage;