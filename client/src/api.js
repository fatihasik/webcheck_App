// api.js
export const fetchSiteStatus = async () => {
    try {
      const response = await fetch('/api/websites');
      const data = await response.json();
      data.sort((a, b) => (a.status === 'down' && b.status !== 'down') ? -1 : 1);
      return data;
    } catch (error) {
      console.error("Veri çekilemedi:", error);
      return [];
    }
  };
  
  export const addWebsite = async (newSite) => {
    try {
      const response = await fetch('/api/websites', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newSite),
      });
  
      if (response.ok) {
        return await response.json();
      } else {
        console.error('Site eklenemedi:', response.statusText);
        return null;
      }
    } catch (error) {
      console.error('Site ekleme işlemi sırasında hata oluştu:', error);
      return null;
    }
  };
  
  export const updateWebsite = async (id, url) => {
    try {
      const response = await fetch(`/api/websites/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url }),
      });
  
      if (response.ok) {
        return await response.json();
      } else {
        console.error('URL güncellenemedi:', response.statusText);
        return null;
      }
    } catch (error) {
      console.error('URL güncelleme sırasında hata oluştu:', error);
      return null;
    }
  };
  
  export const deleteWebsite = async (id) => {
    try {
      const response = await fetch(`/api/websites/${id}`, {
        method: 'DELETE',
      });
  
      if (response.ok) {
        return true;
      } else {
        console.error('Silme işlemi başarısız:', response.statusText);
        return false;
      }
    } catch (error) {
      console.error('Silme işlemi sırasında hata oluştu:', error);
      return false;
    }
  };
  