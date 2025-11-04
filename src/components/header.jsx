import { useState } from "react";
import { Link, useLocation } from "react-router-dom";

import SignupPopup from "./signup-popup";

function Header() {
    const [popupDisplay, setPopupDisplay] = useState(false);

    const location = useLocation();

    const popupHandler = () => {
        setPopupDisplay(!popupDisplay);
    };

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
                    <div className="link hover:cursor-pointer" onClick={popupHandler}>Signup</div>
                    {popupDisplay && (
                        <SignupPopup popupHandler={popupHandler} />
                    )}
                </div>
            </header>
        </>
    );
}

export default Header;
