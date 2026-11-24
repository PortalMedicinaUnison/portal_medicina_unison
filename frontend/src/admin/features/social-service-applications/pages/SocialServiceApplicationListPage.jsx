import { useNavigate } from 'react-router-dom';
import { ROUTES, adminAbs } from '../../../../config';
import Layout from '../../../../Layout';
import PageLayout from '../../../../components/PageLayout';
import useGetSocialServiceApplications from '../hooks/useGetSocialServiceApplications';
import SocialServiceApplicationList from '../components/SocialServiceApplicationList';


function SocialServiceApplicationListPage() {
  const navigate = useNavigate();
  const { applications, loading: fetching, error: fetchError, refetch } = useGetSocialServiceApplications();

  const actions = (
    <button
      type="button"
      className="btn-primary"
      onClick={() => navigate(adminAbs(ROUTES.ADMIN.SOCIAL_SERVICE_APPLICATION_CREATE))}
    >
      Crear
    </button>
  );

  return (
    <Layout>
      <PageLayout
        title="Lista de asignaciones de servicio social"
        actions={actions}
      >
        <SocialServiceApplicationList
          applications={applications}
          fetching={fetching}
          fetchError={fetchError}
          refetch={refetch}
        />
      </PageLayout>
    </Layout>
  );
}

export default SocialServiceApplicationListPage;
