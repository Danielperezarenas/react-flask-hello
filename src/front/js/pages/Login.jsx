import React, { useContext, useState } from "react";
import { Context } from "../store/appContext";
import { Navigate, useNavigate } from "react-router-dom";


export const Login = () => {
	const { store, actions } = useContext(Context);

	const [ email, setEmail ] = useState("");
    const [ password, setPassword ] = useState("");
	const navigate = useNavigate();

	const handleOnClick = async () => {
		const url = process.env.BACKEND_URL + "/api/login";
		const options = {
			method: "POST",
			headers: {
				"Content-Type": "application/json"
			},
			body: JSON.stringify({ email, password })
		};
		const response = await fetch(url, options);
			if (!response.ok) {
				console.log('Error: ', response.status, response.statusText);
			}
			const data = await response.json();
			console.log(data);
			actions.login(data.access_token, data.results.user);
    };

	const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            handleOnClick();
        }
    };

	return (
        store.isLoggedIn ? <Navigate to='/private'/> :
		<div className="text-center mt-5">
			<h1>Login!</h1>
			<div className="d-flex justify-content-center align-items-center w-100">
				<form className="submit" onKeyDown={handleKeyPress}>
					<div className="mb-3">
						<label htmlFor="InputEmail" className="form-label">Email address</label>
						<input 
							type="email" 
							className="form-control"
							value={email}
							onChange={(e) => setEmail(e.target.value)} 
							placeholder="email" 
							required 
							id="InputEmail" 
							aria-describedby="emailHelp" 
						/>
						<div id="emailHelp" className="form-text">We'll never share your email with anyone else.</div>
					</div>
					<div className="mb-3">
						<label htmlFor="InputPassword" className="form-label">Password</label>
						<input 
							type="password" 
							className="form-control" 
							value={password}
							onChange={(e) => setPassword(e.target.value)} 
							autoComplete="off" 
							placeholder="password" 
							required 
							id="InputPassword" 
						/>
					</div>
					<button type="button" className="btn btn-primary me-2" onClick={handleOnClick}>Login</button>
					<button type="button" className="btn btn-secondary" onClick={() => navigate('/singup')}>Sing Up</button>
				</form>
			</div>
		</div>
	);
};