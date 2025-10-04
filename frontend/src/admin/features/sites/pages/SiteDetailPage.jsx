import { useNavigate, useParams } from "react-router-dom";
import { ROUTES, adminAbs } from "../../../../config";
import useSite from '../hooks/useSite';
import Layout from "../../../../Layout";
import PageLayout from '../../../../components/PageLayout';
import SiteDetail from "../components/SiteDetail";


function SitePage() {
  const navigate = useNavigate();
  const { siteId } = useParams();
  const { site, loading: fetching, error: fetchError, refetch } = useSite(siteId);

  const pageTitle = fetching
  ? 'Cargando...'
  : site
    ? `${site.name}`
    : ' ';

  const siteActions = (
    <span className="show-on-sm">
      <button
        type="button"
        className="btn-primary"
        onClick={() => navigate(adminAbs(ROUTES.ADMIN.SITE_EDIT(siteId)))}
        disabled={fetching || fetchError}
      >
        Editar
      </button>
    </span>
  );

  return (
    <Layout>
      <PageLayout 
        title={pageTitle}
        actions={siteActions}
      >
        <SiteDetail
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

export default SitePage;