export default function ErrorBar(props) {
    const error = props.error

    if(error) {
        return(
            <div className="row alert alert-warning alert-dismissible fade show" role="alert">
                <strong>{error}!</strong>
                <button onClick={props.closeAlertError} type="button" className="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
            </div>
        )
    }
}