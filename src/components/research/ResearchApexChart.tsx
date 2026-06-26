"use client";

import type { ApexOptions } from "apexcharts";
import dynamic from "next/dynamic";

const Chart = dynamic(() => import("react-apexcharts"), {
  ssr: false,
});

type ResearchApexChartProps = {
  type: "bar" | "line" | "area" | "donut";
  series: ApexOptions["series"];
  categories?: string[];
  height?: number;
  horizontal?: boolean;
  colors?: string[];
  yAxisTitle?: string;
};

export function ResearchApexChart({
  type,
  series,
  categories,
  height = 320,
  horizontal = false,
  colors = ["#2f6f45", "#2468a8", "#d1453b", "#6f4aa8", "#6b7280"],
  yAxisTitle,
}: ResearchApexChartProps) {
  const safeCategories = categories ?? [];
  const options: ApexOptions = {
    chart: {
      type,
      toolbar: { show: false },
      fontFamily: "inherit",
      animations: { enabled: true },
      foreColor: "#4b5563",
    },
    colors,
    dataLabels: { enabled: false },
    grid: {
      borderColor: "rgba(23, 32, 51, 0.14)",
      strokeDashArray: 4,
    },
    legend: {
      position: "top",
      horizontalAlign: "left",
      labels: { colors: "#4b5563" },
    },
    ...(type === "bar"
      ? {
          plotOptions: {
            bar: {
              borderRadius: 3,
              horizontal,
              columnWidth: "48%",
            },
          },
        }
      : {}),
    stroke: {
      curve: "smooth",
      width: type === "bar" || type === "donut" ? 0 : 3,
    },
    tooltip: {
      shared: type !== "donut",
      intersect: false,
      y: {
        formatter: (value) =>
          new Intl.NumberFormat("id-ID", {
            maximumFractionDigits: 3,
          }).format(value),
      },
    },
    ...(type === "donut"
      ? {
          labels: safeCategories,
        }
      : {
          xaxis: {
            categories: safeCategories,
            labels: {
              rotate: -25,
              trim: true,
              style: { colors: "#5b6472" },
            },
            axisBorder: { show: false },
            axisTicks: { show: false },
          },
          yaxis: {
            ...(yAxisTitle ? { title: { text: yAxisTitle } } : {}),
            labels: {
              style: { colors: "#5b6472" },
              formatter: (value) =>
                new Intl.NumberFormat("id-ID", {
                  maximumFractionDigits: 2,
                }).format(value),
            },
          },
        }),
    responsive: [
      {
        breakpoint: 768,
        options: {
          chart: { height: Math.max(260, height - 40) },
          legend: { position: "bottom" },
          ...(type === "donut" ? {} : { xaxis: { labels: { rotate: -45 } } }),
        },
      },
    ],
  };

  return <Chart options={options} series={series} type={type} height={height} />;
}
