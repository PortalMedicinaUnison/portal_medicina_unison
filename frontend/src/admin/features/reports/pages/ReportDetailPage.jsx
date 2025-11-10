import { useNavigate, useParams } from "react-router-dom";
import { ROUTES, adminAbs } from "../../../../config";
import useReport from '../hooks/useReport';
import Layout from "../../../../Layout";
import PageLayout from '../../../../components/PageLayout';
import ReportDetail from "../components/ReportDetail";


function ReportPage() {
  const navigate = useNavigate();
  const { reportId } = useParams();
  const { report, loading: fetching, error: fetchError, refetch } = useReport(reportId);

  const pageTitle = fetching
  ? 'Cargando...'
  : 'Reporte'

  const actions = (
    <span className="show-on-sm">
      <button
        type="button"
        className="btn-primary"
        onClick={() => navigate(adminAbs(ROUTES.ADMIN.PROMOTION_EDIT(reportId)))}
        disabled={fetching || fetchError}
      >
        Editar
      </button>
    </span>
  );

  return (
    <Layout>
      <PageLayout 
        title={pageTitle}
        actions={actions}
      >
        <ReportDetail
          report={report}
          fetching={fetching}
          fetchError={fetchError}
          refetch={refetch}
          reportId={reportId}
        />
      </PageLayout>
    </Layout>
  );
}

export default ReportPage;