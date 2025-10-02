import { useParams } from "react-router-dom";
import Layout from "../../../../Layout.jsx";
import PageLayout from '../../../../components/PageLayout.jsx';
import InstitutionUpdate from '../components/InstitutionUpdate.jsx'
import useInstitution from '../hooks/useInstitution.js';


function InstitutionUpdatePage() {
  const { institutionId } = useParams();
  const { institution, loading: fetching, error: fetchError, refetch } = useInstitution(institutionId);
  
  const pageTitle = fetching
  ? 'Cargando anuncio...'
  : institution
    ? '📢 Actualizar anuncio'
    : ' ';
  
  return ( 
    <Layout>
      <PageLayout 
        title={pageTitle}
      >
        <InstitutionUpdate
          institution={institution}
          fetching={fetching}
          fetchError={fetchError}
          refetch={refetch}
          institutionId={institutionId}
        />
      </PageLayout>
    </Layout>
  );
}

export default InstitutionUpdatePage;
