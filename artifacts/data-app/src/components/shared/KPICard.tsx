import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowUp, ArrowDown } from "lucide-react";

interface KPICardProps {
  title: string;
  value: string;
  change?: string;
  trend?: "up" | "down" | "neutral";
  loading?: boolean;
}

export function KPICard({ title, value, change, trend, loading }: KPICardProps) {
  const isPositive = trend === "up";
  const isNegative = trend === "down";

  return (
    <Card>
      <CardContent className="p-6">
        {loading ? (
          <>
            <Skeleton className="h-4 w-24 mb-2" />
            <Skeleton className="h-8 w-32" />
          </>
        ) : (
          <>
            <p className="text-sm text-muted-foreground">{title}</p>
            <p className="text-2xl font-bold mt-1" style={{ color: "#000080" }}>{value}</p>
            {change && (
              <div className="flex items-center gap-1 mt-1">
                {isPositive ? (
                  <ArrowUp className="w-4 h-4 text-green-600 dark:text-green-400" />
                ) : isNegative ? (
                  <ArrowDown className="w-4 h-4 text-red-600 dark:text-red-400" />
                ) : null}
                <span className={`text-sm ${
                  isPositive ? "text-green-600 dark:text-green-400" : 
                  isNegative ? "text-red-600 dark:text-red-400" : 
                  "text-muted-foreground"
                }`}>
                  {change}
                </span>
                <span className="text-sm text-muted-foreground">vs 2024</span>
              </div>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
}
