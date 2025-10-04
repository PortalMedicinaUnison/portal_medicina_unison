import { useParams } from "react-router-dom";
import Layout from "../../../../Layout.jsx";
import PageLayout from '../../../../components/PageLayout.jsx';
import SiteUpdate from '../components/SiteUpdate.jsx'
import useSite from '../hooks/useSite.js';


function SiteUpdatePage() {
  const { siteId } = useParams();
  const { site, loading: fetching, error: fetchError, refetch } = useSite(siteId);
  
  const pageTitle = fetching
  ? 'Cargando...'
  : site
    ? 'Actualizar anuncio'
    : ' ';
  
  return ( 
    <Layout>
      <PageLayout 
        title={pageTitle}
      >
        <SiteUpdate
          site={site}
          fetching={fetching}
          fetchError={fetchError}
          refetch={refetch}
          siteId={siteId}
        />
      </PageLayout>
    </Layout>
  );
}

export default SiteUpdatePage;
