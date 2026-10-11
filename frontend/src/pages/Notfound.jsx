import { Link } from "react-router-dom";

const NotFound = () => {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen  text-center px-4">

            <img
                src="https://i.imgur.com/qIufhof.png"
                alt="404"
                className="w-80 md:w-96  mb-6"
            />
            

            <h1 className="text-6xl font-bold text-gray-800 ">404</h1>
            <h2 className="text-2xl font-semibold text-gray-700 mt-2">Page Not Found</h2>

            <p className="text-gray-500 mt-4 max-w-md ">
                Oops!  you are in wrong page.
            </p>

            <Link
                to="/"
                className="mt-6 px-6 md:py-3 py-1.5 bg-accent text-white rounded-lg hover:bg-primary transition"
            >
                Go Back Home
            </Link>
        </div>
    );
};

export default NotFound;