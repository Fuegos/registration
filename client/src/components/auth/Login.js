import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useState } from 'react';
import ErrorBar from "../ErrorBar";


export default function Login() {
    const [user, setUser] = useState({
        email: "",
        password: ""
    })

    const [error, setError] = useState()

    const closeAlertError = () => {
        setError()
    }

    const navigate = useNavigate()
    
    const navigateToRegistration = () => {
        navigate('/registration')
    }

    const changeEmail = (event) => {
        setUser(prevState => ({...prevState, email: event.target.value}))
    }

    const changePassword = (event) => {
        setUser(prevState => ({...prevState, password: event.target.value}))
    }

    const handleLogin = event => {
        event.preventDefault()

        axios.put(
            "/api/login",
            user
        ).then(res => res.data)
        .then(data => {
            if(data.isError) {
                setError(data.message)
            } else {
                localStorage.setItem("token", data.token)
                navigate('/users')
            }
        })
    }

    return(
        <div className="container mt-5 border border-primary">
            <ErrorBar error={error} closeAlertError={closeAlertError} />
            <div className="row pt-2">
                <h1 className="d-flex justify-content-center">Authentication</h1>
            </div>
            <div className="row px-5 pt-3">
                <form onSubmit={handleLogin}>
                    <div className="mb-3">
                        <label htmlFor="email" className="form-label">Email</label>
                        <input 
                            type="email" 
                            onChange={changeEmail} 
                            className="form-control" 
                            id="email" 
                        />
                    </div>
                    <div className="mb-5">
                        <label htmlFor="password" className="form-label">Password</label>
                        <input 
                            type="password" 
                            onChange={changePassword} 
                            className="form-control" 
                            id="password" 
                        />
                    </div>
                    <div className="row mb-5">
                        <div className="col d-grid gap-2">
                            <button type="submit" className="btn btn-primary">Login</button>
                        </div>
                        <div className="col d-grid">
                            <button 
                                onClick={navigateToRegistration} 
                                type="submit" 
                                className="btn btn-primary"
                            >
                                Registration
                            </button>
                        </div>
                    </div>
                </form>
            </div>           
        </div>
    )
}