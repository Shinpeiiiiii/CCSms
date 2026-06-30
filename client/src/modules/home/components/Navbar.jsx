import { Link } from "react-router-dom";

const Navbar = () => {
    return(
        <nav className="bg-white shadow-sm px-8 py-4 flex items-center justify-between">
            <div className="text-2xl font-bold text-blue-600">
                School Portal
            </div>

            <div className="flex items-center gap-6">
                <Link className="hover:text-blue-600">
                    Home
                </Link>

                <Link className="hover:text-blue-600">
                    About
                </Link>

                <Link className="hover:text-blue-600">
                    Programs
                </Link>

                <Link className="hover:text-blue-600">
                    Enrollment
                </Link>

                <Link to="/login" className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
                    Login
                </Link>
            </div>
        </nav>
    )
}

export default Navbar