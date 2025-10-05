import Layout from '../../../Layout';
import PageLayout from '../../../components/PageLayout';
import { useUser } from '../../../contexts/UserContext';
import ProfileUpdate from '../components/ProfileUpdate'


function ProfileUpdatePage() {
  const { user, loading: fetching, error: fetchError, reload } = useUser();
  
  const userId = user?.user_id;
  
  const pageTitle = fetching
  ? 'Cargando...'
  : user
    ? 'Editar perfil'
    : ' ';
  
  return ( 
    <Layout>
      <PageLayout 
        title={pageTitle}
      >
        <ProfileUpdate
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

export default ProfileUpdatePage;
