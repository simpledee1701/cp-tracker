import { subMonths, startOfDay, format } from 'date-fns';
import Chart from 'react-apexcharts';

const RatingChart = ({ ratingHistory }) => {
  // Filter data for last 6 months
  const sixMonthsAgo = startOfDay(subMonths(new Date(), 6)).getTime();
  const filteredData = ratingHistory
    .filter(contest => contest.ratingUpdateTimeSeconds * 1000 >= sixMonthsAgo)
    .map(contest => ({
      x: contest.ratingUpdateTimeSeconds * 1000, // Convert to milliseconds
      y: contest.newRating,
      rank: contest.rank
    }));

  const options = {
    chart: {
      type: 'area',
      height: 400,
      foreColor: '#fff',
      toolbar: { show: true },
      zoom: { enabled: false }
    },
    colors: ['#FF6B6B'],
    dataLabels: { enabled: false },
    stroke: { curve: 'smooth', width: 2 },
    fill: {
      type: 'gradient',
      gradient: {
        shadeIntensity: 1,
        opacityFrom: 0.7,
        opacityTo: 0.3,
        stops: [0, 100]
      }
    },
    xaxis: {
      type: 'datetime',
      min: sixMonthsAgo,
      max: new Date().getTime(),
      labels: {
        style: { colors: '#fff' },
        format: 'MMM dd',
        rotate: -45
      },
      axisBorder: { show: false }
    },
    yaxis: {
      labels: { style: { colors: '#fff' } },
      forceNiceScale: true
    },
    annotations: {
      points: filteredData.map((contest, idx) => ({
        x: contest.x,
        y: contest.y,
        marker: {
          size: 6,
          fillColor: '#fff',
          strokeColor: '#FF6B6B',
          radius: 2
        },
        label: {
          text: `#${contest.rank}`,
          style: {
            color: '#fff',
            background: '#FF6B6B',
            fontSize: '12px',
            padding: { left: 5, right: 5, top: 2, bottom: 2 }
          }
        }
      }))
    },
    tooltip: {
      theme: 'dark',
      x: {
        formatter: (val) => format(new Date(val), 'MMM dd, yyyy HH:mm')
      }
    },
    grid: {
      borderColor: 'rgba(255,255,255,0.1)',
      strokeDashArray: 4
    }
  };

  const series = [{
    name: 'Rating',
    data: filteredData
  }];

  return (
    <div className="glass p-6 rounded-2xl">
      <h3 className="text-xl font-semibold mb-4 text-purple-400">
        Rating History (Last 6 Months)
      </h3>
      <Chart 
        options={options} 
        series={series} 
        type="area" 
        height={400} 
      />
    </div>
  );
};

export default RatingChart;