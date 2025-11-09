import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MapPin, Thermometer, Activity, Info, Layers } from "lucide-react";
import { useState } from "react";

const MapExplorer = () => {
  const [selectedCluster, setSelectedCluster] = useState<string | null>(null);

  const clusters = [
    { id: "mum", name: "Mumbai", uhi: 3.2, risk: "High", color: "from-red-500 to-orange-500" },
    { id: "pun", name: "Pune", uhi: 2.8, risk: "Medium", color: "from-orange-500 to-yellow-500" },
    { id: "nag", name: "Nagpur", uhi: 3.5, risk: "High", color: "from-red-600 to-red-500" },
    { id: "nas", name: "Nashik", uhi: 2.3, risk: "Medium", color: "from-yellow-500 to-green-500" },
    { id: "aur", name: "Aurangabad", uhi: 2.6, risk: "Medium", color: "from-orange-400 to-yellow-500" },
  ];

  return (
    <div className="min-h-screen p-4 md:p-8">
      <div className="container mx-auto space-y-6">
        {/* Header */}
        <div className="space-y-2">
          <h1 className="text-3xl md:text-4xl font-bold text-foreground">Interactive Map Explorer</h1>
          <p className="text-muted-foreground">
            Visualize Urban Heat Island intensity and health risk across Maharashtra's regional clusters
          </p>
        </div>

        {/* Main Content */}
        <div className="grid lg:grid-cols-4 gap-6">
          {/* Sidebar - Cluster List */}
          <Card className="p-6 space-y-4 lg:col-span-1">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-foreground">Regional Clusters</h2>
              <Layers className="h-5 w-5 text-primary" />
            </div>

            <div className="space-y-2">
              {clusters.map((cluster) => (
                <button
                  key={cluster.id}
                  onClick={() => setSelectedCluster(cluster.id)}
                  className={`w-full p-3 rounded-lg border transition-all text-left ${
                    selectedCluster === cluster.id
                      ? "border-primary bg-primary/10"
                      : "border-border hover:border-primary/50 hover:bg-muted/50"
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium text-foreground">{cluster.name}</span>
                    <MapPin className="h-4 w-4 text-primary" />
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Thermometer className="h-3 w-3 text-muted-foreground" />
                    <span className="text-muted-foreground">UHI: {cluster.uhi}°C</span>
                  </div>
                  <Badge
                    variant={cluster.risk === "High" ? "destructive" : "secondary"}
                    className="mt-2"
                  >
                    {cluster.risk} Risk
                  </Badge>
                </button>
              ))}
            </div>

            <div className="pt-4 border-t border-border space-y-2">
              <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
                <Info className="h-4 w-4 text-primary" />
                Legend
              </h3>
              <div className="space-y-1 text-sm">
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded bg-red-500" />
                  <span className="text-muted-foreground">High Intensity (&gt;3.0°C)</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded bg-orange-500" />
                  <span className="text-muted-foreground">Medium (2.0-3.0°C)</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded bg-green-500" />
                  <span className="text-muted-foreground">Low (&lt;2.0°C)</span>
                </div>
              </div>
            </div>
          </Card>

          {/* Map Area */}
          <div className="lg:col-span-3 space-y-6">
            {/* Map Container */}
            <Card className="p-6 min-h-[600px] relative overflow-hidden">
              {/* Placeholder for actual map integration */}
              <div className="absolute inset-6 bg-muted/30 rounded-lg border-2 border-dashed border-border flex items-center justify-center">
                <div className="text-center space-y-4 p-8">
                  <div className="flex justify-center">
                    <div className="p-4 bg-primary/10 rounded-full">
                      <MapPin className="h-12 w-12 text-primary" />
                    </div>
                  </div>
                  <h3 className="text-xl font-semibold text-foreground">Interactive Map</h3>
                  <p className="text-muted-foreground max-w-md">
                    This area will display an interactive Mapbox or Leaflet map with dynamic heatmap overlays, 
                    cluster boundaries, and clickable regions showing detailed UHI metrics.
                  </p>
                  <div className="flex gap-2 justify-center flex-wrap">
                    <Badge variant="outline" className="border-primary text-primary">
                      Heatmap Layer
                    </Badge>
                    <Badge variant="outline" className="border-secondary text-secondary">
                      Risk Index Layer
                    </Badge>
                    <Badge variant="outline" className="border-accent text-accent">
                      Boundaries Layer
                    </Badge>
                  </div>
                </div>
              </div>
            </Card>

            {/* Cluster Insights Panel */}
            {selectedCluster && (
              <Card className="p-6">
                <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                  <Activity className="h-5 w-5 text-primary" />
                  Cluster Insights
                </h3>
                <div className="grid md:grid-cols-3 gap-4">
                  {[
                    { label: "UHI Intensity", value: "3.2°C", change: "+0.3°C", trend: "up" },
                    { label: "Health Risk Index", value: "7.8/10", change: "+0.5", trend: "up" },
                    { label: "Vegetation Cover", value: "18%", change: "-2%", trend: "down" },
                  ].map((metric, idx) => (
                    <div key={idx} className="p-4 bg-muted/50 rounded-lg space-y-2">
                      <div className="text-sm text-muted-foreground">{metric.label}</div>
                      <div className="text-2xl font-bold text-foreground">{metric.value}</div>
                      <div
                        className={`text-sm ${
                          metric.trend === "up" ? "text-destructive" : "text-green-500"
                        }`}
                      >
                        {metric.change} from last month
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MapExplorer;
