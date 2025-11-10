import { useNavigate } from 'react-router-dom';
import { ROUTES, adminAbs } from '../../../../config';
import Layout from '../../../../Layout';
import PageLayout from '../../../../components/PageLayout';
import useGetReports from '../hooks/useGetReports';
import ReportList from '../components/ReportList';


function ReportListPage() {
  const navigate = useNavigate();
  const { reports, loading: fetching, error: fetchError, refetch } = useGetReports();
    
  const actions = (
    <button
      type="button"
      className="btn-primary"
      onClick={() => navigate(adminAbs(ROUTES.ADMIN.PROMOTION_CREATE))}
    >
      Crear
    </button>
  );
    
  return (
    <Layout>
      <PageLayout 
        title="Lista de reportes"
        actions={actions}
      >
        <ReportList
          reports={reports}
          fetching={fetching}
          fetchError={fetchError}
          refetch={refetch}
        />
      </PageLayout>
    </Layout>
  );
}

export default ReportListPage;
