import { useState } from "react";
import { Link, useLocation } from "react-router-dom";

import SignupPopup from "./signup-popup";
import LoginPopup from "./login-popup";

function Header() {
    const [loginPopupDisplay, setLoginPopupDisplay] = useState(false);
    const [signupPopupDisplay, setSignupPopupDisplay] = useState(false);

    const location = useLocation();

    const loginPopupHandler = () => {
        setLoginPopupDisplay(!loginPopupDisplay);
    };
    
    const signupPopupHandler = () => {
        setSignupPopupDisplay(!signupPopupDisplay);
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
                    <div
                        className="link hover:cursor-pointer"
                        onClick={loginPopupHandler}
                    >
                        Login
                    </div>
                    <div
                        className="link hover:cursor-pointer"
                        onClick={signupPopupHandler}
                    >
                        Signup
                    </div>

                    {signupPopupDisplay && (
                        <SignupPopup popupHandler={signupPopupHandler} />
                    )}

                    {loginPopupDisplay && (
                        <LoginPopup popupHandler={loginPopupHandler} />
                    )}
                </div>
            </header>
        </>
    );
}

export default Header;
