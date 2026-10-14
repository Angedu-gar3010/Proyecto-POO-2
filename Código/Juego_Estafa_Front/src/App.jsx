import { useState } from 'react';
import LoginPage from './pages/LoginPage.jsx';
import RegisterPage from './pages/RegisterPage.jsx';

export default function App() {
  const [page, setPage] = useState('login');

  return page === 'login' ? (
    <LoginPage onCreateAccount={() => setPage('register')} />
  ) : (
    <RegisterPage onBackToLogin={() => setPage('login')} />
  );
}