import { NavLink, useLocation } from "react-router";

export function Sidebar() {
  const location = useLocation();

  const booksClass = location.pathname.startsWith("/books")
    ? "d-block w-100 text-start border-0 rounded px-3 py-2 mb-2 bg-primary text-white"
    : "d-block w-100 text-start border-0 rounded px-3 py-2 mb-2 bg-transparent text-white-50";
  const ratedClass = location.pathname.startsWith("/rated")
    ? "d-block w-100 text-start border-0 rounded px-3 py-2 mb-2 bg-primary text-white"
    : "d-block w-100 text-start border-0 rounded px-3 py-2 mb-2 bg-transparent text-white-50";

      
  return (
    <aside className="mylibrary-sidebar p-3">
      <nav aria-label="Основная навигация">
        <NavLink to="/books" className={booksClass}>
          Все книги
        </NavLink>

        <NavLink to="/rated" className={ratedClass}>
          Оценённые книги
        </NavLink>
      </nav>
    </aside>
  );
}
