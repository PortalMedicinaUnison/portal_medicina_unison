import React from "react";
import { useEffect, useState } from 'react';
import fetchUser from '../../../../utils/utils';
import Navbar from '../../../../components/Navbar';
import FormularioHistorialClinico from "../components/FormularioHistorialClinico";

function MedicalRecordPage() {
    const [user, setUser] = useState({});

    useEffect(() => {
        fetchUser(setUser);
    }, []);

    return (
        <div>
            <Navbar/>
                <div className="center">
                    <h1>Historial clínico</h1>
                    <FormularioHistorialClinico user={user}/>
                </div>
        </div>
    );
}

export default MedicalRecordPage;