import { useParams } from 'react-router-dom';
import Layout from '../../../../Layout';
import PageLayout from '../../../../components/PageLayout';
import useInternship from '../hooks/useInternship';
import InternshipDetail from '../components/InternshipDetail';


function InternshipDetailPage() {
  const { internshipId } = useParams();
  const { internship, loading: fetching, error: fetchError, refetch } = useInternship(internshipId);

  const student = internship?.application?.student;
  const pageTitle = fetching && !internship
    ? 'Cargando...'
    : internship
      ? `Internado de ${student ? `${student.first_name} ${student.last_name}` : internship.academic_id}`
      : ' ';

  return (
    <Layout>
      <PageLayout title={pageTitle}>
        <InternshipDetail
          internship={internship}
          fetching={fetching}
          fetchError={fetchError}
          refetch={refetch}
        />
      </PageLayout>
    </Layout>
  );
}

export default InternshipDetailPage;
