import React, { useEffect, useState } from "react";
import { api } from "../services/api";
import { Link, useLocation } from "react-router-dom";

/**
 * Sidebar lists restaurants with a search input.
 * Fetches data from the backend and highlights the active restaurant.
 */
export default function Sidebar() {
  const [search, setSearch] = useState("");
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const location = useLocation();

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    api
      .getRestaurants({ search })
      .then((data) => {
        if (!mounted) return;
        const list = Array.isArray(data) ? data : data?.restaurants || [];
        setRestaurants(list);
      })
      .finally(() => mounted && setLoading(false));
    return () => {
      mounted = false;
    };
  }, [search]);

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <input
          className="input"
          placeholder="Search restaurants..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          aria-label="Search restaurants"
        />
      </div>
      <div className="restaurant-list">
        {loading && <div className="menu-item" style={{ padding: 12 }}>Loading...</div>}
        {!loading && restaurants.length === 0 && (
          <div className="menu-item" style={{ padding: 12 }}>No restaurants found.</div>
        )}
        {restaurants.map((r) => {
          const id = r.id ?? r.rest_id ?? r.slug ?? "";
          const to = `/restaurant/${id}`;
          const active = location.pathname === to;
          return (
            <Link
              key={id}
              to={to}
              className="restaurant-card"
              aria-current={active ? "page" : undefined}
            >
              <div className="rest-logo" />
              <div>
                <div style={{ fontWeight: 700 }}>{r.name || r.title || "Restaurant"}</div>
                <div style={{ fontSize: 12, color: "var(--muted)" }}>
                  {r.cuisine || r.description || "Delicious meals"}
                </div>
              </div>
              <div style={{ fontSize: 12, color: "var(--muted)" }}>
                {r.rating ? `⭐ ${r.rating.toFixed ? r.rating.toFixed(1) : r.rating}` : ""}
              </div>
            </Link>
          );
        })}
      </div>
    </aside>
  );
}
