import { Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { toggleTheme } from "../store/themeSlice";

function Header({ search, setSearch, showSearch = true }) {
  const dispatch = useDispatch();
  const theme = useSelector((state) => state.theme.mode);

  return (
    <header>
      <div className="header-top">
        <div className="header-side" />

        <Link to="/" style={{ textDecoration: "none", color: "inherit" }}>
          <h1>Кінопокази просто неба</h1>
        </Link>

        <div className="header-side header-actions">
          <Link to="/analytics" className="btn btn-secondary analytics-link">
            Аналітика
          </Link>
          <button className="theme-toggle" onClick={() => dispatch(toggleTheme())}>
            {theme === "dark" ? "☀️" : "🌙"}
          </button>
        </div>
      </div>

      {showSearch && (
        <input
          type="text"
          placeholder="Пошук за назвою фільму..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      )}
    </header>
  );
}

export default Header;