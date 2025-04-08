import React from "react";
import { useEffect, useState } from "react";
import fetchUser from "../../../utils/utils";
import FormularioPerfil from "../components/FormularioPerfil";
import Layout from "../../../Layout";

function ProfilePage() {
  const [user, setUser] = useState({});

  useEffect(() => {
    fetchUser(setUser);
  }, []);

  return (
    <div>
      <Layout user={user}>
        <FormularioPerfil user={user}/>
      </Layout>
    </div>
  );
}

export default ProfilePage;
