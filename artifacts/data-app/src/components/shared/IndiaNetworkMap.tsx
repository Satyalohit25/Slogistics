import { useState } from "react";

// SVG viewBox: 0 0 500 600
// Projection: x = (lng - 68) / 29 * 440 + 20,  y = (37 - lat) / 29 * 560 + 20
// India simplified outline (clockwise from NW Kashmir)
const INDIA_OUTLINE =
  "119,30 149,49 157,68 134,97 146,103 179,107 214,146 220,184 263,194 " +
  "323,203 346,223 384,203 430,213 422,252 392,281 381,300 361,290 316,317 " +
  "308,339 286,368 255,406 210,455 202,503 205,536 164,570 154,576 146,561 " +
  "149,532 134,505 125,493 113,449 108,435 96,377 94,370 70,339 46,300 " +
  "23,300 28,290 43,277 46,265 81,261 88,232 79,209 63,194 58,175 63,155 " +
  "58,136 73,107 111,88 149,59 119,30";

export const EDGE_COLORS: Record<string, string> = {
  sea: "#0ea5e9",
  air: "#8b5cf6",
  dfc: "#f59e0b",
  rail: "#f59e0b",
  road: "#6b7280",
  industrial: "#FF9933",
  coastal: "#0079F2",
};

export interface MapNode {
  id: string;
  label: string;
  shortLabel?: string;
  x: number;
  y: number;
  color?: string;
  data?: Record<string, string | number>;
}

export interface MapEdge {
  from: string;
  to: string;
  type?: keyof typeof EDGE_COLORS;
  color?: string;
  dashed?: boolean;
  width?: number;
  data?: Record<string, string | number>;
}

export interface MapLegendItem {
  color: string;
  label: string;
  dashed?: boolean;
}

interface Props {
  nodes: MapNode[];
  edges: MapEdge[];
  legend?: MapLegendItem[];
  height?: number;
  className?: string;
  hint?: string;
}

function TooltipBox({
  svgX, svgY, children,
}: {
  svgX: number;
  svgY: number;
  children: React.ReactNode;
}) {
  const pctLeft = (svgX / 500) * 100;
  const pctTop = (svgY / 600) * 100;
  return (
    <div
      className="absolute z-50 bg-card border border-border rounded-lg px-3 py-2 shadow-xl pointer-events-none max-w-[220px] min-w-[140px]"
      style={{
        left: `${pctLeft}%`,
        top: `${pctTop}%`,
        transform: `translate(${pctLeft > 65 ? "-110%" : "8px"}, ${pctTop > 75 ? "-110%" : "-50%"})`,
      }}
    >
      {children}
    </div>
  );
}

export function IndiaNetworkMap({ nodes, edges, legend, height = 480, className, hint }: Props) {
  const [hoveredNode, setHoveredNode] = useState<MapNode | null>(null);
  const [hoveredEdge, setHoveredEdge] = useState<{ edge: MapEdge; mx: number; my: number } | null>(null);

  const nodeMap = Object.fromEntries(nodes.map((n) => [n.id, n]));

  return (
    <div className={`relative select-none overflow-hidden rounded-lg ${className ?? ""}`} style={{ height }}>
      <svg
        viewBox="0 0 500 600"
        preserveAspectRatio="xMidYMid meet"
        className="w-full h-full"
        onMouseLeave={() => { setHoveredNode(null); setHoveredEdge(null); }}
      >
        {/* India filled outline */}
        <polygon
          points={INDIA_OUTLINE}
          fill="hsl(var(--muted))"
          stroke="hsl(var(--border))"
          strokeWidth={1.2}
          opacity={0.9}
        />

        {/* Edges — invisible hit-area + visible line */}
        {edges.map((edge, i) => {
          const from = nodeMap[edge.from];
          const to = nodeMap[edge.to];
          if (!from || !to) return null;
          const color = edge.color ?? (edge.type ? EDGE_COLORS[edge.type] : "#888");
          const dashArr = edge.dashed ? "6,4" : undefined;
          const w = edge.width ?? 1.8;
          const mx = (from.x + to.x) / 2;
          const my = (from.y + to.y) / 2;
          return (
            <g key={i}>
              <line
                x1={from.x} y1={from.y} x2={to.x} y2={to.y}
                stroke="transparent" strokeWidth={14}
                style={{ cursor: "pointer" }}
                onMouseEnter={() => setHoveredEdge({ edge, mx, my })}
                onMouseLeave={() => setHoveredEdge(null)}
              />
              <line
                x1={from.x} y1={from.y} x2={to.x} y2={to.y}
                stroke={color}
                strokeWidth={w}
                strokeDasharray={dashArr}
                strokeLinecap="round"
                opacity={0.85}
                style={{ pointerEvents: "none" }}
              />
            </g>
          );
        })}

        {/* Nodes */}
        {nodes.map((node) => (
          <g
            key={node.id}
            style={{ cursor: "pointer" }}
            onMouseEnter={() => setHoveredNode(node)}
            onMouseLeave={() => setHoveredNode(null)}
          >
            <circle cx={node.x} cy={node.y} r={11} fill="transparent" />
            <circle
              cx={node.x} cy={node.y} r={hoveredNode?.id === node.id ? 7 : 5}
              fill={node.color ?? "#000080"}
              stroke="white"
              strokeWidth={1.5}
              style={{ transition: "r 0.1s" }}
            />
            <text
              x={node.x + 8}
              y={node.y + 4}
              fontSize={8}
              fill="hsl(var(--foreground))"
              style={{ pointerEvents: "none", userSelect: "none" }}
            >
              {node.shortLabel ?? node.label}
            </text>
          </g>
        ))}
      </svg>

      {/* Node tooltip */}
      {hoveredNode && (
        <TooltipBox svgX={hoveredNode.x} svgY={hoveredNode.y}>
          <p className="font-semibold text-sm mb-1 text-foreground leading-tight">{hoveredNode.label}</p>
          {hoveredNode.data &&
            Object.entries(hoveredNode.data).map(([k, v]) => (
              <p key={k} className="text-xs leading-snug">
                <span className="text-muted-foreground">{k}: </span>
                <span className="font-medium text-foreground">{v}</span>
              </p>
            ))}
        </TooltipBox>
      )}

      {/* Edge tooltip */}
      {hoveredEdge && !hoveredNode && (
        <TooltipBox svgX={hoveredEdge.mx} svgY={hoveredEdge.my}>
          {hoveredEdge.edge.data &&
            Object.entries(hoveredEdge.edge.data).map(([k, v]) => (
              <p key={k} className="text-xs leading-snug">
                <span className="text-muted-foreground">{k}: </span>
                <span className="font-medium text-foreground">{v}</span>
              </p>
            ))}
        </TooltipBox>
      )}

      {/* Legend */}
      {legend && legend.length > 0 && (
        <div className="absolute bottom-2 left-2 bg-card/90 border border-border rounded-md px-2 py-1.5 space-y-1 backdrop-blur-sm">
          {legend.map((item) => (
            <div key={item.label} className="flex items-center gap-1.5 text-xs text-foreground">
              <svg width={20} height={6}>
                <line
                  x1={0} y1={3} x2={20} y2={3}
                  stroke={item.color}
                  strokeWidth={2.5}
                  strokeDasharray={item.dashed ? "5,3" : undefined}
                  strokeLinecap="round"
                />
              </svg>
              <span>{item.label}</span>
            </div>
          ))}
        </div>
      )}

      {/* Hint */}
      {hint && (
        <p className="absolute bottom-2 right-2 text-xs text-muted-foreground bg-card/80 rounded px-1.5 py-0.5 pointer-events-none">
          {hint}
        </p>
      )}
    </div>
  );
}
