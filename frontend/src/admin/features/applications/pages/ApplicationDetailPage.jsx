import { useParams } from "react-router-dom";
import useApplication from '../hooks/useApplication';
import Layout from "../../../../Layout";
import PageLayout from '../../../../components/PageLayout';
import ApplicationDetail from "../components/ApplicationDetail";


function ApplicationPage() {
  const { applicationId } = useParams();
  const { application, loading: fetching, error: fetchError, refetch } = useApplication(applicationId);

  const pageTitle = fetching
  ? 'Cargando...'
  : application
    ? `Aplicación de ${application.academic_id}`
    : ' ';

  return (
    <Layout>
      <PageLayout title={pageTitle}>
        <ApplicationDetail
          application={application}
          fetching={fetching}
          fetchError={fetchError}
          refetch={refetch}
          applicationId={applicationId}
        />
      </PageLayout>
    </Layout>
  );
}

export default ApplicationPage;
