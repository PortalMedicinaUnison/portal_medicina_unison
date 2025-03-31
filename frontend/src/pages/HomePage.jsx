import React from 'react';
import { useEffect, useState } from 'react';
import fetchUser from '../utils/utils';
import BarraNavegacion from '../components/BarraNavegacion';
import ContenidoPrincipal from '../components/ContenidoPrincipal';
import Layout from '../Layout';

function HomePage() {
  const [user, setUser] = useState({});

  useEffect(() => {
    fetchUser(setUser);
  }, []);
  
  return (
    <div>
      
      <Layout user={user}>
        <h1>Lorem ipsum dolor sit amet.</h1>
        <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Ex, deleniti.</p>
      </Layout>
    </div>
  );
}

export default HomePage;
