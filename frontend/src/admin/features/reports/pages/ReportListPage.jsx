import Layout from '../../../../Layout';
import PageLayout from '../../../../components/PageLayout';
import useGetReports from '../hooks/useGetReports';
import ReportList from '../components/ReportList';


// Los reportes los crean los alumnos; la administración solo los gestiona.
function ReportListPage() {
  const { reports, loading: fetching, error: fetchError, refetch } = useGetReports();

  return (
    <Layout>
      <PageLayout title="Lista de reportes">
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
