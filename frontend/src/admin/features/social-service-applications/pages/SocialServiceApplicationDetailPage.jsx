import { useParams } from 'react-router-dom';
import Layout from '../../../../Layout';
import PageLayout from '../../../../components/PageLayout';
import useSocialServiceApplication from '../hooks/useSocialServiceApplication';
import SocialServiceApplicationDetail from '../components/SocialServiceApplicationDetail';


function SocialServiceApplicationDetailPage() {
  const { applicationId } = useParams();
  const { application, loading: fetching, error: fetchError, refetch } = useSocialServiceApplication(applicationId);

  const pageTitle = fetching
    ? 'Cargando...'
    : application
      ? `Asignación de ${application.academic_id}`
      : ' ';

  return (
    <Layout>
      <PageLayout title={pageTitle}>
        <SocialServiceApplicationDetail
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

export default SocialServiceApplicationDetailPage;
