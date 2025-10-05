import { useNavigate, useParams } from 'react-router-dom';
import { ROUTES } from '../../../../config';
import Layout from '../../../../Layout';
import PageLayout from '../../../../components/PageLayout';
import useGetPsdsByProm from '../hooks/useGetReportsByStudent';
import ReportsList from '../components/ReportsList';


function ReportListPage() {
  const navigate = useNavigate();
  const { studentId } = useParams();
  const { reports, loading: fetching, error: fetchError, refetch } = useGetPsdsByProm(studentId);
    
  const actions = (
    <button
      type="button"
      className="btn-primary"
      onClick={() => navigate(ROUTES.USER.REPORT_CREATE)}
    >
      Crear
    </button>
  );
    
  return (
    <Layout>
      <PageLayout 
        title="Mis reportes"
        actions={actions}
      >
        <ReportsList
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
