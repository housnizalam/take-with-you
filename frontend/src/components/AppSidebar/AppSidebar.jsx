import { NavLink } from "react-router-dom";

import { clearCurrentUser } from "../../auth/currentUser.js";

import "./AppSidebar.css";

function AppSidebar() {
  function handleLogout() {
    clearCurrentUser();
    window.location.reload();
  }

  return (
    <aside className="app-sidebar">
      <div className="app-sidebar__brand">
        <div className="app-sidebar__logo">▲</div>

        <div>
          <strong>Take With You</strong>
          <span>Brighter journeys</span>
        </div>
      </div>

      <nav className="app-sidebar__nav">
        <NavLink
          to="/"
          end
          className={({ isActive }) =>
            isActive ? "sidebar-link sidebar-link--active" : "sidebar-link"
          }
        >
          <span>⌂</span>
          Home
        </NavLink>

        <NavLink
          to="/trips/new"
          className={({ isActive }) =>
            isActive ? "sidebar-link sidebar-link--active" : "sidebar-link"
          }
        >
          <span>＋</span>
          Create Trip
        </NavLink>

        <NavLink
          to="/needs/new"
          className={({ isActive }) =>
            isActive ? "sidebar-link sidebar-link--active" : "sidebar-link"
          }
        >
          <span>⌕</span>
          Find Transport
        </NavLink>

        <NavLink
          to="/trips"
          end
          className={({ isActive }) =>
            isActive ? "sidebar-link sidebar-link--active" : "sidebar-link"
          }
        >
          <span>▣</span>
          My Trips
        </NavLink>

        <NavLink
          to="/needs"
          end
          className={({ isActive }) =>
            isActive ? "sidebar-link sidebar-link--active" : "sidebar-link"
          }
        >
          <span>▤</span>
          My Requests
        </NavLink>
      </nav>

      <button
        type="button"
        className="app-sidebar__logout"
        onClick={handleLogout}
      >
        Log Out
      </button>
    </aside>
  );
}

export default AppSidebar;
