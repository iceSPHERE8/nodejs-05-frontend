import { useState } from "react";

import { useAuth } from "./auth-context";

function LoginPopup({ popupHandler }) {
    const { login } = useAuth();

    const [formData, setFormData] = useState({
        email: "",
        password: "",
    });

    const handleChange = (e) => {
        const { name, value } = e.target;

        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        fetch("http://localhost:8080/auth/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(formData),
        })
            .then((result) => {
                if (!result.ok) {
                    return result.json().then((errData) => {
                        const error = new Error(
                            errData.message || "Login failed!"
                        );
                        error.status = result.status;
                        error.data = errData.data;
                        throw error;
                    });
                }
                return result.json();
            })
            .then((data) => {
                const payload = JSON.parse(atob(data.token.split(".")[1]));
                const expiresAt = payload.exp * 1000;

                localStorage.setItem("expiresAt", new Date(parseInt(expiresAt)).toLocaleString());

                login(data.token, data.userId);
                console.log("Login success!", data);
                popupHandler();
            })
            .catch((err) => {
                console.log(err);
            });
    };

    return (
        <>
            <div className="fixed inset-0 z-50 flex items-center justify-center">
                <div
                    className="absolute z-10 inset-0 bg-black opacity-50"
                    onClick={popupHandler}
                ></div>
                <div className="z-99 w-xl bg-white rounded-xl text-black p-4">
                    <form onSubmit={handleSubmit}>
                        <div className="mt-2">
                            <input
                                type="email"
                                placeholder="Enter your email..."
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                className="bg-[#eaeaea] w-full px-2 py-1 rounded-md outline-0"
                            />
                        </div>

                        <div className="mt-2">
                            <input
                                type="password"
                                placeholder="Enter your password..."
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                className="bg-[#eaeaea] w-full px-2 py-1 rounded-md outline-0"
                            />
                        </div>

                        <div className="mt-4 flex justify-end">
                            <button
                                type="submit"
                                className="btn bg-[#FFAD2F] text-white"
                            >
                                Login
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </>
    );
}

export default LoginPopup;
