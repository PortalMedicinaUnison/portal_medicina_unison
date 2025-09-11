import PromotionsList from '../components/PromotionsList.jsx';
import Layout from '../../../../Layout.jsx';
import PageLayout from '../../../../components/PageLayout.jsx';
import { useNavigate } from 'react-router-dom';
import { ROUTES, adminAbs } from '../../../../config.js';


function PromotionsListPage() {
  const navigate = useNavigate();

  const promotionActions = (
    <span className="show-on-sm">
      <button
        type="button"
        className="btn-primary"
        onClick={() => navigate(adminAbs(ROUTES.ADMIN.PROMOTION_CREATE))}
      >
        Crear
      </button>
    </span>
  );

  return (
      <Layout>
        <PageLayout 
          title="Lista de promociones"
          actions={promotionActions}
          >
          <PromotionsList />
        </PageLayout>
      </Layout>
  );
}

export default PromotionsListPage;