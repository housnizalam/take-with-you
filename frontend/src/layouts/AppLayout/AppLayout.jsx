import { Outlet } from "react-router-dom";

import AppSidebar from "../../components/AppSidebar/AppSidebar.jsx";

import "./AppLayout.css";

function AppLayout() {
  return (
    <div className="app-layout">
      <AppSidebar />

      <main className="app-layout__content">
        <Outlet />
      </main>
    </div>
  );
}

export default AppLayout;