import SurveyInfo from "../components/SurveyInfo";
import { useNavigate, useParams } from "react-router-dom";
import { ROUTES, adminAbs } from "../../../../config";
import { useSurvey } from "../hooks/useSurvey";
import Layout from "../../../../Layout";
import PageLayout from '../../../../components/PageLayout';

function SurveyPage() {
  const { surveyId } = useParams();
  const { survey, loading, error } = useSurvey(surveyId);
  const navigate = useNavigate();

  // Acción para el botón de editar
  const editSurveyActions = (
    <span className="show-on-sm">
      <button
        type="button"
        className="btn-primary"
        // Navega a la ruta para EDITAR el anuncio actual
        onClick={() => navigate(adminAbs(ROUTES.ADMIN.SURVEY_EDIT(surveyId)))}
      >
        Editar
      </button>
    </span>
  );

  if (loading) return <Layout><div>Cargando...</div></Layout>;
  if (error) return <Layout><div>{error}</div></Layout>;
  if (!survey) return <Layout><div>No se encontró la encuesta.</div></Layout>;

  return (
      <Layout>
        <PageLayout 
          title={'📢 ' + survey.title}
          actions={editSurveyActions}
        >
          {/* Pasamos los datos del anuncio al componente de información */}
          <SurveyInfo survey={survey}/>
        </PageLayout>
      </Layout>
  );
}

export default SurveyPage;
