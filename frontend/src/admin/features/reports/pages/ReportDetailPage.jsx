import { useParams } from "react-router-dom";
import useReport from '../hooks/useReport';
import Layout from "../../../../Layout";
import PageLayout from '../../../../components/PageLayout';
import ReportDetail from "../components/ReportDetail";


// La administración no edita reportes: solo los consulta, los cierra/reabre o los elimina.
function ReportPage() {
  const { reportId } = useParams();
  const { report, loading: fetching, error: fetchError, refetch } = useReport(reportId);

  const pageTitle = fetching && !report
  ? 'Cargando...'
  : 'Reporte';

  return (
    <Layout>
      <PageLayout title={pageTitle}>
        <ReportDetail
          report={report}
          fetching={fetching}
          fetchError={fetchError}
          refetch={refetch}
        />
      </PageLayout>
    </Layout>
  );
}

export default ReportPage;
