import React from 'react';
import './App.css';
import AppRoutes from './Routes';
import { UserProvider } from './contexts/UserContext';

function App() {
    return (
        <UserProvider>
            <div className="App">
                <AppRoutes />
            </div>
        </UserProvider>
    );
}

export default App;
