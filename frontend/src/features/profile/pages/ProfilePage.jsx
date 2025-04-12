import React from "react";
import { useEffect, useState } from "react";
import { useUser } from "../../../contexts/UserContext";
import FormularioPerfil from "../components/FormularioPerfil";
import Layout from "../../../Layout";

function ProfilePage() {
  const { user } = useUser();

  return (
    <div>
      <Layout>
        <FormularioPerfil/>
      </Layout>
    </div>
  );
}

export default ProfilePage;
