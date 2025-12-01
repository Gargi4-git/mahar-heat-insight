import React, { useState } from "react";
import { GoogleMap, LoadScript, Marker, InfoWindow, Polygon } from "@react-google-maps/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Flame, Heart, Leaf, MapPin } from "lucide-react";

const GOOGLE_MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY || "";

const libraries: ("drawing" | "geometry")[] = ["drawing", "geometry"];

const mapContainerStyle = {
  width: "100%",
  height: "600px",
};

const center = {
  lat: 19.7515,
  lng: 75.7139,
};

const MapExplorer = () => {
  const [selectedCluster, setSelectedCluster] = useState<string | null>(null);
  const [activeMarker, setActiveMarker] = useState<string | null>(null);
  const [activeLayers, setActiveLayers] = useState({
    uhi: true,
    health: true,
    vegetation: true,
  });

  const clusters = [
    {
      name: "Mumbai",
      coords: { lat: 19.076, lng: 72.8777 },
      uhiScore: 8.5,
      healthRisk: 7.2,
      vegetation: 22,
      zone: "hot",
      boundary: [
        { lat: 19.3, lng: 72.7 },
        { lat: 19.3, lng: 73.1 },
        { lat: 18.85, lng: 73.1 },
        { lat: 18.85, lng: 72.7 },
      ],
    },
    {
      name: "Pune",
      coords: { lat: 18.5204, lng: 73.8567 },
      uhiScore: 7.8,
      healthRisk: 6.5,
      vegetation: 28,
      zone: "moderately-hot",
      boundary: [
        { lat: 18.7, lng: 73.65 },
        { lat: 18.7, lng: 74.05 },
        { lat: 18.35, lng: 74.05 },
        { lat: 18.35, lng: 73.65 },
      ],
    },
    {
      name: "Nagpur-Wardha",
      coords: { lat: 21.1458, lng: 79.0882 },
      uhiScore: 8.2,
      healthRisk: 7.0,
      vegetation: 25,
      zone: "hot",
      boundary: [
        { lat: 21.35, lng: 78.85 },
        { lat: 21.35, lng: 79.35 },
        { lat: 20.95, lng: 79.35 },
        { lat: 20.95, lng: 78.85 },
      ],
    },
    {
      name: "Nashik-Ahmednagar",
      coords: { lat: 19.9975, lng: 73.7898 },
      uhiScore: 7.5,
      healthRisk: 6.3,
      vegetation: 30,
      zone: "warm",
      boundary: [
        { lat: 20.2, lng: 73.55 },
        { lat: 20.2, lng: 74.05 },
        { lat: 19.8, lng: 74.05 },
        { lat: 19.8, lng: 73.55 },
      ],
    },
    {
      name: "Solapur-Sangli",
      coords: { lat: 17.6599, lng: 75.9064 },
      uhiScore: 7.3,
      healthRisk: 6.0,
      vegetation: 32,
      zone: "warm",
      boundary: [
        { lat: 17.85, lng: 75.65 },
        { lat: 17.85, lng: 76.15 },
        { lat: 17.45, lng: 76.15 },
        { lat: 17.45, lng: 75.65 },
      ],
    },
    {
      name: "Aurangabad-Jalna",
      coords: { lat: 19.8762, lng: 75.3433 },
      uhiScore: 7.9,
      healthRisk: 6.8,
      vegetation: 26,
      zone: "moderately-hot",
      boundary: [
        { lat: 20.05, lng: 75.1 },
        { lat: 20.05, lng: 75.6 },
        { lat: 19.7, lng: 75.6 },
        { lat: 19.7, lng: 75.1 },
      ],
    },
    {
      name: "Kolhapur-Ichalkarangi",
      coords: { lat: 16.7050, lng: 74.2433 },
      uhiScore: 6.8,
      healthRisk: 5.5,
      vegetation: 35,
      zone: "cold",
      boundary: [
        { lat: 16.9, lng: 74.0 },
        { lat: 16.9, lng: 74.5 },
        { lat: 16.5, lng: 74.5 },
        { lat: 16.5, lng: 74.0 },
      ],
    },
  ];

  const getZoneColor = (zone: string) => {
    switch (zone) {
      case "hot":
        return "#dc2626"; // red-600
      case "moderately-hot":
        return "#f97316"; // orange-500
      case "warm":
        return "#facc15"; // yellow-400
      case "cold":
        return "#22c55e"; // green-500
      default:
        return "#3b82f6"; // blue-500
    }
  };

  const getMarkerColor = (zone: string) => {
    switch (zone) {
      case "hot":
        return "https://maps.google.com/mapfiles/ms/icons/red-dot.png";
      case "moderately-hot":
        return "https://maps.google.com/mapfiles/ms/icons/orange-dot.png";
      case "warm":
        return "https://maps.google.com/mapfiles/ms/icons/yellow-dot.png";
      case "cold":
        return "https://maps.google.com/mapfiles/ms/icons/green-dot.png";
      default:
        return "https://maps.google.com/mapfiles/ms/icons/blue-dot.png";
    }
  };

  const toggleLayer = (layer: keyof typeof activeLayers) => {
    setActiveLayers((prev) => ({ ...prev, [layer]: !prev[layer] }));
  };

  const handleClusterSelect = (clusterName: string) => {
    setSelectedCluster(clusterName);
    setActiveMarker(clusterName);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-accent/5 animate-fade-in">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8 text-center animate-scale-in">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-primary via-accent to-primary-light bg-clip-text text-transparent animate-pulse-glow">
            Interactive Heat Map Explorer
          </h1>
          <p className="text-muted-foreground text-lg">
            Explore Urban Heat Island patterns across Maharashtra with real-time data visualization
          </p>
          <div className="mt-4 flex items-center justify-center gap-4 flex-wrap">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded-full bg-red-500 animate-pulse"></div>
              <span className="text-sm">Hot</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded-full bg-orange-500 animate-pulse"></div>
              <span className="text-sm">Moderately Hot</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded-full bg-yellow-500 animate-pulse"></div>
              <span className="text-sm">Warm</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded-full bg-green-500 animate-pulse"></div>
              <span className="text-sm">Cold</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar with cluster list */}
          <Card className="lg:col-span-1 hover:shadow-lg transition-all duration-300 animate-slide-in-left">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="h-5 w-5 text-primary animate-bounce" />
                Regional Clusters
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {clusters.map((cluster, index) => (
                <Button
                  key={cluster.name}
                  variant={selectedCluster === cluster.name ? "default" : "outline"}
                  className="w-full justify-start transition-all duration-300 hover:scale-105 animate-fade-in"
                  style={{ animationDelay: `${index * 0.1}s` }}
                  onClick={() => handleClusterSelect(cluster.name)}
                >
                  <div
                    className={`w-3 h-3 rounded-full mr-2 ${
                      cluster.zone === "hot"
                        ? "bg-red-500"
                        : cluster.zone === "moderately-hot"
                        ? "bg-orange-500"
                        : cluster.zone === "warm"
                        ? "bg-yellow-500"
                        : "bg-green-500"
                    } animate-pulse`}
                  ></div>
                  {cluster.name}
                </Button>
              ))}
            </CardContent>
          </Card>

          {/* Main map container */}
          <div className="lg:col-span-3 space-y-4 animate-slide-in-right">
            {/* Layer controls */}
            <Card className="hover:shadow-lg transition-all duration-300">
              <CardContent className="pt-6">
                <div className="flex flex-wrap gap-4">
                  <Button
                    variant={activeLayers.uhi ? "default" : "outline"}
                    onClick={() => toggleLayer("uhi")}
                    className="flex items-center gap-2 transition-all duration-300 hover:scale-105"
                  >
                    <Flame className={`h-4 w-4 ${activeLayers.uhi ? "animate-pulse" : ""}`} />
                    UHI Intensity
                  </Button>
                  <Button
                    variant={activeLayers.health ? "default" : "outline"}
                    onClick={() => toggleLayer("health")}
                    className="flex items-center gap-2 transition-all duration-300 hover:scale-105"
                  >
                    <Heart className={`h-4 w-4 ${activeLayers.health ? "animate-pulse" : ""}`} />
                    Health Risk
                  </Button>
                  <Button
                    variant={activeLayers.vegetation ? "default" : "outline"}
                    onClick={() => toggleLayer("vegetation")}
                    className="flex items-center gap-2 transition-all duration-300 hover:scale-105"
                  >
                    <Leaf className={`h-4 w-4 ${activeLayers.vegetation ? "animate-pulse" : ""}`} />
                    Vegetation
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Map */}
            <Card className="overflow-hidden hover:shadow-xl transition-all duration-300">
              <LoadScript googleMapsApiKey={GOOGLE_MAPS_API_KEY} libraries={libraries}>
                <GoogleMap
                  mapContainerStyle={mapContainerStyle}
                  center={center}
                  zoom={7}
                  options={{
                    styles: [
                      {
                        featureType: "all",
                        elementType: "geometry",
                        stylers: [{ color: "#242f3e" }],
                      },
                      {
                        featureType: "water",
                        elementType: "geometry",
                        stylers: [{ color: "#17263c" }],
                      },
                    ],
                  }}
                >
                  {/* Heat Zone Polygons */}
                  {clusters.map((cluster) => (
                    <React.Fragment key={`${cluster.name}-zone`}>
                      <Polygon
                        paths={cluster.boundary}
                        options={{
                          fillColor: getZoneColor(cluster.zone),
                          fillOpacity: activeLayers.uhi ? 0.4 : 0.2,
                          strokeColor: getZoneColor(cluster.zone),
                          strokeOpacity: 0.8,
                          strokeWeight: 2,
                        }}
                        onClick={() => handleClusterSelect(cluster.name)}
                      />
                    </React.Fragment>
                  ))}

                  {/* Markers */}
                  {clusters.map((cluster) => (
                    <Marker
                      key={cluster.name}
                      position={cluster.coords}
                      onClick={() => handleClusterSelect(cluster.name)}
                      icon={
                        typeof google !== 'undefined'
                          ? {
                              url: getMarkerColor(cluster.zone),
                              scaledSize: new google.maps.Size(40, 40),
                            }
                          : undefined
                      }
                      animation={
                        activeMarker === cluster.name && typeof google !== 'undefined'
                          ? google.maps.Animation.BOUNCE
                          : undefined
                      }
                    >
                      {activeMarker === cluster.name && (
                        <InfoWindow onCloseClick={() => setActiveMarker(null)}>
                          <div className="p-2">
                            <h3 className="font-bold text-lg mb-2">{cluster.name}</h3>
                            <div className="space-y-1 text-sm">
                              <p>
                                <span className="font-semibold">Zone:</span>{" "}
                                <span className="capitalize">{cluster.zone.replace("-", " ")}</span>
                              </p>
                              <p>
                                <span className="font-semibold">UHI Score:</span>{" "}
                                {cluster.uhiScore}/10
                              </p>
                              <p>
                                <span className="font-semibold">Health Risk:</span>{" "}
                                {cluster.healthRisk}/10
                              </p>
                              <p>
                                <span className="font-semibold">Vegetation:</span>{" "}
                                {cluster.vegetation}%
                              </p>
                            </div>
                          </div>
                        </InfoWindow>
                      )}
                    </Marker>
                  ))}

                </GoogleMap>
              </LoadScript>
            </Card>

            {/* Cluster insights panel */}
            {selectedCluster && (
              <Card className="border-primary/20 hover:shadow-xl transition-all duration-300 animate-scale-in">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MapPin className="h-5 w-5 text-primary animate-pulse" />
                    Cluster Insights: {selectedCluster}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2 p-4 rounded-lg bg-destructive/10 hover:bg-destructive/20 transition-all duration-300 hover:scale-105">
                      <div className="flex items-center gap-2 text-destructive">
                        <Flame className="h-5 w-5 animate-pulse" />
                        <span className="font-semibold">UHI Score</span>
                      </div>
                      <p className="text-3xl font-bold">
                        {clusters.find((c) => c.name === selectedCluster)?.uhiScore}
                      </p>
                    </div>
                    <div className="space-y-2 p-4 rounded-lg bg-orange-500/10 hover:bg-orange-500/20 transition-all duration-300 hover:scale-105">
                      <div className="flex items-center gap-2 text-orange-500">
                        <Heart className="h-5 w-5 animate-pulse" />
                        <span className="font-semibold">Health Risk</span>
                      </div>
                      <p className="text-3xl font-bold">
                        {clusters.find((c) => c.name === selectedCluster)?.healthRisk}
                      </p>
                    </div>
                    <div className="space-y-2 p-4 rounded-lg bg-green-500/10 hover:bg-green-500/20 transition-all duration-300 hover:scale-105">
                      <div className="flex items-center gap-2 text-green-500">
                        <Leaf className="h-5 w-5 animate-pulse" />
                        <span className="font-semibold">Vegetation %</span>
                      </div>
                      <p className="text-3xl font-bold">
                        {clusters.find((c) => c.name === selectedCluster)?.vegetation}%
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MapExplorer;
