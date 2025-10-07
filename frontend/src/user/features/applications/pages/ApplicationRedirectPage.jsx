import { Navigate, useNavigate } from 'react-router-dom';
import Layout from '../../../../Layout';
import PageLayout from '../../../../components/PageLayout';
import { ROUTES } from '../../../../config';
import { useUser } from '../../../../contexts/UserContext';
import useApplicationByAcademic from '../hooks/useApplicationByAcademic';
import LoadingSpinner from '../../../../utils/ui/LoadingSpinner';
import DataLoadError from '../../../../utils/ui/DataLoadError';

const STATUS = { PENDING: 1, ACCEPTED: 2, DECLINED: 3 };

function ApplicationRedirectPage() {
  const { user } = useUser();
  const navigate = useNavigate();
  const academicId = user?.academic_id;

  const { application, loading: fetching, error: fetchError, refetch } = useApplicationByAcademic(academicId);

  if (fetching) return <LoadingSpinner />;

  if (fetchError) {
    return (
      <DataLoadError
        title="No se pudo cargar la información de tu internado"
        message="Intenta recargar o vuelve más tarde."
        details={fetchError}
        onRetry={refetch}
        onSecondary={() => navigate(-1)}
        secondaryLabel="Volver"
      />
    );
  }

  if (!application) {
    return (
      <DataLoadError
        title="404"
        message="No encontramos información sobre tu internado. Contacta a tu administrador para verificar tu estado."
        onRetry={refetch}
        retryLabel="Recargar"
        onSecondary={() => navigate(-1)}
        secondaryLabel="Volver"
      />
    );
  }

  const status = application?.status != null ? Number(application.status) : null;

  if (status === STATUS.PENDING) {
    return <Navigate replace to={ROUTES.USER.INTERNSHIP_APPLICATION_STATUS} />;
  }

  if (status === STATUS.ACCEPTED) {
    return <Navigate replace to={ROUTES.USER.INTERNSHIP} />;
  }

  if (status === STATUS.DECLINED) {
    return <Navigate replace to={ROUTES.USER.INTERNSHIP_APPLICATION_DECLINED} />;
  }

  return (
    <Layout>
      <PageLayout title="Internado">
        <p>No pudimos determinar tu estado de internado.</p>
      </PageLayout>
    </Layout>
  );
}

export default ApplicationRedirectPage;
