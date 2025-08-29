import { Navbar } from "./Navbar";
import { Outlet } from "react-router-dom";

export function Layout() {
  return (
    <div className="min-h-screen bg-gray-50 transition-colors">
      <Navbar />
      <main className="pb-8">
        <Outlet />
      </main>
    </div>
  );
}
