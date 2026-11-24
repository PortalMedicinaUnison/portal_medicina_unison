import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Layout from '../../../../Layout';
import LoadingSpinner from '../../../../utils/ui/LoadingSpinner';
import DataLoadError from '../../../../utils/ui/DataLoadError';
import { getProgramRecordRequest } from '../../../../services/inscriptionService';
import { getErrorMessage } from '../../../../utils/errors';
import { INSCRIPTION_PROGRAMS } from '../programs';

// Enlaces anteriores a un internado o servicio social (/internships/:id) → su inscripción.
function RecordRedirectPage({ program }) {
  const config = INSCRIPTION_PROGRAMS[program];
  const { recordId } = useParams();
  const navigate = useNavigate();
  const [error, setError] = useState(null);

  useEffect(() => {
    let active = true;
    getProgramRecordRequest(program, recordId)
      .then(({ data }) => { if (active) navigate(config.detailPath(data.application_id), { replace: true }); })
      .catch((err) => { if (active) setError(getErrorMessage(err, `No se encontró el ${config.recordName}.`)); });
    return () => { active = false; };
  }, [program, recordId, navigate, config]);

  return (
    <Layout>
      {error
        ? <DataLoadError title={`No se encontró el ${config.recordName}`} message={error} onSecondary={() => navigate(config.listPath)} secondaryLabel="Ir a inscripciones" />
        : <LoadingSpinner />}
    </Layout>
  );
}

export default RecordRedirectPage;
