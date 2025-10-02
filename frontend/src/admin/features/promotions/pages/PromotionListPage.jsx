import { useNavigate } from 'react-router-dom';
import { ROUTES, adminAbs } from '../../../../config';
import Layout from '../../../../Layout';
import PageLayout from '../../../../components/PageLayout';
import useGetPromotions from '../hooks/useGetPromotions';
import PromotionsList from '../components/PromotionList';


function PromotionListPage() {
  const navigate = useNavigate();
  const { promotions, loading: fetching, error: fetchError, refetch } = useGetPromotions();
    
  const actions = (
    <button
      type="button"
      className="btn-primary"
      onClick={() => navigate(adminAbs(ROUTES.ADMIN.PROMOTION_CREATE))}
    >
      Crear
    </button>
  );
    
  return (
    <Layout>
      <PageLayout 
        title="Lista de promociones"
        actions={actions}
      >
        <PromotionsList
          promotions={promotions}
          fetching={fetching}
          fetchError={fetchError}
          refetch={refetch}
        />
      </PageLayout>
    </Layout>
  );
}

export default PromotionListPage;
