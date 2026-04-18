import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Projects from "./pages/Projects";
import ProjectDetails from "./pages/ProjectDetails";
import Transparency from "./pages/Transparency";
import Members from "./pages/Members";
import PostList from "./pages/PostList";
import Register from "./pages/Register";
import ProtectedRoute from "./components/ProtectedRoute";
import ScrollToTop from "./components/ScrollToTop";
import AdminDashboard from "./pages/AdminDashboard";
import ProjectsPage from "./pages/Admin/ProjectsPage"
import FinancesPage from "./pages/Admin/FinancesPage";
import AdminPostsPage from "./pages/Admin/PostsPage";
import MembersPage from "./pages/Admin/MembersPage";
import Profile from "./pages/Profile";

function App() {
  return (
    <Router>
      <ScrollToTop />
      <div className="flex flex-col min-h-screen bg-black">
        <Navbar />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/projects" element={<Projects />} />
            <Route path="/projects/:id" element={<ProjectDetails />} />
            <Route
              path="/transparency"
              element={
                <ProtectedRoute>
                  <Transparency />
                </ProtectedRoute>
              }
            />
            <Route path="/members" element={<Members />} />
            <Route path="/posts" element={<PostList />} />
            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin"
              element={
                <ProtectedRoute adminOnly>
                  <AdminDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/projects"
              element={
                <ProtectedRoute adminOnly>
                  <ProjectsPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/finances"
              element={
                <ProtectedRoute adminOnly>
                  <FinancesPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/posts"
              element={
                <ProtectedRoute adminOnly>
                  <AdminPostsPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/members"
              element={
                <ProtectedRoute adminOnly>
                  <MembersPage />
                </ProtectedRoute>
              }
            />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;