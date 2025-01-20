import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  Paper,
  TextField,
  Button
} from '@mui/material';

const getColor = (site, darkMode) => {
  if (site.status === 'down') {
    const downTimeMinutes = (Date.now() - new Date(site.firstDownTime)) / 60000;
    if (downTimeMinutes < 30) return '#ff3333'; 
    if (downTimeMinutes < 60) return '#ff9999'; 
    if (downTimeMinutes < 120) return '#ff6666'; 
    return '#ff3333'; 
  }
  return 'inherit'; 
};

const SiteTable = ({
  sites,
  page,
  rowsPerPage,
  setPage,
  setRowsPerPage,
  handleEditWebsite,
  handleSaveWebsite,
  handleDeleteWebsite,
  editingSite,
  editingUrl,
  setEditingUrl,
  darkMode
}) => {
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const rowStyle = (site) => ({
    backgroundColor: getColor(site, darkMode),
    color: darkMode ? '#ffffff' : '#000000'
  });

  return (
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
  );
};

export default SiteTable;
