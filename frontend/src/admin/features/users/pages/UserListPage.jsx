import Layout from '../../../../Layout';
import PageLayout from '../../../../components/PageLayout';
import useGetUsers from '../hooks/useGetUsers';
import UserList from '../components/UserList';


function UserListPage() {
  // Incluye cuentas desactivadas: la lista filtra por estado y permite reactivarlas.
  const { users, loading: fetching, error: fetchError, refetch } = useGetUsers({ includeInactive: true });
    
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
