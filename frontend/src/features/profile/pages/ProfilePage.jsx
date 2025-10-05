import { useNavigate } from 'react-router-dom';
import { ROUTES, adminAbs } from '../../../config';
import { useUser } from '../../../contexts/UserContext';
import Layout from '../../../Layout';
import PageLayout from '../../../components/PageLayout';
import UserDetail from '../components/UserDetail';


function ProfilePage() {
  const navigate = useNavigate();
  const { user, loading: fetching, error: fetchError, reload } = useUser();

  const pageTitle = fetching
  ? 'Cargando...'
  : user
    ? `${user.first_name} ${user.last_name} ${user.second_last_name ? user.second_last_name
    : ''}`
    : ' ';

  const actions = (
    <span className="show-on-sm">
      <button
        type="button"
        className="btn-primary"
        onClick={() => navigate(adminAbs(ROUTES.USER.EDIT_PROFILE))}
        disabled={fetching || fetchError}
      >
        Editar
      </button>
    </span>
  );

  return (
    <Layout>
      <PageLayout 
        title={pageTitle}
        actions={actions}
      >
        <UserDetail
          user={user}
          fetching={fetching}
          fetchError={fetchError}
          reload={reload}
          userId={user.user_id}
        />
      </PageLayout>
    </Layout>
  );
}

export default ProfilePage;