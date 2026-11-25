import { Header } from "./Header";
import { Sidebar } from "./Sidebar";
import { Footer } from "./Footer";
import { Outlet } from "react-router";



export function AppLayout() {
  return (
    <div className="mylibrary-shell d-flex flex-column">
      <Header />
      <div className="mylibrary-layout d-flex flex-grow-1">
        <Sidebar />

        <main className="mylibrary-main flex-grow-1 p-4">
          <Outlet />
        </main>
      </div>

      <Footer />
    </div>
  );
}
