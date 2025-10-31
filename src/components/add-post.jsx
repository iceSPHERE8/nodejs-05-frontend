import { useState, useEffect } from "react";

function AddPost({ popupHandler, post, isEdit }) {
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [image, setImage] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [message, setMessage] = useState("");

    useEffect(() => {
        if (post) {
            setTitle(post.title);
            setContent(post.content);
            setImage(post.imageUrl);
        }
    }, [post]);

    const submitHandler = (e) => {
        e.preventDefault();

        if (!isEdit) {
            const formData = new FormData();
            formData.append("title", title);
            formData.append("content", content);
            formData.append("image", image);

            fetch("http://localhost:8080/feed/post", {
                method: "POST",
                body: formData,
            })
                .then((res) => {
                    setIsLoading(true);
                    return res.json();
                })
                .then((data) => {
                    if (!data) {
                        throw new Error("Failed to post");
                    }

                    setIsLoading(false);
                    setMessage(data.message);
                    setTitle("");
                    setContent("");
                })
                .catch((err) => {
                    setMessage(err);
                });
        }

        const formData = new FormData();

        formData.append("title", title);
        formData.append("content", content);
        formData.append("image", image);

        fetch(`http://localhost:8080/feed/post/update/${post._id}`, {
            method: "PUT",
            body: formData,
        })
            .then((res) => {
                setIsLoading(true);
                return res.json();
            })
            .then((data) => {
                if (!data) {
                    throw new Error("Failed to post");
                }
                
                setIsLoading(false);
                setMessage(data.message);
            })
            .catch((err) => {
                setMessage(err);
            });
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div
                className="absolute inset-0 bg-black opacity-50"
                onClick={popupHandler}
            ></div>
            <div className="z-99 w-xl bg-white rounded-xl text-black p-4">
                <form onSubmit={submitHandler}>
                    <div>
                        <input
                            type="text"
                            placeholder="Enter your title..."
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            className="bg-[#eaeaea] w-full px-2 py-1 rounded-md outline-0"
                        />
                    </div>

                    <div className="mt-2">
                        <input
                            type="file"
                            onChange={(e) => {
                                setImage(e.target.files[0]);
                            }}
                            className="bg-[#eaeaea] w-full px-2 py-1 rounded-md outline-0"
                        />
                    </div>

                    <div className="mt-2">
                        <textarea
                            placeholder="Enter your content..."
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            rows={5}
                            className="bg-[#eaeaea] w-full px-2 py-1 rounded-md outline-0"
                        />
                    </div>

                    <div className="mt-4 flex justify-end">
                        {!isLoading && <p>{message}</p>}
                        <button
                            type="submit"
                            className="btn bg-[#FFAD2F] text-white"
                        >
                            Create
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default AddPost;
