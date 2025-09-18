import { useNavigate, useParams } from "react-router-dom";
import { useUserAdmin } from "../hooks/useUserAdmin.js";
import UserDetail from "../components/UserInfoAdmin.jsx";
import { ROUTES, adminAbs } from "../../../../config.js";
import Layout from "../../../../Layout.jsx";
import PageLayout from '../../../../components/PageLayout.jsx';


function UserInfoAdminPage() {
  const navigate = useNavigate();
  const { academicId } = useParams();
  const { userAdmin, loading, error } = useUserAdmin(academicId);

  if (loading) return <div>Cargando...</div>;
  if (error) return <div>{error}</div>;
  if (!userAdmin) return <div>No se encontró el usuarioo.</div>;

  return (
      <Layout>
        <PageLayout 
          title={ '🎓 ' + userAdmin.first_name + ' ' + userAdmin.last_name + ' ' + userAdmin.second_last_name }
        >
          <UserDetail/>
        </PageLayout>
      </Layout>
  );
}

export default UserInfoAdminPage;