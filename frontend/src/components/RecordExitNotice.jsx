import { formatDate } from '../utils/utils';

// Aviso al alumno cuando su internado o servicio social terminó por renuncia (4) o baja (5).
function RecordExitNotice({ record, programName, afterWithdrawal }) {
  const withdrawal = Number(record.status) === 4;
  return (
    <div className="mb-8 rounded-md border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900" role="status">
      <p className="font-semibold">
        Tu {programName} terminó por {withdrawal ? 'renuncia' : 'baja'} el {formatDate(record.exit_date, { dateStyle: 'long' })}.
      </p>
      {record.exit_reason && <p className="mt-1">Motivo: {record.exit_reason}</p>}
      <p className="mt-2">
        {withdrawal ? afterWithdrawal : 'Si tienes dudas, acude a la coordinación.'} Tus documentos quedan solo para consulta.
      </p>
    </div>
  );
}

export default RecordExitNotice;
