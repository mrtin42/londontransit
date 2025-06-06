export default function NotFound() {
  return (
    <main className="block h-max bg-background text-foreground">
      <div className="w-full h-[60vh] flex items-center justify-center bg-background bg-blend-multiply bg-cover bg-center bg-no-repeat">
        <div className="bg-opacity-50 p-10 rounded-lg text-center">
          <h1 className="text-5xl font-bold text-white mb-4">404 - Page Not Found</h1>
          <p className="text-lg text-white mb-6">
            The page you are looking for does not exist or has been moved.
          </p>
        </div>
      </div>
    </main>
  );
}