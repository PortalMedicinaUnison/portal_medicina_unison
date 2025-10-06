import Layout from '../../../../Layout';
import PageLayout from '../../../../components/PageLayout';
import InternshipDetail from '../components/InternshipDetail';
import { useUser } from '../../../../contexts/UserContext';
import useInternshipByAcademic from '../hooks/useInternshipByAcademic'


function InternshipDetailPage() {
  const { user } = useUser();
  const academicId = user?.academic_id;

  const { internship, loading: fetching, error: fetchError, refetch } = useInternshipByAcademic(academicId);
  const internshipId = internship?.internship_id ?? null;

  const pageTitle = fetching
  ? 'Cargando...'
  : internship
    ? 'Mi internado'
    : ' ';

  return ( 
    <Layout>
      <PageLayout 
        title={pageTitle}
      >
        <InternshipDetail
          internship={internship}
          fetching={fetching}
          fetchError={fetchError}
          refetch={refetch}
          internshipId={internshipId}
          user={user}
        />
      </PageLayout>
    </Layout>
  );
}

export default InternshipDetailPage;