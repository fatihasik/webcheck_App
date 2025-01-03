import React from 'react';

function AddWebsiteForm({ newSiteName, newSiteUrl, setNewSiteName, setNewSiteUrl, handleAddWebsite }) {
  return (
    <div style={{ marginTop: '20px' }}>
      <input
        type="text"
        placeholder="Site Adı"
        value={newSiteName}
        onChange={(e) => setNewSiteName(e.target.value)}
      />
      <input
        type="text"
        placeholder="Site URL"
        value={newSiteUrl}
        onChange={(e) => setNewSiteUrl(e.target.value)}
      />
      <button onClick={handleAddWebsite}>Site Ekle</button>
    </div>
  );
}

export default AddWebsiteForm;
