import React, { useContext, useState } from "react";
import { Context } from "../store/appContext";
import { Navigate, useNavigate } from "react-router-dom";

export const SingUp = () => {
	const { store, actions } = useContext(Context);
	const [ email, setEmail ] = useState("");
    const [ password, setPassword ] = useState("");
	const [ isActive, setIsActive ] = useState(false)


	const handleSubmit = async () => {
        const newUser = {
            email,
            password,
            is_active: true,
        };
		const url = process.env.BACKEND_URL + "api/singup";
		const options = {
			method: "POST",
			headers: {
				"Content-Type": "application/json"
			},
			body: JSON.stringify(newUser)
		};
		const response = await fetch(url, options);
			if (!response.ok) {
				console.log('Error: ', response.status, response.statusText);
			}
			const data = await response.json();
			console.log({ "user": data });
			actions.login(data.access_token, data.results.user);

    };

	const handleChecked = (e) => {
        setIsActive(e.target.checked)
    }

	const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            handleSubmit();
        }
    };

	return (
        store.isLoggedIn ? <Navigate to='/private'/> :
		<div className="text-center mt-5">
			<h1>Sing Up!</h1>
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
					<div className="mb-3 form-check">
						<input type="checkbox" className="form-check-input" id="Check" checked={isActive} onChange={handleChecked}/>
						<label className="form-check-label" htmlFor="Check">Is Active</label>
					</div>
					<button type="button" className="btn btn-primary" onClick={handleSubmit}>Submit</button>
				</form>
			</div>
		</div>
	);
};