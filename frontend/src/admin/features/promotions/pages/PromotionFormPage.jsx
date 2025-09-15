import PromotionForm from "../components/PromotionForm.jsx";
import Layout from "../../../../Layout.jsx";
import PageLayout from '../../../../components/PageLayout.jsx';


function PromotionFormPage() {
  return ( 
    <Layout>
      <PageLayout 
        title="Registrar nueva promoción" 
      >
        <PromotionForm/>
      </PageLayout>
    </Layout>
  );
}

export default PromotionFormPage;
