import { useNavigate, useSearchParams } from 'react-router-dom';
import Layout from '../../../../Layout';
import PageLayout from '../../../../components/PageLayout';
import useGetPromotions from '../hooks/useGetPromotions';
import PromotionsList from '../components/PromotionList';
import { PROGRAM_LABELS } from '../../../../utils/constants';
import { promotionCreatePath } from '../promotionPaths';
import { programFromParams } from '../../../../utils/programParams';


// Una sola pantalla para ambos programas: el menú de Internado y el de Servicio social la abren con ?program=.
function PromotionListPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const program = programFromParams(searchParams);
  const { promotions, loading: fetching, error: fetchError, refetch } = useGetPromotions({ program });

  const actions = (
    <button
      type="button"
      className="btn-primary"
      onClick={() => navigate(promotionCreatePath(program))}
    >
      Crear
    </button>
  );

  return (
    <Layout>
      <PageLayout
        title={program ? `Promociones · ${PROGRAM_LABELS[program]}` : 'Promociones'}
        actions={actions}
      >
        {/* key: al cambiar de programa se limpian los filtros de la lista */}
        <PromotionsList
          key={program ?? 'all'}
          program={program}
          promotions={promotions}
          fetching={fetching}
          fetchError={fetchError}
          refetch={refetch}
        />
      </PageLayout>
    </Layout>
  );
}

export default PromotionListPage;
