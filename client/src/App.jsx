import { lazy, Suspense } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import ProtectedRoute from "./components/ProtectedRoute";
import ScrollToTop from "./components/ScrollToTop";

// Lazy Loaded Pages
const Home = lazy(() => import("./pages/Home"));
const Login = lazy(() => import("./pages/Login"));
const Projects = lazy(() => import("./pages/Projects"));
const ProjectDetails = lazy(() => import("./pages/ProjectDetails"));
const Transparency = lazy(() => import("./pages/Transparency"));
const Members = lazy(() => import("./pages/Members"));
const PostList = lazy(() => import("./pages/PostList"));
const Register = lazy(() => import("./pages/Register"));
const AdminDashboard = lazy(() => import("./pages/AdminDashboard"));
const ProjectsPage = lazy(() => import("./pages/Admin/ProjectsPage"));
const FinancesPage = lazy(() => import("./pages/Admin/FinancesPage"));
const AdminPostsPage = lazy(() => import("./pages/Admin/PostsPage"));
const MembersPage = lazy(() => import("./pages/Admin/MembersPage"));
const Profile = lazy(() => import("./pages/Profile"));

// Premium Loading Component
const PageLoader = () => (
  <div className="flex flex-col items-center justify-center min-h-[60vh] bg-black">
    <div className="relative">
      <div className="w-16 h-16 border-4 border-brand/20 rounded-full"></div>
      <div className="w-16 h-16 border-4 border-brand border-t-transparent rounded-full animate-spin absolute top-0 left-0"></div>
    </div>
    <p className="mt-6 text-[10px] font-black tracking-[0.3em] text-gray-500 uppercase animate-pulse">Syncing Data</p>
  </div>
);

function App() {
  return (
    <Router>
      <ScrollToTop />
      <div className="flex flex-col min-h-screen bg-black">
        <Navbar />
        <main className="flex-grow">
          <Suspense fallback={<PageLoader />}>
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
          </Suspense>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;