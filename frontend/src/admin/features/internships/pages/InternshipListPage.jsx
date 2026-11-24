import Layout from '../../../../Layout';
import PageLayout from '../../../../components/PageLayout';
import useGetInternships from '../hooks/useGetInternships';
import InternshipList from '../components/InternshipList';


// Los internados se crean cuando el alumno acepta su asignación, por eso no hay botón "Crear".
function InternshipListPage() {
  const { internships, loading: fetching, error: fetchError, refetch } = useGetInternships();

  return (
    <Layout>
      <PageLayout title="Lista de internados">
        <InternshipList
          internships={internships}
          fetching={fetching}
          fetchError={fetchError}
          refetch={refetch}
        />
      </PageLayout>
    </Layout>
  );
}

export default InternshipListPage;
