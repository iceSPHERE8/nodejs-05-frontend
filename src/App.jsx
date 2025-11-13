import { Routes, Route } from "react-router-dom";

import HomePage from "./pages/home-page";
import PostDetail from "./pages/post-detail";
import Header from "./components/header";

import { AuthProvider } from "./components/auth-context";

function App() {
    return (
        <AuthProvider>
            <Header />
            <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/feed/post/:id" element={<PostDetail />} />
            </Routes>
        </AuthProvider>
    );
}

export default App;
