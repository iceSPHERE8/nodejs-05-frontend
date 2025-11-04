import { useState } from "react";

function SignupPopup({ popupHandler }) {
    const [formData, setFormData] = useState({
        username: "",
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

        fetch("http://localhost:8080/auth/signup", {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(formData),
        })
            .then((result) => {
                popupHandler();
            })
            .catch((err) => {
                console.log(err);
            });
    };

    return (
        <>
            <div className="fixed inset-0 z-50 flex items-center justify-center">
                <div className="absolute z-10 inset-0 bg-black opacity-50" onClick={popupHandler}></div>
                <div className="z-99 w-xl bg-white rounded-xl text-black p-4">
                    <form onSubmit={handleSubmit}>
                        <div>
                            <input
                                type="text"
                                placeholder="Enter your username..."
                                name="username"
                                value={formData.username}
                                onChange={handleChange}
                                className="bg-[#eaeaea] w-full px-2 py-1 rounded-md outline-0"
                            />
                        </div>

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
                                Signup
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </>
    );
}

export default SignupPopup;
