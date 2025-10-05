import { useNavigate } from 'react-router-dom';
import { ROUTES, adminAbs } from '../../../../config';
import Layout from '../../../../Layout';
import PageLayout from '../../../../components/PageLayout';
import useGetSites from '../hooks/useGetSites';
import SiteList from '../components/SiteList';


function SiteListPage() {
  const navigate = useNavigate();
  const { sites, loading: fetching, error: fetchError, refetch } = useGetSites();
    
  const actions = (
    <button
      type="button"
      className="btn-primary"
      onClick={() => navigate(adminAbs(ROUTES.ADMIN.SITE_CREATE))}
    >
      Crear
    </button>
  );
    
  return (
    <Layout>
      <PageLayout 
        title="Lista de sedes"
        actions={actions}
      >
        <SiteList
          sites={sites}
          fetching={fetching}
          fetchError={fetchError}
          refetch={refetch}
        />
      </PageLayout>
    </Layout>
  );
}

export default SiteListPage;
