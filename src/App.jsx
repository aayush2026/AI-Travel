import { Route, Routes } from "react-router"
import { Button } from "./components/ui/button"
import HomePage from "./pages/HomePage"
import CreateTrip from "./pages/CreateTrip"
import Header from "./components/custom/Header"
import ViewTrip from "./pages/ViewTrip"
import NotFound from "./components/custom/NotFound"
import MyTrips from "./pages/MyTrips"

function App() {
  return (
    <>
      <Header/>
      <Routes>
        <Route path="/" element={<HomePage/>} />
        <Route path="/create-trip" element={<CreateTrip/>} />
        <Route path="/view-trip/:tripId" element={<ViewTrip/>} />
        <Route path="/my-trips" element={<MyTrips/>} />
        <Route path="*" element={<NotFound/>}></Route>
      </Routes>
    </>
  )
}

export default App
