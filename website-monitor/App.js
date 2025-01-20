import React, { useState, useEffect } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  Paper,
  Button,
  TextField,
  Box,
  Typography,
  Switch,
  CssBaseline,
} from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { Bar, Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, BarElement, Title, Tooltip, Legend, LinearScale, ArcElement } from 'chart.js';
import logom from "./logom.png";
import bakanliklogo from "./bakanliklogo.png";

ChartJS.register(CategoryScale, BarElement, Title, Tooltip, Legend, LinearScale, ArcElement);

const lightGreen = '#81c784';

const lightTheme = createTheme({
  palette: {
    mode: 'light',
    background: {
      default: '#e7f5e9',
    },
    text: {
      primary: '#000000',
    },
  },
});

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    background: {
      default: '#212121',
    },
    text: {
      primary: '#ffffff',
    },
  },
});

const App = () => {
  const [darkMode, setDarkMode] = useState(false);
  const [sites, setSites] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [newSiteName, setNewSiteName] = useState('');
  const [newSiteUrl, setNewSiteUrl] = useState('');
  const [editingSite, setEditingSite] = useState(null);
  const [editingUrl, setEditingUrl] = useState('');  

  const theme = darkMode ? darkTheme : lightTheme;

  const fetchSiteStatus = async () => {
    try {
      const response = await fetch('/api/websites');
      const data = await response.json();
      data.sort((a, b) => (a.status === 'down' && b.status !== 'down') ? -1 : 1);
      setSites(data);
    } catch (error) {
      console.error("Veri çekilemedi:", error);
    }
  };

  useEffect(() => {
    fetchSiteStatus();
    const interval = setInterval(fetchSiteStatus, 30000); 
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

    try {
      const response = await fetch('/api/websites', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
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

  const handleEditWebsite = (site) => {
    setEditingSite(site.id);
    setEditingUrl(site.url);  
  };

  const handleSaveWebsite = async (site) => {
    try {
      const response = await fetch(`/api/websites/${site.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url: editingUrl }),
      });

      if (response.ok) {
        const updatedSite = await response.json();
        setSites((prevSites) =>
          prevSites.map((s) => (s.id === site.id ? { ...s, url: updatedSite.url } : s))
        );
        setEditingSite(null);
        setEditingUrl('');
      } else {
        console.error('URL güncellenemedi:', response.statusText);
      }
    } catch (error) {
      console.error('URL güncelleme sırasında hata oluştu:', error);
    }
  };

  const handleDeleteWebsite = async (id) => {
    try {
      const response = await fetch(`/api/websites/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setSites((prevSites) => prevSites.filter((site) => site.id !== id));
      } else {
        console.error('Silme işlemi başarısız:', response.statusText);
      }
    } catch (error) {
      console.error('Silme işlemi sırasında hata oluştu:', error);
    }
  };

  const getDowntimeChartData = () => {
    const downtimeData = sites.map((site) => site.downtime);
    return {
      labels: sites.map((site) => site.name),
      datasets: [
        {
          label: 'Kesinti Süresi (dakika)',
          data: downtimeData,
          backgroundColor: downtimeData.map((downtime) =>
            downtime === 0 ? lightGreen : '#f44336'
          ),
        },
      ],
    };
  };

  const getDoughnutChartData = () => {
    const upSites = sites.filter((site) => site.downtime === 0).length;
    const downSites = sites.filter((site) => site.downtime > 0).length;
    return {
      labels: ['Kesinti Yaşayan', 'Kesinti Yaşamayan'],
      datasets: [
        {
          data: [downSites, upSites],
          backgroundColor: ['#f44336', lightGreen],
        },
      ],
    };
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const getColor = (site) => {
    if (site.status === 'down') {
      const downTimeMinutes = (Date.now() - new Date(site.firstDownTime)) / 60000;
      if (downTimeMinutes < 30) return '#ff3333'; 
      if (downTimeMinutes < 60) return '#ff9999'; 
      if (downTimeMinutes < 120) return '#ff6666'; 
      return '#ff3333'; 
    }
    return 'inherit'; 
  };

  const rowStyle = (site) => ({
    backgroundColor: getColor(site),
    color: darkMode ? '#ffffff' : '#000000'
  });

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ padding: 2, minHeight: '100vh', backgroundColor: theme.palette.background.default }}>
        <Box display="flex" alignItems="center" justifyContent="space-between" mb={5} sx={{marginLeft:30}}>
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
          
          <Switch
            checked={darkMode}
            onChange={() => setDarkMode(!darkMode)}
            color="primary"
          />
        </Box>
        <Box display="flex" flexDirection="column" gap={4}>
          <Box display="flex" justifyContent="space-between" mb={4}>
            <Box sx={{ width: '48%', height: 300 }}>
              <Bar data={getDowntimeChartData()} options={{ responsive: true }} />
            </Box>
            <Box sx={{ width: '48%', height: 300 }}>
              <Doughnut data={getDoughnutChartData()} options={{ maintainAspectRatio: false }} />
              </Box>
          </Box>
          
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Site Adı</TableCell>
                  <TableCell>URL</TableCell>
                  <TableCell>Durum</TableCell>
                  <TableCell>İlk Kesinti Zamanı</TableCell>
                  <TableCell>Toplam Kesinti Süresi</TableCell>
                  <TableCell>Düzenle/Kaydet</TableCell>
                  <TableCell>Sil</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {sites.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((site) => (
                  <TableRow key={site.id} style={rowStyle(site)}>
                    <TableCell>{site.name}</TableCell>
                    <TableCell onDoubleClick={() => handleEditWebsite(site)}>
                      {editingSite === site.id ? (
                        <TextField
                          value={editingUrl}
                          onChange={(e) => setEditingUrl(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                              handleSaveWebsite(site);
                            }
                          }}
                          variant="outlined"
                          fullWidth
                        />
                      ) : (
                        site.url.length > 30 ? `${site.url.substring(0, 30)}...` : site.url
                      )}
                    </TableCell>
                    <TableCell>{site.status}</TableCell>
                    <TableCell>
                      {site.firstDownTime ? new Date(site.firstDownTime).toLocaleString('tr-TR', { timeZone: 'Europe/Istanbul' }) : 'Yok'}
                    </TableCell>
                    <TableCell>{site.downtime} dakika</TableCell>
                    <TableCell>
                      {editingSite === site.id ? (
                        <Button
                          variant="contained"
                          color="primary"
                          onClick={() => handleSaveWebsite(site)}
                        >
                          Kaydet
                        </Button>
                      ) : (
                        <Button
                          variant="contained"
                          color="secondary"
                          onClick={() => handleEditWebsite(site)}
                        >
                          Düzenle
                        </Button>
                      )}
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="contained"
                        color="error"
                        onClick={() => handleDeleteWebsite(site.id)}
                      >
                        Sil
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            <TablePagination
              rowsPerPageOptions={[5, 10, 15, 20, { label: 'Tüm', value: -1 }]}
              count={sites.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
            />
          </TableContainer>
        </Box>
        <Box mb={4} style={{ marginTop: 10 }}>
          <TextField
            label="Site Adı"
            value={newSiteName}
            onChange={(e) => setNewSiteName(e.target.value)}
            variant="outlined"
            style={{ marginRight: 10 }}
          />
          <TextField
            label="Site URL"
            value={newSiteUrl}
            onChange={(e) => setNewSiteUrl(e.target.value)}
            variant="outlined"
            style={{ marginRight: 10 }}
          />
          <Button
            variant="contained"
            color="primary"
            onClick={handleAddWebsite}
          >
            Site Ekle
          </Button>
        </Box>
      </Box>
    </ThemeProvider>
  );
}

export default App;
