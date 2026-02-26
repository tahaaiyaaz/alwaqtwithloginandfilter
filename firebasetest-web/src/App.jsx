import React from "react";
import { BrowserRouter, Routes, Route, NavLink, Navigate, useLocation } from "react-router-dom";
import { IoHome, IoHomeOutline, IoHeart, IoHeartOutline, IoPerson, IoPersonOutline, IoAddCircle, IoAddCircleOutline, IoBusiness, IoBusinessOutline } from "react-icons/io5";
import HomePage from "./pages/HomePage";
import AddMasjid from "./pages/AddMasjid";
import FavoritesPage from "./pages/FavoritesPage";
import AccountsPage from "./pages/AccountsPage";
import AboutMasjidPage from "./pages/AboutMasjidPage";
import WelcomePage from "./pages/WelcomePage";
import MuezzinPage from "./pages/MuezzinPage";
import MasjidList from "./pages/MasjidList";
import UpdateTimingsPage from "./pages/UpdateTimingsPage";
import "./index.css";

function AppContent() {
  const location = useLocation();
  const userStr = localStorage.getItem("@user");
  const user = userStr ? JSON.parse(userStr) : null;

  return (
    <div className="app-layout">
      <div className="page-content">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/welcome" element={<WelcomePage />} />
          <Route path="/add-masjid" element={<AddMasjid />} />
          <Route path="/favorites" element={<FavoritesPage />} />
          <Route path="/account" element={<AccountsPage />} />
          <Route path="/about-masjid" element={<AboutMasjidPage />} />
          <Route path="/masjids" element={<MasjidList />} />
          <Route path="/update-timings" element={<UpdateTimingsPage />} />
          <Route path="/muezzin" element={<MuezzinPage />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </div>

      {/* Bottom Navigation */}
      <nav className="bottom-nav">
        <NavLink to="/" end className={({ isActive }) => isActive ? 'active' : ''}>
          {({ isActive }) => (<>
            {isActive ? <IoHome /> : <IoHomeOutline />}
            <span>Home</span>
          </>)}
        </NavLink>
        <NavLink to="/add-masjid" className={({ isActive }) => isActive ? 'active' : ''}>
          {({ isActive }) => (<>
            {isActive ? <IoAddCircle /> : <IoAddCircleOutline />}
            <span>Add</span>
          </>)}
        </NavLink>

        {user && (
          <NavLink to="/favorites" className={({ isActive }) => isActive ? 'active' : ''}>
            {({ isActive }) => (<>
              {isActive ? <IoHeart /> : <IoHeartOutline />}
              <span>Favorites</span>
            </>)}
          </NavLink>
        )}

        {user && user.userType === "Muazzin" && (
          <NavLink to="/muezzin" className={({ isActive }) => isActive ? 'active' : ''}>
            {({ isActive }) => (<>
              {isActive ? <IoBusiness /> : <IoBusinessOutline />}
              <span>Your Masjid</span>
            </>)}
          </NavLink>
        )}

        <NavLink to="/account" className={({ isActive }) => isActive ? 'active' : ''}>
          {({ isActive }) => (<>
            {isActive ? <IoPerson /> : <IoPersonOutline />}
            <span>Account</span>
          </>)}
        </NavLink>
      </nav>
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}

export default App;
