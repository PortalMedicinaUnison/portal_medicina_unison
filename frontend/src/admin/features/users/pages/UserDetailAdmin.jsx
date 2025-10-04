import useUserAdmin from '../hooks/useUserAdmin';
import Layout from "../../../../Layout";
import PageLayout from '../../../../components/PageLayout';
import UserDetailAdmin from "../components/UserDetailAdmin";


function UserPage() {
  const { userId } = useParams();
  const { user, loading: fetching, error: fetchError, refetch } = useUserAdmin(userId);

  const pageTitle = fetching
  ? 'Cargando anuncio...'
  : user
    ? `${user.firs_name} ${user.last_name} ${user.second_last_name}`
    : ' ';

  return (
    <Layout>
      <PageLayout 
        title={pageTitle}
      >
        <UserDetailAdmin
          user={user}
          fetching={fetching}
          fetchError={fetchError}
          refetch={refetch}
          userId={userId}
        />
      </PageLayout>
    </Layout>
  );
}

export default UserPage;