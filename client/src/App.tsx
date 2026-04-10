import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Layout } from './components/layout';
import { HomePage } from './pages/Home';
import { GalleryPage } from './pages/Gallery';
import { GalleryCategoryPage } from './pages/Gallery/GalleryCategoryPage';
import { AlbumsPage, AlbumDetailPage } from './pages/Albums';
import { BlogPage, BlogPostPage } from './pages/Blog';
import { PostsPage } from './pages/Posts';
import { ProfilePage } from './pages/Profile';
import { ContactPage } from './pages/Contact';
import { ManagePage } from './pages/Manage';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <Layout>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/gallery" element={<GalleryPage />} />
            <Route path="/gallery/:category" element={<GalleryCategoryPage />} />
            <Route path="/albums" element={<AlbumsPage />} />
            <Route path="/albums/:slug" element={<AlbumDetailPage />} />
            <Route path="/blog" element={<BlogPage />} />
            <Route path="/blog/:slug" element={<BlogPostPage />} />
            <Route path="/posts" element={<PostsPage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/manage" element={<ManagePage />} />
          </Routes>
        </Layout>
      </Router>
    </QueryClientProvider>
  );
}

export default App;
