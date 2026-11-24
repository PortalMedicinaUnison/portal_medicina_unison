import { useState } from 'react';
import { useUser } from '../../contexts/UserContext';
import useAuth from '../auth/hooks/useAuth';
import { acceptPrivacyNoticeRequest } from '../../services/userService';
import { getErrorMessage } from '../../utils/errors';
import PrivacyNoticeContent, { LAST_UPDATED, PrivacyNoticeSummary } from './PrivacyNoticeContent';

/*
 * Se muestra en lugar del portal mientras el usuario no acepte la versión vigente del aviso
 * (cuentas creadas antes de que existiera o cuando el aviso cambia). Las páginas no se montan
 * hasta aceptarlo, así que tampoco se cargan datos.
 */
function PrivacyConsentGate() {
  const { user, reload } = useUser();
  const { logout } = useAuth();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [showFull, setShowFull] = useState(false);

  const isUpdate = Boolean(user?.privacy_notice_version);

  const handleAccept = async () => {
    if (saving) return;
    setSaving(true);
    setError(null);
    try {
      await acceptPrivacyNoticeRequest();
      await reload();
    } catch (err) {
      setError(getErrorMessage(err, 'No se pudo registrar tu aceptación. Intenta de nuevo.'));
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-gray-50 px-4 py-10">
      <section
        className="mx-auto max-w-2xl rounded-2xl border bg-white p-6 sm:p-8 space-y-5"
        aria-labelledby="privacy-gate-title"
      >
        <div className="space-y-1">
          <h1 id="privacy-gate-title" className="text-xl font-bold text-gray-900">
            {isUpdate ? 'Actualizamos el aviso de privacidad' : 'Aviso de privacidad'}
          </h1>
          <p className="text-sm text-gray-600">
            Para continuar usando el portal, revisa y acepta el aviso de privacidad
            (última actualización: {LAST_UPDATED}).
          </p>
        </div>

        <div className="rounded-lg bg-gray-50 p-4 text-sm leading-6 text-gray-700">
          <PrivacyNoticeSummary />
        </div>

        <button
          type="button"
          className="text-sm font-medium text-indigo-600 hover:text-indigo-700"
          aria-expanded={showFull}
          onClick={() => setShowFull((v) => !v)}
        >
          {showFull ? 'Ocultar el aviso completo' : 'Leer el aviso completo'}
        </button>

        {showFull && (
          <div className="max-h-[50vh] overflow-y-auto rounded-lg border p-4">
            <PrivacyNoticeContent />
          </div>
        )}

        {error && <div className="alert-error">{error}</div>}

        <div className="flex flex-wrap justify-end gap-3">
          <button type="button" className="btn-secondary" onClick={logout} disabled={saving}>
            Cerrar sesión
          </button>
          <button type="button" className="btn-primary" onClick={handleAccept} disabled={saving}>
            {saving ? 'Guardando...' : 'He leído y acepto el aviso de privacidad'}
          </button>
        </div>
      </section>
    </div>
  );
}

export default PrivacyConsentGate;
