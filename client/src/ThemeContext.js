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
  IconButton,
} from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import Brightness3Icon from '@mui/icons-material/Brightness3'; // Gece ikonu
import WbSunnyIcon from '@mui/icons-material/WbSunny'; // Gündüz ikonu
import moment from 'moment-timezone';
import { Bar } from 'react-chartjs-2'; // Grafik için gerekli
import { Chart as ChartJS, CategoryScale, BarElement, Title, Tooltip, Legend } from 'chart.js';

// Ölçekleri ve diğer gerekli bileşenleri kaydedin
ChartJS.register(CategoryScale, BarElement, Title, Tooltip, Legend);

// Renkler ve tema ayarları
const lightGreen = '#81c784'; // Güncellenmiş yeşil tonu
const darkGreen = '#388e3c';

function App() {
  const [darkMode, setDarkMode] = useState(false);
  const [sites, setSites] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [newSiteName, setNewSiteName] = useState('');
  const [newSiteUrl, setNewSiteUrl] = useState('');
  const [editingSite, setEditingSite] = useState(null);

  // Gündüz ve gece temaları
  const lightTheme = createTheme({
    palette: {
      mode: 'light',
      background: {
        default: '#e7f5e9', // Modern yeşil tonları
      },
      text: {
        primary: '#000000', // Siyah yazılar
      },
    },
  });

  const darkTheme = createTheme({
    palette: {
      mode: 'dark',
      background: {
        default: '#212121', // Koyu tema
      },
      text: {
        primary: '#ffffff', // Beyaz yazılar
      },
    },
  });

  const theme = darkMode ? darkTheme : lightTheme;

  // Kesinti durumlarına göre arka plan rengi
  const calculateBackgroundColor = (downtime) => {
    if (downtime === 0) return lightGreen; // Kesinti yoksa yeşil
    if (downtime < 5) return '#ffeb99'; // Sarı
    if (downtime < 15) return '#ffa726'; // Turuncu
    return '#f44336'; // Kırmızı
  };

  // Grafik verilerini oluştur
  const getDowntimeChartData = () => {
    const downtimeData = sites.map(site => site.downtime);
    return {
      labels: sites.map(site => site.name),
      datasets: [{
        label: 'Kesinti Süresi (dakika)',
        data: downtimeData,
        backgroundColor: downtimeData.map(down => down === 0 ? lightGreen : (down < 5 ? '#ffeb99' : (down < 15 ? '#ffa726' : '#f44336'))),
      }],
    };
  };

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
        setSites((prev) => [addedSite, ...prev]);
        setNewSiteName('');
        setNewSiteUrl('');
      }
    } catch (error) {
      console.error('Site eklenemedi:', error);
    }
  };

  const handleUpdateWebsite = async (id, updatedUrl) => {
    try {
      const response = await fetch(`/api/websites/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: updatedUrl }),
      });

      if (response.ok) {
        setSites((prev) =>
          prev.map((site) => (site.id === id ? { ...site, url: updatedUrl } : site))
        );
        setEditingSite(null);
      }
    } catch (error) {
      console.error('Site güncellenemedi:', error);
    }
  };

  const handleDeleteWebsite = async (id) => {
    try {
      const response = await fetch(`/api/websites/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setSites((prev) => prev.filter((site) => site.id !== id));
      }
    } catch (error) {
      console.error('Site silinemedi:', error);
    }
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box
        sx={{
          minHeight: '100vh',
          padding: 2,
          backgroundColor: darkMode ? '#121212' : '#e7f5e9',
          color: darkMode ? '#fff' : '#000',
        }}
      >
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            mb: 3,
          }}
        >
          <Typography variant="h4" sx={{ mr: 2 }}>
            Siber Güvenlik Operasyon Merkezi
          </Typography>
          {darkMode ? (
            <WbSunnyIcon sx={{ color: '#ffd600', mr: 1 }} /> // Gündüz modu ikonu
          ) : (
            <Brightness3Icon sx={{ color: '#4caf50', mr: 1 }} /> // Gece modu ikonu
          )}
          <Switch
            checked={darkMode}
            onChange={() => setDarkMode(!darkMode)}
            inputProps={{ 'aria-label': 'Tema Değiştirici' }}
          />
        </Box>

        {/* Grafik */}
        <Box sx={{ width: '80%', maxWidth: 800, mb: 4 }}>
          <Bar data={getDowntimeChartData()} options={{ responsive: true }} />
        </Box>

        {/* Tablo */}
        <TableContainer component={Paper} sx={{ width: '80%', maxWidth: 800 }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Site Adı</TableCell>
                <TableCell>URL</TableCell>
                <TableCell>Durum</TableCell>
                <TableCell>Kesinti Süresi</TableCell>
                <TableCell>İlk Kesinti Zamanı</TableCell>
                <TableCell>Düzenle</TableCell>
                <TableCell>Sil</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {sites.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((site) => (
                <TableRow
                  key={site.id}
                  sx={{
                    backgroundColor: calculateBackgroundColor(site.downtime),
                  }}
                >
                  <TableCell>{site.name}</TableCell>
                  <TableCell>
                    {editingSite === site.id ? (
                      <TextField
                        defaultValue={site.url}
                        onChange={(e) => setNewSiteUrl(e.target.value)}
                        size="small"
                      />
                    ) : (
                      site.url
                    )}
                  </TableCell>
                  <TableCell>{site.status === 'up' ? 'Çalışıyor' : 'Kesinti'}</TableCell>
                  <TableCell>{site.downtime}</TableCell>
                  <TableCell>{site.firstDownTime ? moment(site.firstDownTime).format('YYYY-MM-DD HH:mm:ss') : 'Yok'}</TableCell>
                  <TableCell>
                    <IconButton onClick={() => handleUpdateWebsite(site.id, newSiteUrl)}>
                      Düzenle
                    </IconButton>
                  </TableCell>
                  <TableCell>
                    <IconButton onClick={() => handleDeleteWebsite(site.id)} color="error">
                      Sil
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <TablePagination
            component="div"
            count={sites.length}
            page={page}
            onPageChange={handleChangePage}
            rowsPerPage={rowsPerPage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </TableContainer>

        {/* Yeni Site Ekle */}
        <Box sx={{ mt: 3 }}>
          <TextField
            label="Site Adı"
            variant="outlined"
            fullWidth
            value={newSiteName}
            onChange={(e) => setNewSiteName(e.target.value)}
            sx={{ mb: 2 }}
          />
          <TextField
            label="Site URL"
            variant="outlined"
            fullWidth
            value={newSiteUrl}
            onChange={(e) => setNewSiteUrl(e.target.value)}
            sx={{ mb: 2 }}
          />
          <Button
            variant="contained"
            onClick={handleAddWebsite}
            sx={{ width: '100%', backgroundColor: darkMode ? '#81c784' : lightGreen }}
          >
            Site Ekle
          </Button>
        </Box>
      </Box>
    </ThemeProvider>
  );
}

export default App;
