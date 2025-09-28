import Link from 'next/link';
 
export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-primary px-4">
      <div className="text-center space-y-6 max-w-md">
        <h1 className="text-6xl font-bold text-primary-foreground">404</h1>
        <h2 className="text-3xl font-semibold text-primary-foreground">Page Not Found</h2>
        <p className="text-primary-foreground">Sorry, the page you are looking for does not exist or has been moved.</p>
        <Link 
          href="/" 
          className="inline-block bg-black hover:bg-black/90 text-white font-medium py-2 px-6 rounded-lg transition duration-200"
        >
            back to home
        </Link>
      </div>
    </div>
  );
}