import { Route, Routes } from "react-router-dom";

import Home from "./pages/home/Home.jsx";
import Trips from "./pages/Trips/Trips.jsx";
import CreateTrip from "./pages/CreateTrip.jsx";
import CreateNeed from "./pages/CreateNeed.jsx";
import TripDetails from "./pages/TripDetails.jsx";
import Needs from "./pages/Needs.jsx";
import Auth from "./pages/Auth/Auth.jsx";

import AppLayout from "./layouts/AppLayout/AppLayout.jsx";

import { getCurrentUser } from "./auth/currentUser.js";

function App() {
  const currentUser = getCurrentUser();

  if (!currentUser) {
    return <Auth />;
  }

  return (
    <Routes>
      <Route element={<AppLayout />}>
        <Route path="/" element={<Home />} />

        <Route path="/trips" element={<Trips />} />

        <Route path="/trips/new" element={<CreateTrip />} />

        <Route path="/needs/new" element={<CreateNeed />} />

        <Route path="/trips/:id" element={<TripDetails />} />

        <Route path="/needs" element={<Needs />} />
      </Route>
    </Routes>
  );
}

export default App;
