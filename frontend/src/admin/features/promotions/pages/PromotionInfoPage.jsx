import PromotionInfo from "../components/PromotionInfo.jsx";
import { useNavigate, useParams } from "react-router-dom";
import { ROUTES, adminAbs } from "../../../../config.js";
import { usePromotion } from "../hooks/usePromotion.js";
import Layout from "../../../../Layout.jsx";
import PageLayout from '../../../../components/PageLayout.jsx';


function PromotionPage() {
  const { promotionId } = useParams();
  const { promotion, loading, error } = usePromotion(promotionId);
  const navigate = useNavigate();

  const editPromotionActions = (
    <span className="show-on-sm">
      <button
        type="button"
        className="btn-primary"
        onClick={() => navigate(adminAbs(ROUTES.ADMIN.PROMOTION_EDIT(promotionId)))}
      >
        Editar
      </button>
    </span>
  );

  if (loading) return <div>Cargando...</div>;
  if (error) return <div>{error}</div>;
  if (!promotion) return <div>No se encontró la promoción.</div>;

  return (
      <Layout>
        <PageLayout 
          title={'🏷️ ' + promotion.year + ' - ' + promotion.period}
          actions={editPromotionActions}
        >
          <PromotionInfo/>
        </PageLayout>
      </Layout>
  );
}

export default PromotionPage;