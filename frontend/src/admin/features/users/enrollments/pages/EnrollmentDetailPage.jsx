import { useParams } from "react-router-dom";
import useEnrollment from '../hooks/useEnrollment';
import Layout from "../../../../../Layout";
import PageLayout from '../../../../../components/PageLayout';
import EnrollmentDetail from "../components/EnrollmentDetail";


function EnrollmentPage() {
  const { enrollmentId } = useParams();
  const { enrollment, loading: fetching, error: fetchError, refetch } = useEnrollment(enrollmentId);

  const pageTitle = fetching
  ? 'Cargando usuario...'
  : enrollment
    ? 'Usuario pre-registrado'
    : ' ';

  return (
    <Layout>
      <PageLayout 
        title={pageTitle}
      >
        <EnrollmentDetail
          enrollment={enrollment}
          fetching={fetching}
          fetchError={fetchError}
          refetch={refetch}
          enrollmentId={enrollmentId}
        />
      </PageLayout>
    </Layout>
  );
}

export default EnrollmentPage;