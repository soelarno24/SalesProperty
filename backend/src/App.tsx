import { useState } from 'react';
import LoginPage from './components/LoginPage';
import Dashboard from './components/Dashboard';
import LeaderDashboard from './components/leader/LeaderDashboard';

export type UserRole = 'admin' | 'leader';

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState<UserRole>('admin');

  const handleLogin = (role: UserRole) => {
    setUserRole(role);
    setIsAuthenticated(true);
  };

  if (!isAuthenticated) {
    return <LoginPage onLogin={handleLogin} />;
  }

  if (userRole === 'leader') {
    return <LeaderDashboard onLogout={() => setIsAuthenticated(false)} />;
  }

  return <Dashboard onLogout={() => setIsAuthenticated(false)} />;
}
