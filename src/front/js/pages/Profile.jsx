import React, { useContext, useState } from "react";
import { Context } from "../store/appContext";
import rigoImageUrl from "../../img/rigo-baby.jpg";
import "../../styles/home.css";
import { useNavigate } from "react-router-dom";

export const Profile = () => {
	const { store, actions } = useContext(Context);
	const [ email, setEmail ] = useState("test");
    const [ password, setPassword ] = useState("test");


    const handleOnClick = async () => {
        const store = getStore();
        const url = process.env.BACKEND_URL + 'api/users';
        const options = {
            method: 'GET',
            headers: {
                "Content-Type": "application/json",
                'Authorization': "Bearer " + localStorage.getItem("token")
            }
        };
        const response = await fetch(url, options);
        if (response.ok) {
            const data = await response.json();
            console.log({ 'user': data.user });
            setStore({ users: data.user });
        } else {
            console.log('Error: ', response.status, response.statusText)
        }
    }

    return (
		<div className="text-center mt-5">
			<h1>Login!</h1>
			<div className="d-flex justify-content-center align-items-center w-100">
				<form className="submit" >
					<div className="mb-3">
						<label htmlFor="InputEmail" className="form-label">Email address</label>
						<input type="email" className="form-control" id="InputEmail" aria-describedby="emailHelp" />
						<div id="emailHelp" className="form-text">We'll never share your email with anyone else.</div>
					</div>
					<div className="mb-3">
						<label htmlFor="InputPassword" className="form-label">Password</label>
						<input type="password" className="form-control" id="InputPassword" />
					</div>
					<div className="mb-3 form-check">
						<input type="checkbox" className="form-check-input" id="Check" />
						<label className="form-check-label" htmlFor="Check">Check me out</label>
					</div>
					<button type="button" className="btn btn-primary" onClick={handleOnClick}>Submit</button>
				</form>
			</div>
		</div>
	);
};