import { Link, isRouteErrorResponse, useRouteError } from "react-router-dom";

export default function ErrorPage() {
    const error = useRouteError();
    const backButton = (
        <Link to="/" className="btn btn-primary">Back to home</Link>

    );
    if (isRouteErrorResponse(error)) {
        return (

            <div className="hero min-h-screen bg-base-200">
                <div className="hero-content text-center">
                    <div className="max-w-md">
                        <h1 className="text-5xl font-bold">{error.status}</h1>
                        <p className="py-6">{error.statusText}</p>
                        {error.data?.message && <p>{error.data.message}</p>}
                        {backButton}
                    </div>
                </div>
            </div>
        );
    } else {
        return (
            <div className="hero min-h-screen bg-base-200">
                <div className="hero-content text-center">
                    <div className="max-w-md">
                        <h1 className="text-5xl font-bold">Oops</h1>
                        <p className="py-6">Somthing went wrong!</p>
                        {backButton}
                    </div>
                </div>
            </div>
        );
    }
}
