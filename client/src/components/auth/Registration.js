import axios from 'axios';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ErrorBar from '../ErrorBar';

export default function Registration() {
    const [user, setUser] = useState({
        name: "",
        email: "",
        password: ""
    })

    const [error, setError] = useState()

    const closeAlertError = () => {
        setError()
    }

    const navigate = useNavigate()
    
    const handleSubmit = event => {
        event.preventDefault()

        axios.post(
            "/api/registration",
            user
        ).then(res => res.data)
        .then(data => {
            if(data.isError) {
                setError(data.message)
            } else { 
                navigate('/')
            }
        })
    }

    const changeName = (event) => {
        setUser(prevState => ({...prevState, name: event.target.value}))
    }

    const changeEmail = (event) => {
        setUser(prevState => ({...prevState, email: event.target.value}))
    }

    const changePassword = (event) => {
        setUser(prevState => ({...prevState, password: event.target.value}))
    }


    return(
        <div className="container mt-5 border border-primary">
            <ErrorBar error={error} closeAlertError={closeAlertError} />
            <div className="row pt-2">
                <h1 className="d-flex justify-content-center">Registration</h1>
            </div>
            <div className="row px-5 pt-3">
                <form onSubmit={handleSubmit} >
                    <div className="mb-3">
                        <label htmlFor="name" className="form-label">Name</label>
                        <input type="text" onChange={changeName} className="form-control" id="name" value={user.name} />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="email" className="form-label">Email</label>
                        <input type="email" onChange={changeEmail} className="form-control" id="email" value={user.email} />
                    </div>
                    <div className="mb-5">
                        <label htmlFor="password" className="form-label">Password</label>
                        <input type="password" onChange={changePassword} className="form-control" id="password" value={user.password} />
                    </div>
                    <div className="d-grid mb-5">
                        <button type="submit" className="btn btn-primary btn-block">Confirm</button>
                    </div>
                    
                </form>
            </div>
            
            
        </div>
        
    )
}