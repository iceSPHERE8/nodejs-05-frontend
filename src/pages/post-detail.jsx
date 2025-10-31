import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import Header from "../components/header";

function PostDetail() {
    const { id } = useParams();

    const [post, setPost] = useState();

    useEffect(() => {
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
    }, []);

    if (!post) {
        return <p>loading...</p>;
    }

    return (
        <>
            <Header />
            <main className="flex flex-col items-center">
                <h1>{post.title}</h1>
                <img className="w-2xl" src={`http://localhost:8080${post.imageUrl}`} />
            </main>
        </>
    );
}

export default PostDetail;
