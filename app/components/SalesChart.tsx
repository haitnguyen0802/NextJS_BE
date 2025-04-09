import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Filler,
  Legend,
  TooltipItem,
  ChartData,
  ScriptableContext,
} from "chart.js";
import styles from './SalesChart.module.scss'; // Import SCSS module

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Filler,
  Legend
);

const options = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      display: false,
    },
    tooltip: {
      mode: "index" as const,
      intersect: false,
      backgroundColor: "#1E2A3B",
      titleColor: "#fff",
      bodyColor: "#94A3B8",
      borderColor: "#334155",
      borderWidth: 1,
      padding: 12,
      bodySpacing: 4,
      titleSpacing: 4,
      displayColors: false,
      callbacks: {
        label: function(context: TooltipItem<"line">) {
           let label = context.dataset.label || '';
           if (label) {
               label += ': ';
           }
           if (context.parsed.y !== null) {
               label += context.parsed.y;
           }
           return label;
        }
      },
      yAlign: 'bottom' as const,
      xAlign: 'center' as const,
      caretPadding: 10,
      caretSize: 5,
      cornerRadius: 4,
      bodyFont: {
        size: 12,
      },
      titleFont: {
        size: 12,
      }
    },
  },
  interaction: {
    mode: "nearest" as const,
    axis: "x" as const,
    intersect: false,
  },
  scales: {
    x: {
      grid: {
        display: false,
      },
      border: {
        display: false,
      },
      ticks: {
        color: "#94A3B8",
        font: {
          size: 12,
        },
      },
    },
    y: {
      min: 0,
      max: 100,
      grid: {
        color: "#334155", // Grid line color
        borderDash: [5, 5], // Make grid lines dashed
      },
      border: {
        display: false,
      },
      ticks: {
        color: "#94A3B8",
        font: {
          size: 12,
        },
        stepSize: 20, // Set Y-axis step to 20%
        callback: function(value: string | number) { // Use string | number for value type
          return value + "%";
        },
      },
    },
  },
};

const labels = ["5k", "10k", "15k", "20k", "25k", "30k", "35k", "40k", "45k", "50k", "55k", "60k"];

const data: ChartData<"line"> = {
  labels,
  datasets: [
    {
      fill: true,
      label: "Sales", // Used in tooltip
      data: [20, 40, 30, 35, 30, 45, 35, 25, 35, 40, 30, 35], // Sample data, adjust as needed
      borderColor: "#3B82F6",
      backgroundColor: (context: ScriptableContext<"line">) => { // Gradient fill
        const ctx = context.chart.ctx;
        if (!ctx) return undefined;
        const gradient = ctx.createLinearGradient(0, 0, 0, 200);
        gradient.addColorStop(0, "rgba(59, 130, 246, 0.3)"); 
        gradient.addColorStop(1, "rgba(59, 130, 246, 0)");
        return gradient;
      },
      tension: 0.4,
      pointRadius: 0, // Hide points by default
      pointHoverRadius: 5,
      pointHoverBackgroundColor: "#3B82F6",
      pointHoverBorderColor: "#fff",
      pointHoverBorderWidth: 2,
      pointHitRadius: 10, // Increase hit radius for easier hovering
    },
  ],
};

const SalesChart = () => {
  return (
    <div className={styles.salesChart}>
      <Line options={options} data={data} />
    </div>
  );
};

export default SalesChart; 