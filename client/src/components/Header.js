export default function Header(props) {
    return(
        <div className="row mb-4 border">
            <div className="col-8">
                <h1>List users</h1>
            </div>
            <div className="col-3 d-flex justify-content-end align-items-center">
                <strong>{props.currentLogin}</strong>
            </div>
            <div className="col d-flex justify-content-end">
                <button 
                    type="button" 
                    className="btn btn-primary btn-block m-1"
                    data-toggle="tooltip"
                    data-placement="top" 
                    title="Logout"
                    onClick={props.handlerLogout}
                >
                    <i className="fa-solid fa-arrow-right-from-bracket"></i>
                </button>
            </div>
        </div>
    )
}