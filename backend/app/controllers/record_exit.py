"""
Renuncia y baja de un internado o servicio social (reglas comunes a ambos programas).

La coordinación las registra con la fecha en que se hicieron efectivas y el motivo (el formato de
renuncia firmado o la causal de la baja). Terminan el programa sin acreditarlo: el lugar en la sede
queda libre (vacante), los documentos del alumno se cierran y el alumno puede asignarse a una
promoción posterior. Si se registró por error, se puede regresar a "activo" mientras haya lugar.
"""
from core.errors import bad_request, conflict

EXIT_NAMES = {4: "la renuncia", 5: "la baja"}


def apply_exit(record, payload: dict, exits: tuple, finished, finished_message: str) -> None:
    """
    Completa en `payload` la fecha y el motivo de la renuncia o baja (se conservan los ya
    registrados si no se envían) o los borra si el estatus deja de serlo.
    """
    target = payload.get("status", record.status)
    if target not in exits:
        payload.update(exit_date=None, exit_reason=None)
        return
    if record.status == finished:
        raise conflict(finished_message)
    already = record.status in exits
    exit_date = payload.get("exit_date") or (record.exit_date if already else None)
    exit_reason = payload.get("exit_reason") or (record.exit_reason if already else None)
    what = EXIT_NAMES[int(target)]
    if exit_date is None:
        raise bad_request(f"Indica la fecha de {what}.")
    if not exit_reason:
        raise bad_request(f"Indica el motivo de {what}.")
    payload.update(exit_date=exit_date, exit_reason=exit_reason)


def ensure_no_other_record(others: list, record_name: str) -> None:
    """Para reactivar un registro con renuncia o baja, el alumno no debe tener otro en curso o acreditado."""
    if others:
        label = others[0].application.promotion.label
        raise conflict(f"El estudiante ya tiene otro {record_name} (promoción {label}); no se puede reactivar este.")
