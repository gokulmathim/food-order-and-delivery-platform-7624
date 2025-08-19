import React from 'react';
import './RestaurantList.css';

// PUBLIC_INTERFACE
export default function RestaurantList({ restaurants, selectedId, onSelect }) {
  /** Sidebar list of restaurants with selection. */
  return (
    <aside className="restaurant-list">
      <h3 className="section-title">Restaurants</h3>
      <ul>
        {restaurants?.map(r => (
          <li key={r.id || r._id} className={selectedId === (r.id || r._id) ? 'active' : ''}>
            <button onClick={() => onSelect(r.id || r._id)}>
              <div className="name">{r.name}</div>
              {r.cuisine ? <div className="meta">{r.cuisine}</div> : null}
            </button>
          </li>
        ))}
      </ul>
    </aside>
  );
}
