import { useParams } from "react-router-dom";
import Layout from "../../../../Layout.jsx";
import PageLayout from '../../../../components/PageLayout.jsx';
import ApplicationUpdate from '../components/ApplicationUpdate.jsx'


function ApplicationUpdatePage() {
  const { applicationId } = useParams();
  
  const pageTitle = fetching
  ? 'Cargando...'
  : announcement
    ? 'Actualizar'
    : ' ';
  
  return ( 
    <Layout>
      <PageLayout 
        title={pageTitle}
      >
        <ApplicationUpdate
          announcement={announcement}
          fetching={fetching}
          fetchError={fetchError}
          refetch={refetch}
          applicationId={applicationId}
        />
      </PageLayout>
    </Layout>
  );
}

export default ApplicationUpdatePage;
