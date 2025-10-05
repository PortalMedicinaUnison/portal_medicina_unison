import { useNavigate } from 'react-router-dom';
import { ROUTES } from '../../../config';
import { useUser } from '../../../contexts/UserContext';
import Layout from '../../../Layout';
import PageLayout from '../../../components/PageLayout';
import Profile from '../components/Profile';


function ProfilePage() {
  const navigate = useNavigate();
  const { user, loading: fetching, error: fetchError, reload } = useUser();

  const userId = user?.user_id;

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
        onClick={() => navigate(ROUTES.USER.EDIT_PROFILE)}
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
        <Profile
          user={user}
          fetching={fetching}
          fetchError={fetchError}
          reload={reload}
          userId={userId}
        />
      </PageLayout>
    </Layout>
  );
}

export default ProfilePage;