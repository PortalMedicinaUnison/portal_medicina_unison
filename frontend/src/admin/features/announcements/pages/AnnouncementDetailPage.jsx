import { useNavigate, useParams } from "react-router-dom";
import { ROUTES, adminAbs } from "../../../../config";
import useAnnouncement from '../hooks/useAnnouncement';
import Layout from "../../../../Layout";
import PageLayout from '../../../../components/PageLayout';
import AnnouncementDetail from "../components/AnnouncementDetail";


function AnnouncementPage() {
  const navigate = useNavigate();
  const { announcementId } = useParams();
  const { announcement, loading: fetching, error: fetchError, refetch } = useAnnouncement(announcementId);

  const pageTitle = fetching
  ? 'Cargando...'
  : announcement
    ? `${announcement.title}`
    : ' ';

  const actions = (
    <span className="show-on-sm">
      <button
        type="button"
        className="btn-primary"
        onClick={() => navigate(adminAbs(ROUTES.ADMIN.ANNOUNCEMENT_EDIT(announcementId)))}
        disabled={fetching || fetchError}
      >
        Editar
      </button>
    </span>
  );

  return (
    <Layout>
      <PageLayout 
        title={pageTitle}
        actions={actions}
      >
        <AnnouncementDetail
          announcement={announcement}
          fetching={fetching}
          fetchError={fetchError}
          refetch={refetch}
          announcementId={announcementId}
        />
      </PageLayout>
    </Layout>
  );
}

export default AnnouncementPage;