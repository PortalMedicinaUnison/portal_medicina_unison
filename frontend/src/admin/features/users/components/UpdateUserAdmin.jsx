import { useState } from "react";
import useUserAdmin from "../hooks/useUserAdmin";
import useUpdateUser from "../hooks/useUpdateUserAdmin";
import LoadingSpinner from "../../../../utils/ui/LoadingSpinner";

function UpdateUserAdmin({ academicId, onClose, onSuccess }) {
    const { user, loading, error, refetch } = useUserAdmin(academicId);
    const { updateUser, error: updateError } = useUpdateUser();
    const [submitting, setSubmitting] = useState(false);

    if (loading) return <LoadingSpinner />;
    if (error) return <p>Error es: {String(error)}</p>;
    if (!userAdmin) return <p>No se encontró el usuario.</p>;

    const nextIsAdmin = !Boolean(userAdmin.is_admin);

    const handleConfirm = async () => {
      try {
          setSubmitting(true);
          const ok = await updateUserAdmin(userAdmin.user_id, { is_admin: nextIsAdmin });
          if (ok) {
          await refetch?.();
          onSuccess?.(nextIsAdmin);
          onClose?.();
          }
      } finally {
          setSubmitting(false);
      }
  };

    return (
      <div className="flex w-full justify-center items-center">
          <div className="w-full ">
            <svg
                xmlns="http://www.w3.org/2000/svg"
                className="justify-self-center mb-4"
                width="90" height="90" 
                viewBox="0 0 24 24"
                fill="none"
                stroke="gray"
                strokeLinecap="round"
                strokeLinejoin="round"
            >
                <circle cx="10.5" cy="10.5" r="8"/>
                <path d="M10.5 11.5v-5"/>
                <circle cx="10.5" cy="14.5" r="1"/>
            </svg>

            <div className="text-center mb-8">
                <p>
                El rol del usuario <strong>{userAdmin?.first_name + ' ' + userAdmin?.last_name || userId}</strong> cambiará a
                <strong>{nextIsAdmin ? ' Administrador' : ' Alumno'}</strong>. ¿Estás seguro?
                </p>
            </div>

            <div className="flex gap-16">
            <button
              type="button"
              onClick={handleConfirm}
              disabled={submitting}
              className="btn-primary_full bg-red-600 hover:bg-red-700 focus:ring-red-500"
            >
              {submitting ? 'Guardando...' : 'Sí, estoy seguro'}
            </button>
  

            <button
              type="button"
              onClick={onClose}
              className="btn-secondary_full"
              disabled={submitting}
            >
              Cancelar
            </button>
            </div>
          </div>
      </div>
    );
  }
  
  export default UpdateUserAdmin;