import { useNavigate } from 'react-router-dom';
import { ROUTES, adminAbs } from '../../../../config';
import Layout from '../../../../Layout';
import PageLayout from '../../../../components/PageLayout';
import useGetApplications from '../hooks/useGetApplications';
import ApplicationList from '../components/ApplicationList';


function ApplicationListPage() {
  const navigate = useNavigate();
  const { applications, loading: fetching, error: fetchError, refetch } = useGetApplications();
    
  const actions = (
    <button
      type="button"
      className="btn-primary"
      onClick={() => navigate(adminAbs(ROUTES.ADMIN.INTERNSHIP_APPLICATION_CREATE))}
    >
      Crear
    </button>
  );
    
  return (
    <Layout>
      <PageLayout 
        title="Lista de aplicaciones a internado"
        actions={actions}
      >
        <ApplicationList
          applications={applications}
          fetching={fetching}
          fetchError={fetchError}
          refetch={refetch}
        />
      </PageLayout>
    </Layout>
  );
}

export default ApplicationListPage;
