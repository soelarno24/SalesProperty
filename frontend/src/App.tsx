import { useState } from 'react';
import SalesLogin from './components/sales/SalesLogin';
import SalesApp from './components/sales/SalesApp';

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  if (!isAuthenticated) {
    return <SalesLogin onLogin={() => setIsAuthenticated(true)} />;
  }

  return <SalesApp onLogout={() => setIsAuthenticated(false)} />;
}
