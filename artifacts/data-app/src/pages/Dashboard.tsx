import { useState, useCallback } from "react";
import { useQueryClient } from "@tanstack/react-query";
import {
  useGetAiAdoption, getGetAiAdoptionQueryKey,
  useGetTransportModes, getGetTransportModesQueryKey,
  useGetInfrastructure, getGetInfrastructureQueryKey,
  useGetSupplyChainNetworks, getGetSupplyChainNetworksQueryKey,
  useGetMarketAdvantages, getGetMarketAdvantagesQueryKey,
  useGetCompanies, getGetCompaniesQueryKey,
  useGetStatesAdoption, getGetStatesAdoptionQueryKey,
  useGetGlobalComparison, getGetGlobalComparisonQueryKey,
} from "@workspace/api-client-react";
import {
  AreaChart, Area, BarChart, Bar, LineChart, Line, RadarChart, Radar,
  PolarGrid, PolarAngleAxis, PolarRadiusAxis, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
} from "recharts";
import { CSVLink } from "react-csv";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { KPICard } from "@/components/shared/KPICard";
import { DashboardControls } from "@/components/shared/DashboardControls";
import { IndiaNetworkMap } from "@/components/shared/IndiaNetworkMap";
import type { MapNode, MapEdge, MapLegendItem } from "@/components/shared/IndiaNetworkMap";
import {
  Download, CheckCircle, Clock, Ship, Plane, Navigation, Package, Factory,
  Brain, Truck, Network, TrendingUp, Building2, Globe, MapPin, Users,
  Newspaper, Cpu, Activity, Zap,
} from "lucide-react";

const INDIA_COLORS = {
  saffron: "#FF9933",
  green: "#138808",
  navy: "#000080",
  blue: "#0079F2",
  purple: "#795EFF",
  teal: "#1B998B",
  red: "#E84855",
  gold: "#F9C74F",
};

const CHART_COLORS = [
  INDIA_COLORS.navy, INDIA_COLORS.saffron, INDIA_COLORS.green,
  INDIA_COLORS.blue, INDIA_COLORS.purple, INDIA_COLORS.teal,
  INDIA_COLORS.red, INDIA_COLORS.gold,
];

const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-card border border-border rounded-lg px-3 py-2 text-sm shadow-lg">
      {label && <p className="font-semibold mb-1 text-foreground">{label}</p>}
      {payload.map((p: any, i: number) => (
        <p key={i} style={{ color: p.color ?? p.fill }}>
          {p.name}: <span className="font-bold">{typeof p.value === "number" ? p.value.toLocaleString() : p.value}</span>
        </p>
      ))}
    </div>
  );
};

function SectionSkeleton() {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Card key={i}><CardContent className="p-6"><Skeleton className="h-4 w-24 mb-2" /><Skeleton className="h-8 w-32" /></CardContent></Card>
        ))}
      </div>
      <Card><CardContent className="p-6"><Skeleton className="h-[300px] w-full" /></CardContent></Card>
    </div>
  );
}

function CsvBtn({ data, filename }: { data: any[]; filename: string }) {
  if (!data?.length) return null;
  return (
    <CSVLink data={data} filename={filename}>
      <button className="flex items-center gap-1 px-2 py-1 rounded text-xs border border-border hover:bg-muted transition-colors text-muted-foreground">
        <Download className="w-3 h-3" /> CSV
      </button>
    </CSVLink>
  );
}

function StatusBadge({ status }: { status: string }) {
  const isLive = status === "Live";
  return (
    <Badge variant={isLive ? "default" : "secondary"}
      className={isLive ? "bg-green-600 text-white" : "bg-amber-500 text-white"}>
      {isLive ? <CheckCircle className="w-3 h-3 mr-1" /> : <Clock className="w-3 h-3 mr-1" />}
      {status}
    </Badge>
  );
}

// ─────────────────────────────────────────────
// PORT MAP DATA  (viewBox 0 0 500 600)
// ─────────────────────────────────────────────
const PORT_NODES: MapNode[] = [
  { id: "jnpt",    label: "JNPT, Maharashtra",         shortLabel: "JNPT",    x: 94,  y: 370, color: INDIA_COLORS.navy, data: { "Cargo/Year": "79.5 MT", "Type": "Container", "AI Enabled": "Yes", "Corridors": "DMIC, W-DFC" } },
  { id: "mundra",  label: "Mundra Port, Gujarat",       shortLabel: "Mundra",  x: 46,  y: 294, color: INDIA_COLORS.navy, data: { "Cargo/Year": "161 MT",  "Type": "Multi-cargo", "AI Enabled": "Yes", "Corridors": "W-DFC, Ahmedabad, Delhi" } },
  { id: "paradip", label: "Paradip Port, Odisha",       shortLabel: "Paradip", x: 302, y: 343, color: INDIA_COLORS.navy, data: { "Cargo/Year": "130 MT",  "Type": "Bulk",         "AI Enabled": "No",  "Corridors": "E-DFC, Visakhapatnam" } },
  { id: "vizag",   label: "Visakhapatnam Port, AP",     shortLabel: "Vizag",   x: 252, y: 393, color: INDIA_COLORS.navy, data: { "Cargo/Year": "76 MT",   "Type": "Multi-cargo",  "AI Enabled": "Yes", "Corridors": "E-DFC, Chennai" } },
  { id: "chennai", label: "Chennai Port, Tamil Nadu",   shortLabel: "Chennai", x: 207, y: 482, color: INDIA_COLORS.navy, data: { "Cargo/Year": "72 MT",   "Type": "Container+Bulk","AI Enabled": "Yes", "Corridors": "DFC, Bengaluru" } },
  { id: "kandla",  label: "Kandla Port, Gujarat",       shortLabel: "Kandla",  x: 53,  y: 290, color: INDIA_COLORS.navy, data: { "Cargo/Year": "140 MT",  "Type": "Multi-cargo",  "AI Enabled": "No",  "Corridors": "W-DFC, Rajkot" } },
  { id: "haldia",  label: "Haldia Port, West Bengal",   shortLabel: "Haldia",  x: 325, y: 310, color: INDIA_COLORS.navy, data: { "Cargo/Year": "62 MT",   "Type": "Bulk",         "AI Enabled": "No",  "Corridors": "E-DFC, Kolkata" } },
  { id: "kochi",   label: "Kochi Port, Kerala",         shortLabel: "Kochi",   x: 146, y: 543, color: INDIA_COLORS.navy, data: { "Cargo/Year": "28 MT",   "Type": "Container",    "AI Enabled": "Yes", "Corridors": "Coimbatore, Bengaluru" } },
];

const PORT_EDGES: MapEdge[] = [
  { from: "kandla",  to: "mundra",  type: "sea", data: { "Route Type": "Maritime", "Distance": "90 km",     "Transit": "8 hours",   "Fuel Cost": "$280/container", "Total Cost": "$800/container" } },
  { from: "mundra",  to: "jnpt",   type: "sea", data: { "Route Type": "Maritime", "Distance": "560 km",    "Transit": "1.8 days",  "Fuel Cost": "$410/container", "Total Cost": "$1,950/container" } },
  { from: "jnpt",    to: "kochi",  type: "sea", data: { "Route Type": "Maritime", "Distance": "1,200 km",  "Transit": "3.5 days",  "Fuel Cost": "$680/container", "Total Cost": "$3,000/container" } },
  { from: "kochi",   to: "chennai",type: "sea", data: { "Route Type": "Maritime", "Distance": "780 km",    "Transit": "2.5 days",  "Fuel Cost": "$520/container", "Total Cost": "$2,400/container" } },
  { from: "chennai", to: "vizag",  type: "sea", data: { "Route Type": "Maritime", "Distance": "580 km",    "Transit": "2 days",    "Fuel Cost": "$450/container", "Total Cost": "$2,100/container" } },
  { from: "vizag",   to: "paradip",type: "sea", data: { "Route Type": "Maritime", "Distance": "400 km",    "Transit": "1.5 days",  "Fuel Cost": "$320/container", "Total Cost": "$1,600/container" } },
  { from: "paradip", to: "haldia", type: "sea", data: { "Route Type": "Maritime", "Distance": "220 km",    "Transit": "18 hours",  "Fuel Cost": "$190/container", "Total Cost": "$980/container" } },
  { from: "jnpt",    to: "chennai",type: "sea", dashed: true, data: { "Route Type": "Long-haul Maritime", "Distance": "1,390 km", "Transit": "4 days", "Fuel Cost": "$760/container", "Total Cost": "$3,400/container" } },
];

const PORT_LEGEND: MapLegendItem[] = [
  { color: "#0ea5e9", label: "Maritime Route" },
  { color: "#0ea5e9", label: "Long-haul Route", dashed: true },
];

// ─────────────────────────────────────────────
// AIRPORT MAP DATA
// ─────────────────────────────────────────────
const AIRPORT_NODES: MapNode[] = [
  { id: "del", label: "Delhi — Indira Gandhi Intl",    shortLabel: "DEL", x: 160, y: 182, color: INDIA_COLORS.purple, data: { "Cargo/Year": "1.08 MT", "AI": "Yes", "Corridors": "W-DFC, Ludhiana" } },
  { id: "bom", label: "Mumbai — CSMI",                 shortLabel: "BOM", x: 93,  y: 366, color: INDIA_COLORS.purple, data: { "Cargo/Year": "0.88 MT", "AI": "Yes", "Corridors": "JNPT, Pune, Nashik" } },
  { id: "blr", label: "Bengaluru — Kempegowda",        shortLabel: "BLR", x: 166, y: 485, color: INDIA_COLORS.purple, data: { "Cargo/Year": "0.54 MT", "AI": "Yes", "Corridors": "Chennai, Hyderabad, KIADB" } },
  { id: "hyd", label: "Hyderabad — Rajiv Gandhi",      shortLabel: "HYD", x: 179, y: 399, color: INDIA_COLORS.purple, data: { "Cargo/Year": "0.42 MT", "AI": "Yes", "Corridors": "Visakhapatnam, Chennai" } },
  { id: "maa", label: "Chennai International",          shortLabel: "MAA", x: 207, y: 482, color: INDIA_COLORS.purple, data: { "Cargo/Year": "0.38 MT", "AI": "No",  "Corridors": "Chennai Port, Sriperumbudur" } },
  { id: "ccu", label: "Kolkata — NSCBI",               shortLabel: "CCU", x: 330, y: 298, color: INDIA_COLORS.purple, data: { "Cargo/Year": "0.22 MT", "AI": "No",  "Corridors": "Haldia Port, E-DFC" } },
  { id: "amd", label: "Ahmedabad — SVPI",              shortLabel: "AMD", x: 90,  y: 290, color: INDIA_COLORS.purple, data: { "Cargo/Year": "0.18 MT", "AI": "Yes", "Corridors": "Mundra Port, Surat" } },
];

const AIRPORT_EDGES: MapEdge[] = [
  { from: "del", to: "bom", type: "air", data: { "Route": "Air Cargo", "Distance": "1,150 km", "Transit": "2 hours",   "Rate": "$3.8/kg", "Total Cost": "$5.8/kg" } },
  { from: "del", to: "ccu", type: "air", data: { "Route": "Air Cargo", "Distance": "1,300 km", "Transit": "2.5 hours", "Rate": "$4.0/kg", "Total Cost": "$6.2/kg" } },
  { from: "bom", to: "blr", type: "air", data: { "Route": "Air Cargo", "Distance": "840 km",   "Transit": "1.5 hours", "Rate": "$3.2/kg", "Total Cost": "$5.1/kg" } },
  { from: "blr", to: "hyd", type: "air", data: { "Route": "Air Cargo", "Distance": "560 km",   "Transit": "1 hour",    "Rate": "$2.8/kg", "Total Cost": "$4.2/kg" } },
  { from: "blr", to: "maa", type: "air", data: { "Route": "Air Cargo", "Distance": "290 km",   "Transit": "45 min",    "Rate": "$2.4/kg", "Total Cost": "$3.8/kg" } },
  { from: "hyd", to: "maa", type: "air", data: { "Route": "Air Cargo", "Distance": "520 km",   "Transit": "1 hour",    "Rate": "$2.6/kg", "Total Cost": "$4.0/kg" } },
  { from: "del", to: "amd", type: "air", data: { "Route": "Air Cargo", "Distance": "870 km",   "Transit": "1.5 hours", "Rate": "$3.2/kg", "Total Cost": "$4.8/kg" } },
  { from: "ccu", to: "hyd", type: "air", dashed: true, data: { "Route": "Air Cargo", "Distance": "1,200 km", "Transit": "2 hours", "Rate": "$3.8/kg", "Total Cost": "$5.5/kg" } },
];

const AIRPORT_LEGEND: MapLegendItem[] = [
  { color: "#8b5cf6", label: "Air Cargo Route" },
  { color: "#8b5cf6", label: "Long-haul Air", dashed: true },
];

// ─────────────────────────────────────────────
// EXPRESSWAY MAP DATA
// ─────────────────────────────────────────────
const EXPRESSWAY_NODES: MapNode[] = [
  { id: "delhi",      label: "Delhi",      shortLabel: "Delhi",    x: 160, y: 182, color: "#6b7280" },
  { id: "jaipur",     label: "Jaipur",     shortLabel: "Jaipur",   x: 138, y: 215, color: "#6b7280" },
  { id: "ahmedabad",  label: "Ahmedabad",  shortLabel: "Amdvd",    x: 90,  y: 290, color: "#6b7280" },
  { id: "mumbai",     label: "Mumbai",     shortLabel: "Mumbai",   x: 93,  y: 366, color: "#6b7280" },
  { id: "agra",       label: "Agra",       shortLabel: "Agra",     x: 172, y: 209, color: "#6b7280" },
  { id: "lucknow",    label: "Lucknow",    shortLabel: "Lucknow",  x: 216, y: 217, color: "#6b7280" },
  { id: "ghazipur",   label: "Ghazipur",   shortLabel: "Ghzpr",    x: 257, y: 240, color: "#6b7280" },
  { id: "pune",       label: "Pune",       shortLabel: "Pune",     x: 110, y: 377, color: "#6b7280" },
  { id: "meerut",     label: "Meerut",     shortLabel: "Meerut",   x: 167, y: 176, color: "#6b7280" },
  { id: "bengaluru",  label: "Bengaluru",  shortLabel: "Blr",      x: 166, y: 485, color: "#6b7280" },
  { id: "chennai",    label: "Chennai",    shortLabel: "Chennai",  x: 207, y: 482, color: "#6b7280" },
  { id: "dholera",    label: "Dholera",    shortLabel: "Dholera",  x: 84,  y: 306, color: "#6b7280" },
  { id: "prayagraj",  label: "Prayagraj",  shortLabel: "Prygrj",   x: 229, y: 244, color: "#6b7280" },
];

const EXPRESSWAY_EDGES: MapEdge[] = [
  { from: "delhi",     to: "jaipur",    color: "#f59e0b", dashed: true,  width: 2.5, data: { "Expressway": "Delhi-Mumbai (PM Gati Shakti)", "Length": "1,350 km", "Status": "Under Construction", "States": "6" } },
  { from: "jaipur",    to: "ahmedabad", color: "#f59e0b", dashed: true,  width: 2.5, data: { "Expressway": "Delhi-Mumbai (PM Gati Shakti)", "Length": "1,350 km", "Status": "Under Construction", "States": "6" } },
  { from: "ahmedabad", to: "mumbai",   color: "#f59e0b", dashed: true,  width: 2.5, data: { "Expressway": "Delhi-Mumbai (PM Gati Shakti)", "Length": "1,350 km", "Status": "Under Construction", "States": "6" } },
  { from: "delhi",     to: "agra",     color: "#138808", width: 2.5, data: { "Expressway": "Yamuna Expressway", "Length": "165 km", "Status": "Live", "States": "2" } },
  { from: "lucknow",   to: "ghazipur", color: "#138808", width: 2.5, data: { "Expressway": "Purvanchal Expressway", "Length": "341 km", "Status": "Live", "States": "1 (UP)" } },
  { from: "mumbai",    to: "pune",     color: "#138808", width: 2.5, data: { "Expressway": "Mumbai-Pune Expressway", "Length": "95 km", "Status": "Live", "States": "2" } },
  { from: "delhi",     to: "meerut",   color: "#138808", width: 2.5, data: { "Expressway": "Delhi-Meerut RRTS", "Length": "82 km", "Status": "Live", "States": "2" } },
  { from: "bengaluru", to: "chennai",  color: "#f59e0b", dashed: true,  width: 2.5, data: { "Expressway": "Bengaluru-Chennai Expressway", "Length": "262 km", "Status": "Under Construction", "States": "2" } },
  { from: "ahmedabad", to: "dholera",  color: "#f59e0b", dashed: true,  width: 2.5, data: { "Expressway": "Ahmedabad-Dholera Expressway", "Length": "110 km", "Status": "Under Construction", "States": "1 (Gujarat)" } },
  { from: "meerut",    to: "prayagraj",color: "#f59e0b", dashed: true,  width: 2.5, data: { "Expressway": "Ganga Expressway", "Length": "594 km", "Status": "Under Construction", "States": "1 (UP)" } },
];

const EXPRESSWAY_LEGEND: MapLegendItem[] = [
  { color: "#138808", label: "Live" },
  { color: "#f59e0b", label: "Under Construction", dashed: true },
];

// ─────────────────────────────────────────────
// FREIGHT HUB MAP DATA
// ─────────────────────────────────────────────
const FREIGHT_NODES: MapNode[] = [
  { id: "ludhiana", label: "Ludhiana — DFC Origin",          shortLabel: "Ludhiana",  x: 138, y: 138, color: "#f59e0b", data: { "Role": "W-DFC & E-DFC Start", "Connects": "Both DFC corridors" } },
  { id: "delhi",    label: "Delhi — CONCOR ICD Tughlakabad", shortLabel: "Delhi ICD", x: 160, y: 182, color: "#f59e0b", data: { "Hub": "CONCOR ICD Tughlakabad", "Capacity": "18 MT/yr", "Status": "Live" } },
  { id: "jaipur",   label: "Jaipur — W-DFC Node",            shortLabel: "Jaipur",    x: 138, y: 215, color: "#f59e0b", data: { "Role": "W-DFC Intermediate Node" } },
  { id: "ahmedabad",label: "Ahmedabad — Sanand Logistics Park",shortLabel: "Sanand",  x: 90,  y: 290, color: "#f59e0b", data: { "Hub": "Sanand Logistics Park", "Capacity": "12 MT/yr", "Status": "Live" } },
  { id: "vadodara", label: "Vadodara — W-DFC Node",           shortLabel: "Vadodara", x: 99,  y: 304, color: "#f59e0b", data: { "Role": "W-DFC Intermediate Node" } },
  { id: "jnpt",     label: "JNPT — W-DFC Sea Terminus",       shortLabel: "JNPT",     x: 94,  y: 370, color: "#f59e0b", data: { "Role": "W-DFC Western Terminus", "Port Cargo": "79.5 MT" } },
  { id: "varanasi", label: "Varanasi — E-DFC Node",           shortLabel: "Varanasi", x: 248, y: 246, color: "#f59e0b", data: { "Role": "E-DFC Intermediate Node" } },
  { id: "kolkata",  label: "Kolkata — E-DFC Sea Terminus",    shortLabel: "Kolkata",  x: 330, y: 298, color: "#f59e0b", data: { "Role": "E-DFC Eastern Terminus", "Connects": "Haldia Port, Bangladesh" } },
  { id: "chennai",  label: "Chennai — Multimodal Logistics Hub",shortLabel: "Chennai MMLP",x: 207,y: 482,color: "#f59e0b",data: { "Hub": "Chennai MMLP", "Capacity": "8 MT/yr", "Status": "Under Construction" } },
  { id: "guwahati", label: "Guwahati — Jogighopa MMLP",        shortLabel: "Jogighopa",x: 380, y: 229, color: "#f59e0b", data: { "Hub": "Jogighopa MMLP", "Capacity": "5 MT/yr", "Status": "Under Construction", "Gateway": "Bangladesh, Bhutan, Myanmar" } },
  { id: "nangal",   label: "Nangal Chaudhry — Delhi MMLP",    shortLabel: "Delhi MMLP",x: 148,y: 195, color: "#f59e0b", data: { "Hub": "Delhi MMLP Nangal Chaudhry", "Capacity": "16 MT/yr", "Status": "Under Construction" } },
];

const FREIGHT_EDGES: MapEdge[] = [
  { from: "ludhiana",  to: "delhi",     type: "dfc", data: { "Corridor": "Western DFC (W-DFC)", "Capacity": "150 MT/yr", "Status": "Live", "Max Speed": "100 km/h" } },
  { from: "delhi",     to: "jaipur",    type: "dfc", data: { "Corridor": "Western DFC", "Status": "Live" } },
  { from: "jaipur",    to: "ahmedabad", type: "dfc", data: { "Corridor": "Western DFC", "Status": "Live" } },
  { from: "ahmedabad", to: "vadodara",  type: "dfc", data: { "Corridor": "Western DFC", "Status": "Live" } },
  { from: "vadodara",  to: "jnpt",      type: "dfc", data: { "Corridor": "Western DFC", "Status": "Live" } },
  { from: "delhi",     to: "varanasi",  type: "dfc", dashed: true, data: { "Corridor": "Eastern DFC (E-DFC)", "Capacity": "120 MT/yr", "Status": "Live", "Max Speed": "100 km/h" } },
  { from: "varanasi",  to: "kolkata",   type: "dfc", dashed: true, data: { "Corridor": "Eastern DFC", "Status": "Live" } },
];

const FREIGHT_LEGEND: MapLegendItem[] = [
  { color: "#f59e0b", label: "Western DFC (W-DFC)" },
  { color: "#f59e0b", label: "Eastern DFC (E-DFC)", dashed: true },
];

// ─────────────────────────────────────────────
// MANUFACTURING HUB MAP DATA
// ─────────────────────────────────────────────
const MANUFACTURING_NODES: MapNode[] = [
  { id: "surat",      label: "Surat — Textiles, Diamonds",        shortLabel: "Surat",      x: 93,  y: 325, color: "#FF6B35", data: { "Hub": "Surat Industrial Corridor", "Sectors": "Textiles, Diamonds, Chemicals", "Export": "USD 38B/yr", "SC Contrib": "14.2%" } },
  { id: "punenashik", label: "Pune-Nashik — Auto, Defence, Electronics", shortLabel: "Pune-Nashik",x: 109,y: 363, color: "#FF6B35", data: { "Hub": "Pune-Nashik Belt", "Sectors": "Automotive, Defence, Electronics", "Export": "USD 29B/yr", "SC Contrib": "11.8%" } },
  { id: "bengaluru",  label: "Bengaluru — Tech, Aerospace, Pharma",shortLabel: "Bengaluru",  x: 166, y: 485, color: "#FF6B35", data: { "Hub": "Tech & Aerospace Corridor", "Sectors": "Electronics, Aerospace, Pharma", "Export": "USD 26B/yr", "SC Contrib": "10.4%" } },
  { id: "sriperumb",  label: "Sriperumbudur-Chennai — Automobiles, Electronics", shortLabel: "Sriperumbdr",x: 195,y: 470,color: "#FF6B35", data: { "Hub": "Sriperumbudur-Chennai Corridor", "Sectors": "Automobiles, Electronics", "Export": "USD 24B/yr", "SC Contrib": "9.6%" } },
  { id: "ludhiana",   label: "Ludhiana — Textiles, Cycles",        shortLabel: "Ludhiana",   x: 138, y: 138, color: "#FF6B35", data: { "Hub": "Ludhiana Industrial Area", "Sectors": "Textiles, Cycles, Auto Parts", "Export": "USD 12B/yr", "SC Contrib": "5.1%" } },
  { id: "manesar",    label: "Manesar-Bawal — Automotive",          shortLabel: "Manesar",    x: 155, y: 195, color: "#FF6B35", data: { "Hub": "Manesar-Bawal DMIC Node", "Sectors": "Automotive, Consumer Durables", "Export": "USD 18B/yr", "SC Contrib": "7.8%" } },
  { id: "hyderabad",  label: "Hyderabad — Pharma City",             shortLabel: "Hyd Pharma", x: 179, y: 399, color: "#FF6B35", data: { "Hub": "Hyderabad Pharma City", "Sectors": "Pharmaceuticals, Biotech", "Export": "USD 21B/yr", "SC Contrib": "8.3%" } },
  { id: "greaternoida",label: "Greater Noida — Electronics Hub",    shortLabel: "Gr. Noida",  x: 168, y: 186, color: "#FF6B35", data: { "Hub": "Greater Noida Electronics Hub", "Sectors": "Mobile Phones, IT Hardware", "Export": "USD 15B/yr", "SC Contrib": "6.2%" } },
  { id: "mundra",     label: "Mundra Port (Gateway)",               shortLabel: "Mundra Pt",  x: 46,  y: 294, color: INDIA_COLORS.navy, data: { "Role": "Export Port Gateway", "Cargo": "161 MT/yr" } },
  { id: "jnpt",       label: "JNPT (Gateway)",                      shortLabel: "JNPT",       x: 94,  y: 370, color: INDIA_COLORS.navy, data: { "Role": "Export Port Gateway", "Cargo": "79.5 MT/yr" } },
  { id: "chennai_pt", label: "Chennai Port (Gateway)",              shortLabel: "Chennai Pt", x: 207, y: 482, color: INDIA_COLORS.navy, data: { "Role": "Export Port Gateway", "Cargo": "72 MT/yr" } },
  { id: "kochi",      label: "Kochi Port (Gateway)",                shortLabel: "Kochi",      x: 146, y: 543, color: INDIA_COLORS.navy, data: { "Role": "Export Port Gateway", "Cargo": "28 MT/yr" } },
  { id: "delhi_apt",  label: "Delhi IGI Airport (Air Gateway)",     shortLabel: "Del Airport",x: 162, y: 174, color: INDIA_COLORS.purple, data: { "Role": "Air Export Gateway", "Cargo": "1.08 MT/yr" } },
  { id: "hyd_apt",    label: "Hyderabad Airport (Air Gateway)",     shortLabel: "HYD Airport",x: 185, y: 412, color: INDIA_COLORS.purple, data: { "Role": "Air Export Gateway", "Cargo": "0.42 MT/yr" } },
];

const MANUFACTURING_EDGES: MapEdge[] = [
  { from: "surat",       to: "mundra",     type: "road", data: { "Link": "Surat → Mundra Port", "Distance": "310 km", "Transit": "5 hours", "Mode": "Road/Rail" } },
  { from: "punenashik",  to: "jnpt",       type: "road", data: { "Link": "Pune-Nashik → JNPT", "Distance": "115 km", "Transit": "2.5 hours", "Mode": "Mumbai-Pune Expressway" } },
  { from: "bengaluru",   to: "chennai_pt", type: "road", data: { "Link": "Bengaluru → Chennai Port", "Distance": "345 km", "Transit": "6 hours", "Mode": "NH48" } },
  { from: "bengaluru",   to: "kochi",      type: "road", dashed: true, data: { "Link": "Bengaluru → Kochi Port", "Distance": "365 km", "Transit": "6.5 hours", "Mode": "NH275" } },
  { from: "sriperumb",   to: "chennai_pt", type: "road", data: { "Link": "Sriperumbudur → Chennai Port", "Distance": "42 km", "Transit": "1 hour", "Mode": "Road" } },
  { from: "ludhiana",    to: "delhi_apt",  type: "road", data: { "Link": "Ludhiana → Delhi Airport", "Distance": "310 km", "Transit": "5 hours (road) / 1 hr air", "Mode": "NH44 / W-DFC" } },
  { from: "manesar",     to: "jnpt",       type: "road", dashed: true, data: { "Link": "Manesar → JNPT via W-DFC", "Distance": "~1,420 km", "Transit": "1.2 days (DFC)", "Mode": "Western DFC Rail" } },
  { from: "hyderabad",   to: "hyd_apt",    type: "road", data: { "Link": "Hyderabad → Airport", "Distance": "22 km", "Transit": "30 min", "Mode": "Expressway" } },
  { from: "greaternoida",to: "delhi_apt",  type: "road", data: { "Link": "Greater Noida → Delhi IGI", "Distance": "55 km", "Transit": "1 hour", "Mode": "NH9 / Expressway" } },
];

const MANUFACTURING_LEGEND: MapLegendItem[] = [
  { color: "#6b7280", label: "SC Link to Gateway" },
  { color: "#6b7280", label: "Via DFC Corridor", dashed: true },
];

// ─────────────────────────────────────────────
// SC NETWORK MAP DATA
// ─────────────────────────────────────────────
const SC_CITY_NODES: MapNode[] = [
  { id: "delhi",      label: "Delhi",          shortLabel: "Delhi",     x: 160, y: 182, color: "#777" },
  { id: "jaipur",     label: "Jaipur",         shortLabel: "Jaipur",    x: 138, y: 215, color: "#777" },
  { id: "ahmedabad",  label: "Ahmedabad",      shortLabel: "Amdvd",     x: 90,  y: 290, color: "#777" },
  { id: "vadodara",   label: "Vadodara",       shortLabel: "Vadodara",  x: 99,  y: 304, color: "#777" },
  { id: "jnpt",       label: "JNPT / Mumbai",  shortLabel: "JNPT",      x: 94,  y: 370, color: "#777" },
  { id: "mundra",     label: "Mundra",         shortLabel: "Mundra",    x: 46,  y: 294, color: "#777" },
  { id: "kandla",     label: "Kandla",         shortLabel: "Kandla",    x: 53,  y: 290, color: "#777" },
  { id: "ludhiana",   label: "Ludhiana",       shortLabel: "Ludhiana",  x: 138, y: 138, color: "#777" },
  { id: "varanasi",   label: "Varanasi",       shortLabel: "Varanasi",  x: 248, y: 246, color: "#777" },
  { id: "kolkata",    label: "Kolkata",        shortLabel: "Kolkata",   x: 330, y: 298, color: "#777" },
  { id: "haldia",     label: "Haldia",         shortLabel: "Haldia",    x: 325, y: 310, color: "#777" },
  { id: "chandigarh", label: "Chandigarh",     shortLabel: "Chndgrh",   x: 154, y: 142, color: "#777" },
  { id: "amritsar",   label: "Amritsar",       shortLabel: "Amritsar",  x: 125, y: 124, color: "#777" },
  { id: "chennai",    label: "Chennai",        shortLabel: "Chennai",   x: 207, y: 482, color: "#777" },
  { id: "bengaluru",  label: "Bengaluru",      shortLabel: "Blr",       x: 166, y: 485, color: "#777" },
  { id: "hosur",      label: "Hosur",          shortLabel: "Hosur",     x: 169, y: 489, color: "#777" },
  { id: "vizag",      label: "Visakhapatnam",  shortLabel: "Vizag",     x: 252, y: 393, color: "#777" },
  { id: "paradip",    label: "Paradip",        shortLabel: "Paradip",   x: 302, y: 343, color: "#777" },
  { id: "kochi",      label: "Kochi",          shortLabel: "Kochi",     x: 146, y: 543, color: "#777" },
  { id: "hyderabad",  label: "Hyderabad",      shortLabel: "Hyd",       x: 179, y: 399, color: "#777" },
  { id: "warangal",   label: "Warangal",       shortLabel: "Warangal",  x: 196, y: 387, color: "#777" },
  { id: "pune",       label: "Pune",           shortLabel: "Pune",      x: 110, y: 377, color: "#777" },
  { id: "mumbai",     label: "Mumbai",         shortLabel: "Mumbai",    x: 93,  y: 366, color: "#777" },
];

const SC_NETWORK_ROUTES = [
  { name: "Delhi-Mumbai Industrial Corridor (DMIC)", color: "#FF9933", status: "Live",        valueBUSD: 90,   completion: 100, route: ["ludhiana","delhi","jaipur","ahmedabad","vadodara","jnpt","mundra"] },
  { name: "Western DFC (W-DFC)",                    color: "#000080", status: "Live",        valueBUSD: 12.6, completion: 100, route: ["ludhiana","delhi","jaipur","ahmedabad","vadodara","jnpt"] },
  { name: "Eastern DFC (E-DFC)",                    color: "#138808", status: "Live",        valueBUSD: 11.8, completion: 100, route: ["ludhiana","delhi","varanasi","kolkata"] },
  { name: "Sagarmala Port-Led Development",          color: "#0079F2", status: "In Progress", valueBUSD: 123,  completion: 62,  route: ["mundra","kandla","jnpt","kochi","chennai","vizag","paradip","haldia"], dashed: true },
  { name: "PM Gati Shakti National Master Plan",     color: "#795EFF", status: "In Progress", valueBUSD: 1400, completion: 48,  route: ["amritsar","ludhiana","delhi","jaipur","jnpt","chennai","vizag","kolkata"], dashed: true },
  { name: "Chennai-Bengaluru Industrial Corridor",   color: "#1B998B", status: "In Progress", valueBUSD: 7.2,  completion: 34,  route: ["chennai","hosur","bengaluru"] },
  { name: "Amritsar-Kolkata Industrial Corridor",    color: "#E84855", status: "In Progress", valueBUSD: 14,   completion: 28,  route: ["amritsar","ludhiana","chandigarh","delhi","varanasi","kolkata"], dashed: true },
  { name: "East Coast Economic Corridor",            color: "#F9C74F", status: "In Progress", valueBUSD: 82,   completion: 22,  route: ["kolkata","haldia","paradip","vizag","chennai"] },
  { name: "Bengaluru-Mumbai Economic Corridor",      color: "#FF6B35", status: "In Progress", valueBUSD: 9.5,  completion: 18,  route: ["bengaluru","pune","mumbai"], dashed: true },
  { name: "Hyderabad-Warangal Industrial Corridor",  color: "#EC4899", status: "In Progress", valueBUSD: 3.2,  completion: 41,  route: ["hyderabad","warangal"] },
];

const SC_NETWORK_EDGES: MapEdge[] = SC_NETWORK_ROUTES.flatMap((net) => {
  const edges: MapEdge[] = [];
  for (let i = 0; i < net.route.length - 1; i++) {
    edges.push({
      from: net.route[i],
      to: net.route[i + 1],
      color: net.color,
      dashed: (net as any).dashed ?? false,
      width: net.status === "Live" ? 2.5 : 2,
      data: {
        "Network": net.name,
        "Status": net.status,
        "Value": `USD ${net.valueBUSD}B`,
        "Completion": `${net.completion}%`,
      },
    });
  }
  return edges;
});

// ─────────────────────────────────────────────
// ACHIEVEMENTS / NEWS
// ─────────────────────────────────────────────
const ACHIEVEMENTS = [
  { date: "Mar 2025", category: "Global Ranking", color: INDIA_COLORS.green,   title: "India LPI Rank jumps to #38 — best improvement in 5 years", desc: "World Bank 2024 LPI: India climbs from #44 in 2018, driven by port efficiency gains, DFC commissioning, and AI-enabled customs clearance." },
  { date: "Feb 2025", category: "Policy",         color: INDIA_COLORS.saffron, title: "PM Gati Shakti: 1,200+ projects worth INR 16 lakh crore sanctioned", desc: "National Master Plan for multimodal connectivity has approved 1,200+ infrastructure projects across 28 states, reducing logistics fragmentation." },
  { date: "Jan 2025", category: "Ports",          color: INDIA_COLORS.navy,    title: "Mundra Port crosses 200 MT — India's first port to achieve this milestone", desc: "Adani Ports' Mundra Port handled 200+ million tonnes in a single year, cementing India's West Coast as a premier gateway for Asian trade." },
  { date: "Dec 2024", category: "Rail Freight",   color: INDIA_COLORS.teal,    title: "WDFC achieves 100 MT in Year 1 — 40% faster than highway freight", desc: "Western Dedicated Freight Corridor completes its first full operational year, demonstrating 40% transit-time reduction vs National Highway freight movement." },
  { date: "Nov 2024", category: "AI & Tech",      color: INDIA_COLORS.purple,  title: "Delhivery & Blue Dart report 22% fuel savings from AI route optimisation", desc: "India's top logistics operators achieve 22% average fleet fuel cost reduction and 18% emissions drop after full-scale deployment of AI routing." },
  { date: "Oct 2024", category: "Trade",          color: INDIA_COLORS.blue,    title: "India merchandise exports reach USD 437B — USD 500B target in sight", desc: "FY2025 export trajectory remains on track for the USD 500B target, supported by logistics reforms, PLI schemes, and port throughput growth." },
];

// ─────────────────────────────────────────────
// TAB COMPONENTS
// ─────────────────────────────────────────────

function AiAdoptionTab() {
  const { data, isLoading, isFetching } = useGetAiAdoption();
  if (isLoading || isFetching) return <SectionSkeleton />;
  const trends = data?.trends ?? [];
  const technologies = data?.technologies ?? [];
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <KPICard title="AI Market Size (2025)" value={`USD ${data?.marketSize}B`} trend="up" change="+67% YoY" />
        <KPICard title="Projected Size (2030)" value={`USD ${data?.projectedMarketSize}B`} trend="up" />
        <KPICard title="AI Adoption Rate" value="58%" trend="up" change="+24pp since 2022" />
        <KPICard title="Companies Using AI" value="820+" trend="up" change="+240 in 2025" />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-base flex items-center gap-2">
              <Activity className="w-4 h-4 text-primary" />
              AI Adoption Rate & Investment (2019–2025)
            </CardTitle>
            <CsvBtn data={trends} filename="ai-adoption-trends.csv" />
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={280}>
              <AreaChart data={trends} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                <defs>
                  <linearGradient id="adoptGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={INDIA_COLORS.navy} stopOpacity={0.3} />
                    <stop offset="95%" stopColor={INDIA_COLORS.navy} stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="invGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={INDIA_COLORS.saffron} stopOpacity={0.3} />
                    <stop offset="95%" stopColor={INDIA_COLORS.saffron} stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="year" tick={{ fontSize: 12 }} stroke="hsl(var(--muted-foreground))" />
                <YAxis yAxisId="left" tick={{ fontSize: 12 }} stroke="hsl(var(--muted-foreground))" />
                <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 12 }} stroke="hsl(var(--muted-foreground))" />
                <Tooltip content={<CustomTooltip />} />
                <Legend />
                <Area yAxisId="left" type="monotone" dataKey="adoptionRate" name="Adoption Rate (%)" stroke={INDIA_COLORS.navy} fill="url(#adoptGrad)" strokeWidth={2} />
                <Area yAxisId="right" type="monotone" dataKey="investment" name="Investment (USD B)" stroke={INDIA_COLORS.saffron} fill="url(#invGrad)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-base flex items-center gap-2">
              <Brain className="w-4 h-4 text-primary" />
              AI Technology Adoption in Logistics (%)
            </CardTitle>
            <CsvBtn data={technologies} filename="ai-technologies.csv" />
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={technologies}
                  dataKey="adoptionPercent"
                  nameKey="name"
                  cx="50%"
                  cy="42%"
                  outerRadius={90}
                  innerRadius={50}
                >
                  {technologies.map((_: any, i: number) => (
                    <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  content={({ active, payload }) => {
                    if (!active || !payload?.length) return null;
                    const d = payload[0].payload;
                    return (
                      <div className="bg-card border border-border rounded-lg px-3 py-2 text-xs shadow-lg max-w-[200px]">
                        <p className="font-semibold mb-1">{d.name}</p>
                        <p>Adoption: <span className="font-bold">{d.adoptionPercent}%</span></p>
                        <p className="text-muted-foreground mt-0.5">{d.useCases}</p>
                      </div>
                    );
                  }}
                />
                <Legend wrapperStyle={{ fontSize: 10 }} />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base flex items-center gap-2">
            <Cpu className="w-4 h-4 text-primary" />
            Companies Adopting AI in Logistics (2019–2025)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={trends} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="year" tick={{ fontSize: 12 }} stroke="hsl(var(--muted-foreground))" />
              <YAxis tick={{ fontSize: 12 }} stroke="hsl(var(--muted-foreground))" />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="companies" name="Companies Using AI" fill={INDIA_COLORS.saffron} radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}

function TransportTab() {
  const { data, isLoading, isFetching } = useGetTransportModes();
  if (isLoading || isFetching) return <SectionSkeleton />;
  const modes = data ?? [];
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {modes.map((m) => (
          <KPICard key={m.mode} title={m.mode} value={`${m.sharePercent}%`} change={`+${m.growthRate}% CAGR`} trend="up" />
        ))}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-base flex items-center gap-2">
              <Truck className="w-4 h-4 text-primary" />
              Modal Split — Share of Logistics Volume
            </CardTitle>
            <CsvBtn data={modes} filename="transport-modes.csv" />
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={280}>
              <PieChart>
                <Pie data={modes} dataKey="sharePercent" nameKey="mode" cx="50%" cy="50%" outerRadius={100} innerRadius={55}
                  label={({ name, sharePercent }) => `${name}: ${sharePercent}%`} labelLine={true}>
                  {modes.map((m, i) => (
                    <Cell key={m.mode} fill={m.color || CHART_COLORS[i % CHART_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-base flex items-center gap-2">
              <Activity className="w-4 h-4 text-primary" />
              Volume by Mode (MT) & Growth Rate (%)
            </CardTitle>
            <CsvBtn data={modes} filename="transport-volume.csv" />
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={modes} margin={{ top: 5, right: 30, left: 0, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="mode" tick={{ fontSize: 10 }} stroke="hsl(var(--muted-foreground))" angle={-15} textAnchor="end" />
                <YAxis yAxisId="left" tick={{ fontSize: 12 }} stroke="hsl(var(--muted-foreground))" />
                <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 12 }} stroke="hsl(var(--muted-foreground))" />
                <Tooltip content={<CustomTooltip />} />
                <Legend />
                <Bar yAxisId="left" dataKey="volumeMT" name="Volume (MT)" fill={INDIA_COLORS.navy} radius={[4, 4, 0, 0]}>
                  {modes.map((m, i) => <Cell key={m.mode} fill={m.color || CHART_COLORS[i]} />)}
                </Bar>
                <Line yAxisId="right" type="monotone" dataKey="growthRate" name="Growth Rate (%)" stroke={INDIA_COLORS.saffron} strokeWidth={2} dot={{ r: 4 }} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function InfrastructureTab() {
  const { data, isLoading, isFetching } = useGetInfrastructure();
  const [section, setSection] = useState<"ports" | "airports" | "expressways" | "freight" | "manufacturing">("ports");
  if (isLoading || isFetching) return <SectionSkeleton />;

  const tabs = [
    { id: "ports",         label: "Ports",          icon: <Ship className="w-3.5 h-3.5" /> },
    { id: "airports",      label: "Airports",        icon: <Plane className="w-3.5 h-3.5" /> },
    { id: "expressways",   label: "Expressways",     icon: <Navigation className="w-3.5 h-3.5" /> },
    { id: "freight",       label: "Freight Hubs",    icon: <Package className="w-3.5 h-3.5" /> },
    { id: "manufacturing", label: "Manufacturing",   icon: <Factory className="w-3.5 h-3.5" /> },
  ] as const;

  return (
    <div className="space-y-6">
      <div className="flex gap-2 flex-wrap">
        {tabs.map((t) => (
          <button key={t.id} onClick={() => setSection(t.id)}
            className={`flex items-center gap-1.5 px-4 py-1.5 rounded-full text-sm font-medium transition-colors border ${section === t.id ? "bg-primary text-primary-foreground border-primary" : "border-border hover:bg-muted"}`}>
            {t.icon}{t.label}
          </button>
        ))}
      </div>

      {section === "ports" && data?.ports && (
        <>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-base flex items-center gap-2">
                <Ship className="w-4 h-4 text-primary" />
                Major Indian Ports — Ranked by Cargo Volume
              </CardTitle>
              <CsvBtn data={data.ports} filename="india-ports.csv" />
            </CardHeader>
            <CardContent className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead><tr className="border-b border-border text-muted-foreground text-left">
                  <th className="py-2 pr-4">Rank</th><th className="py-2 pr-4">Port</th><th className="py-2 pr-4">State</th>
                  <th className="py-2 pr-4">Cargo (MT)</th><th className="py-2 pr-4">Type</th>
                  <th className="py-2 pr-4">Connected Corridors</th><th className="py-2">AI</th>
                </tr></thead>
                <tbody>
                  {data.ports.map((p) => (
                    <tr key={p.rank} className="border-b border-border/50 hover:bg-muted/40 transition-colors">
                      <td className="py-2 pr-4"><span className="font-bold text-primary">#{p.rank}</span></td>
                      <td className="py-2 pr-4 font-medium">{p.name}</td>
                      <td className="py-2 pr-4 text-muted-foreground">{p.state}</td>
                      <td className="py-2 pr-4 font-semibold">{p.cargoMT}M</td>
                      <td className="py-2 pr-4"><Badge variant="outline">{p.type}</Badge></td>
                      <td className="py-2 pr-4 text-muted-foreground text-xs max-w-[200px]">{p.connected}</td>
                      <td className="py-2">{p.aiEnabled ? <Badge className="bg-green-600 text-white text-xs"><Zap className="w-2.5 h-2.5 mr-0.5" />AI</Badge> : <Badge variant="outline" className="text-xs">—</Badge>}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base flex items-center gap-2">
                <Ship className="w-4 h-4 text-primary" />
                Port Network Map — Hover connections for route efficiency
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0 sm:p-2">
              <IndiaNetworkMap nodes={PORT_NODES} edges={PORT_EDGES} legend={PORT_LEGEND} height={400} hint="Hover nodes or routes for details" />
            </CardContent>
          </Card>
        </>
      )}

      {section === "airports" && data?.airports && (
        <>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-base flex items-center gap-2">
                <Plane className="w-4 h-4 text-primary" />
                Major Cargo Airports — Ranked by Freight Volume
              </CardTitle>
              <CsvBtn data={data.airports} filename="india-airports.csv" />
            </CardHeader>
            <CardContent className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead><tr className="border-b border-border text-muted-foreground text-left">
                  <th className="py-2 pr-4">Rank</th><th className="py-2 pr-4">Airport</th><th className="py-2 pr-4">City</th>
                  <th className="py-2 pr-4">Cargo (MT)</th><th className="py-2 pr-4">Connected Corridors</th><th className="py-2">AI</th>
                </tr></thead>
                <tbody>
                  {data.airports.map((a) => (
                    <tr key={a.rank} className="border-b border-border/50 hover:bg-muted/40 transition-colors">
                      <td className="py-2 pr-4"><span className="font-bold text-primary">#{a.rank}</span></td>
                      <td className="py-2 pr-4 font-medium">{a.name}</td>
                      <td className="py-2 pr-4 text-muted-foreground">{a.city}</td>
                      <td className="py-2 pr-4 font-semibold">{a.cargoMT}M</td>
                      <td className="py-2 pr-4 text-muted-foreground text-xs">{a.connected}</td>
                      <td className="py-2">{a.aiEnabled ? <Badge className="bg-green-600 text-white text-xs"><Zap className="w-2.5 h-2.5 mr-0.5" />AI</Badge> : <Badge variant="outline" className="text-xs">—</Badge>}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base flex items-center gap-2">
                <Plane className="w-4 h-4 text-primary" />
                Air Cargo Network Map — Hover routes for time, rate & cost
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0 sm:p-2">
              <IndiaNetworkMap nodes={AIRPORT_NODES} edges={AIRPORT_EDGES} legend={AIRPORT_LEGEND} height={400} hint="Hover nodes or routes for details" />
            </CardContent>
          </Card>
        </>
      )}

      {section === "expressways" && data?.expressways && (
        <>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-base flex items-center gap-2">
                <Navigation className="w-4 h-4 text-primary" />
                Key Expressways & Logistics Corridors
              </CardTitle>
              <CsvBtn data={data.expressways} filename="india-expressways.csv" />
            </CardHeader>
            <CardContent className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead><tr className="border-b border-border text-muted-foreground text-left">
                  <th className="py-2 pr-4">Rank</th><th className="py-2 pr-4">Name</th><th className="py-2 pr-4">Length (km)</th>
                  <th className="py-2 pr-4">States</th><th className="py-2 pr-4">Key Corridors</th><th className="py-2">Status</th>
                </tr></thead>
                <tbody>
                  {data.expressways.map((e) => (
                    <tr key={e.rank} className="border-b border-border/50 hover:bg-muted/40 transition-colors">
                      <td className="py-2 pr-4"><span className="font-bold text-primary">#{e.rank}</span></td>
                      <td className="py-2 pr-4 font-medium">{e.name}</td>
                      <td className="py-2 pr-4 font-semibold">{e.lengthKm} km</td>
                      <td className="py-2 pr-4 text-center">{e.states}</td>
                      <td className="py-2 pr-4 text-muted-foreground text-xs">{e.corridors}</td>
                      <td className="py-2"><StatusBadge status={e.status} /></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base flex items-center gap-2">
                <Navigation className="w-4 h-4 text-primary" />
                Expressway Corridor Map — Hover for length, status & states covered
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0 sm:p-2">
              <IndiaNetworkMap nodes={EXPRESSWAY_NODES} edges={EXPRESSWAY_EDGES} legend={EXPRESSWAY_LEGEND} height={400} hint="Hover routes for details" />
            </CardContent>
          </Card>
        </>
      )}

      {section === "freight" && data?.freightHubs && (
        <>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-base flex items-center gap-2">
                <Package className="w-4 h-4 text-primary" />
                Major Freight Hubs & Multimodal Logistics Parks
              </CardTitle>
              <CsvBtn data={data.freightHubs} filename="india-freight-hubs.csv" />
            </CardHeader>
            <CardContent className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead><tr className="border-b border-border text-muted-foreground text-left">
                  <th className="py-2 pr-4">Rank</th><th className="py-2 pr-4">Hub</th><th className="py-2 pr-4">State</th>
                  <th className="py-2 pr-4">Type</th><th className="py-2 pr-4">Capacity (MT)</th>
                  <th className="py-2 pr-4">Connected</th><th className="py-2">Status</th>
                </tr></thead>
                <tbody>
                  {data.freightHubs.map((f) => (
                    <tr key={f.rank} className="border-b border-border/50 hover:bg-muted/40 transition-colors">
                      <td className="py-2 pr-4"><span className="font-bold text-primary">#{f.rank}</span></td>
                      <td className="py-2 pr-4 font-medium">{f.name}</td>
                      <td className="py-2 pr-4 text-muted-foreground">{f.state}</td>
                      <td className="py-2 pr-4"><Badge variant="outline" className="text-xs">{f.type}</Badge></td>
                      <td className="py-2 pr-4 font-semibold">{f.capacityMT}M</td>
                      <td className="py-2 pr-4 text-muted-foreground text-xs">{f.connected}</td>
                      <td className="py-2"><StatusBadge status={f.status} /></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base flex items-center gap-2">
                <Package className="w-4 h-4 text-primary" />
                Freight Corridor Map — W-DFC (solid) & E-DFC (dashed), hover for capacity & speed
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0 sm:p-2">
              <IndiaNetworkMap nodes={FREIGHT_NODES} edges={FREIGHT_EDGES} legend={FREIGHT_LEGEND} height={400} hint="Hover nodes or routes for details" />
            </CardContent>
          </Card>
        </>
      )}

      {section === "manufacturing" && data?.manufacturingHubs && (
        <>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-base flex items-center gap-2">
                <Factory className="w-4 h-4 text-primary" />
                Top Manufacturing Hubs by Supply Chain Contribution
              </CardTitle>
              <CsvBtn data={data.manufacturingHubs} filename="india-manufacturing-hubs.csv" />
            </CardHeader>
            <CardContent className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead><tr className="border-b border-border text-muted-foreground text-left">
                  <th className="py-2 pr-4">Rank</th><th className="py-2 pr-4">Hub</th><th className="py-2 pr-4">State</th>
                  <th className="py-2 pr-4">Sector</th><th className="py-2 pr-4">Export (USD B)</th><th className="py-2 pr-4 w-36">SC Contribution</th>
                </tr></thead>
                <tbody>
                  {data.manufacturingHubs.map((m) => (
                    <tr key={m.rank} className="border-b border-border/50 hover:bg-muted/40 transition-colors">
                      <td className="py-2 pr-4"><span className="font-bold text-primary">#{m.rank}</span></td>
                      <td className="py-2 pr-4 font-medium">{m.name}</td>
                      <td className="py-2 pr-4 text-muted-foreground">{m.state}</td>
                      <td className="py-2 pr-4 text-muted-foreground text-xs">{m.sector}</td>
                      <td className="py-2 pr-4 font-semibold">${m.exportValueB}B</td>
                      <td className="py-2 pr-4">
                        <div className="flex items-center gap-2">
                          <Progress value={m.supplyChainContrib * 5} className="h-2 flex-1" />
                          <span className="text-xs font-medium w-10">{m.supplyChainContrib}%</span>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base flex items-center gap-2">
                <Factory className="w-4 h-4 text-primary" />
                Manufacturing Hub Supply Chain Map — Hover hubs & links for export gateway details
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0 sm:p-2">
              <IndiaNetworkMap nodes={MANUFACTURING_NODES} edges={MANUFACTURING_EDGES} legend={MANUFACTURING_LEGEND} height={400} hint="Hover nodes or routes for details" />
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}

function NetworksTab() {
  const { data, isLoading, isFetching } = useGetSupplyChainNetworks();
  if (isLoading || isFetching) return <SectionSkeleton />;
  const networks = data ?? [];
  const live = networks.filter((n) => n.status === "Live");
  const inProgress = networks.filter((n) => n.status !== "Live");

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <KPICard title="Total Networks" value={`${networks.length}`} />
        <KPICard title="Live Networks" value={`${live.length}`} trend="up" />
        <KPICard title="In Progress" value={`${inProgress.length}`} />
        <KPICard title="Total Pipeline Value" value={`USD ${networks.reduce((s, n) => s + n.valueBUSD, 0).toFixed(0)}B`} trend="up" />
      </div>
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base flex items-center gap-2">
            <Network className="w-4 h-4 text-primary" />
            National Supply Chain Corridor Network Map — Hover routes to see network details
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0 sm:p-2">
          <IndiaNetworkMap
            nodes={SC_CITY_NODES}
            edges={SC_NETWORK_EDGES}
            height={480}
            hint="Hover routes for network name, value & completion"
          />
        </CardContent>
      </Card>
      <div className="flex gap-3 flex-wrap text-xs text-muted-foreground px-1">
        {SC_NETWORK_ROUTES.map((n) => (
          <span key={n.name} className="flex items-center gap-1.5">
            <span className="w-5 h-1 rounded-full inline-block" style={{ background: n.color }} />
            <span className="font-medium" style={{ color: n.color }}>{n.name.split("(")[0].trim()}</span>
          </span>
        ))}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {networks.map((n) => (
          <Card key={n.name}>
            <CardContent className="p-4 space-y-2">
              <div className="flex items-start justify-between gap-2">
                <h3 className="font-semibold text-sm leading-tight">{n.name}</h3>
                <StatusBadge status={n.status} />
              </div>
              <div className="flex items-center gap-4 text-xs text-muted-foreground">
                <span><span className="font-semibold text-foreground">USD {n.valueBUSD}B</span></span>
                <span>{n.type}</span>
                <span>{n.states} states</span>
              </div>
              <p className="text-xs text-muted-foreground">{n.keyNodes}</p>
              <div className="flex items-center gap-2">
                <Progress value={n.completion} className="h-1.5 flex-1" />
                <span className="text-xs font-medium">{n.completion}%</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

function MarketAdvantagesTab() {
  const { data, isLoading, isFetching } = useGetMarketAdvantages();
  if (isLoading || isFetching) return <SectionSkeleton />;
  const advantages = data?.advantages ?? [];
  const stats = data?.stats ?? [];
  const radarData = advantages.map((a) => ({
    subject: a.category.split(" ")[0],
    India: a.indiaScore,
    "World Avg": a.worldAvg,
  }));

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {stats.map((s) => (
          <KPICard key={s.label} title={s.label} value={`${s.value} ${s.unit}`} trend={s.trend as "up" | "down"} />
        ))}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-base flex items-center gap-2">
              <Globe className="w-4 h-4 text-primary" />
              India vs World Average — Logistics Competitiveness Radar
            </CardTitle>
            <CsvBtn data={advantages} filename="market-advantages.csv" />
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <RadarChart data={radarData} margin={{ top: 10, right: 30, left: 30, bottom: 10 }}>
                <PolarGrid stroke="hsl(var(--border))" />
                <PolarAngleAxis dataKey="subject" tick={{ fontSize: 11 }} />
                <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fontSize: 9 }} />
                <Radar name="India" dataKey="India" stroke={INDIA_COLORS.navy} fill={INDIA_COLORS.navy} fillOpacity={0.3} />
                <Radar name="World Avg" dataKey="World Avg" stroke={INDIA_COLORS.saffron} fill={INDIA_COLORS.saffron} fillOpacity={0.2} />
                <Legend />
                <Tooltip content={<CustomTooltip />} />
              </RadarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-primary" />
              India Score vs World Average by Category
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {advantages.map((a) => (
              <div key={a.category} className="space-y-1">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium text-xs">{a.category}</span>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Badge variant="outline" className="text-xs py-0">Global Rank #{a.rank}</Badge>
                    <span className="font-semibold text-foreground">{a.indiaScore}/100</span>
                  </div>
                </div>
                <div className="relative h-2 bg-muted rounded-full overflow-hidden">
                  <div className="absolute h-full rounded-full transition-all" style={{ width: `${a.worldAvg}%`, background: INDIA_COLORS.saffron, opacity: 0.5 }} />
                  <div className="absolute h-full rounded-full transition-all" style={{ width: `${a.indiaScore}%`, background: INDIA_COLORS.navy }} />
                </div>
                <p className="text-xs text-muted-foreground">{a.description}</p>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Achievements & News */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base flex items-center gap-2">
            <Newspaper className="w-4 h-4 text-primary" />
            Recent Achievements & Sector News
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {ACHIEVEMENTS.map((item) => (
              <div key={item.title} className="rounded-lg border border-border p-4 space-y-2 hover:bg-muted/30 transition-colors">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold px-2 py-0.5 rounded-full" style={{ background: item.color + "22", color: item.color }}>{item.category}</span>
                  <span className="text-xs text-muted-foreground">{item.date}</span>
                </div>
                <p className="text-sm font-semibold leading-snug">{item.title}</p>
                <p className="text-xs text-muted-foreground leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function CompaniesTab() {
  const { data, isLoading, isFetching } = useGetCompanies();
  if (isLoading || isFetching) return <SectionSkeleton />;
  const companies = data ?? [];
  const levelColor: Record<string, string> = {
    Advanced: "bg-green-600 text-white",
    High: "bg-blue-600 text-white",
    Moderate: "bg-amber-500 text-white",
  };
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <KPICard title="Total Key Players" value={`${companies.length}`} />
        <KPICard title="Advanced AI Adopters" value={`${companies.filter(c => c.aiAdoptionLevel === "Advanced").length}`} trend="up" />
        <KPICard title="High Adopters" value={`${companies.filter(c => c.aiAdoptionLevel === "High").length}`} trend="up" />
        <KPICard title="Largest Revenue" value={`USD ${Math.max(...companies.map(c => c.revenue))}B`} />
      </div>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-base flex items-center gap-2">
            <Users className="w-4 h-4 text-primary" />
            Revenue by Company (USD Billion)
          </CardTitle>
          <CsvBtn data={companies} filename="logistics-companies.csv" />
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={[...companies].sort((a, b) => b.revenue - a.revenue)} margin={{ top: 5, right: 20, left: 0, bottom: 50 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="name" tick={{ fontSize: 10 }} angle={-30} textAnchor="end" stroke="hsl(var(--muted-foreground))" />
              <YAxis tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="revenue" name="Revenue (USD B)" radius={[4, 4, 0, 0]}>
                {[...companies].sort((a, b) => b.revenue - a.revenue).map((c, i) => (
                  <Cell key={c.name} fill={CHART_COLORS[i % CHART_COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base flex items-center gap-2">
            <Brain className="w-4 h-4 text-primary" />
            Companies & AI Capabilities
          </CardTitle>
        </CardHeader>
        <CardContent className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead><tr className="border-b border-border text-muted-foreground text-left">
              <th className="py-2 pr-4">Company</th><th className="py-2 pr-4">Segment</th>
              <th className="py-2 pr-4">AI Tools</th><th className="py-2 pr-4">AI Use Case</th>
              <th className="py-2 pr-4">Revenue (USD B)</th><th className="py-2">AI Level</th>
            </tr></thead>
            <tbody>
              {companies.map((c) => (
                <tr key={c.name} className="border-b border-border/50 hover:bg-muted/40 transition-colors">
                  <td className="py-2 pr-4 font-semibold">{c.name}</td>
                  <td className="py-2 pr-4 text-muted-foreground text-xs">{c.segment}</td>
                  <td className="py-2 pr-4 text-xs">{c.aiTools}</td>
                  <td className="py-2 pr-4 text-muted-foreground text-xs">{c.aiUseCase}</td>
                  <td className="py-2 pr-4 font-semibold">${c.revenue}B</td>
                  <td className="py-2"><Badge className={`text-xs ${levelColor[c.aiAdoptionLevel] ?? ""}`}>{c.aiAdoptionLevel}</Badge></td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  );
}

function StatesTab() {
  const { data, isLoading, isFetching } = useGetStatesAdoption();
  if (isLoading || isFetching) return <SectionSkeleton />;
  const states = data ?? [];
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-base flex items-center gap-2">
              <MapPin className="w-4 h-4 text-primary" />
              State LPI Score (Logistics Performance Index)
            </CardTitle>
            <CsvBtn data={states} filename="states-lpi.csv" />
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={380}>
              <BarChart data={[...states].sort((a, b) => b.lpi - a.lpi)} layout="vertical"
                margin={{ top: 5, right: 30, left: 110, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis type="number" domain={[3, 5]} tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" />
                <YAxis type="category" dataKey="state" tick={{ fontSize: 10 }} width={105} stroke="hsl(var(--muted-foreground))" />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="lpi" name="LPI Score" radius={[0, 4, 4, 0]}>
                  {[...states].sort((a, b) => b.lpi - a.lpi).map((s, i) => (
                    <Cell key={s.state} fill={i < 3 ? INDIA_COLORS.green : i < 6 ? INDIA_COLORS.navy : INDIA_COLORS.blue} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center gap-2">
              <Brain className="w-4 h-4 text-primary" />
              AI Adoption vs Policy Score by State
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={380}>
              <BarChart data={[...states].sort((a, b) => b.aiAdoption - a.aiAdoption)} layout="vertical"
                margin={{ top: 5, right: 30, left: 110, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis type="number" domain={[0, 100]} tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" />
                <YAxis type="category" dataKey="state" tick={{ fontSize: 10 }} width={105} stroke="hsl(var(--muted-foreground))" />
                <Tooltip content={<CustomTooltip />} />
                <Legend />
                <Bar dataKey="aiAdoption" name="AI Adoption %" fill={INDIA_COLORS.saffron} radius={[0, 2, 2, 0]} />
                <Bar dataKey="policyScore" name="Policy Score" fill={INDIA_COLORS.navy} radius={[0, 2, 2, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base flex items-center gap-2">
            <MapPin className="w-4 h-4 text-primary" />
            State Rankings — Full Scorecard
          </CardTitle>
        </CardHeader>
        <CardContent className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead><tr className="border-b border-border text-muted-foreground text-left">
              <th className="py-2 pr-4">Rank</th><th className="py-2 pr-4">State</th><th className="py-2 pr-4">LPI</th>
              <th className="py-2 pr-4">Policy</th><th className="py-2 pr-4">Infrastructure</th>
              <th className="py-2 pr-4">AI Adoption</th><th className="py-2">Warehouse (M sqft)</th>
            </tr></thead>
            <tbody>
              {states.map((s) => (
                <tr key={s.state} className="border-b border-border/50 hover:bg-muted/40 transition-colors">
                  <td className="py-2 pr-4"><span className="font-bold text-primary">#{s.rank}</span></td>
                  <td className="py-2 pr-4 font-medium">{s.state}</td>
                  <td className="py-2 pr-4 font-semibold">{s.lpi.toFixed(2)}</td>
                  <td className="py-2 pr-4">{s.policyScore}/100</td>
                  <td className="py-2 pr-4">{s.infrastructure}/100</td>
                  <td className="py-2 pr-4">{s.aiAdoption}%</td>
                  <td className="py-2">{s.warehouseCapacity}M</td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  );
}

function GlobalTab() {
  const { data, isLoading, isFetching } = useGetGlobalComparison();
  if (isLoading || isFetching) return <SectionSkeleton />;
  const countries = data ?? [];
  const india = countries.find((c) => c.country === "India");
  return (
    <div className="space-y-6">
      {india && (
        <div className="rounded-lg p-4 border-2 text-sm" style={{ borderColor: INDIA_COLORS.saffron, background: "hsl(var(--card))" }}>
          <h3 className="font-bold mb-2 flex items-center gap-2" style={{ color: INDIA_COLORS.navy }}>
            <Globe className="w-4 h-4" />
            India's Global Position (2025)
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div><p className="text-2xl font-bold" style={{ color: INDIA_COLORS.saffron }}>#{india.lpiRank}</p><p className="text-muted-foreground text-xs">LPI Rank (up from #44 in 2018)</p></div>
            <div><p className="text-2xl font-bold" style={{ color: INDIA_COLORS.green }}>{india.growthRate}%</p><p className="text-muted-foreground text-xs">Fastest CAGR among top markets</p></div>
            <div><p className="text-2xl font-bold" style={{ color: INDIA_COLORS.navy }}>USD {india.marketSizeB}B</p><p className="text-muted-foreground text-xs">Market Size (#3 globally)</p></div>
            <div><p className="text-2xl font-bold" style={{ color: INDIA_COLORS.saffron }}>{india.aiAdoption}%</p><p className="text-muted-foreground text-xs">AI Adoption (fastest-growing in Asia)</p></div>
          </div>
        </div>
      )}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-base flex items-center gap-2">
              <Globe className="w-4 h-4 text-primary" />
              LPI Score — India vs World (2024)
            </CardTitle>
            <CsvBtn data={countries} filename="global-comparison.csv" />
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={[...countries].sort((a, b) => b.lpiScore - a.lpiScore)} margin={{ top: 5, right: 20, left: 0, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="country" tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" />
                <YAxis domain={[2.5, 4.5]} tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="lpiScore" name="LPI Score" radius={[4, 4, 0, 0]}>
                  {[...countries].sort((a, b) => b.lpiScore - a.lpiScore).map((c) => (
                    <Cell key={c.country} fill={c.country === "India" ? INDIA_COLORS.saffron : INDIA_COLORS.navy} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-primary" />
              Market Growth Rate (%) — India Leads
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={[...countries].sort((a, b) => b.growthRate - a.growthRate)} margin={{ top: 5, right: 20, left: 0, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="country" tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" />
                <YAxis tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="growthRate" name="Growth Rate (%)" radius={[4, 4, 0, 0]}>
                  {[...countries].sort((a, b) => b.growthRate - a.growthRate).map((c) => (
                    <Cell key={c.country} fill={c.country === "India" ? INDIA_COLORS.green : INDIA_COLORS.blue} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base flex items-center gap-2">
            <Brain className="w-4 h-4 text-primary" />
            AI Adoption & Infrastructure Score Comparison
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={countries} margin={{ top: 5, right: 20, left: 0, bottom: 20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="country" tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" />
              <YAxis domain={[0, 100]} tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <Bar dataKey="aiAdoption" name="AI Adoption (%)" fill={INDIA_COLORS.saffron} radius={[2, 2, 0, 0]} />
              <Bar dataKey="infrastructure" name="Infrastructure Score" fill={INDIA_COLORS.navy} radius={[2, 2, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}

// ─────────────────────────────────────────────
// MAIN DASHBOARD
// ─────────────────────────────────────────────
export default function Dashboard() {
  const [isDark, setIsDark] = useState(false);
  const queryClient = useQueryClient();
  const [lastRefreshed, setLastRefreshed] = useState<string | null>(null);

  const allKeys = [
    getGetAiAdoptionQueryKey(), getGetTransportModesQueryKey(),
    getGetInfrastructureQueryKey(), getGetSupplyChainNetworksQueryKey(),
    getGetMarketAdvantagesQueryKey(), getGetCompaniesQueryKey(),
    getGetStatesAdoptionQueryKey(), getGetGlobalComparisonQueryKey(),
  ];

  const onRefresh = useCallback(() => {
    allKeys.forEach((key) => queryClient.invalidateQueries({ queryKey: key }));
    setLastRefreshed(new Date().toLocaleTimeString());
  }, [queryClient]);

  const { isFetching: f1 } = useGetAiAdoption();
  const { isFetching: f2 } = useGetTransportModes();
  const { isFetching: f3 } = useGetInfrastructure();
  const { isFetching: f4 } = useGetSupplyChainNetworks();
  const loading = f1 || f2 || f3 || f4;

  return (
    <div className={isDark ? "dark" : ""}>
      <div className="min-h-screen bg-background text-foreground">
        <div className="max-w-[1400px] mx-auto px-4 py-6 space-y-6">
          {/* Header */}
          <div className="flex items-start justify-between flex-wrap gap-4">
            <div>
              <div className="flex items-center gap-3 mb-1">
                <svg width="48" height="32" viewBox="0 0 48 32" xmlns="http://www.w3.org/2000/svg" style={{ border: "1px solid hsl(var(--border))", borderRadius: 2, display: "block", flexShrink: 0 }}>
                  <rect width="48" height="32" fill="white" />
                  <rect width="48" height="10.67" fill="#FF9933" />
                  <rect y="21.33" width="48" height="10.67" fill="#138808" />
                  <circle cx="24" cy="16" r="5" fill="none" stroke="#000080" strokeWidth="0.8" />
                  <circle cx="24" cy="16" r="0.8" fill="#000080" />
                  {Array.from({ length: 24 }).map((_, i) => {
                    const angle = (i * 360) / 24;
                    const rad = (angle * Math.PI) / 180;
                    const x1 = 24 + 0.8 * Math.cos(rad);
                    const y1 = 16 + 0.8 * Math.sin(rad);
                    const x2 = 24 + 4.2 * Math.cos(rad);
                    const y2 = 16 + 4.2 * Math.sin(rad);
                    return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="#000080" strokeWidth="0.5" />;
                  })}
                </svg>
                <h1 className="text-2xl font-bold tracking-tight" style={{ color: INDIA_COLORS.navy }}>
                  India Supply Chain & Logistics Intelligence
                </h1>
              </div>
              <p className="text-sm text-muted-foreground">
                Strategic overview for international delegations — AI adoption, infrastructure, networks & global competitiveness
              </p>
            </div>
            <DashboardControls isDark={isDark} setIsDark={setIsDark} loading={loading} onRefresh={onRefresh} lastRefreshed={lastRefreshed} />
          </div>

          {/* Global KPI Strip */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
            <KPICard title="Market Size (2025)" value="USD 317B" trend="up" />
            <KPICard title="CAGR (2025–2030)" value="8.8%" trend="up" />
            <KPICard title="Global Market Rank" value="#3" trend="up" />
            <KPICard title="LPI Global Rank" value="#38" trend="up" change="Up from #44" />
            <KPICard title="AI Logistics Market" value="USD 8.4B" trend="up" />
            <KPICard title="Target Cost % GDP" value="8% by 2030" trend="down" change="Down from 14%" />
          </div>

          {/* Tabs */}
          <Tabs defaultValue="ai">
            <TabsList className="flex flex-wrap h-auto gap-1 bg-muted/50 p-1 rounded-lg">
              <TabsTrigger value="ai" className="text-xs flex items-center gap-1"><Brain className="w-3 h-3" />AI Adoption</TabsTrigger>
              <TabsTrigger value="transport" className="text-xs flex items-center gap-1"><Truck className="w-3 h-3" />Transport</TabsTrigger>
              <TabsTrigger value="infrastructure" className="text-xs flex items-center gap-1"><Building2 className="w-3 h-3" />Infrastructure</TabsTrigger>
              <TabsTrigger value="networks" className="text-xs flex items-center gap-1"><Network className="w-3 h-3" />SC Networks</TabsTrigger>
              <TabsTrigger value="advantages" className="text-xs flex items-center gap-1"><TrendingUp className="w-3 h-3" />Market Advantages</TabsTrigger>
              <TabsTrigger value="companies" className="text-xs flex items-center gap-1"><Users className="w-3 h-3" />Companies & AI</TabsTrigger>
              <TabsTrigger value="states" className="text-xs flex items-center gap-1"><MapPin className="w-3 h-3" />States</TabsTrigger>
              <TabsTrigger value="global" className="text-xs flex items-center gap-1"><Globe className="w-3 h-3" />Global</TabsTrigger>
            </TabsList>

            <div className="mt-6">
              <TabsContent value="ai"><AiAdoptionTab /></TabsContent>
              <TabsContent value="transport"><TransportTab /></TabsContent>
              <TabsContent value="infrastructure"><InfrastructureTab /></TabsContent>
              <TabsContent value="networks"><NetworksTab /></TabsContent>
              <TabsContent value="advantages"><MarketAdvantagesTab /></TabsContent>
              <TabsContent value="companies"><CompaniesTab /></TabsContent>
              <TabsContent value="states"><StatesTab /></TabsContent>
              <TabsContent value="global"><GlobalTab /></TabsContent>
            </div>
          </Tabs>

          <p className="text-center text-xs text-muted-foreground pb-4 print:hidden">
            Data sourced from World Bank LPI 2023, Ministry of Commerce & Industry, DPIIT, NITI Aayog, Invest India, Sagarmala Programme — as of 2025
          </p>
        </div>
      </div>
    </div>
  );
}
