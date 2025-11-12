import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import AddPost from "./add-post";

import { useAuth } from "./auth-context";

function Posts() {
    const { token, user } = useAuth();

    const [posts, setPosts] = useState([]);
    const [status, setStatus] = useState("");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [popupDisplay, setPopupDisplay] = useState(false);
    const [totalPage, setTotalPage] = useState(1);
    const [currentPage, setCurrentPage] = useState(1);

    const [isEdit, setIsEdit] = useState(false);

    const [post, setPost] = useState();

    const popupHandler = () => {
        setPopupDisplay(!popupDisplay);
    };

    const navigate = useNavigate();

    const handleNewPost = (data) => {
        if (data.action === "create") {
            setPosts((prevPosts) => [...(prevPosts || []), data.post]);
        } else if (data.action === "update") {
            setPosts((prevPosts) => {
                return prevPosts.map((p) =>
                    p._id === data.post._id ? data.post : p
                );
            });
        } else if (data.action === "delete") {
            setPosts((prevPosts) =>
                prevPosts.filter((post) => post._id !== data.post)
            );
        }
    };

    useEffect(() => {
        setPosts([]);
        setStatus("");
        setError(null);
        setLoading(true);

        const graphqlQuery = {
            query: `
                query {
                    fetchAllPost {
                    }
                }
            `
        }

        fetch("http://localhost:8080/graphql", {
            method: "POST",
            headers: {
                Authorization: "Bearer " + token,
                "Content-Type": "application/json"
            },
        })
            .then((res) => {
                if (res.status !== 200) {
                    throw new Error("Failed to get posts.");
                }
                return res.json();
            })
            .then((data) => {
                setPosts(data.posts || []);
                socket.on("posts", (data) => handleNewPost(data));
                
                setTotalPage(data.totalPage);
                setLoading(false);
            })
            .catch((err) => {
                console.log(err);
                setError(err.message);
                setLoading(false);
            });

        if (user && user !== null) {
            fetch(`http://localhost:8080/feed/post/status/${user}`)
                .then((res) => {
                    if (res.status !== 200) {
                        throw new Error("Failed to get status.");
                    }
                    return res.json();
                })
                .then((data) => {
                    setStatus(data.userStatus);
                })
                .catch((err) => {
                    console.log(err);
                    setError(err.message);
                });
        }

        // return () => {
        //     socket.off("posts", handleNewPost);
        // };
    }, [user]);

    if (loading) {
        return <h3>Loading...</h3>;
    }

    // if (error) {
    //     return <h3>{error}</h3>;
    // }

    // if (!posts || posts.length === 0) {
    //     return <h3>No posts.</h3>;
    // }

    const getSinglePost = (id) => {
        navigate(`/feed/post/${id}`);
    };

    const handleEdit = (id) => {
        setPopupDisplay(!popupDisplay);
        setIsEdit(true);

        fetch(`http://localhost:8080/feed/post/${id}`, {
            headers: {
                Authorization: "Bearer " + token,
            },
        })
            .then((res) => {
                return res.json();
            })
            .then((data) => {
                setPost(data.post);
                socket.on("posts", (data) => handleNewPost(data));
            })
            .catch((err) => {
                console.log(err);
            });
    };

    const handlePage = (index) => {
        fetch(`http://localhost:8080/feed/posts?page=${index}`, {
            headers: {
                Authorization: "Bearer " + token,
            },
        })
            .then((res) => {
                if (res.status !== 200) {
                    throw new Error("Failed to get posts.");
                }
                return res.json();
            })
            .then((data) => {
                // console.log();
                setPosts(data.posts || []);
                setTotalPage(data.totalPage);
                setCurrentPage(data.currentPage);
                setLoading(false);
            })
            .catch((err) => {
                console.log(err);
                setError(err.message);
                setLoading(false);
            });
    };

    const handleDelete = (id) => {
        fetch(`http://localhost:8080/feed/post/delete/${id}`, {
            method: "DELETE",
            headers: {
                Authorization: "Bearer " + token,
            },
        })
            .then((res) => {
                socket.on("posts", (data) => handleNewPost(data));
                return res.json();
            })
            .catch((err) => {
                console.log(err);
            });
    };

    const handleStatus = (e) => {
        e.preventDefault();

        fetch(`http://localhost:8080/feed/post/status/update?user=${user}`, {
            method: "POST",
            body: JSON.stringify({
                updateStatus: status,
            }),
            headers: {
                "Content-Type": "application/json",
                Authorization: "Bearer " + token,
            },
        })
            .then((res) => {
                return res.json();
            })
            .then((data) => {
                console.log(data);
                setStatus(data.status);
            })
            .catch((err) => {
                console.log(err);
            });
    };

    return (
        <>
            <div>
                <div className="mt-8 w-full">
                    <form
                        className="flex flex-col items-center gap-4 md:flex-row md:justify-center"
                        onSubmit={handleStatus}
                    >
                        <input
                            type="text"
                            placeholder="Enter your status..."
                            name="status"
                            value={status || ""}
                            onChange={(e) => setStatus(e.target.value)}
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
                        <ul className="flex gap-4">
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
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleEdit(p._id);
                                            }}
                                        >
                                            edit
                                        </div>
                                        <div
                                            className="absolute top-1 right-2 text-sm font-bold"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleDelete(p._id);
                                            }}
                                        >
                                            delete
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

            <div className="bg-white rounded-full mt-4">
                <ul className="flex justify-center items-center text-center gap-2 px-1 py-1">
                    {Array.from({ length: totalPage }).map((_, index) => {
                        return (
                            <li
                                key={index + 1}
                                onClick={() => handlePage(index + 1)}
                                className={`${
                                    currentPage == index + 1
                                        ? "bg-[#320A53]"
                                        : "bg-[#eaeaea]"
                                } rounded-full w-6 h-6 hover:bg-[#320A53] transition-all hover:cursor-pointer`}
                            >
                                {index + 1}
                            </li>
                        );
                    })}
                </ul>
            </div>
            
            <div className="mt-8">
                <button
                    className="btn bg-[#FFAD2F] text-white"
                    onClick={popupHandler}
                >
                    New Post
                </button>
                {popupDisplay && (
                    <AddPost
                        popupHandler={popupHandler}
                        post={post}
                        posts={posts}
                        setPosts={setPosts}
                        isEdit={isEdit}
                    />
                )}
            </div>
        </>
    );
}

export default Posts;
