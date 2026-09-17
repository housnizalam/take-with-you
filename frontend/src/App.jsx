import { Link, Route, Routes } from "react-router-dom";
import Home from "./pages/Home.jsx";
import Trips from "./pages/Trips.jsx";
import CreateTrip from "./pages/CreateTrip.jsx";

function App() {
  return (
    <div>
      <nav>
        <Link to="/">Home</Link>
        {" | "}
        <Link to="/trips">Trips</Link>
        {" | "}
        <Link to="/trips/new">Create Trip</Link>
      </nav>

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/trips" element={<Trips />} />
        <Route path="/trips/new" element={<CreateTrip />} />
      </Routes>
    </div>
  );
}

export default App;
