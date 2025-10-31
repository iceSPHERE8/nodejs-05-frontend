import { Link, useLocation } from "react-router-dom";

function Header() {
    const location = useLocation();

    return (
        <>
            <header className="bg-[#320A53] flex justify-between items-center h-12 px-8 w-full">
                <div>
                    <Link to="/">HOME</Link>
                </div>
                <div className="flex justify-between gap-12">
                    <div>
                        <a href="/" className="link active">
                            Feed
                        </a>
                    </div>
                    <div>
                        <a href="/" className="link">
                            Logout
                        </a>
                    </div>
                </div>
            </header>
        </>
    );
}

export default Header;
