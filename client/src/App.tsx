import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Layout } from './components/layout';
import { HomePage } from './pages/Home';
import { GalleryPage } from './pages/Gallery';
import { GalleryCategoryPage } from './pages/Gallery/GalleryCategoryPage';
import { PhotoWalkPage } from './pages/PhotoWalk';
import { BlogPage } from './pages/Blog';
import { MessagesPage } from './pages/Messages';
import { ProfilePage } from './pages/Profile';

// Create a client for React Query
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
            <Route path="/photo-walks" element={<PhotoWalkPage />} />
            <Route path="/photo-walks/:slug" element={<PhotoWalkPage />} />
            <Route path="/blog" element={<BlogPage />} />
            <Route path="/blog/:slug" element={<BlogPage />} />
            <Route path="/messages" element={<MessagesPage />} />
            <Route path="/profile" element={<ProfilePage />} />
          </Routes>
        </Layout>
      </Router>
    </QueryClientProvider>
  );
}

export default App;
