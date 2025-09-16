import { useNavigate } from 'react-router-dom';
import { ROUTES, adminAbs } from '../../../../config';
import Layout from '../../../../Layout.jsx';
import PageLayout from '../../../../components/PageLayout.jsx';
import UsersList from '../components/UsersList.jsx';


function UsersListPage() {
  const navigate = useNavigate();

  const usersActions = (
    <span className="show-on-sm">
      <button
        type="button"
        className="btn-primary"
        onClick={() => navigate(adminAbs(ROUTES.ADMIN.USER_ENROLLMENT_CREATE))}
      >
        Crear
      </button>
    </span>
  );

  return (
      <Layout>
        <PageLayout 
          title="Lista de alumnos"
          actions={usersActions}
          >
          <UsersList />
        </PageLayout>
      </Layout>
  );
}

export default UsersListPage;