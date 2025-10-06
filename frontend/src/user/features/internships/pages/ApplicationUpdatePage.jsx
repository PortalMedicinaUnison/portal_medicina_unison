import Layout from "../../../../Layout.jsx";
import PageLayout from '../../../../components/PageLayout.jsx';
import ApplicationUpdate from '../components/ApplicationUpdate.jsx';
import { useUser } from '../../../../contexts/UserContext.jsx';
import useApplicationByAcademic from '../hooks/useApplicationByAcademic.js'


function ApplicationUpdatePage() {
  const { user } = useUser();
  const academicId = user?.academic_id;

  const { application, loading: fetching, error: fetchError, refetch } = useApplicationByAcademic(academicId);
  const applicationId = application?.application_id;
  
  const pageTitle = fetching
  ? 'Cargando...'
  : application
    ? 'Información importante'
    : ' ';
  
  return ( 
    <Layout>
      <PageLayout 
        title={pageTitle}
      >
        <ApplicationUpdate
          application={application}
          fetching={fetching}
          fetchError={fetchError}
          refetch={refetch}
          applicationId={applicationId}
          user={user}
        />
      </PageLayout>
    </Layout>
  );
}

export default ApplicationUpdatePage;
