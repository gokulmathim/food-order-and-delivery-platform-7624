import React from "react";

export default function HomePage() {
  return (
    <div className="panel">
      <div className="section-title">
        <div style={{ fontWeight: 800, fontSize: 18 }}>Welcome</div>
        <div style={{ color: "var(--muted)", fontSize: 12 }}>
          Choose a restaurant on the left to browse the menu.
        </div>
      </div>
      <div className="notice">
        Tip: Use the cart on the right to review items and place your order. You need to login or register to checkout.
      </div>
    </div>
  );
}
