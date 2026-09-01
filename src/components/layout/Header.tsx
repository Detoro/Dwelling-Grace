import { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { COLORS, FONT_DISPLAY, FONT_MONO } from "../../theme";
import { useCart } from "../../context/CartContext";

const NAV_LINKS = [
  { to: "/shop", label: "Collection" },
  { to: "/designer", label: "3D Design Studio" },
  { to: "/journal", label: "Journal & Care" },
];

export function Header() {
  const { itemCount, openDrawer } = useCart();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <>
      {/* Top Announcement Bar */}
      <div
        style={{
          background: COLORS.bgDeep2,
          color: COLORS.goldLight,
          fontFamily: FONT_MONO,
          fontSize: 11,
          letterSpacing: "0.1em",
          textTransform: "uppercase",
          padding: "8px 16px",
          textAlign: "center",
          borderBottom: `1px solid ${COLORS.lineOnDark}`,
        }}
      >
        <span>Bespoke made-to-order pillows &bull; Handcrafted in small batches &bull; Free US shipping over $150</span>
      </div>

      <header
        style={{
          position: "sticky",
          top: 0,
          zIndex: 100,
          background: "rgba(247, 245, 238, 0.94)",
          backdropFilter: "blur(12px)",
          borderBottom: `1px solid ${COLORS.line}`,
          transition: "background-color 0.2s ease",
        }}
      >
        <div
          style={{
            maxWidth: 1240,
            margin: "0 auto",
            padding: "16px 24px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          {/* Brand Logo */}
          <Link
            to="/"
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              textDecoration: "none",
              color: COLORS.ink,
            }}
          >
            <span
              style={{
                width: 28,
                height: 28,
                borderRadius: "50%",
                background: COLORS.bgDeep,
                color: COLORS.gold,
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                fontFamily: FONT_DISPLAY,
                fontSize: 15,
                fontWeight: 600,
                border: `1px solid ${COLORS.gold}`,
              }}
            >
              D
            </span>
            <span
              style={{
                fontFamily: FONT_DISPLAY,
                fontSize: 21,
                fontWeight: 600,
                letterSpacing: "-0.01em",
              }}
            >
              Dwelling Grace
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav
            aria-label="Primary"
            style={{ display: "flex", gap: 32, alignItems: "center" }}
            className="header-nav-desktop"
          >
            {NAV_LINKS.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                style={({ isActive }) => ({
                  fontFamily: FONT_MONO,
                  fontSize: 12,
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                  textDecoration: "none",
                  color: isActive ? COLORS.wine : COLORS.ink,
                  fontWeight: isActive ? 600 : 400,
                  position: "relative",
                  padding: "6px 0",
                })}
              >
                {({ isActive }) => (
                  <>
                    {link.label}
                    {isActive && (
                      <span
                        style={{
                          position: "absolute",
                          bottom: 0,
                          left: 0,
                          right: 0,
                          height: 2,
                          background: COLORS.wine,
                          borderRadius: 2,
                        }}
                      />
                    )}
                  </>
                )}
              </NavLink>
            ))}
          </nav>

          {/* Actions (Bag + Mobile Toggle) */}
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <button
              type="button"
              onClick={openDrawer}
              aria-label={`Open shopping bag, ${itemCount} item${itemCount === 1 ? "" : "s"}`}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 9,
                background: COLORS.white,
                border: `1px solid ${COLORS.line}`,
                borderRadius: 999,
                padding: "8px 16px",
                cursor: "pointer",
                fontFamily: FONT_MONO,
                fontSize: 12,
                letterSpacing: "0.05em",
                color: COLORS.ink,
                boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
              }}
            >
              <span>Bag</span>
              <span
                style={{
                  background: itemCount > 0 ? COLORS.wine : "rgba(26, 24, 21, 0.08)",
                  color: itemCount > 0 ? COLORS.cream : COLORS.inkSoft,
                  borderRadius: 999,
                  minWidth: 20,
                  height: 20,
                  fontSize: 11,
                  fontWeight: 600,
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  padding: "0 5px",
                  transition: "all 0.2s ease",
                }}
              >
                {itemCount}
              </span>
            </button>

            <button
              type="button"
              className="header-nav-toggle"
              aria-label={mobileOpen ? "Close menu" : "Open menu"}
              aria-expanded={mobileOpen}
              onClick={() => setMobileOpen((v) => !v)}
              style={{
                display: "none",
                background: "none",
                border: "none",
                fontSize: 22,
                color: COLORS.ink,
                cursor: "pointer",
                padding: 4,
              }}
            >
              {mobileOpen ? "\u2715" : "\u2630"}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileOpen && (
          <nav
            aria-label="Primary mobile"
            style={{
              display: "flex",
              flexDirection: "column",
              padding: "16px 24px 24px",
              gap: 16,
              background: COLORS.cream,
              borderTop: `1px solid ${COLORS.line}`,
            }}
          >
            {NAV_LINKS.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                onClick={() => setMobileOpen(false)}
                style={({ isActive }) => ({
                  fontFamily: FONT_MONO,
                  fontSize: 13,
                  textTransform: "uppercase",
                  letterSpacing: "0.08em",
                  color: isActive ? COLORS.wine : COLORS.ink,
                  fontWeight: isActive ? 600 : 400,
                  textDecoration: "none",
                  padding: "6px 0",
                })}
              >
                {link.label}
              </NavLink>
            ))}
          </nav>
        )}

        <style>{`
          @media (max-width: 900px) {
            .header-nav-desktop { display: none !important; }
            .header-nav-toggle { display: inline-flex !important; }
          }
        `}</style>
      </header>
    </>
  );
}

