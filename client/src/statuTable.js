import React from 'react'
import { useState, useEffect } from 'react';
import moment from 'moment-timezone';

function statuTable() {

    const [sites, setSites] = useState([]);
 const [newSiteName, setNewSiteName] = useState('');
  const [newSiteUrl, setNewSiteUrl] = useState('');
  const [editingSite, setEditingSite] = useState(null);
  const [lastEditedUrl, setLastEditedUrl] = useState('');

  

  const addWebsite = async () => {
    if (!newSiteName || !newSiteUrl) {
      alert('Lütfen site adı ve URL girin.');
      return;
    }

    const newSite = {
      name: newSiteName,
      url: newSiteUrl,
      status: 'up',
      downtime: 0,
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

  const updateWebsiteUrl = async (id, newUrl) => {
    try {
      const response = await fetch(`/api/websites/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url: newUrl }),
      });

      if (response.ok) {
        const updatedSite = await response.json();
        setSites((prevSites) =>
          prevSites.map((site) =>
            site.id === id ? { ...site, url: updatedSite.url } : site
          )
        );
        setEditingSite(null);
      } else {
        console.error('URL güncellenemedi:', response.statusText);
      }
    } catch (error) {
      console.error('URL güncelleme sırasında hata oluştu:', error);
    }
  };

  const sortedSites = [...sites].sort((a, b) => {
    if (a.status === 'down' && b.status !== 'down') return -1;
    if (a.status !== 'down' && b.status === 'down') return 1;
    return 0;
  });

  const formatLastDownTime = (date) => {
    if (!date) return 'Yok';
    return moment(date).tz('Europe/Istanbul').format('YYYY-MM-DD HH:mm:ss');
  };
    useEffect(() => {
        const fetchSiteStatus = async () => {
          try {
            const response = await fetch('/api/websites');
            const data = await response.json();
            setSites(data);
          } catch (error) {
            console.error("Veri çekilemedi:", error);
          }
        };
    
        fetchSiteStatus();
        const interval = setInterval(fetchSiteStatus, 60000);
    
        return () => clearInterval(interval);
      }, []);
    
      const getBackgroundColor = (downtime) => {
        if (downtime >= 5) return 'rgba(183, 28, 28, 0.8)'; // Kırmızı
        if (downtime >= 4) return 'rgba(255, 87, 34, 0.8)'; // Turuncu
        if (downtime >= 3) return 'rgba(255, 235, 59, 0.8)'; // Sarı
        return '#4caf50'; // Yeşil
      };
    
      const getOverallBackgroundColor = () => {
        const downSitesCount = sites.filter((site) => site.status === 'down').length;
    
        if (downSitesCount >= 4) return 'rgba(183, 28, 28, 0.8)'; // Kırmızı
        if (downSitesCount === 3) return 'rgba(255, 87, 34, 0.8)'; // Turuncu
        if (downSitesCount === 2) return 'rgba(230, 210, 40, 0.8)'; // Sarı
        return '#2e7d32'; // Yeşil 
      };
    
      const deleteWebsite = async (id) => {
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

  return (
    <div
      className="App"
      style={{
        background: getOverallBackgroundColor(),
        color: "white",
        minHeight: "100vh",
        padding: "20px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <statuTable/>
      <h1 style={{ fontSize: "2rem", marginBottom: "20px" }} className="textStyle">
        ETKB Siber Güvenlik Operasyon Merkezi
      </h1>
      <h1 style={{ fontSize: "2rem", marginBottom: "20px" }} className="textStyle">
        Website Durum Kontrol
      </h1>
      <table style={{ borderCollapse: "collapse", width: "80%", maxWidth: "800px" }}>
        <thead>
          <tr>
            <th className="textStyle">Site Adı</th>
            <th className="textStyle">URL</th>
            <th className="textStyle">Durum</th>
            <th className="textStyle">Kesinti Süresi (Dakika)</th>
            <th className="textStyle">Son Kesinti Zamanı</th>
            <th className="textStyle">Düzenle</th>
            <th className="textStyle">Sil</th>
          </tr>
        </thead>
        <tbody>
          {sortedSites.map((site) => (
            <tr key={site.id} style={{ textAlign: "center" }}>
              <td style={{ background: getBackgroundColor(site.downtime), border: "1px solid #ddd", padding: "12px" }}>{site.name}</td>
              <td style={{ background: getBackgroundColor(site.downtime), border: "1px solid #ddd", padding: "12px" }}>
                {editingSite === site.id ? (
                  <input
                    type="text"
                    value={newSiteUrl}
                    onChange={(e) => setNewSiteUrl(e.target.value)}
                    style={{ border: '1px solid #ddd', padding: '8px', flex: 2 }}
                  />
                ) : (
                  site.url
                )}
              </td>
              <td
                style={{
                  background: site.status === 'up' ? '#4caf50' : '#d32f2f',
                  color: "white",
                  fontWeight: "bold",
                  border: "1px solid #ddd",
                  padding: "12px",
                }}
              >
                {site.status === 'up' ? 'Çalışıyor' : 'Kesinti'}
              </td>
              <td
                style={{
                  background: getBackgroundColor(site.downtime),
                  fontWeight: 'bold',
                  color: "white",
                  border: "1px solid #ddd",
                  padding: "12px",
                }}
              >
                {site.downtime}
              </td>
              <td
                style={{
                  background: site.status === 'down' ? '#d32f2f' : '#4caf50',
                  color: "white",
                  border: "1px solid #ddd",
                  padding: "12px",
                }}
              >
                {formatLastDownTime(site.lastDownTime)}
              </td>
              <td>
                {editingSite === site.id ? (
                  <button
                    style={{
                      background: '#4caf50',
                      padding: "10px",
                      color: "white",
                      cursor: "pointer",
                    }}
                    onClick={() => {
                      updateWebsiteUrl(site.id, newSiteUrl);
                    }}
                  >
                    Kaydet
                  </button>
                ) : (
                  <button
                    style={{
                      background: '#ff9800',
                      padding: "10px",
                      color: "white",
                      cursor: "pointer",
                    }}
                    onClick={() => {
                      setEditingSite(site.id);
                      setLastEditedUrl(site.url);
                    }}
                  >
                    Düzenle
                  </button>
                )}
              </td>
              <td>
                <button
                  style={{
                    background: '#f44336',
                    padding: "10px",
                    color: "white",
                    cursor: "pointer",
                  }}
                  onClick={() => deleteWebsite(site.id)}
                >
                  Sil
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div style={{ marginTop: "20px" }}>
        <input
          type="text"
          placeholder="Site Adı"
          value={newSiteName}
          onChange={(e) => setNewSiteName(e.target.value)}
          style={{ padding: "10px", marginRight: "10px" }}
        />
        <input
          type="text"
          placeholder="Site URL"
          value={newSiteUrl}
          onChange={(e) => setNewSiteUrl(e.target.value)}
          style={{ padding: "10px", marginRight: "10px" }}
        />
        <button
          onClick={addWebsite}
          style={{
            background: "#4caf50",
            padding: "10px",
            color: "white",
            cursor: "pointer",
          }}
        >
          Site Ekle
        </button>
      </div>
    </div>
  )
}

export default statuTable