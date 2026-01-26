import { Link } from 'react-router-dom';
import { Home, ArrowLeft } from 'lucide-react';
import Header from '../../common-components/Header/Header';
import Footer from '../../common-components/Footer/Footer';

export default function NotFound() {
  return (
    <>
      <Header />
      <div className="min-h-[calc(100vh-160px)] flex flex-col items-center justify-center bg-(--dark-bg) px-6">
        <div className="text-center max-w-2xl">
          <h1 className="text-9xl font-bold mb-4 text-(--primary-text-color)">
            404
          </h1>
          <h2 className="text-3xl font-semibold mb-4 text-(--primary-text-color)">
            Page Not Found
          </h2>
          <p className="text-lg mb-8 text-(--secondary-text-color)">
            The page you're looking for doesn't exist or has been moved.
          </p>
          <div className="flex gap-4 justify-center">
            <Link
              to="/"
              className="flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-all bg-(--primary-button) text-white hover:bg-(--primary-button-hover)"
            >
              <Home size={20} />
              Go Home
            </Link>
            <button
              onClick={() => window.history.back()}
              className="flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-all border bg-(--secondary-button) text-(--primary-text-color) border-(--main-border-color) hover:bg-(--secondary-button-hover)"
            >
              <ArrowLeft size={20} />
              Go Back
            </button>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
