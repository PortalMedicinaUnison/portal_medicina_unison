import PromotionUpdate from "../components/PromotionUpdate.jsx";
import Layout from "../../../../Layout.jsx";
import PageLayout from '../../../../components/PageLayout.jsx';


function PromotionUpdatePage() {
  return ( 
    <Layout>
      <PageLayout 
        title="Actualizar promoción" 
      >
        <PromotionUpdate/>
      </PageLayout>
    </Layout>
  );
}

export default PromotionUpdatePage;
