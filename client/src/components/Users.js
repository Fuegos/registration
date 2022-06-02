import axios from "axios"
import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import Header from "./Header"
import ToolBar from "./ToolBar"
import User from "./User"

export default function Users() {
    const [users, setUsers] = useState([])
    const [checkedUsers, setCheckedUsers] = useState([])
    const [currentLogin, setCurrentLogin] = useState("")
    const [isLoading, setIsLoading] = useState(true)

    const auth = {
        headers: {
            "x-access-token": localStorage.getItem("token")
        }
    }

    const navigate = useNavigate()
    
    useEffect(() => {
        axios.get(
            "/api/users",
            auth
        )
        .then(res => res.data)
        .then(data => {
            if(data.isError) {
                setIsLoading(true)
                setUsers([])
            } else {
                setIsLoading(false)
                setUsers(data)
            }
        })
    })

    useEffect(() => {
        axios.get("/api/isUserAuth", auth)
        .then(res => res.data)
        .then(data => {
            setCurrentLogin(data.email)
            if(!data.isLoggedIn) navigate("/")
        })
    })

    const changeChecked = (event, user) => {
        if(event.target.checked) {
            setCheckedUsers(prevState => [...prevState, user])
        } else {
            setCheckedUsers(prevState => prevState.filter(u => u._id !== user._id))
        }
    }

    const everyChecked = (event) => {
        if(event.target.checked) {
            setCheckedUsers(users)
        }else {
            setCheckedUsers([])
        }
    }

    const handleUnblock = () => {
        checkedUsers.forEach(u => {
            axios.put(
                `/api/user/${u._id}/unblock`,
                null,
                auth
            )
        })
        setCheckedUsers([])
    }

    const handleBlock = () => {
        checkedUsers.forEach(u => {
            console.log(u)
            axios.put(
                `/api/user/${u._id}/block`,
                null,
                auth
            )
            .then(res => console.log(res))
        })
        setCheckedUsers([])
    }

    const handleDelete = () => {
        checkedUsers.forEach(u => {
            axios.delete(
                `/api/user/${u._id}`,
                auth
            )
        })
        setCheckedUsers([])
    }

    const handlerLogout = () => {
        localStorage.removeItem("token")
    }

    const listUsers = users.map(
        u => <User 
            key={u._id} 
            user={u} 
            changeChecked={changeChecked} 
            checked={checkedUsers.some(ch => ch._id === u._id )}
        />
    )

    const isEveryChecked = users.every(u => checkedUsers.some(ch => ch._id === u._id))


    return(
        <div className="container-fluid">
            <Header currentLogin={currentLogin} handlerLogout={handlerLogout}/>
            <ToolBar 
                handleBlock={handleBlock}
                handleUnblock={handleUnblock}
                handleDelete={handleDelete}
            />
            {
                isLoading ? 
                <div className="spinner-grow" role="status">
                    <span className="visually-hidden">Loading...</span>
                </div> :
                <table className="table border">
                    <thead>
                        <tr>
                            <th>
                                <input 
                                    onChange={everyChecked} 
                                    className="form-check-input" 
                                    type="checkbox" 
                                    checked={isEveryChecked}
                                />
                            </th>
                            <th scope="col">Id</th>
                            <th scope="col">Name</th>
                            <th scope="col">E-mail</th>
                            <th scope="col">Last login time</th>
                            <th scope="col">Registration time</th>
                            <th scope="col">Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {listUsers}
                    </tbody>
                </table>
            }
            
        </div>
        
    )
}