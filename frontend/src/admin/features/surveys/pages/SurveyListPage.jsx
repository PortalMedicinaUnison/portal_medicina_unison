import { useNavigate } from 'react-router-dom';
import { ROUTES, adminAbs } from '../../../../config';
import Layout from '../../../../Layout';
import PageLayout from '../../../../components/PageLayout';
import useGetSurveys from '../hooks/useGetSurveys';
import SurveyList from '../components/SurveyList';


function SurveyListPage() {
  const navigate = useNavigate();
  const { surveys, loading: fetching, error: fetchError, refetch } = useGetSurveys();
    
  const actions = (
    <button
      type="button"
      className="btn-primary"
      onClick={() => navigate(adminAbs(ROUTES.ADMIN.SURVEY_CREATE))}
    >
      Crear
    </button>
  );
    
  return (
    <Layout>
      <PageLayout 
        title="Lista de encuestas"
        actions={actions}
      >
        <SurveyList
          surveys={surveys}
          fetching={fetching}
          fetchError={fetchError}
          refetch={refetch}
        />
      </PageLayout>
    </Layout>
  );
}

export default SurveyListPage;
