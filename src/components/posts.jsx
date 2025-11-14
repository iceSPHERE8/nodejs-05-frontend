import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";

import AddPost from "./add-post";

import { useAuth } from "./auth-context";

function Posts() {
    const { token, user } = useAuth();

    const [popupDisplay, setPopupDisplay] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);

    const [isEdit, setIsEdit] = useState(false);

    const [post, setPost] = useState();
    const [status, setStatus] = useState("");

    const popupHandler = () => {
        setPopupDisplay(!popupDisplay);
    };

    const navigate = useNavigate();

    const { data, isLoading, error } = useQuery({
        queryKey: ["posts", currentPage],
        queryFn: async () => {
            const graphqlQuery = {
                query: `
                    query {
                        fetchAllPosts(page: ${currentPage}) {
                            posts {
                                _id
                                title
                                content
                                imageUrl
                                creator {
                                    username
                                    email
                                }
                            }
                            total
                        }
                    }
                `,
            };

            const res = await fetch("http://localhost:8080/graphql", {
                method: "POST",
                headers: {
                    Authorization: "Bearer " + token,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(graphqlQuery),
            });

            const resData = await res.json();
            if (resData.errors) throw new Error(resData.errors[0].message);

            return resData.data.fetchAllPosts;
        },
        keepPreviousData: true,
        staleTime: 1000,
    });

    const posts = data?.posts || [];
    const totalPage = data?.total || 1;

    useEffect(() => {
        if (user && user !== null) {
            // fetchUserStatus(userId: ID!): User!

            const graphqlQuery = {
                query: `
                    query FetchUserStatus($userId: ID!) {
                        fetchUserStatus(userId: $userId) {
                            status
                        }
                    }
                `,
                variables: {
                    userId: user,
                },
            };

            fetch(`http://localhost:8080/graphql`, {
                method: "POST",
                headers: {
                    Authorization: "Bearer " + token,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(graphqlQuery),
            })
                .then((res) => {
                    if (res.status !== 200) {
                        throw new Error("Failed to get status.");
                    }
                    return res.json();
                })
                .then((resData) => {
                    setStatus(resData.data.fetchUserStatus.status);
                })
                .catch((err) => {
                    throw new Error(err.message);
                });
        }
    }, [user]);

    if (isLoading) {
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

        const graphqlQuery = {
            // fetchOnePost(postId: String!): Post!
            query: `
                query FetchOnePost($postId: String!){
                    fetchOnePost(postId: $postId) {
                        title
                        content
                        imageUrl
                    }
                }
            `,
            variables: {
                postId: id,
            },
        };

        fetch(`http://localhost:8080/graphql`, {
            method: "POST",
            headers: {
                Authorization: "Bearer " + token,
                "Content-Type": "application/json",
            },
            body: JSON.stringify(graphqlQuery),
        })
            .then((res) => {
                return res.json();
            })
            .then((resData) => {
                // console.log(resData);
                setPost({ ...resData.data.fetchOnePost, _id: id });
            })
            .catch((err) => {
                throw new Error(err.message);
            });
    };

    const handlePage = (index) => {
        setCurrentPage(index);
        // fetch(`http://localhost:8080/feed/posts?page=${index}`, {
        //     headers: {
        //         Authorization: "Bearer " + token,
        //     },
        // })
        //     .then((res) => {
        //         if (res.status !== 200) {
        //             throw new Error("Failed to get posts.");
        //         }
        //         return res.json();
        //     })
        //     .then((data) => {
        //         // console.log();
        //         setPosts(data.posts || []);
        //         setTotalPage(data.totalPage);
        //         setCurrentPage(data.currentPage);
        //         setLoading(false);
        //     })
        //     .catch((err) => {
        //         console.log(err);
        //         setError(err.message);
        //         setLoading(false);
        //     });
    };

    const handleDelete = (id) => {
        fetch(`http://localhost:8080/feed/post/delete/${id}`, {
            method: "DELETE",
            headers: {
                Authorization: "Bearer " + token,
            },
        })
            .then((res) => {
                // socket.on("posts", (data) => handleNewPost(data));
                return res.json();
            })
            .catch((err) => {
                console.log(err);
            });
    };

    const handleStatus = (e) => {
        e.preventDefault();

        const graphqlQuery = {
            // editUserStatus(userId: ID!, statusInput: String!): User!
            query: `
                mutation EditUserStatus($userId: ID!, $statusInput: String!){
                    editUserStatus(userId: $userId, statusInput: $statusInput) {
                        status
                    }
                }
            `,
            variables: {
                userId: user,
                statusInput: status
            },
        };

        fetch(`http://localhost:8080/graphql`, {
            method: "POST",
            headers: {
                Authorization: "Bearer " + token,
                "Content-Type": "application/json",
            },
            body: JSON.stringify(graphqlQuery),
        })
            .then((res) => {
                return res.json();
            })
            .then((resData) => {
                // console.log(resData);
                setStatus(resData.data.editUserStatus.status);
            })
            .catch((err) => {
                throw new Error(err.message);
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
                                    onClick={() => getSinglePost(p._id)}
                                    className="hover:cursor-pointer"
                                >
                                    <div className="relative">
                                        <img
                                            className="w-32"
                                            src={`http://localhost:8080/${p.imageUrl.replace(
                                                /\\/g,
                                                "/"
                                            )}`}
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
                                        <p className="text-sm text-gray-400">
                                            {p.creator.email}
                                        </p>
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
                        // setPosts={setPosts}
                        isEdit={isEdit}
                    />
                )}
            </div>
        </>
    );
}

export default Posts;
