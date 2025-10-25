import { useNavigate } from 'react-router-dom';
import { ROUTES, adminAbs } from '../../../../config';
import Layout from '../../../../Layout';
import PageLayout from '../../../../components/PageLayout';
import useGetSurveys from '../../../../admin/features/surveys/hooks/useGetSurveys';
import SurveyCard from '../components/SurveyCard';


function SurveyCardPage() {
  const navigate = useNavigate();
  const { surveys, loading: fetching, error: fetchError, refetch } = useGetSurveys();
    
  return (
    <Layout>
      <PageLayout 
        pretitle=''
      >
        <SurveyCard
          surveys={surveys}
          fetching={fetching}
          fetchError={fetchError}
          refetch={refetch}
        />
      </PageLayout>
    </Layout>
  );
}

export default SurveyCardPage;
