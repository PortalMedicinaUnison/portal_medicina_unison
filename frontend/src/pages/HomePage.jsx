import React from 'react';
import { useEffect, useState } from 'react';
import fetchUser from '../utils/utils';
import Layout from '../Layout';

function HomePage() {
  const [user, setUser] = useState({});

  useEffect(() => {
    fetchUser(setUser);
  }, []);
  
  return (
    <div>
      <Layout user={user}>
      </Layout>
    </div>
  );
}

export default HomePage;
