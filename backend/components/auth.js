import React, { useState } from 'react';
import { login, register } from '../services/authService'; // Ensure the API service uses JWT

const Auth = ({ setToken }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [authError, setAuthError] = useState('');
    const [isSignUp, setIsSignUp] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const userData = { email, password };

            // Call the appropriate API method depending on sign up or login
            const response = isSignUp ? await register(userData) : await login(userData);
            const { token } = response.data; // Assume the token is returned in the response

            localStorage.setItem('token', token); // Save token in localStorage
            setToken(token); // Set token in the state to keep track of it
            setAuthError('');
        } catch (err) {
            setAuthError('Invalid email or password');
            console.error(err.response ? err.response.data.message : err.message);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="auth-form">
            <h2>{isSignUp ? 'Sign Up' : 'Login'}</h2>
            <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
            />
            <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
            />
            {authError && <p style={{ color: 'red' }}>{authError}</p>}
            <button type="submit">{isSignUp ? 'Sign Up' : 'Login'}</button>
            <p>
                {isSignUp ? (
                    <span>
                        Already have an account?{' '}
                        <button type="button" onClick={() => setIsSignUp(false)}>Login</button>
                    </span>
                ) : (
                    <span>
                        Don't have an account?{' '}
                        <button type="button" onClick={() => setIsSignUp(true)}>Sign Up</button>
                    </span>
                )}
            </p>
        </form>
    );
};

export default Auth;
