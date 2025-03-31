import React from 'react';
import { useEffect, useState } from 'react';
import fetchUser from '../utils/utils';
import BarraNavegacion from '../components/BarraNavegacion';
import ContenidoPrincipal from '../components/ContenidoPrincipal';
import Layout from '../Layout';
import Encabezado from '../components/Encabezado';

function HomePage() {
  const [user, setUser] = useState({});

  useEffect(() => {
    fetchUser(setUser);
  }, []);
  
  return (
    <div>
      <Encabezado user={user} />
      <BarraNavegacion/>
      <div className="p-4 sm:ml-64">
        <div className="p-1 border-2 h-screen border-gray-200 border-dashed rounded-lg dark:border-gray-700 p-4">
        </div>
      </div>
    </div>
  );
}

export default HomePage;
