import { useNavigate, Link } from 'react-router-dom';
import { ROUTES } from '../../../../config';
import Layout from '../../../../Layout';
import PageLayout from '../../../../components/PageLayout';
import InternshipDetail from '../components/InternshipDetail';
import { useUser } from '../../../../contexts/UserContext';
import useApplicationByAcademic from '../hooks/useApplicationByAcademic'
import { useEffect } from 'react';


function InternshipDetailPage() {
  const navigate = useNavigate();
  const { user } = useUser();
  const academicId = user?.academic_id;

  const { application, loading: fetching, error: fetchError, refetch } = useApplicationByAcademic(academicId);
  const applicationId = application?.application_id ?? null;
  const status = application?.status != null ? Number(application.status) : null;

  if (status === 1) {
    navigate(ROUTES.USER.INTERNSHIP_APPLICATION_STATUS);
  }
  if (status === 3) {
    navigate(ROUTES.USER.INTERNSHIP_APPLICATION_DECLINED);
  }

  return ( 
    <Layout>
      <PageLayout 
        title="Detalle de pasantía" 
      >
        <InternshipDetail/>
      </PageLayout>
    </Layout>
  );
}

export default InternshipDetailPage;