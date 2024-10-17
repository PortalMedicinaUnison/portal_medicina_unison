import React from 'react';
import { useEffect, useState } from 'react';
import fetchUser from '../components/utils';

function UserPage() {
  const [user, setUser] = useState({});

  useEffect(() => {
    fetchUser(setUser);
  }, []);
  
  return (
    <div>
      <p><b>Name: </b> {user.name}</p>
      <p><b>Paternal last name:</b> {user.pat_last_name}</p>
      <p><b>Maternal last name:</b> {user.mat_last_name}</p>
      <p><b>Email: </b>{user.email}</p>
      <p><b>File number: </b>{user.file_number}</p>
      <br />
      <a href="http://localhost:5173/edit">Edit</a>
    </div>
  );
}

export default UserPage;
