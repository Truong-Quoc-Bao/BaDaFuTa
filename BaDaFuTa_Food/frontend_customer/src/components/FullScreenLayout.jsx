import { Footer } from "./Footer";

export function FullScreenLayout({ children }) {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}
