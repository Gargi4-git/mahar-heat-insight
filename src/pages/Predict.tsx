import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Upload, FileSpreadsheet, Loader2, Download, Sparkles } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

const Predict = () => {
  const [isUploading, setIsUploading] = useState(false);
  const [isPredicting, setIsPredicting] = useState(false);
  const [predictions, setPredictions] = useState<any[] | null>(null);
  const { toast } = useToast();

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.name.endsWith('.csv')) {
      toast({
        title: "Invalid File",
        description: "Please upload a CSV file",
        variant: "destructive",
      });
      return;
    }

    setIsUploading(true);
    // Simulate upload
    setTimeout(() => {
      setIsUploading(false);
      toast({
        title: "File Uploaded",
        description: `${file.name} uploaded successfully`,
      });
    }, 1500);
  };

  const handlePredict = async () => {
    setIsPredicting(true);
    // Simulate API call
    setTimeout(() => {
      setPredictions([
        { cluster: "Mumbai", lat: 19.076, lon: 72.877, uhi: 3.2, health_risk: 7.8 },
        { cluster: "Pune", lat: 18.520, lon: 73.856, uhi: 2.8, health_risk: 6.5 },
        { cluster: "Nagpur", lat: 21.145, lon: 79.088, uhi: 3.5, health_risk: 8.2 },
      ]);
      setIsPredicting(false);
      toast({
        title: "Predictions Complete",
        description: "UHI intensity and health risk calculated successfully",
      });
    }, 2000);
  };

  return (
    <div className="min-h-screen p-4 md:p-8">
      <div className="container mx-auto max-w-6xl space-y-6">
        {/* Header */}
        <div className="space-y-2">
          <h1 className="text-3xl md:text-4xl font-bold text-foreground">UHI Prediction</h1>
          <p className="text-muted-foreground">
            Upload CSV data or input coordinates to predict Urban Heat Island intensity and health impact
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* CSV Upload */}
          <Card className="p-6 space-y-6">
            <div className="space-y-2">
              <h2 className="text-xl font-semibold text-foreground flex items-center gap-2">
                <FileSpreadsheet className="h-5 w-5 text-primary" />
                Batch Prediction (CSV)
              </h2>
              <p className="text-sm text-muted-foreground">
                Upload a CSV file with latitude, longitude, and month columns
              </p>
            </div>

            <div className="border-2 border-dashed border-border rounded-lg p-8 text-center space-y-4 hover:border-primary/50 transition-smooth">
              <div className="flex justify-center">
                <div className="p-4 bg-primary/10 rounded-full">
                  <Upload className="h-8 w-8 text-primary" />
                </div>
              </div>
              <div>
                <Label htmlFor="csv-upload" className="cursor-pointer">
                  <div className="text-foreground font-medium mb-1">
                    Click to upload or drag and drop
                  </div>
                  <div className="text-sm text-muted-foreground">
                    CSV file (MAX. 10MB)
                  </div>
                </Label>
                <Input
                  id="csv-upload"
                  type="file"
                  accept=".csv"
                  className="hidden"
                  onChange={handleFileUpload}
                />
              </div>
              {isUploading && (
                <div className="flex items-center justify-center gap-2 text-primary">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span className="text-sm">Uploading...</span>
                </div>
              )}
            </div>

            <div className="space-y-2">
              <h3 className="text-sm font-semibold text-foreground">CSV Format Example:</h3>
              <div className="bg-muted/50 p-3 rounded-lg font-mono text-xs">
                latitude,longitude,month<br />
                19.0760,72.8777,6<br />
                18.5204,73.8567,7
              </div>
            </div>
          </Card>

          {/* Manual Input */}
          <Card className="p-6 space-y-6">
            <div className="space-y-2">
              <h2 className="text-xl font-semibold text-foreground flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-secondary" />
                Single Location Prediction
              </h2>
              <p className="text-sm text-muted-foreground">
                Enter coordinates manually for instant prediction
              </p>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="latitude">Latitude</Label>
                <Input
                  id="latitude"
                  type="number"
                  placeholder="19.0760"
                  step="0.0001"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="longitude">Longitude</Label>
                <Input
                  id="longitude"
                  type="number"
                  placeholder="72.8777"
                  step="0.0001"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="month">Month</Label>
                <Input
                  id="month"
                  type="number"
                  placeholder="6"
                  min="1"
                  max="12"
                />
              </div>

              <Button
                onClick={handlePredict}
                disabled={isPredicting}
                className="w-full bg-secondary text-secondary-foreground hover:bg-secondary-dark"
              >
                {isPredicting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Predicting...
                  </>
                ) : (
                  <>
                    <Sparkles className="mr-2 h-4 w-4" />
                    Predict Now
                  </>
                )}
              </Button>
            </div>
          </Card>
        </div>

        {/* Results */}
        {predictions && (
          <Card className="p-6 space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-foreground">Prediction Results</h2>
              <Button variant="outline" size="sm">
                <Download className="mr-2 h-4 w-4" />
                Download CSV
              </Button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-3 px-4 text-sm font-semibold text-foreground">Cluster</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-foreground">Latitude</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-foreground">Longitude</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-foreground">UHI Intensity (°C)</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-foreground">Health Risk Index</th>
                  </tr>
                </thead>
                <tbody>
                  {predictions.map((pred, idx) => (
                    <tr key={idx} className="border-b border-border hover:bg-muted/50 transition-smooth">
                      <td className="py-3 px-4 text-sm text-foreground font-medium">{pred.cluster}</td>
                      <td className="py-3 px-4 text-sm text-muted-foreground">{pred.lat}</td>
                      <td className="py-3 px-4 text-sm text-muted-foreground">{pred.lon}</td>
                      <td className="py-3 px-4 text-sm">
                        <span className="px-2 py-1 bg-destructive/10 text-destructive rounded font-medium">
                          {pred.uhi}°C
                        </span>
                      </td>
                      <td className="py-3 px-4 text-sm">
                        <span className="px-2 py-1 bg-accent/10 text-accent-foreground rounded font-medium">
                          {pred.health_risk}/10
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
};

export default Predict;
