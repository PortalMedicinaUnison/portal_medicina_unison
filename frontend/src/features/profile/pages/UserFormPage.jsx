import React from "react";
import UserForm from "../components/UserForm";
import Layout from "../../../Layout";
import PageLayout from '../../../components/PageLayout.jsx';


function ProfilePage() {

  return ( 
    <Layout>
      <PageLayout 
        title="Editar perfil" 
      >
        <UserForm/>
      </PageLayout>
    </Layout>
  );
}

export default ProfilePage;
