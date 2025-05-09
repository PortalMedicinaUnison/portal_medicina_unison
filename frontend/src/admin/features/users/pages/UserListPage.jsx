import React from 'react';
import UsersList from '../components/UsersList.jsx';
import Layout from '../../../../Layout.jsx';
import PageLayout from '../../../../components/PageLayout.jsx';


function UserListPage() {
  return (
      <Layout>
        <PageLayout 
          title="Lista de usuarios" 
          >
          <UsersList />
        </PageLayout>
      </Layout>
  );
}

export default UserListPage;