import SiteInfo from "../components/SiteInfo.jsx";
import { useNavigate, useParams } from "react-router-dom";
import { ROUTES, adminAbs } from "../../../../config.js";
import useSite from "../hooks/useSite.js";
import Layout from "../../../../Layout.jsx";
import PageLayout from '../../../../components/PageLayout.jsx';


function SitePage() {
  const { siteId } = useParams();
  const { site, loading, error } = useSite(siteId);
  const navigate = useNavigate();

  const editSiteActions = (
    <span className="show-on-sm">
      <button
        type="button"
        className="btn-primary"
        onClick={() => navigate(adminAbs(ROUTES.ADMIN.PROMOTION_EDIT))}
      >
        Editar
      </button>
    </span>
  );

  if (loading) return <div>Cargando...</div>;
  if (error) return <div>{error}</div>;
  if (!site) return <div>No se encontró el sitio.</div>;

  return (
      <Layout>
        <PageLayout 
          title={'🏢 ' + site.name}
          actions={editSiteActions}
        >
          <SiteInfo/>
        </PageLayout>
      </Layout>
  );
}

export default SitePage;