import type { ComponentType } from "react";
import * as Icons from "../icons";
import type { PropsType as IconProps } from "../icons";

type NavSubItem = {
  title: string;
  url: string;
};

type NavItem = {
  title: string;
  url?: string;
  icon: ComponentType<IconProps>;
  items: NavSubItem[];
};

type NavSection = {
  label: string;
  items: NavItem[];
};

export const NAV_DATA: NavSection[] = [
  {
    label: "RISET PUBLIK",
    items: [
      {
        title: "Ikhtisar",
        url: "/dashboard",
        icon: Icons.HomeIcon,
        items: [],
      },
      {
        title: "Kualitas Data",
        url: "/dashboard/data-quality",
        icon: Icons.Table,
        items: [],
      },
      {
        title: "Validasi Temporal",
        url: "/dashboard/validation",
        icon: Icons.Calendar,
        items: [],
      },
      {
        title: "Ablation USD/IDR",
        url: "/dashboard/usd-idr-ablation",
        icon: Icons.PieChart,
        items: [],
      },
      {
        title: "Evaluasi Test Akhir",
        url: "/dashboard/test-evaluation",
        icon: Icons.Table,
        items: [],
      },
      {
        title: "Segmen Hasil",
        url: "/dashboard/segments",
        icon: Icons.FourCircle,
        items: [],
      },
      {
        title: "Sumatera Barat",
        url: "/dashboard/sumatera-barat",
        icon: Icons.HomeIcon,
        items: [],
      },
      {
        title: "Explainability",
        url: "/dashboard/explainability",
        icon: Icons.PieChart,
        items: [],
      },
      {
        title: "Metodologi",
        url: "/dashboard/methodology",
        icon: Icons.Alphabet,
        items: [],
      },
      {
        title: "Downloads",
        url: "/dashboard/downloads",
        icon: Icons.Authentication,
        items: [],
      },
    ],
  },
  {
    label: "ADMIN",
    items: [
      {
        title: "Status Import",
        url: "/admin",
        icon: Icons.User,
        items: [],
      },
    ],
  },
];
