  import { useNavigate, useParams } from "react-router-dom";
  import { ROUTES, adminAbs } from "../../../../config";
  import { useAnnouncement } from '../hooks/useAnnouncement';
  import AnnouncementInfo from "../components/AnnouncementInfo";
  import Layout from "../../../../Layout";
  import PageLayout from '../../../../components/PageLayout';
  import LoadingSpinner from '../../../../utils/ui/LoadingSpinner';
  import DataLoadError from '../../../../utils/ui/DataLoadError';


  function AnnouncementPage() {
    const { announcementId } = useParams();
    const { announcement, loading, error } = useAnnouncement(announcementId);
    const navigate = useNavigate();

    const announcementActions = (
      <span className="show-on-sm">
        <button
          type="button"
          className="btn-primary"
          onClick={() => navigate(adminAbs(ROUTES.ADMIN.ANNOUNCEMENT_EDIT(announcementId)))}
        >
          Editar
        </button>
      </span>
    );

    if (loading) return <Layout><LoadingSpinner /></Layout>;
    if (error) return <Layout><div>{error}</div></Layout>;
    if (!announcement) return <Layout><div>No se encontró el anuncio.</div></Layout>;

    return (
        <Layout>
          <PageLayout 
            title={'📢 ' + announcement.title}
            actions={announcementActions}
          >
            <AnnouncementInfo/>
          </PageLayout>
        </Layout>
    );
  }

  export default AnnouncementPage;
