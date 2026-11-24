import { useState } from 'react';
import Modal from '../../../utils/ui/Modal';

// La coordinación escribe qué debe corregir el estudiante (el documento queda "con observaciones").
function ObservationsDialog({ open, documentName, onClose, onSubmit, saving }) {
  const [comment, setComment] = useState('');
  const [error, setError] = useState('');

  const handleClose = () => {
    setComment('');
    setError('');
    onClose();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const text = comment.trim();
    if (!text) {
      setError('Escribe las observaciones para el estudiante.');
      return;
    }
    const ok = await onSubmit(text);
    if (ok) {
      setComment('');
      setError('');
    }
  };

  return (
    <Modal open={open} onClose={handleClose} title="Observaciones">
      <form className="space-y-4" onSubmit={handleSubmit}>
        <p className="text-sm text-gray-700">
          {documentName ? <>Documento: <strong>{documentName}</strong>. </> : null}
          El estudiante verá este mensaje y podrá subir el documento corregido.
        </p>
        <label className="form-label" htmlFor="review-comment">Qué debe corregir</label>
        <textarea
          id="review-comment"
          className="form-input_full min-h-28"
          maxLength={2000}
          value={comment}
          onChange={(e) => { setComment(e.target.value); if (error) setError(''); }}
          disabled={saving}
        />
        {error && <div className="alert-error">{error}</div>}
        <div className="flex flex-wrap justify-end gap-3">
          <button type="button" className="btn-secondary" onClick={handleClose} disabled={saving}>Cancelar</button>
          <button type="submit" className="btn-primary" disabled={saving}>
            {saving ? 'Guardando...' : 'Guardar observaciones'}
          </button>
        </div>
      </form>
    </Modal>
  );
}

export default ObservationsDialog;
