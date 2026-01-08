import { Link } from 'react-router-dom';
import { Home, ArrowLeft } from 'lucide-react';
import Header from '../../common-components/Header/Header';
import Footer from '../../common-components/Footer/Footer';

export default function NotFound() {
  return (
    <>
      <Header />
      <div className="min-h-[calc(100vh-160px)] flex flex-col items-center justify-center bg-[var(--dark-bg)] px-6">
        <div className="text-center max-w-2xl">
          <h1 className="text-9xl font-bold mb-4" style={{ color: 'var(--primary-text-color)' }}>
            404
          </h1>
          <h2 className="text-3xl font-semibold mb-4" style={{ color: 'var(--primary-text-color)' }}>
            Page Not Found
          </h2>
          <p className="text-lg mb-8" style={{ color: 'var(--secondary-text-color)' }}>
            The page you're looking for doesn't exist or has been moved.
          </p>
          <div className="flex gap-4 justify-center">
            <Link
              to="/"
              className="flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-all"
              style={{
                backgroundColor: 'var(--primary-button)',
                color: 'white'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = 'var(--primary-button-hover)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'var(--primary-button)';
              }}
            >
              <Home size={20} />
              Go Home
            </Link>
            <button
              onClick={() => window.history.back()}
              className="flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-all border"
              style={{
                backgroundColor: 'var(--secondary-button)',
                color: 'var(--primary-text-color)',
                borderColor: 'var(--main-border-color)'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = 'var(--secondary-button-hover)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'var(--secondary-button)';
              }}
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
