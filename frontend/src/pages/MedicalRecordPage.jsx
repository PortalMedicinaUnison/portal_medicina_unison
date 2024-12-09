import React from "react";
import { useEffect, useState } from 'react';
import fetchUser from '../components/utils';

import Encabezado from '../components/Encabezado';
import ContenidoPrincipal from '../components/ContenidoPrincipal';
import BarraNavegacion from '../components/BarraNavegacion';
import FormularioHistorialClinico from "../components/FormularioHistorialClinico";

function MedicalRecordPage() {
    const [user, setUser] = useState({});

    useEffect(() => {
        fetchUser(setUser);
    }, []);

    return (
        <div>
            <BarraNavegacion/>
            <ContenidoPrincipal user={user}>
                <FormularioHistorialClinico/>
            </ContenidoPrincipal>
        </div>
    );
}

export default MedicalRecordPage;