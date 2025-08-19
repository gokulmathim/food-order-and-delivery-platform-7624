import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { api } from "../services/api";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";

export default function RestaurantPage() {
  const { id } = useParams();
  const [menu, setMenu] = useState({ categories: [], items: [] });
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");
  const { addItem } = useCart();
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    api
      .getMenuByRestaurant(id)
      .then((data) => {
        if (!mounted) return;
        if (Array.isArray(data?.categories)) {
          setMenu({ categories: data.categories, items: [] });
        } else if (Array.isArray(data)) {
          setMenu({ categories: [], items: data });
        } else if (Array.isArray(data?.items)) {
          setMenu({ categories: [], items: data.items });
        } else {
          setMenu({ categories: [], items: [] });
        }
        setErr("");
      })
      .catch((e) => setErr(e.message))
      .finally(() => setLoading(false));
    return () => {
      mounted = false;
    };
  }, [id]);

  const onAdd = async (menuItemId) => {
    try {
      await addItem(Number(menuItemId), 1, "");
    } catch (e) {
      alert(e.message);
    }
  };

  return (
    <div className="panel">
      <div className="section-title">
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div className="brand-mark" style={{ width: 28, height: 28 }} />
          <div>
            <div style={{ fontWeight: 800 }}>Menu</div>
            <div style={{ fontSize: 12, color: "var(--muted)" }}>Restaurant #{id}</div>
          </div>
        </div>
      </div>

      {loading && <div>Loading menu...</div>}
      {err && <div className="notice">Failed to load: {err}</div>}

      {!loading && !err && (
        <>
          {menu.categories.length > 0 ? (
            menu.categories.map((cat, idx) => (
              <div key={idx} style={{ marginBottom: 16 }}>
                <div style={{ fontWeight: 800, margin: "8px 0" }}>{cat.name || "Category"}</div>
                <div className="menu-grid">
                  {(cat.items || []).map((it) => (
                    <div key={it.id || it.menu_item_id} className="menu-item-card">
                      <div className="menu-item-media" />
                      <div className="menu-item-body">
                        <div style={{ fontWeight: 700 }}>{it.name || it.title || "Item"}</div>
                        <div style={{ color: "var(--muted)", fontSize: 12 }}>
                          {it.description || ""}
                        </div>
                        <div className="menu-item-footer">
                          <div className="price">${(it.price || it.unit_price || 0).toFixed(2)}</div>
                          <button
                            className="add-btn"
                            onClick={() => onAdd(it.id || it.menu_item_id)}
                            disabled={!isAuthenticated}
                            title={isAuthenticated ? "Add to cart" : "Login to add"}
                          >
                            ➕ Add
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))
          ) : (
            <div>
              <div style={{ fontWeight: 800, margin: "8px 0" }}>All Items</div>
              <div className="menu-grid">
                {(menu.items || []).map((it) => (
                  <div key={it.id || it.menu_item_id} className="menu-item-card">
                    <div className="menu-item-media" />
                    <div className="menu-item-body">
                      <div style={{ fontWeight: 700 }}>{it.name || it.title || "Item"}</div>
                      <div style={{ color: "var(--muted)", fontSize: 12 }}>
                        {it.description || ""}
                      </div>
                      <div className="menu-item-footer">
                        <div className="price">${(it.price || it.unit_price || 0).toFixed(2)}</div>
                        <button
                          className="add-btn"
                          onClick={() => onAdd(it.id || it.menu_item_id)}
                          disabled={!isAuthenticated}
                          title={isAuthenticated ? "Add to cart" : "Login to add"}
                        >
                          ➕ Add
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
