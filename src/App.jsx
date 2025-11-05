import { Routes, Route } from "react-router-dom";

import HomePage from "./pages/home-page";
import PostDetail from "./pages/post-detail";

import { AuthProvider } from "./components/auth-context";

function App() {
    return (
        <AuthProvider>
            <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/feed/post/:id" element={<PostDetail />} />
            </Routes>
        </AuthProvider>
    );
}

export default App;
