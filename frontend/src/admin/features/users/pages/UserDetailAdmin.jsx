import { useParams } from 'react-router-dom';
import useUserAdmin from '../hooks/useUserAdmin';
import Layout from "../../../../Layout";
import PageLayout from '../../../../components/PageLayout';
import UserDetailAdmin from "../components/UserDetailAdmin";
import { formatFullName } from '../../../../utils/utils';


function UserPage() {
  const { userId } = useParams();
  const { user, loading: fetching, error: fetchError, refetch } = useUserAdmin(userId);

  const pageTitle = fetching
  ? 'Cargando...'
  : user
    ? formatFullName(user)
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
