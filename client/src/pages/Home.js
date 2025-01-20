// pages/Home.js
import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  CssBaseline,
  Switch,
  Button
} from '@mui/material';
import { ThemeProvider } from '@mui/material/styles';
import { lightTheme, darkTheme, IconWrapper } from '../theme';
import { fetchSiteStatus, addWebsite, updateWebsite, deleteWebsite } from '../api';
import SiteTable from '../components/SiteTable';
import AddWebsiteForm from '../components/AddWebsiteForm';
import ChartDisplay from '../components/ChartDisplay';
import logom from '../assets/logom.png';
import bakanliklogo from '../assets/bakanliklogo.png';
import { Brightness4, Brightness7 } from '@mui/icons-material';
import { signOut } from 'firebase/auth';
import { auth } from '../firebase';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const [darkMode, setDarkMode] = useState(false);
  const [sites, setSites] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [newSiteName, setNewSiteName] = useState('');
  const [newSiteUrl, setNewSiteUrl] = useState('');
  const [editingSite, setEditingSite] = useState(null);
  const [editingUrl, setEditingUrl] = useState('');
  const navigate = useNavigate();

  const theme = darkMode ? darkTheme : lightTheme;

  useEffect(() => {
    const fetchData = async () => {
      const data = await fetchSiteStatus();
      setSites(data);
    };

    fetchData();
    const interval = setInterval(fetchData, 30000);
    return () => clearInterval(interval);
  }, []);

  const handleAddWebsite = async () => {
    if (!newSiteName || !newSiteUrl) {
      alert('Lütfen site adı ve URL girin.');
      return;
    }
    const newSite = {
      name: newSiteName,
      url: newSiteUrl,
      status: 'unknown',
      downtime: 0,
      firstDownTime: null,
      lastChecked: null,
    };

    const addedSite = await addWebsite(newSite);
    if (addedSite) {
      setSites((prevSites) => [...prevSites, addedSite]);
      setNewSiteName('');
      setNewSiteUrl('');
    }
  };

  const handleEditWebsite = (site) => {
    setEditingSite(site.id);
    setEditingUrl(site.url);
  };

  const handleSaveWebsite = async (site) => {
    const updatedSite = await updateWebsite(site.id, editingUrl);
    if (updatedSite) {
      setSites((prevSites) =>
        prevSites.map((s) => (s.id === site.id ? { ...s, url: updatedSite.url } : s))
      );
      setEditingSite(null);
      setEditingUrl('');
    }
  };

  const handleDeleteWebsite = async (id) => {
    if (await deleteWebsite(id)) {
      setSites((prevSites) => prevSites.filter((site) => site.id !== id));
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate('/');
    } catch (error) {
      console.error('Oturum kapatma hatası:', error);
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ padding: 2, minHeight: '100vh', backgroundColor: theme.palette.background.default }}>
        <Box display="flex" alignItems="center" justifyContent="space-between" mb={5} sx={{ marginLeft: 30 }}>
          <Box
            component="img"
            src={bakanliklogo}
            alt="BLogo"
            sx={{
              height: 100,
              marginLeft: 2,
            }}
          />
          <Typography variant="h4">ETKB Siber Güvenlik Operasyon Merkezi</Typography>
          <Box
            component="img"
            src={logom}
            alt="Logo"
            sx={{
              height: 100,
              marginLeft: 2,
              ...(darkMode && {
                backgroundColor: 'white',
                padding: '10px',
                borderRadius: '35px',
                boxShadow: '0 0 15px rgba(255, 255, 255, 0.8), 0 0 30px rgba(255, 255, 255, 0.8)',
              }),
            }}
          />
          <Box display="flex" alignItems="center">
            <IconWrapper style={{ transform: darkMode ? 'rotate(360deg)' : 'none' }}>
              {darkMode ? <Brightness4 /> : <Brightness7 />}
            </IconWrapper>
            <Switch
              checked={darkMode}
              onChange={() => setDarkMode(!darkMode)}
              color="primary"
            />
            <Button
              variant="contained"
              color="secondary"
              onClick={handleLogout}
              sx={{ marginLeft: 2 }}
            >
              Oturumu Kapat
            </Button>
          </Box>
        </Box>
        <ChartDisplay sites={sites} />
        <SiteTable
          sites={sites}
          page={page}
          rowsPerPage={rowsPerPage}
          setPage={setPage}
          setRowsPerPage={setRowsPerPage}
          handleEditWebsite={handleEditWebsite}
          handleSaveWebsite={handleSaveWebsite}
          handleDeleteWebsite={handleDeleteWebsite}
          editingSite={editingSite}
          editingUrl={editingUrl}
          setEditingUrl={setEditingUrl}
          darkMode={darkMode}
        />
        <AddWebsiteForm
          newSiteName={newSiteName}
          newSiteUrl={newSiteUrl}
          setNewSiteName={setNewSiteName}
          setNewSiteUrl={setNewSiteUrl}
          handleAddWebsite={handleAddWebsite}
        />
      </Box>
    </ThemeProvider>
  );
};

export default Home;
