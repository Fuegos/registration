export default function ToolBar(props) {

    return(
        <div className="mb-2">
            <button 
                type="button" 
                onClick={props.handleUnblock} 
                className="btn btn-secondary me-2"
                data-toggle="tooltip"
                data-placement="top" 
                title="Unblock"
            >
                <i className="fa-solid fa-unlock"></i>
            </button>
            <button 
                type="button" 
                onClick={props.handleBlock} 
                className="btn btn-success me-2"
                data-toggle="tooltip"
                data-placement="top" 
                title="Block"
            >
                <i className="fa-solid fa-lock"></i>
            </button>
            <button 
                type="button" 
                onClick={props.handleDelete} 
                className="btn btn-danger me-2"
                data-toggle="tooltip"
                data-placement="top" 
                title="Delete"
            >
                <i className="fa-solid fa-trash"></i>
            </button>
        </div>
    )
}