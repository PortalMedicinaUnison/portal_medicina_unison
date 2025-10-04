import Layout from '../../../../Layout';
import PageLayout from '../../../../components/PageLayout';
import useGetUsers from '../hooks/useGetUsers';
import UserList from '../components/UserList';


function UserListPage() {
  const { users, loading: fetching, error: fetchError, refetch } = useGetUsers();
    
  return (
    <Layout>
      <PageLayout 
        title="Lista de usuarios"
      >
        <UserList
          users={users}
          fetching={fetching}
          fetchError={fetchError}
          refetch={refetch}
        />
      </PageLayout>
    </Layout>
  );
}

export default UserListPage;
