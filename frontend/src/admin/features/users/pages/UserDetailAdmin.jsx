import { useNavigate, useParams } from "react-router-dom";
import useUserAdmin from "../hooks/useUserAdmin.js";
import UserDetail from "../components/UserDetailAdmin.jsx";
import { ROUTES, adminAbs } from "../../../../config.js";
import Layout from "../../../../Layout.jsx";
import PageLayout from '../../../../components/PageLayout.jsx';


function UserInfoAdminPage() {
  const navigate = useNavigate();
  const { academicId } = useParams();
  const { user, loading, error } = useUserAdmin(academicId);

  if (loading) return <div>Cargando...</div>;
  if (error) return <div>{error}</div>;
  if (!user) return <div>No se encontró el usuarioo.</div>;

  return (
      <Layout>
        <PageLayout 
          title={ '🎓 ' + user.first_name + ' ' + user.last_name + ' ' + user.second_last_name }
        >
          <UserDetail/>
        </PageLayout>
      </Layout>
  );
}

export default UserInfoAdminPage;