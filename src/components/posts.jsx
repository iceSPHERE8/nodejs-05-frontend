import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import AddPost from "./add-post";

function Posts() {
    const [posts, setPosts] = useState();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [popupDisplay, setPopupDisplay] = useState(false);
    const [postId, setPostId] = useState("");
    
    const [isEdit, setIsEdit] = useState(false);

    const [post, setPost] = useState();

    const popupHandler = () => {
        setPopupDisplay(!popupDisplay);
    };

    const navigate = useNavigate();

    useEffect(() => {
        fetch("http://localhost:8080/feed/posts")
            .then((res) => {
                if (res.status !== 200) {
                    throw new Error("Failed to get posts.");
                }
                return res.json();
            })
            .then((data) => {
                console.log();
                setPosts(data.posts || []);
                setLoading(false);
            })
            .catch((err) => {
                console.log(err);
                setError(err.message);
                setLoading(false);
            });
    }, []);

    if (loading) {
        return <h3>Loading...</h3>;
    }

    if (error) {
        return <h3>{error}</h3>;
    }

    if (!posts || posts.length === 0) {
        return <h3>No posts.</h3>;
    }

    const getSinglePost = (id) => {
        navigate(`/feed/post/${id}`);
    };

    const handleEdit = (id) => {
        setPopupDisplay(!popupDisplay);
        setIsEdit(true);

        fetch(`http://localhost:8080/feed/post/${id}`)
            .then((res) => {
                return res.json();
            })
            .then((data) => {
                setPost(data.post);
            })
            .catch((err) => {
                console.log(err);
            });
    };

    return (
        <>
            <div>
                <div className="mt-8 w-full">
                    <form className="flex flex-col items-center gap-4 md:flex-row md:justify-center">
                        <input
                            type="text"
                            placeholder="Enter your status..."
                            name="status"
                            className="border-2 px-4 py-1 border-gray-300 text-gray-800 rounded-4xl w-xl outline-0"
                        />
                        <button className="btn" type="submit">
                            UPDATE
                        </button>
                    </form>
                </div>
                <div className="mt-8 text-center w-full flex flex-col items-center">
                    <h3 className="text-[#320A53] font-bold">NEW POST</h3>
                    <hr className="w-2xl text-black" />

                    <div className="mt-8">
                        <ul>
                            {posts.map((p) => (
                                <li
                                    key={p._id}
                                    // onClick={() => getSinglePost(p._id)}
                                    className="hover:cursor-pointer"
                                >
                                    <div className="relative">
                                        <img
                                            className="w-32"
                                            src={`http://localhost:8080${p.imageUrl}`}
                                        />
                                        <div
                                            className="absolute top-1 left-2 text-sm font-bold"
                                            onClick={() => handleEdit(p._id)}
                                        >
                                            edit
                                        </div>
                                    </div>
                                    <div className="text-black">
                                        <h3>{p.title}</h3>
                                        <p>{p.content}</p>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>

            <div className="mt-8">
                <button
                    className="btn bg-[#FFAD2F] text-white"
                    onClick={popupHandler}
                >
                    New Post
                </button>

                {popupDisplay && (
                    <AddPost popupHandler={popupHandler} post={post} isEdit={isEdit} />
                )}
            </div>
        </>
    );
}

export default Posts;
