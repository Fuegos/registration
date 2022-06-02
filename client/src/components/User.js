export default function User(props) {
    const user = props.user
    
    const dateLogin = user.dateLogin ? 
        `${new Date(user.dateLogin).toLocaleDateString()} ${new Date(user.dateLogin).toLocaleTimeString()}` :
        null

    const dateRegistration = `${new Date(user.dateRegistration).toLocaleDateString()} ${new Date(user.dateRegistration).toLocaleTimeString()}`

    return(
        <tr>
            <td>
                <input 
                    onChange={event => props.changeChecked(event, user)} 
                    className="form-check-input" 
                    type="checkbox" 
                    id={user._id} 
                    checked={props.checked}
                />
            </td>
            <td>{user._id}</td>
            <td>{user.name}</td>
            <td>{user.email}</td>
            <td>{dateLogin}</td>
            <td>{dateRegistration}</td>
            <td>{user.status}</td>
        </tr>
    )
}