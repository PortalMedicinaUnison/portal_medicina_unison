import { PROGRAM_LABELS } from './constants';

// Pantallas compartidas por el internado y el servicio social: el programa viaja en la URL
// (?program=1 internado, 2 servicio social) y el menú tiene una entrada por programa.
export const withProgram = (path, program) => (program ? `${path}?program=${program}` : path);

// Programa válido de los parámetros de la URL, o null.
export function programFromParams(searchParams) {
  const value = searchParams.get('program');
  return PROGRAM_LABELS[value] ? Number(value) : null;
}
