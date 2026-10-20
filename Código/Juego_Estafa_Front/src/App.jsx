import { useState } from 'react';
import PaginaInicioSesion from './pages/LoginPage.jsx';
import PaginaRegistro from './pages/RegisterPage.jsx';

export default function Aplicacion() {
  const [page, establecerPagina] = useState('login');

  return page === 'login' ? (
    <PaginaInicioSesion
      alCrearCuenta={() => establecerPagina('register')}
    />
  ) : (
    <PaginaRegistro
      alVolverAlInicioSesion={() => establecerPagina('login')}
    />
  );
}