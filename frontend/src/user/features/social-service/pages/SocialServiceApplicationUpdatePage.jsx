import { Navigate } from 'react-router-dom';
import { ROUTES } from '../../../../config';
import { APPLICATION_STATUS } from '../../../../utils/constants';
import Layout from '../../../../Layout';
import PageLayout from '../../../../components/PageLayout';
import SocialServiceApplicationUpdate from '../components/SocialServiceApplicationUpdate';
import { useUser } from '../../../../contexts/UserContext';
import useSocialServiceApplicationByAcademic from '../hooks/useSocialServiceApplicationByAcademic';


function SocialServiceApplicationUpdatePage() {
  const { user } = useUser();
  const academicId = user?.academic_id;

  const { application, loading: fetching, error: fetchError, refetch } =
    useSocialServiceApplicationByAcademic(academicId);
  const applicationId = application?.application_id ?? null;
  const status = application?.status != null ? Number(application.status) : null;

  // Si la asignación ya fue respondida se manda a la vista que corresponde (sin navegar durante el render).
  if (status === APPLICATION_STATUS.ACCEPTED) {
    return <Navigate replace to={ROUTES.USER.SOCIAL_SERVICE} />;
  }
  if (status === APPLICATION_STATUS.DECLINED) {
    return <Navigate replace to={ROUTES.USER.SOCIAL_SERVICE_APPLICATION_DECLINED} />;
  }

  return (
    <Layout>
      {/* Mientras carga se deja el título final para que no cambie al llegar los datos. */}
      <PageLayout title={fetching || application ? 'Mi asignación · Servicio social' : 'Mi servicio social'}>
        <SocialServiceApplicationUpdate
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

export default SocialServiceApplicationUpdatePage;
