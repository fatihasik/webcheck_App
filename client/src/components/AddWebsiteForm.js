import React from 'react';
import { Button, TextField, Box } from '@mui/material';

const AddWebsiteForm = ({
  newSiteName,
  newSiteUrl,
  setNewSiteName,
  setNewSiteUrl,
  handleAddWebsite
}) => {
  return (
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
  );
};

export default AddWebsiteForm;
