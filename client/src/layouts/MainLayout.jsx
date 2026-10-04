import { Suspense } from 'react';
import { Outlet } from 'react-router-dom';
import Container from '../components/Container';
import Footer from '../components/Footer';
import LoadingState from '../components/LoadingState';
import Navbar from '../components/Navbar';
import ScrollToTop from '../components/ScrollToTop';
import SkipLink from '../components/SkipLink';

export default function MainLayout() {
  return (
    <div className="flex min-h-screen flex-col">
      <SkipLink />
      <ScrollToTop />
      <Navbar />
      <main id="main-content" tabIndex={-1} className="flex-1 focus:outline-none">
        <Suspense
          fallback={
            <Container>
              <LoadingState label="Loading page" />
            </Container>
          }
        >
          <Outlet />
        </Suspense>
      </main>
      <Footer />
    </div>
  );
}
