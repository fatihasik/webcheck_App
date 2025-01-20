import { Box } from '@mui/material';
import { Bar, Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, BarElement, Title, Tooltip, Legend, LinearScale, ArcElement } from 'chart.js';
import { lightGreen } from '../theme';


ChartJS.register(CategoryScale, BarElement, Title, Tooltip, Legend, LinearScale, ArcElement);

const ChartDisplay = ({ sites }) => {
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

  return (
    <Box display="flex" justifyContent="space-between" mb={4}>
      <Box sx={{ width: '48%', height: 300 }}>
        <Bar data={getDowntimeChartData()} options={{ responsive: true }} />
      </Box>
      <Box sx={{ width: '48%', height: 300 }}>
        <Doughnut data={getDoughnutChartData()} options={{ maintainAspectRatio: false }} />
      </Box>
    </Box>
  );
};

export default ChartDisplay;
