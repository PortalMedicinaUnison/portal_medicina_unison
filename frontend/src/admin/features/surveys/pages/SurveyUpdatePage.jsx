import { useParams } from "react-router-dom";
import Layout from "../../../../Layout.jsx";
import PageLayout from '../../../../components/PageLayout.jsx';
import SurveyUpdate from '../components/SurveyUpdate.jsx'
import useSurvey from '../hooks/useSurvey.js';


function SurveyUpdatePage() {
  const { surveyId } = useParams();
  const { survey, loading: fetching, error: fetchError, refetch } = useSurvey(surveyId);
  
  const pageTitle = fetching
  ? 'Cargando encuesta...'
  : survey
    ? '📢 Actualizar encuesta'
    : ' ';
  
  return ( 
    <Layout>
      <PageLayout 
        title={pageTitle}
      >
        <SurveyUpdate
          survey={survey}
          fetching={fetching}
          fetchError={fetchError}
          refetch={refetch}
          surveyId={surveyId}
        />
      </PageLayout>
    </Layout>
  );
}

export default SurveyUpdatePage;
