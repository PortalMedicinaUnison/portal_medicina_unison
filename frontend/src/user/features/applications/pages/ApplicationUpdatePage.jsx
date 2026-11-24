import { Navigate } from 'react-router-dom';
import { ROUTES } from '../../../../config';
import { APPLICATION_STATUS } from '../../../../utils/constants';
import Layout from '../../../../Layout';
import PageLayout from '../../../../components/PageLayout';
import ApplicationUpdate from '../components/ApplicationUpdate';
import { useUser } from '../../../../contexts/UserContext';
import useApplicationByAcademic from '../hooks/useApplicationByAcademic';


function ApplicationUpdatePage() {
  const { user } = useUser();
  const academicId = user?.academic_id;

  const { application, loading: fetching, error: fetchError, refetch } = useApplicationByAcademic(academicId);
  const applicationId = application?.application_id ?? null;
  const status = application?.status != null ? Number(application.status) : null;

  // Si la asignación ya fue respondida se manda a la vista que corresponde (sin navegar durante el render).
  if (status === APPLICATION_STATUS.ACCEPTED) {
    return <Navigate replace to={ROUTES.USER.INTERNSHIP} />;
  }
  if (status === APPLICATION_STATUS.DECLINED) {
    return <Navigate replace to={ROUTES.USER.INTERNSHIP_APPLICATION_DECLINED} />;
  }

  return (
    <Layout>
      <PageLayout title={application ? 'Información importante' : 'Mi internado'}>
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
