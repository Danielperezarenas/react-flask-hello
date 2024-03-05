import React, { useContext, useState } from "react";
import { Context } from "../store/appContext";
import { Navigate } from "react-router-dom";


export const Dashboard = () => {
	const { store, actions } = useContext(Context);

    return (
        !store.isLoggedIn ? <Navigate to='/login'/> :
        <div className="card-body py-5 px-md-5">
            <div>
                <h1>Bienvenido {store.user.email}</h1>
            </div>
        </div>
    );
};