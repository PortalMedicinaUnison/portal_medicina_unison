import { useRef, useState } from 'react';
import Modal from '../../../../utils/ui/Modal';
import usePasswordResetLink from '../hooks/usePasswordResetLink';
import { formatDateTime, formatFullName } from '../../../../utils/utils';


function buildMailto(user, url, expiresText) {
  const subject = 'Restablecer contraseña - Portal de Medicina Unison';
  const body = [
    `Hola, ${user.first_name}:`,
    '',
    'Para crear una contraseña nueva en el portal de Internado y Servicio Social de Medicina abre este enlace',
    `(vence el ${expiresText} y solo se puede usar una vez):`,
    url,
    '',
    'Si no lo solicitaste, avisa a la coordinación.',
  ].join('\n');
  return `mailto:${encodeURIComponent(user.email)}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}

/*
 * Botón + diálogo para generar el enlace de restablecimiento. No requiere servidor de correo:
 * la coordinación lo copia o lo envía desde su propio correo.
 */
function PasswordResetLinkDialog({ user }) {
  const { link, createLink, loading, error, reset } = usePasswordResetLink();
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const inputRef = useRef(null);

  const handleClose = () => {
    setOpen(false);
    setCopied(false);
    reset();
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(link.url);
      setCopied(true);
    } catch {
      // Sin HTTPS el portapapeles no está disponible: se selecciona el texto para copiarlo a mano.
      inputRef.current?.select();
      setCopied(document.execCommand?.('copy') ?? false);
    }
  };

  const expiresText = link ? formatDateTime(link.expiresAt, { dateStyle: 'long' }) : '';

  return (
    <>
      <button type="button" className="btn-tertiary" onClick={() => setOpen(true)}>
        Restablecer contraseña
      </button>

      <Modal open={open} onClose={handleClose} title="Restablecer contraseña">
        {!link ? (
          <div className="space-y-4 text-sm text-gray-700">
            <p>
              Se generará un enlace de un solo uso para que <strong>{formatFullName(user)}</strong> cree una
              contraseña nueva. Los enlaces generados antes dejarán de funcionar y, al cambiarla, se cerrarán
              las sesiones abiertas de la cuenta.
            </p>
            {error && <div className="alert-error">{error}</div>}
            <div className="flex flex-wrap justify-end gap-3">
              <button type="button" className="btn-secondary" onClick={handleClose}>Cancelar</button>
              <button type="button" className="btn-primary" onClick={() => createLink(user.user_id)} disabled={loading}>
                {loading ? 'Generando...' : 'Generar enlace'}
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-4 text-sm text-gray-700">
            <p>
              Envía este enlace solo a <strong>{user.email}</strong> o entrégalo en persona: quien lo tenga puede
              cambiar la contraseña. Vence el <strong>{expiresText}</strong>.
            </p>
            <label className="form-label" htmlFor="password-reset-link">Enlace</label>
            <input
              id="password-reset-link"
              ref={inputRef}
              type="text"
              readOnly
              value={link.url}
              onFocus={(e) => e.target.select()}
              className="form-input_full font-mono text-xs"
            />
            {copied && <p className="text-xs text-green-700" role="status">Enlace copiado.</p>}
            <div className="flex flex-wrap justify-end gap-3">
              <a className="btn-secondary" href={buildMailto(user, link.url, expiresText)}>
                Enviar desde mi correo
              </a>
              <button type="button" className="btn-secondary" onClick={handleCopy}>Copiar enlace</button>
              <button type="button" className="btn-primary" onClick={handleClose}>Listo</button>
            </div>
          </div>
        )}
      </Modal>
    </>
  );
}

export default PasswordResetLinkDialog;
