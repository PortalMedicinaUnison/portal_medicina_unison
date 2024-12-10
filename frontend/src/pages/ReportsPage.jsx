import React from 'react';
import { useEffect, useState } from 'react';
import fetchUser from '../components/utils';
import BarraNavegacion from '../components/BarraNavegacion';
import ContenidoPrincipal from '../components/ContenidoPrincipal';

function ReportsPage() {
  const [user, setUser] = useState({});

  useEffect(() => {
    fetchUser(setUser);
  }, []);
  
  return (
    <div>
      <BarraNavegacion/>
      <ContenidoPrincipal user={user}>
        <h1>Reportes</h1>
        <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Ex, deleniti.</p>
      </ContenidoPrincipal>
    </div>
  );
}

export default ReportsPage;
