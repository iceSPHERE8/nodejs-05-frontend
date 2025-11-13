import Header from "../components/header";
import Posts from "../components/posts";

import CreatePost from "../components/create-post";

function HomePage() {
    return (
        <>
            
            <main className="flex flex-col items-center">
                <Posts />
            </main>
        </>
    );
}

export default HomePage;