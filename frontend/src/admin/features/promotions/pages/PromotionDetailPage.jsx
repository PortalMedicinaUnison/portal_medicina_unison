import { useNavigate, useParams } from "react-router-dom";
import { ROUTES, adminAbs } from "../../../../config";
import usePromotion from '../hooks/usePromotion';
import Layout from "../../../../Layout";
import PageLayout from '../../../../components/PageLayout';
import PromotionDetail from "../components/PromotionDetail";


function PromotionPage() {
  const navigate = useNavigate();
  const { promotionId } = useParams();
  const { promotion, loading: fetching, error: fetchError, refetch } = usePromotion(promotionId);

  const pageTitle = fetching
  ? 'Cargando...'
  : promotion
    ? `Promoción ${promotion.year} - ${promotion.period}`
    : ' ';

  const actions = (
    <span className="show-on-sm">
      <button
        type="button"
        className="btn-primary"
        onClick={() => navigate(adminAbs(ROUTES.ADMIN.PROMOTION_EDIT(promotionId)))}
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
        actions={actions}
      >
        <PromotionDetail
          promotion={promotion}
          fetching={fetching}
          fetchError={fetchError}
          refetch={refetch}
          promotionId={promotionId}
        />
      </PageLayout>
    </Layout>
  );
}

export default PromotionPage;