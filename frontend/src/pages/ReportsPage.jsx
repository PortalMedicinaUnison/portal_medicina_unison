import React from 'react';
import { useEffect, useState } from 'react';
import fetchUser from '../components/utils';
import BarraNavegacion from '../components/BarraNavegacion';
import ContenidoPrincipal from '../components/ContenidoPrincipal';
import ReportsForm from '../components/ReportsForm';

function ReportsPage() {
  const [user, setUser] = useState({});

  useEffect(() => {
    fetchUser(setUser);
  }, []);
  
  return (
    <div>
      <BarraNavegacion/>
      <ContenidoPrincipal user={user}>
        <div className='center'>
          <h1>Reportes</h1>
          <ReportsForm/>
        </div>
      </ContenidoPrincipal>
    </div>
  );
}

export default ReportsPage;
