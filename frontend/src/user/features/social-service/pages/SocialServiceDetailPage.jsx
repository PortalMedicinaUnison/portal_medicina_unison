import Layout from '../../../../Layout';
import PageLayout from '../../../../components/PageLayout';
import SocialServiceDetail from '../components/SocialServiceDetail';
import { useUser } from '../../../../contexts/UserContext';
import useSocialServiceByAcademic from '../hooks/useSocialServiceByAcademic';


function SocialServiceDetailPage() {
  const { user } = useUser();
  const academicId = user?.academic_id;

  const { socialService, loading: fetching, error: fetchError, refetch } = useSocialServiceByAcademic(academicId);

  return (
    <Layout>
      <PageLayout title="Mi servicio social">
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
