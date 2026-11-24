import { Navigate } from 'react-router-dom';
import { ROUTES } from '../../../../config';
import { APPLICATION_STATUS } from '../../../../utils/constants';
import Layout from '../../../../Layout';
import PageLayout from '../../../../components/PageLayout';
import ApplicationDeclined from '../components/ApplicationDeclined';
import { useUser } from '../../../../contexts/UserContext';
import useApplicationByAcademic from '../hooks/useApplicationByAcademic';

function ApplicationDeclinedPage() {
  const { user } = useUser();
  const academicId = user?.academic_id;
  const { application, loading: fetching, error: fetchError, refetch } = useApplicationByAcademic(academicId);

  // Si su asignación más reciente no está declinada (p. ej. tiene una nueva pendiente),
  // la página de redirección lo manda a la vista correcta.
  if (application && Number(application.status) !== APPLICATION_STATUS.DECLINED) {
    return <Navigate replace to={ROUTES.USER.INTERNSHIP_REDIRECT} />;
  }

  return (
    <Layout>
      <PageLayout title="Participación declinada">
        <ApplicationDeclined
          application={application}
          fetching={fetching}
          fetchError={fetchError}
          refetch={refetch}
          user={user}
        />
      </PageLayout>
    </Layout>
  );
}

export default ApplicationDeclinedPage;
