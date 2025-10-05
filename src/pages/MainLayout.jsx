import React, { useState } from "react";
import { AppBar, Toolbar, Typography, IconButton, Button, Drawer, List, ListItem, ListItemText } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import { NavLink, Outlet, useLocation } from "react-router-dom";

export default function MainLayout() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();

  const toggleDrawer = () => setMobileOpen(!mobileOpen);

  const navItems = [
    { label: "Dashboard", path: "/" },
    { label: "Data Siswa", path: "/students" },
    { label: "Latihan", path: "/latihan" },
    { label: "Evaluasi", path: "/evaluasi" },
    { label: "Leaderboard", path: "/leaderboard" },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 text-gray-800">
      {/* ======== NAVBAR ======== */}
      <AppBar
        position="static"
        className="bg-blue-600 shadow-lg"
        elevation={0}
      >
        <Toolbar className="flex justify-between">
          {/* Left Section */}
          <div className="flex items-center gap-3">
            <Typography
              variant="h6"
              className="font-bold tracking-wide text-white"
            >
              FitKids Tracker
            </Typography>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex gap-3">
            {navItems.map((item) => (
              <NavLink key={item.path} to={item.path}>
                <Button
                  sx={{
                    color: isActive(item.path) ? "#fff" : "#E0E7FF",
                    borderBottom: isActive(item.path)
                      ? "2px solid white"
                      : "2px solid transparent",
                    borderRadius: 0,
                    transition: "0.3s",
                    "&:hover": { borderBottom: "2px solid white", color: "#fff" },
                  }}
                >
                  {item.label}
                </Button>
              </NavLink>
            ))}
          </div>

          {/* Mobile Menu Icon */}
          <IconButton
            edge="end"
            color="inherit"
            aria-label="menu"
            className="md:hidden"
            onClick={toggleDrawer}
          >
            <MenuIcon />
          </IconButton>
        </Toolbar>
      </AppBar>

      {/* ======== MOBILE DRAWER ======== */}
      <Drawer
        anchor="right"
        open={mobileOpen}
        onClose={toggleDrawer}
        PaperProps={{
          sx: { width: 240, backgroundColor: "#f8fafc" },
        }}
      >
        <List>
          {navItems.map((item) => (
            <ListItem
              button
              key={item.path}
              onClick={toggleDrawer}
              component={NavLink}
              to={item.path}
              sx={{
                backgroundColor: isActive(item.path) ? "#E3F2FD" : "transparent",
              }}
            >
              <ListItemText
                primary={item.label}
                primaryTypographyProps={{
                  color: isActive(item.path) ? "primary" : "inherit",
                  fontWeight: isActive(item.path) ? "bold" : "normal",
                }}
              />
            </ListItem>
          ))}
        </List>
      </Drawer>

      {/* ======== PAGE CONTENT ======== */}
      <main className="flex-1 p-6 md:p-10 transition-all duration-300">
        <Outlet />
      </main>

      {/* ======== FOOTER ======== */}
      <footer className="bg-blue-600 text-white text-center py-3 mt-auto text-sm">
        © {new Date().getFullYear()} FitKids Tracker. All Rights Reserved.
      </footer>
    </div>
  );
}
