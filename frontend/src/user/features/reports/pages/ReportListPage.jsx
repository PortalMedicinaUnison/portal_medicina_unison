import { useLocation, useNavigate } from 'react-router-dom';
import { ROUTES } from '../../../../config';
import Layout from '../../../../Layout';
import PageLayout from '../../../../components/PageLayout';
import useGetReportsByStudent from '../hooks/useGetReportsByStudent';
import ReportList from '../components/ReportList';
import { useUser } from '../../../../contexts/UserContext';


function ReportListPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useUser();
  const academicId = user?.academic_id;

  const { reports, loading: fetching, error: fetchError, refetch } = useGetReportsByStudent(academicId);
    
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
        {location.state?.notice && <div className="alert-success mb-6" role="status">{location.state.notice}</div>}
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
