import { Routes, Route } from "react-router-dom";

import HomePage from "./pages/home-page";
import PostDetail from "./pages/post-detail";

function App() {
    return (
        <Routes>
            <Route path="/" element={ <HomePage /> } />
            <Route path="/feed/post/:id" element={ <PostDetail /> } />
        </Routes>
    );
}

export default App;
