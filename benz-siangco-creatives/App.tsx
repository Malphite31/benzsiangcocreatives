
import { useState, useEffect } from 'react';
import { User } from './types';
import * as authService from './services/authService';
import { LoginPage } from './components/LoginPage';
import { SignupPage } from './components/SignupPage';
import { AppContent } from './components/AppContent';


export default function App() {
    const [currentUser, setCurrentUser] = useState<User | null>(() => authService.getCurrentUser());
    // Determines which view to show when not logged in. Defaults to 'login'.
    const [authView, setAuthView] = useState<'login' | 'signup'>('login');

    useEffect(() => {
        // If the user logs out elsewhere, this will update the state
        const handleStorageChange = () => {
            const user = authService.getCurrentUser();
            if (!user) {
                setCurrentUser(null);
            }
        };

        window.addEventListener('storage', handleStorageChange);
        return () => window.removeEventListener('storage', handleStorageChange);
    }, []);

    const handleLogin = (user: User) => {
        setCurrentUser(user);
    };

    const handleLogout = () => {
        authService.logout();
        setCurrentUser(null);
        setAuthView('login'); // Default to login screen on logout
    };

    if (!currentUser) {
        return authView === 'login' ? (
            <LoginPage onLoginSuccess={handleLogin} onSwitchToSignup={() => setAuthView('signup')} />
        ) : (
            <SignupPage onSignupSuccess={handleLogin} onSwitchToLogin={() => setAuthView('login')} />
        );
    }

    return <AppContent user={currentUser} onLogout={handleLogout} />;
}