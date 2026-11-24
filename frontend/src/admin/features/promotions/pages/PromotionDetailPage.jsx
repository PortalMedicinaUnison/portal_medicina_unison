import { Link, useNavigate, useParams } from "react-router-dom";
import { ROUTES, adminAbs } from "../../../../config";
import usePromotion from '../hooks/usePromotion';
import { INSCRIPTION_PROGRAMS } from '../../inscriptions/programs';
import { PROGRAM_LABELS, labelOf } from '../../../../utils/constants';
import { promotionLabel } from '../../../../utils/utils';
import Layout from "../../../../Layout";
import PageLayout from '../../../../components/PageLayout';
import PromotionDetail from "../components/PromotionDetail";


function PromotionPage() {
  const navigate = useNavigate();
  const { promotionId } = useParams();
  const { promotion, loading: fetching, error: fetchError, refetch } = usePromotion(promotionId);

  const pageTitle = promotion
    ? `Promoción · ${labelOf(PROGRAM_LABELS, promotion.program)} ${promotionLabel(promotion)}`
    : fetching ? 'Cargando...' : ' ';
  const inscriptions = promotion && INSCRIPTION_PROGRAMS[promotion.program];

  const actions = (
    <span className="flex flex-wrap gap-3">
      {inscriptions && (
        <Link to={`${inscriptions.listPath}?promotion_id=${promotion.promotion_id}`} className="btn-secondary">
          Ver inscripciones
        </Link>
      )}
      <button
        type="button"
        className="btn-primary"
        onClick={() => navigate(adminAbs(ROUTES.ADMIN.PROMOTION_EDIT(promotionId)))}
        disabled={fetching || Boolean(fetchError)}
      >
        Editar fechas y cupos
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