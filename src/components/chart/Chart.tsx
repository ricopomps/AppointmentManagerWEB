import {
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LineElement,
  LinearScale,
  PointElement,
  Title,
  Tooltip,
  TooltipItem,
} from "chart.js";
import { Bar, Bubble, Doughnut, Line, Pie, Scatter } from "react-chartjs-2";

export interface ChartData {
  labels: string[];
  datasets: Dataset[];
}

interface Dataset {
  label: string;
  data: number[];
  backgroundColor: string[];
  minBarLength?: number;
  borderColor: string;
  borderWidth: number;
}

export enum ChartTypeEnum {
  Bar = "bar",
  Line = "line",
  Pie = "pie",
  Bubble = "bubble",
  Doughnut = "doughnut",
  PolarArea = "polarArea",
  Radar = "radar",
  Scatter = "scatter",
}

type ChartType =
  | "bar"
  | "line"
  | "pie"
  | "bubble"
  | "doughnut"
  | "polarArea"
  | "radar"
  | "scatter";

interface ChartProps {
  data: ChartData;
  chartType: ChartType;
  currency?: boolean;
  showLabelInTitle?: boolean;
  showLabelInValue?: boolean;
}

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const Chart = ({
  data,
  chartType,
  currency,
  showLabelInTitle,
  showLabelInValue = chartType === "line",
}: ChartProps) => {
  const options = {
    plugins: {
      tooltip: {
        callbacks: {
          title: (tooltipItem: TooltipItem<typeof chartType>[]) => {
            return showLabelInTitle
              ? tooltipItem[0].dataset.label
              : tooltipItem[0].label;
          },
          label: (tooltipItem: TooltipItem<typeof chartType>) => {
            const datasetLabel = showLabelInValue
              ? `${data.datasets[tooltipItem.datasetIndex].label}: `
              : "";

            const labelValue = currency
              ? "R$" +
                parseFloat(
                  tooltipItem.formattedValue.replaceAll(",", "")
                ).toFixed(2)
              : `${tooltipItem.formattedValue}`;

            return datasetLabel + labelValue;
          },
        },
      },
    },
    scales: {
      x: {
        type: "category" as const,
        labels: data.labels,
      },
      y: {
        beginAtZero: true,
      },
    },
  };

  if (chartType === "bar") {
    return <Bar data={data} options={options} />;
  } else if (chartType === "line") {
    return <Line data={data} options={options} />;
  } else if (chartType === "pie") {
    return <Pie data={data} options={options} />;
  } else if (chartType === "bubble") {
    return <Bubble data={data} options={options} />;
  } else if (chartType === "doughnut") {
    return <Doughnut data={data} options={options} />;
  } else if (chartType === "polarArea") {
    return <div>Unsupported chart type</div>;
    // return <PolarArea data={data} options={options} />;
  } else if (chartType === "radar") {
    return <div>Unsupported chart type</div>;
    // return <Radar data={data} options={options} />;
  } else if (chartType === "scatter") {
    return <Scatter data={data} options={options} />;
  } else {
    return <div>Unsupported chart type</div>;
  }
};

export default Chart;
