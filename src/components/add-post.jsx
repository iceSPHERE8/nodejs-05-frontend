import { useState, useEffect } from "react";

import { useAuth } from "./auth-context";

function AddPost({ popupHandler, post, isEdit, posts, setPosts }) {
    const { token, user } = useAuth();

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

    const submitHandler = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setMessage("");

        const formData = new FormData();
        formData.append("image", image);

        let filePath = "";

        if (isEdit) {
            formData.append("oldPath", post.imageUrl);
        }

        try {
            const res = await fetch("http://localhost:8080/post-image", {
                method: "PUT",
                headers: {
                    Authorization: "Bearer " + token,
                },
                body: formData,
            });

            const fileResData = await res.json();
            filePath = fileResData.filePath;

        } catch (err) {
            throw new Error(err.message);
        }

        const graphqlQuery = {
            query: `
                mutation CreatePost($input: PostInputData!){
                    createPost(postInput: $input) {
                        _id
                        title
                        content
                        imageUrl
                        creator {
                            _id
                            username
                        }
                        createdAt
                    }
                }
            `,
            variables: {
                input: {
                    title: title,
                    content: content,
                    imageUrl: filePath,
                },
            },
        };

        try {
            const res = await fetch("http://localhost:8080/graphql", {
                method: "POST",
                body: JSON.stringify(graphqlQuery),
                headers: {
                    Authorization: "Bearer " + token,
                    "Content-Type": "application/json",
                },
            });

            if (!res.ok) throw new Error("Failed to save post");
            const response = await res.json();

            if (response.errors) {
                console.log(response.errors);
            }

            popupHandler();
        } catch (err) {
            setMessage(err.message);
        } finally {
            setIsLoading(false);
        }
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
