import { useNavigate, Link } from 'react-router-dom';
import { ROUTES } from '../../../../config';
import Layout from '../../../../Layout';
import PageLayout from '../../../../components/PageLayout';
import ApplicationUpdate from '../components/ApplicationUpdate';
import { useUser } from '../../../../contexts/UserContext';
import useApplicationByAcademic from '../hooks/useApplicationByAcademic'


function ApplicationUpdatePage() {
  const navigate = useNavigate();
  const { user } = useUser();
  const academicId = user?.academic_id;

  const { application, loading: fetching, error: fetchError, refetch } = useApplicationByAcademic(academicId);
  const applicationId = application?.application_id ?? null;
  const status = application?.status != null ? Number(application.status) : null;

  if (status === 2) {
    navigate(ROUTES.USER.INTERNSHIP);
  }
  if (status === 3) {
    navigate(ROUTES.USER.INTERNSHIP_APPLICATION_DECLINED);
  }

  const pageTitle = fetching
  ? 'Cargando...'
  : application
    ? 'Información importante'
    : ' ';
  
  return ( 
    <Layout>
      <PageLayout 
        title={pageTitle}
      >
        <ApplicationUpdate
          application={application}
          fetching={fetching}
          fetchError={fetchError}
          refetch={refetch}
          applicationId={applicationId}
          user={user}
        />
      </PageLayout>
    </Layout>
  );
}

export default ApplicationUpdatePage;
