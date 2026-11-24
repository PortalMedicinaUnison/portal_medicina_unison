import { useParams } from 'react-router-dom';
import Layout from '../../../../Layout';
import PageLayout from '../../../../components/PageLayout';
import useSocialService from '../hooks/useSocialService';
import SocialServiceDetail from '../components/SocialServiceDetail';


function SocialServiceDetailPage() {
  const { socialServiceId } = useParams();
  const { socialService, loading: fetching, error: fetchError, refetch } = useSocialService(socialServiceId);

  const student = socialService?.application?.student;
  const pageTitle = fetching && !socialService
    ? 'Cargando...'
    : socialService
      ? `Servicio social de ${student ? `${student.first_name} ${student.last_name}` : socialService.academic_id}`
      : ' ';

  return (
    <Layout>
      <PageLayout title={pageTitle}>
        <SocialServiceDetail
          socialService={socialService}
          fetching={fetching}
          fetchError={fetchError}
          refetch={refetch}
        />
      </PageLayout>
    </Layout>
  );
}

export default SocialServiceDetailPage;
