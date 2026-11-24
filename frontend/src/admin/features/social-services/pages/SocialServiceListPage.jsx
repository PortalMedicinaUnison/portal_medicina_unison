import Layout from '../../../../Layout';
import PageLayout from '../../../../components/PageLayout';
import useGetSocialServices from '../hooks/useGetSocialServices';
import SocialServiceList from '../components/SocialServiceList';


// Los servicios sociales se crean cuando el alumno acepta su asignación, por eso no hay botón "Crear".
function SocialServiceListPage() {
  const { socialServices, loading: fetching, error: fetchError, refetch } = useGetSocialServices();

  return (
    <Layout>
      <PageLayout title="Lista de servicios sociales">
        <SocialServiceList
          socialServices={socialServices}
          fetching={fetching}
          fetchError={fetchError}
          refetch={refetch}
        />
      </PageLayout>
    </Layout>
  );
}

export default SocialServiceListPage;
