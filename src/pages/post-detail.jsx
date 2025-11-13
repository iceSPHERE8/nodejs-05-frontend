import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import Header from "../components/header";

function PostDetail() {
    const { id } = useParams();

    const [post, setPost] = useState();

    useEffect(() => {
        const fetchData = async () => {
            const graphqlQuery = {
                query: `
                    query FetchOnePost($postId: String!) {
                        fetchOnePost(postId: $postId) {
                            title
                            content
                            imageUrl
                            creator {
                                username
                                email
                            }
                        }
                    }
                `,
                variables: {
                    postId: id,
                },
            };
            try {
                const res = await fetch(`http://localhost:8080/graphql`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        // Authorization: "Bearer " + token,
                    },
                    body: JSON.stringify(graphqlQuery),
                });
                const resData = await res.json();

                if (resData.errors) {
                    throw new Error(resData.errors[0].message);
                }
                console.log(resData);
                setPost(resData.data.fetchOnePost);
            } catch (err) {
                console.log(err);
            }
        };

        fetchData();
    }, []);

    if (!post) {
        return <p>loading...</p>;
    }

    return (
        <>
            <main className="flex flex-col items-center">
                <h1>{post.title}</h1>
                <img
                    className="w-2xl"
                    src={`http://localhost:8080/${post.imageUrl.replace(
                        /\\/g,
                        "/"
                    )}`}
                />
            </main>
        </>
    );
}

export default PostDetail;
