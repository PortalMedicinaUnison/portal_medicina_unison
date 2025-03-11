import React from "react";
import { useEffect, useState } from "react";
import fetchUser from "../../../utils/utils";
import ContenidoPrincipal from "../../../components/ContenidoPrincipal";
import BarraNavegacion from "../../../components/BarraNavegacion";
import FormularioPerfil from "../components/FormularioPerfil";


function ProfilePage() {
  const [user, setUser] = useState({});

  useEffect(() => {
    fetchUser(setUser);
  }, []);

  return (
    <div>
      <BarraNavegacion/>
      <ContenidoPrincipal user={user}>
        <FormularioPerfil user={user}/>
      </ContenidoPrincipal>
    </div>
  );
}

export default ProfilePage;