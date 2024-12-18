"use client";

import React, { useState, useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { Navigation } from 'react-minimal-side-navigation';
import 'react-minimal-side-navigation/lib/ReactMinimalSideNavigation.css';
import { IconButton, Drawer, useMediaQuery, useTheme, CircularProgress, Box , Button } from '@mui/material';
import Link from 'next/link';
import axios from "axios";
import { toast } from 'react-toastify';
import Cookies from 'js-cookie';
import MenuIcon from '@mui/icons-material/Menu';
import { inherits } from 'util';

const Layout = ({ children }) => {
  const [isLoading, setIsLoading] = useState(true); // State to handle loading
  const currentPath = usePathname();
  const router = useRouter();

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  // Function to toggle the sidebar
  const [open, setOpen] = useState(false);
  const toggleSidebar = () => {
    setOpen(!open);
  };

  // Redirect to login if token is missing
  useEffect(() => {
    const token = Cookies.get('authToken'); 
    console.log(token)
    if (!token) {
      router.replace('/admin/login'); 
    } else {
      setIsLoading(false); 
    }
  }, [router]);


  const handleSignout = async () => {
    try {
      // Call the API to log out
      await axios.post('/api/auth/signout');
      toast.success("Logged out successfully");

      // Redirect the user to the login page
      router.push('/admin/login');
    } catch (error) {
      toast.error("Logout failed. Please try again.");
    }
  };


  // Show a loader while checking token
  if (isLoading) {
    return (
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          height: '100vh',
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: isMobile ? 'column' : 'row' }}>
      {/* Mobile toggle button */}
      {isMobile && (
      <MenuIcon
      onClick={toggleSidebar}
      style={{
        position: "relative",
        top: 10,
        left: 10,
        zIndex: 1000,
        color: "#000",
      }}
    >
     
    </MenuIcon>
      )}

      {/* Sidebar menu */}
      <Drawer
        variant={isMobile ? 'temporary' : 'persistent'}
        open={isMobile ? open : true}
        onClose={toggleSidebar}
        sx={{
          '& .MuiDrawer-paper': {
            width: 250,
            backgroundColor: '#d8d8d8',
            height: '100%',
            position: 'fixed',
          },
        }}
      >
        <Navigation
          activeItemId={currentPath}
          onSelect={({ itemId }) => {
            if (isMobile) {
              setOpen(false);
            }
          }}
          items={[
            {
              title: (
                <Link href="/admin/dashboard" style={{ textDecoration: 'none', color: 'inherit' }}>
                  Dashboard
                </Link>
              ),
              itemId: '/admin/dashboard',
            },
            {
              title: (
                <Link href="/admin/category" style={{ textDecoration: 'none', color: 'inherit' }}>
                  Category
                </Link>
              ),
              itemId: '/admin/category',
            },
          ]}
        />
 <Button variant="contained" color="secondary" onClick={handleSignout}>
      Sign Out
    </Button>
        
      </Drawer>

      {/* Main content */}
      <div
        style={{
          flex: 1,
          padding: '20px',
          marginLeft: isMobile ? 0 : open ? 0 : 250,
          transition: 'margin-left 0.3s',
          width: inherits,
        }}
      >
        {children}
      </div>
    </div>
  );
};

export default Layout;
