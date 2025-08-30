import ReportsList from '../components/ReportsList.jsx';
import Layout from '../../../../Layout.jsx';
import PageLayout from '../../../../components/PageLayout.jsx';
import { useNavigate } from 'react-router-dom';
import { ROUTES, userAbs } from '../../../../config.js';

function ReportsListPage() {
  const navigate = useNavigate();

  const reportActions = (
    <span className="show-on-sm">
      <button
        type="button"
        className="btn-primary"
        onClick={() => navigate(userAbs(ROUTES.USER.REPORT_CREATE))}
      >
        Crear Reporte
      </button>
    </span>
  );

  return (
      <Layout>
        <PageLayout 
          title="Mis Reportes"
          actions={reportActions}
          >
          <ReportsList />
        </PageLayout>
      </Layout>
  );
}

export default ReportsListPage;
