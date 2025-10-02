import { useNavigate, useParams } from "react-router-dom";
import { ROUTES, adminAbs } from "../../../../config";
import useSurvey from '../hooks/useSurvey';
import Layout from "../../../../Layout";
import PageLayout from '../../../../components/PageLayout';
import SurveyDetail from "../components/SurveyDetail";


function SurveyPage() {
  const navigate = useNavigate();
  const { surveyId } = useParams();
  const { survey, loading: fetching, error: fetchError, refetch } = useSurvey(surveyId);

  const pageTitle = fetching
  ? 'Cargando encuesta...'
  : survey
    ? `📢 ${survey.title}`
    : ' ';

  const actions = (
    <span className="show-on-sm">
      <button
        type="button"
        className="btn-primary"
        onClick={() => navigate(adminAbs(ROUTES.ADMIN.SURVEY_EDIT(surveyId)))}
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
        <SurveyDetail
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

export default SurveyPage;