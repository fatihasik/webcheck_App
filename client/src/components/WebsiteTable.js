import React, { useState, useEffect } from 'react';
import moment from 'moment-timezone';
import { Box, Button, TextField, Typography, Stack, Switch } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import { Brightness4, Brightness7 } from '@mui/icons-material'; // Moon and Sun icons
import { ThemeProvider, createTheme } from '@mui/material/styles';

function WebsiteTable() {
  const [sites, setSites] = useState([]);
  const [newSiteName, setNewSiteName] = useState('');
  const [newSiteUrl, setNewSiteUrl] = useState('');
  const [darkMode, setDarkMode] = useState(false); // Dark mode state

  useEffect(() => {
    const fetchSiteStatus = async () => {
      try {
        const response = await fetch('/api/websites');
        const data = await response.json();
        setSites(data);
      } catch (error) {
        console.error('Veri çekilemedi:', error);
      }
    };

    fetchSiteStatus();
    const interval = setInterval(fetchSiteStatus, 60000);

    return () => clearInterval(interval);
  }, []);

  const handleDeleteWebsite = async (id) => {
    try {
      const response = await fetch(`/api/websites/${id}`, { method: 'DELETE' });
      if (response.ok) {
        setSites((prevSites) => prevSites.filter((site) => site.id !== id));
      } else {
        console.error('Silme işlemi başarısız:', response.statusText);
      }
    } catch (error) {
      console.error('Silme işlemi sırasında hata oluştu:', error);
    }
  };

  const handleAddWebsite = async () => {
    if (!newSiteName || !newSiteUrl) {
      alert('Lütfen site adı ve URL girin.');
      return;
    }

    const newSite = { name: newSiteName, url: newSiteUrl, status: 'up', downtime: 0 };

    try {
      const response = await fetch('/api/websites', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newSite),
      });

      if (response.ok) {
        const addedSite = await response.json();
        setSites((prevSites) => [...prevSites, addedSite]);
        setNewSiteName('');
        setNewSiteUrl('');
      } else {
        console.error('Site eklenemedi:', response.statusText);
      }
    } catch (error) {
      console.error('Site ekleme işlemi sırasında hata oluştu:', error);
    }
  };

  const handleEditWebsite = async (id, updatedSite) => {
    try {
      const response = await fetch(`/api/websites/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedSite),
      });

      if (response.ok) {
        setSites((prevSites) =>
          prevSites.map((site) => (site.id === id ? { ...site, ...updatedSite } : site))
        );
      } else {
        console.error('Düzenleme işlemi başarısız:', response.statusText);
      }
    } catch (error) {
      console.error('Düzenleme işlemi sırasında hata oluştu:', error);
    }
  };

  const columns = [
    { field: 'name', headerName: 'Site Adı', flex: 1, editable: true },
    { field: 'url', headerName: 'URL', flex: 1, editable: true },
    {
      field: 'status',
      headerName: 'Durum',
      flex: 1,
      renderCell: (params) => (params.value === 'up' ? 'Çalışıyor' : 'Kesinti'),
    },
    { field: 'downtime', headerName: 'Kesinti Süresi (Dakika)', flex: 1 },
    {
      field: 'lastDownTime',
      headerName: 'Son Kesinti Zamanı',
      flex: 1,
      renderCell: (params) =>
        params.value
          ? moment(params.value).tz('Europe/Istanbul').format('DD-MM HH:mm:ss')
          : 'Yok',
    },
    {
      field: 'actions',
      headerName: 'Eylemler',
      flex: 1,
      sortable: false,
      renderCell: (params) => (
        <Stack direction="row" spacing={1}>
          <Button
            variant="contained"
            color="primary"
            onClick={() => handleEditWebsite(params.row.id, params.row)}
          >
            Düzenle
          </Button>
          <Button
            variant="contained"
            color="secondary"
            onClick={() => handleDeleteWebsite(params.row.id)}
          >
            Sil
          </Button>
        </Stack>
      ),
    },
  ];

  const sortedSites = [...sites].sort((a, b) => {
    if (a.status === 'down' && b.status !== 'down') return -1;
    if (a.status !== 'down' && b.status === 'down') return 1;
    return 0;
  });

  // Define the theme based on darkMode state
  const theme = createTheme({
    palette: {
      mode: darkMode ? 'dark' : 'light', // Toggle dark/light theme
    },
  });

  return (
    <ThemeProvider theme={theme}>
      <Box
        sx={{
          backgroundColor: darkMode ? '#333' : '#fafafa', // Dark mode background
          color: darkMode ? '#fff' : '#000', // Text color based on mode
          minHeight: '100vh',
          padding: '20px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
       

        {/* Theme toggle */}
        <Box sx={{ display: 'flex', alignItems: 'center', marginBottom: 2 }}>
          <Typography variant="h6" sx={{ marginRight: 1 }}>
            {darkMode ? 'Gece' : 'Gündüz'} Modu
          </Typography>
          <Switch
            checked={darkMode}
            onChange={() => setDarkMode(!darkMode)}
            inputProps={{ 'aria-label': 'Toggle dark mode' }}
          />
          {darkMode ? <Brightness4 /> : <Brightness7 />}
        </Box>

        <Box sx={{ height: 400, width: '100%', maxWidth: 1200, backgroundColor: 'white' }}>
          <DataGrid
            rows={sortedSites}
            columns={columns}
            pageSize={5}
            rowsPerPageOptions={[5, 10, 15, 20, { value: -1, label: 'Tümü' }]}
            getRowId={(row) => row.id}
            processRowUpdate={(newRow, oldRow) => {
              handleEditWebsite(newRow.id, newRow);
              return newRow;
            }}
          />
        </Box>

        <Box sx={{ marginTop: '20px', display: 'flex', gap: 2 }}>
          <TextField
            variant="outlined"
            label="Site Adı"
            value={newSiteName}
            onChange={(e) => setNewSiteName(e.target.value)}
          />
          <TextField
            variant="outlined"
            label="Site URL"
            value={newSiteUrl}
            onChange={(e) => setNewSiteUrl(e.target.value)}
          />
          <Button variant="contained" color="primary" onClick={handleAddWebsite}>
            Site Ekle
          </Button>
        </Box>
      </Box>
    </ThemeProvider>
  );
}

export default WebsiteTable;
