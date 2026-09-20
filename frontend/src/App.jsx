import { Link, Route, Routes } from "react-router-dom";
import Home from "./pages/Home.jsx";
import Trips from "./pages/Trips.jsx";
import CreateTrip from "./pages/CreateTrip.jsx";
import CreateNeed from "./pages/CreateNeed.jsx";
import TripDetails from "./pages/TripDetails.jsx";
import Needs from "./pages/Needs.jsx";

function App() {
  return (
    <div>
      <nav>
        <Link to="/">Home</Link>
        {" | "}
        <Link to="/trips">My trips</Link>
        {" | "}
        <Link to="/needs">My Needs</Link>
        {" | "}
        <Link to="/trips/new">Create Trip</Link>
        {" | "}
        <Link to="/needs/new">Find Transport</Link>
      </nav>

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/trips" element={<Trips />} />
        <Route path="/trips/new" element={<CreateTrip />} />
        <Route path="/needs/new" element={<CreateNeed />} />
        <Route path="/trips/:id" element={<TripDetails />} />
        <Route path="/needs" element={<Needs />} />
      </Routes>
    </div>
  );
}

export default App;
