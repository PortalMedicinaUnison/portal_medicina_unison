import AnnouncementInfo from "../components/AnnouncementInfo";
import { useNavigate, useParams } from "react-router-dom";
import { ROUTES, adminAbs } from "../../../../config";
import { useAnnouncement } from '../hooks/useAnnouncement';
import Layout from "../../../../Layout";
import PageLayout from '../../../../components/PageLayout';

function AnnouncementPage() {
  const { announcementId } = useParams();
  const { announcement, loading, error } = useAnnouncement(announcementId);
  const navigate = useNavigate();

  // Acción para el botón de editar
  const editAnnouncementActions = (
    <span className="show-on-sm">
      <button
        type="button"
        className="btn-primary"
        // Navega a la ruta para EDITAR el anuncio actual
        onClick={() => navigate(adminAbs(ROUTES.ADMIN.ANNOUNCEMENT_EDIT(announcementId)))}
      >
        Editar
      </button>
    </span>
  );

  if (loading) return <Layout><div>Cargando...</div></Layout>;
  if (error) return <Layout><div>{error}</div></Layout>;
  if (!announcement) return <Layout><div>No se encontró el anuncio.</div></Layout>;

  return (
      <Layout>
        <PageLayout 
          title={'📢 ' + announcement.title}
          actions={editAnnouncementActions}
        >
          {/* Pasamos los datos del anuncio al componente de información */}
          <AnnouncementInfo announcement={announcement}/>
        </PageLayout>
      </Layout>
  );
}

export default AnnouncementPage;
