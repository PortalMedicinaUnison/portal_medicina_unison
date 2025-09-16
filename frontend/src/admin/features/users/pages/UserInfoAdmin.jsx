import { useNavigate, useParams } from "react-router-dom";
import { useUserAdmin } from "../hooks/useUserAdmin.js";
import UserDetail from "../components/UserInfoAdmin.jsx";
import { ROUTES, adminAbs } from "../../../../config.js";
import Layout from "../../../../Layout.jsx";
import PageLayout from '../../../../components/PageLayout.jsx';


function UserInfoAdminPage() {
  const navigate = useNavigate();
  const { userId } = useParams();
  const { userAdmin, loading, error } = useUserAdmin(userId);

  const editUserActions = (
    <span className="show-on-sm">
      <button
        type="button"
        className="btn-primary"
        onClick={() => navigate(adminAbs(ROUTES.ADMIN.PROMOTION_EDIT(userId)))}
      >
        Editar
      </button>
    </span>
  );

  if (loading) return <div>Cargando...</div>;
  if (error) return <div>{error}</div>;
  if (!userAdmin) return <div>No se encontró el usuarioo.</div>;

  return (
      <Layout>
        <PageLayout 
          title={'🏷️  Amado'}
          actions={editUserActions}
        >
          <UserDetail/>
        </PageLayout>
      </Layout>
  );
}

export default UserInfoAdminPage;