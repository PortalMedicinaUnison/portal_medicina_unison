import { useParams } from "react-router-dom";
import Layout from "../../../../Layout.jsx";
import PageLayout from '../../../../components/PageLayout.jsx';
import PromotionUpdate from '../components/PromotionUpdate.jsx'
import usePromotion from '../hooks/usePromotion.js';


function PromotionUpdatePage() {
  const { promotionId } = useParams();
  const { promotion, loading: fetching, error: fetchError, refetch } = usePromotion(promotionId);
  
  const pageTitle = fetching
  ? 'Cargando...'
  : promotion
    ? 'Actualizar promoción'
    : ' ';
  
  return ( 
    <Layout>
      <PageLayout 
        title={pageTitle}
      >
        <PromotionUpdate
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

export default PromotionUpdatePage;
