import SitesList from '../components/SitesList.jsx';
import Layout from '../../../../Layout.jsx';
import PageLayout from '../../../../components/PageLayout.jsx';
import { useNavigate } from 'react-router-dom';
import { ROUTES, adminAbs } from '../../../../config.js';


function SitesListPage() {
  const navigate = useNavigate();

  const siteActions = (
    <span className="show-on-sm">
      <button
        type="button"
        className="btn-primary"
        onClick={() => navigate(adminAbs(ROUTES.ADMIN.SITE_CREATE))}
      >
        Crear
      </button>
    </span>
  );

  return (
      <Layout>
        <PageLayout 
          title="Lista de sedes"
          actions={siteActions}
          >
          <SitesList />
        </PageLayout>
      </Layout>
  );
}

export default SitesListPage;