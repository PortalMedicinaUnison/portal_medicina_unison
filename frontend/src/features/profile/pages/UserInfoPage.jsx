import React from "react";
import UserInfo from "../components/UserInfo.jsx";
import { useNavigate } from "react-router-dom";
import { ROUTES } from "../../../config";
import Layout from "../../../Layout.jsx";
import PageLayout from '../../../components/PageLayout.jsx';


function UserPage() {
  const navigate = useNavigate();

  const editProfileActions = (
    <span className="show-on-sm">
      <button
        type="button"
        className="btn-primary"
        onClick={() => navigate(ROUTES.USER.EDIT_PROFILE)}
      >
        Editar
      </button>
    </span>
  );

  return (
      <Layout>
        <PageLayout 
          title="Perfil" 
          actions={editProfileActions}
        >
          <UserInfo/>
        </PageLayout>
      </Layout>
  );
}

export default UserPage;