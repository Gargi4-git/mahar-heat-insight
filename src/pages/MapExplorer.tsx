import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MapPin, Thermometer, Activity, Info, Layers, Eye, EyeOff } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { useToast } from "@/hooks/use-toast";

const MapExplorer = () => {
  const [selectedCluster, setSelectedCluster] = useState<string | null>(null);
  const [mapboxToken, setMapboxToken] = useState<string>("");
  const [mapInitialized, setMapInitialized] = useState(false);
  const [activeLayers, setActiveLayers] = useState({
    uhi: true,
    healthRisk: false,
    vegetation: false,
  });
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const { toast } = useToast();

  const clusters = [
    { id: "mum", name: "Mumbai", uhi: 3.2, risk: 8.5, vegetation: 18, coords: [72.8777, 19.0760], color: "from-red-500 to-orange-500" },
    { id: "pun", name: "Pune", uhi: 2.8, risk: 6.2, vegetation: 25, coords: [73.8567, 18.5204], color: "from-orange-500 to-yellow-500" },
    { id: "nag", name: "Nagpur", uhi: 3.5, risk: 9.1, vegetation: 15, coords: [79.0882, 21.1458], color: "from-red-600 to-red-500" },
    { id: "nas", name: "Nashik", uhi: 2.3, risk: 5.0, vegetation: 32, coords: [73.7898, 19.9975], color: "from-yellow-500 to-green-500" },
    { id: "aur", name: "Aurangabad", uhi: 2.6, risk: 5.8, vegetation: 28, coords: [75.3433, 19.8762], color: "from-orange-400 to-yellow-500" },
  ];

  useEffect(() => {
    if (!mapContainer.current || !mapboxToken || mapInitialized) return;

    try {
      mapboxgl.accessToken = mapboxToken;
      
      map.current = new mapboxgl.Map({
        container: mapContainer.current,
        style: "mapbox://styles/mapbox/dark-v11",
        center: [75.7139, 19.7515], // Maharashtra center
        zoom: 6.5,
      });

      map.current.addControl(new mapboxgl.NavigationControl(), "top-right");

      map.current.on("load", () => {
        if (!map.current) return;

        // Add cluster markers and boundaries
        clusters.forEach((cluster) => {
          // Add marker
          const el = document.createElement("div");
          el.className = "cluster-marker";
          el.style.width = "40px";
          el.style.height = "40px";
          el.style.borderRadius = "50%";
          el.style.backgroundColor = `hsl(${cluster.uhi > 3 ? "0 84% 60%" : cluster.uhi > 2.5 ? "25 95% 53%" : "142 76% 36%"})`;
          el.style.border = "3px solid white";
          el.style.cursor = "pointer";
          el.style.boxShadow = "0 2px 10px rgba(0,0,0,0.3)";

          new mapboxgl.Marker(el)
            .setLngLat(cluster.coords as [number, number])
            .addTo(map.current!);

          el.addEventListener("click", () => {
            setSelectedCluster(cluster.id);
            map.current?.flyTo({
              center: cluster.coords as [number, number],
              zoom: 9,
              duration: 1500,
            });
          });

          // Add popup on hover
          const popup = new mapboxgl.Popup({ offset: 25, closeButton: false })
            .setHTML(`
              <div style="padding: 8px;">
                <h3 style="font-weight: bold; margin-bottom: 4px;">${cluster.name}</h3>
                <p style="margin: 2px 0;">🌡️ UHI: ${cluster.uhi}°C</p>
                <p style="margin: 2px 0;">🏥 Risk: ${cluster.risk}/10</p>
                <p style="margin: 2px 0;">🌳 Vegetation: ${cluster.vegetation}%</p>
              </div>
            `);

          el.addEventListener("mouseenter", () => {
            popup.setLngLat(cluster.coords as [number, number]).addTo(map.current!);
          });

          el.addEventListener("mouseleave", () => {
            popup.remove();
          });
        });

        // Add UHI heatmap layer
        map.current!.addSource("uhi-heat", {
          type: "geojson",
          data: {
            type: "FeatureCollection",
            features: clusters.map((cluster) => ({
              type: "Feature",
              properties: {
                intensity: cluster.uhi,
              },
              geometry: {
                type: "Point",
                coordinates: cluster.coords,
              },
            })),
          },
        });

        map.current!.addLayer({
          id: "uhi-heatmap",
          type: "heatmap",
          source: "uhi-heat",
          paint: {
            "heatmap-weight": ["interpolate", ["linear"], ["get", "intensity"], 0, 0, 5, 1],
            "heatmap-intensity": ["interpolate", ["linear"], ["zoom"], 0, 1, 9, 3],
            "heatmap-color": [
              "interpolate",
              ["linear"],
              ["heatmap-density"],
              0, "rgba(33,102,172,0)",
              0.2, "rgb(103,169,207)",
              0.4, "rgb(209,229,240)",
              0.6, "rgb(253,219,199)",
              0.8, "rgb(239,138,98)",
              1, "rgb(178,24,43)",
            ],
            "heatmap-radius": ["interpolate", ["linear"], ["zoom"], 0, 20, 9, 40],
            "heatmap-opacity": 0.8,
          },
        });

        // Add health risk layer
        map.current!.addSource("health-risk", {
          type: "geojson",
          data: {
            type: "FeatureCollection",
            features: clusters.map((cluster) => ({
              type: "Feature",
              properties: {
                risk: cluster.risk,
              },
              geometry: {
                type: "Point",
                coordinates: cluster.coords,
              },
            })),
          },
        });

        map.current!.addLayer({
          id: "health-heatmap",
          type: "heatmap",
          source: "health-risk",
          paint: {
            "heatmap-weight": ["interpolate", ["linear"], ["get", "risk"], 0, 0, 10, 1],
            "heatmap-intensity": ["interpolate", ["linear"], ["zoom"], 0, 1, 9, 3],
            "heatmap-color": [
              "interpolate",
              ["linear"],
              ["heatmap-density"],
              0, "rgba(0,0,0,0)",
              0.2, "rgb(255,245,0)",
              0.4, "rgb(255,200,0)",
              0.6, "rgb(255,150,0)",
              0.8, "rgb(255,100,0)",
              1, "rgb(200,0,0)",
            ],
            "heatmap-radius": ["interpolate", ["linear"], ["zoom"], 0, 25, 9, 50],
            "heatmap-opacity": 0.7,
          },
          layout: {
            visibility: "none",
          },
        });

        // Add vegetation layer
        map.current!.addSource("vegetation", {
          type: "geojson",
          data: {
            type: "FeatureCollection",
            features: clusters.map((cluster) => ({
              type: "Feature",
              properties: {
                vegetation: cluster.vegetation,
              },
              geometry: {
                type: "Point",
                coordinates: cluster.coords,
              },
            })),
          },
        });

        map.current!.addLayer({
          id: "vegetation-heatmap",
          type: "heatmap",
          source: "vegetation",
          paint: {
            "heatmap-weight": ["interpolate", ["linear"], ["get", "vegetation"], 0, 0, 50, 1],
            "heatmap-intensity": ["interpolate", ["linear"], ["zoom"], 0, 1, 9, 3],
            "heatmap-color": [
              "interpolate",
              ["linear"],
              ["heatmap-density"],
              0, "rgba(0,0,0,0)",
              0.2, "rgb(255,255,178)",
              0.4, "rgb(190,255,128)",
              0.6, "rgb(120,198,121)",
              0.8, "rgb(49,163,84)",
              1, "rgb(0,104,55)",
            ],
            "heatmap-radius": ["interpolate", ["linear"], ["zoom"], 0, 25, 9, 50],
            "heatmap-opacity": 0.7,
          },
          layout: {
            visibility: "none",
          },
        });

        setMapInitialized(true);
        toast({
          title: "Map initialized",
          description: "Interactive map with heatmap overlays loaded successfully",
        });
      });
    } catch (error) {
      toast({
        title: "Map initialization failed",
        description: "Please check your Mapbox token and try again",
        variant: "destructive",
      });
    }

    return () => {
      map.current?.remove();
    };
  }, [mapboxToken, mapInitialized, toast]);

  useEffect(() => {
    if (!map.current || !mapInitialized) return;

    map.current.setLayoutProperty(
      "uhi-heatmap",
      "visibility",
      activeLayers.uhi ? "visible" : "none"
    );
    map.current.setLayoutProperty(
      "health-heatmap",
      "visibility",
      activeLayers.healthRisk ? "visible" : "none"
    );
    map.current.setLayoutProperty(
      "vegetation-heatmap",
      "visibility",
      activeLayers.vegetation ? "visible" : "none"
    );
  }, [activeLayers, mapInitialized]);

  const toggleLayer = (layer: keyof typeof activeLayers) => {
    setActiveLayers((prev) => ({ ...prev, [layer]: !prev[layer] }));
  };

  const handleClusterSelect = (clusterId: string) => {
    setSelectedCluster(clusterId);
    const cluster = clusters.find((c) => c.id === clusterId);
    if (cluster && map.current) {
      map.current.flyTo({
        center: cluster.coords as [number, number],
        zoom: 9,
        duration: 1500,
      });
    }
  };

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

        {/* Mapbox Token Input */}
        {!mapInitialized && (
          <Card className="p-6 bg-accent/10 border-accent">
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <Info className="h-5 w-5 text-accent mt-0.5" />
                <div className="space-y-2 flex-1">
                  <h3 className="font-semibold text-foreground">Mapbox Token Required</h3>
                  <p className="text-sm text-muted-foreground">
                    Enter your Mapbox public token to initialize the interactive map.
                    Get your token from{" "}
                    <a
                      href="https://mapbox.com/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-accent hover:underline"
                    >
                      mapbox.com
                    </a>
                  </p>
                  <div className="flex gap-2">
                    <Input
                      type="text"
                      placeholder="pk.eyJ1Ijoi..."
                      value={mapboxToken}
                      onChange={(e) => setMapboxToken(e.target.value)}
                      className="flex-1"
                    />
                    <Button onClick={() => setMapboxToken(mapboxToken)}>Initialize Map</Button>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        )}

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
                  onClick={() => handleClusterSelect(cluster.id)}
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
                  <div className="flex items-center gap-2 text-sm mb-1">
                    <Thermometer className="h-3 w-3 text-muted-foreground" />
                    <span className="text-muted-foreground">UHI: {cluster.uhi}°C</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Activity className="h-3 w-3 text-muted-foreground" />
                    <span className="text-muted-foreground">Risk: {cluster.risk}/10</span>
                  </div>
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
            {/* Layer Controls */}
            {mapInitialized && (
              <Card className="p-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
                    <Layers className="h-4 w-4 text-primary" />
                    Active Layers
                  </h3>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant={activeLayers.uhi ? "default" : "outline"}
                      onClick={() => toggleLayer("uhi")}
                      className="gap-2"
                    >
                      {activeLayers.uhi ? <Eye className="h-3 w-3" /> : <EyeOff className="h-3 w-3" />}
                      UHI Intensity
                    </Button>
                    <Button
                      size="sm"
                      variant={activeLayers.healthRisk ? "default" : "outline"}
                      onClick={() => toggleLayer("healthRisk")}
                      className="gap-2"
                    >
                      {activeLayers.healthRisk ? <Eye className="h-3 w-3" /> : <EyeOff className="h-3 w-3" />}
                      Health Risk
                    </Button>
                    <Button
                      size="sm"
                      variant={activeLayers.vegetation ? "default" : "outline"}
                      onClick={() => toggleLayer("vegetation")}
                      className="gap-2"
                    >
                      {activeLayers.vegetation ? <Eye className="h-3 w-3" /> : <EyeOff className="h-3 w-3" />}
                      Vegetation
                    </Button>
                  </div>
                </div>
              </Card>
            )}

            {/* Map Container */}
            <Card className="p-0 overflow-hidden">
              <div ref={mapContainer} className="w-full h-[600px] rounded-lg" />
            </Card>

            {/* Cluster Insights Panel */}
            {selectedCluster && (
              <Card className="p-6">
                <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                  <Activity className="h-5 w-5 text-primary" />
                  {clusters.find((c) => c.id === selectedCluster)?.name} - Cluster Insights
                </h3>
                <div className="grid md:grid-cols-3 gap-4">
                  {(() => {
                    const cluster = clusters.find((c) => c.id === selectedCluster);
                    if (!cluster) return null;
                    return [
                      { label: "UHI Intensity", value: `${cluster.uhi}°C`, change: "+0.3°C", trend: "up" },
                      { label: "Health Risk Index", value: `${cluster.risk}/10`, change: "+0.5", trend: "up" },
                      { label: "Vegetation Cover", value: `${cluster.vegetation}%`, change: "-2%", trend: "down" },
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
                    ));
                  })()}
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
