import React, { useState, useEffect } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  Container,
  Button,
  Menu,
  MenuItem,
  IconButton,
  Avatar,
  useMediaQuery,
  Drawer,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Collapse,
  useTheme,
  Fade,
} from "@mui/material";
import {
  Dashboard as DashboardIcon,
  Business as BusinessIcon,
  ContactMail as ContactMailIcon,
  Group as GroupIcon,
  KeyboardArrowDown as KeyboardArrowDownIcon,
  Menu as MenuIcon,
  ExpandLess,
  ExpandMore,
  Inventory as InventoryIcon,
  ViewList as ViewListIcon,
} from "@mui/icons-material";
import { useNavigate, useLocation } from "react-router-dom";

const menuOptions = [
  {
    name: "Create WD Accounts",
    route: "/Sign-Up",
    icon: <BusinessIcon color="primary" />,
  },
  {
    name: "Inventory",
    route: "/Add-Master",
    icon: <InventoryIcon color="success" />,
  },
  {
    name: "Show Data",
    route: "/product-data",
    icon: <ViewListIcon color="secondary" />,
  },
  {
    name: "Show All CC",
    route: "/show-all-cc",
    icon: <GroupIcon color="error" />,
  },
];

const AppNavBar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  // For desktop dropdown menu
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  // For mobile drawer
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [menuExpanded, setMenuExpanded] = useState(false);

  // For scroll effect
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 10;
      if (isScrolled !== scrolled) {
        setScrolled(isScrolled);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [scrolled]);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleNavigation = (route) => {
    navigate(route);
    handleClose();
    setDrawerOpen(false);
  };


  const handleClicked = ()=>{

    localStorage.removeItem("email")
    navigate("/")
  }


 

  const toggleDrawer = (open) => (event) => {
    if (
      event &&
      event.type === "keydown" &&
      (event.key === "Tab" || event.key === "Shift")
    ) {
      return;
    }
    setDrawerOpen(open);
  };

  const toggleMenuExpand = () => {
    setMenuExpanded(!menuExpanded);
  };

  const isActive = (path) => {
    return location.pathname === path;
  };

  // Desktop navigation
  const desktopNav = (
    <>
      <Box sx={{ display: "flex", alignItems: "center" }}>
        <Button
          id="menu-button"
          aria-controls={open ? "product-menu" : undefined}
          aria-haspopup="true"
          aria-expanded={open ? "true" : undefined}
          onClick={handleClick}
          endIcon={<KeyboardArrowDownIcon />}
          sx={{
            mx: 1,
            color: "white",
            fontWeight: "bold",
            backgroundColor: menuOptions.some((option) =>
              isActive(option.route)
            )
              ? "rgba(255, 255, 255, 0.15)"
              : "transparent",
            "&:hover": {
              backgroundColor: "rgba(255, 255, 255, 0.25)",
            },
            borderRadius: 2,
            px: 2,
            py: 1,
            transition: "all 0.3s ease",
          }}
        >
          Menu
        </Button>
        <Menu
          id="product-menu"
          anchorEl={anchorEl}
          open={open}
          onClose={handleClose}
          MenuListProps={{
            "aria-labelledby": "menu-button",
          }}
          PaperProps={{
            elevation: 8,
            sx: {
              borderRadius: 2,
              mt: 1,
              width: 240,
              overflow: "visible",
              boxShadow: "0 8px 16px rgba(0, 0, 0, 0.1)",
              "&:before": {
                content: '""',
                display: "block",
                position: "absolute",
                top: 0,
                right: 14,
                width: 10,
                height: 10,
                bgcolor: "background.paper",
                transform: "translateY(-50%) rotate(45deg)",
                zIndex: 0,
              },
            },
          }}
          TransitionComponent={Fade}
          transformOrigin={{ horizontal: "right", vertical: "top" }}
          anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
        >
          {menuOptions.map((option) => (
            <MenuItem
              key={option.name}
              onClick={() => handleNavigation(option.route)}
              sx={{
                py: 1.5,
                borderLeft: isActive(option.route)
                  ? `4px solid ${theme.palette.primary.main}`
                  : "4px solid transparent",
                "&:hover": {
                  backgroundColor: theme.palette.action.hover,
                },
              }}
            >
              <Box sx={{ mr: 2, display: "flex", alignItems: "center" }}>
                {option.icon}
              </Box>
              <Typography>{option.name}</Typography>
            </MenuItem>
          ))}
        </Menu>        <Button
          variant="contained"
          color="secondary"
          sx={{
            ml: 2,
            borderRadius: 2,
            boxShadow: "0 4px 8px rgba(0, 0, 0, 0.15)",
            "&:hover": {
              boxShadow: "0 6px 12px rgba(0, 0, 0, 0.2)",
            },
          }}
        >
          Admin
        </Button>
        <Button
          variant="contained"
          color="secondary"
          sx={{
            ml: 2,
            borderRadius: 2,
            boxShadow: "0 4px 8px rgba(0, 0, 0, 0.15)",
            "&:hover": {
              boxShadow: "0 6px 12px rgba(0, 0, 0, 0.2)",
            },
          }}
          onClick={()=>handleClicked()}
        >
          logout
        </Button>

      </Box>
    </>
  );

  // Mobile drawer content
  const drawerContent = (
    <Box
      sx={{ width: 280 }}
      role="presentation"
      onKeyDown={toggleDrawer(false)}
    >
      <Box
        sx={{
          p: 3,
          display: "flex",
          alignItems: "center",
          borderBottom: "1px solid rgba(0, 0, 0, 0.12)",
          background: "linear-gradient(90deg, #1a237e 0%, #3949ab 100%)",
          color: "white",
        }}
      >
        <Avatar
          sx={{
            bgcolor: "white",
            color: theme.palette.primary.main,
            mr: 2,
            boxShadow: "0 2px 8px rgba(0, 0, 0, 0.15)",
          }}
        >
          PT
        </Avatar>
        <Typography variant="h6">Product Tracking</Typography>
      </Box>

      <List sx={{ pt: 2 }}>
        <ListItem
          button
          onClick={() => handleNavigation("/dashboard")}
          selected={isActive("/dashboard")}
          sx={{
            borderRadius: "0 20px 20px 0",
            mx: 1,
            my: 0.5,
            "&.Mui-selected": {
              backgroundColor: `${theme.palette.primary.light}20`,
              "&:hover": {
                backgroundColor: `${theme.palette.primary.light}30`,
              },
            },
          }}
        >
          <ListItemIcon>
            <DashboardIcon
              color={isActive("/dashboard") ? "primary" : "inherit"}
            />
          </ListItemIcon>
          <ListItemText primary="Dashboard" />
        </ListItem>

        <ListItem
          button
          onClick={toggleMenuExpand}
          sx={{
            borderRadius: "0 20px 20px 0",
            mx: 1,
            my: 0.5,
            bgcolor: menuExpanded
              ? `${theme.palette.primary.light}15`
              : "transparent",
            "&:hover": {
              backgroundColor: `${theme.palette.primary.light}25`,
            },
          }}
        >
          <ListItemIcon>
            <BusinessIcon
              color={
                menuOptions.some((option) => isActive(option.route))
                  ? "primary"
                  : "inherit"
              }
            />
          </ListItemIcon>
          <ListItemText primary="Product Menu" />
          {menuExpanded ? <ExpandLess /> : <ExpandMore />}
        </ListItem>

        <Collapse in={menuExpanded} timeout="auto" unmountOnExit>
          <List component="div" disablePadding>
            {menuOptions.map((option) => (
              <ListItem
                button
                key={option.name}
                onClick={() => handleNavigation(option.route)}
                selected={isActive(option.route)}
                sx={{
                  pl: 4,
                  borderRadius: "0 20px 20px 0",
                  mx: 1,
                  my: 0.5,
                  "&.Mui-selected": {
                    backgroundColor: `${theme.palette.primary.light}20`,
                    "&:hover": {
                      backgroundColor: `${theme.palette.primary.light}30`,
                    },
                  },
                }}
              >
                <ListItemIcon>{option.icon}</ListItemIcon>
                <ListItemText primary={option.name} />
              </ListItem>
            ))}
          </List>
        </Collapse>
      </List>
    </Box>
  );

  return (
    <AppBar
      position="sticky"
      sx={{
        background: scrolled
          ? "linear-gradient(90deg, #1a237e 0%, #3949ab 100%)"
          : "linear-gradient(90deg, #1a237e 0%, #3949ab 100%)",
        boxShadow: scrolled
          ? "0 4px 20px rgba(0, 0, 0, 0.2)"
          : "0 4px 20px rgba(0, 0, 0, 0.15)",
        transition: "all 0.3s ease",
        backdropFilter: scrolled ? "blur(8px)" : "none",
        height: scrolled ? "64px" : "70px",
        display: "flex",
        justifyContent: "center",
      }}
    >
      <Container maxWidth="xl">
        <Toolbar disableGutters sx={{ height: "100%" }}>
          {/* Logo and brand */}
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              flexGrow: isMobile ? 1 : 0,
            }}
          >
            <Avatar
              sx={{
                bgcolor: "white",
                color: theme.palette.primary.main,
                fontWeight: "bold",
                mr: 2,
                transition: "all 0.3s ease",
                transform: scrolled ? "scale(0.9)" : "scale(1)",
                boxShadow: "0 2px 10px rgba(0, 0, 0, 0.15)",
              }}
            >
              PT
            </Avatar>
            <Typography
              variant="h6"
              noWrap
              component="div"
              sx={{
                display: { xs: "none", sm: "block" },
                fontWeight: "bold",
                letterSpacing: 1,
                transition: "all 0.3s ease",
                fontSize: scrolled ? "1.1rem" : "1.25rem",
              }}
            >
              Data Collection
            </Typography>
          </Box>

          {/* Mobile menu icon */}
          {isMobile ? (
            <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
              <IconButton
                size="large"
                edge="end"
                color="inherit"
                aria-label="menu"
                onClick={toggleDrawer(true)}
                sx={{
                  "&:hover": {
                    backgroundColor: "rgba(255, 255, 255, 0.15)",
                  },
                }}
              >
                <MenuIcon />
              </IconButton>
              <Drawer
                anchor="left"
                open={drawerOpen}
                onClose={toggleDrawer(false)}
              >
                {drawerContent}
              </Drawer>
            </Box>
          ) : (
            <Box
              sx={{ flexGrow: 1, display: "flex", justifyContent: "flex-end" }}
            >
              {desktopNav}
            </Box>
          )}
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default AppNavBar;
