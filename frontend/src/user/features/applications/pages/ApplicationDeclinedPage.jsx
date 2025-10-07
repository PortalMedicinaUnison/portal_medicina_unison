import Layout from '../../../../Layout';
import PageLayout from '../../../../components/PageLayout';
import ApplicationDeclined from '../components/ApplicationDeclined';
import { useUser } from '../../../../contexts/UserContext';
import useApplicationByAcademic from '../hooks/useApplicationByAcademic'

function ApplicationDeclinedPage() {
  const { user } = useUser();
  const academicId = user?.academic_id;  
  const { application, loading: fetching, error: fetchError, refetch } = useApplicationByAcademic(academicId);
  
  return ( 
    <Layout>
      <PageLayout 
        title="Participación declinada" 
      >
        <ApplicationDeclined
          application={application}
          fetching={fetching}
          fetchError={fetchError}
          refetch={refetch}
          user={user}
        />
      </PageLayout>
    </Layout>
  );
}

export default ApplicationDeclinedPage;