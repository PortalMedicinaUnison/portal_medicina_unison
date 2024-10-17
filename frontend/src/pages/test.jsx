import React from "react";
import { useEffect, useState } from "react";
import api from "../api";
import fetchUser from "../components/utils";

function TestPage(){
    const [user, setUser] = useState({});

    useEffect(() => {
        fetchUser(setUser);
    }, []);

    useEffect(() => {
        const formData = {
            id: user.id,
            name: "erick"
        };

        const test = async() => {
            try {
                const response = await api.put("/students/", formData);
                console.log(response);
            } catch (error) {
                console.error("Edit failed", error);
            }
        };

        test();
    }, []);

    return (
        <div>
            This is a test to check it we can use the app.put('/students/') in ReactJS.
        </div>
    );
}

export default TestPage;