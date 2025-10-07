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
  const academicId = user?.academic_id || null;

  const { application, loading: fetching, error: fetchError, refetch } =
    useApplicationByAcademic(academicId);

  if (fetching) return <LoadingSpinner />;

  if (fetchError) {
    return (
      <Layout>
        <PageLayout title="Mi Internado">
          <DataLoadError
            title="No se pudo cargar la información de tu internado"
            message="Intenta recargar o vuelve más tarde."
            details={String(fetchError)}
            onRetry={refetch}
            onSecondary={() => navigate(-1)}
            secondaryLabel="Volver"
          />
        </PageLayout>
      </Layout>
    );
  }

  if (!application) {
    return (
      <Layout>
        <PageLayout title="Mi Internado">
          <DataLoadError
            title="Internado no encontrado"
            message="No encontramos información sobre tu internado. Contacta a tu administrador para verificar tu estado."
            onRetry={refetch}
            retryLabel="Recargar"
            onSecondary={() => navigate(-1)}
            secondaryLabel="Volver"
          />
        </PageLayout>
      </Layout>
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
      <PageLayout title="Mi Internado">
        <DataLoadError
          title="Estado desconocido"
          message="Tu solicitud tiene un estado no reconocido. Contacta al administrador."
          onSecondary={() => navigate(-1)}
          secondaryLabel="Volver"
        />
      </PageLayout>
    </Layout>
  );
}

export default ApplicationRedirectPage;
