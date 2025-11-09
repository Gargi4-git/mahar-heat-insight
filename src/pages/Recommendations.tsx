import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Lightbulb, Download, Leaf, Building2, CloudRain, Droplets, Sparkles } from "lucide-react";
import { useState } from "react";

const Recommendations = () => {
  const [isGenerating, setIsGenerating] = useState(false);

  const recommendations = [
    {
      icon: Leaf,
      category: "Green Infrastructure",
      priority: "High",
      title: "Increase Urban Vegetation Coverage",
      description:
        "Expand green spaces by planting native trees and creating urban forests. Target a 25% increase in NDVI across high-risk clusters. Focus on heat-absorbing concrete areas with green corridors and pocket parks.",
      impact: "Expected UHI reduction: 1.2°C",
      actions: [
        "Plant 10,000 native trees in Mumbai cluster",
        "Create 15 new pocket parks in dense areas",
        "Establish green corridors along major roads",
        "Implement rooftop gardens on public buildings",
      ],
    },
    {
      icon: Building2,
      category: "Urban Planning",
      priority: "High",
      title: "Cool Roofs & Reflective Surfaces",
      description:
        "Mandate cool roof installations for new constructions and incentivize retrofits for existing buildings. Use high-albedo materials to reflect solar radiation and reduce surface temperatures.",
      impact: "Expected UHI reduction: 0.8°C",
      actions: [
        "Mandate cool roofs for all new buildings",
        "Provide subsidies for cool roof retrofits",
        "Use reflective pavements in parking areas",
        "Paint building exteriors with reflective coatings",
      ],
    },
    {
      icon: CloudRain,
      category: "Climate Adaptation",
      priority: "Medium",
      title: "Enhance Microclimate Regulation",
      description:
        "Install misting systems in public spaces during heat waves. Create water features and increase humidity in dry zones to improve thermal comfort and reduce local temperature spikes.",
      impact: "Expected health risk reduction: 15%",
      actions: [
        "Install public misting stations in markets",
        "Create water fountains in parks",
        "Develop artificial lakes in suburban areas",
        "Implement fog cooling in crowded zones",
      ],
    },
    {
      icon: Droplets,
      category: "Water Management",
      priority: "Medium",
      title: "Integrated Water Systems",
      description:
        "Develop blue-green infrastructure combining water management with vegetation. Implement rainwater harvesting, permeable pavements, and bioswales to manage runoff while cooling urban areas.",
      impact: "Expected UHI reduction: 0.5°C",
      actions: [
        "Install rainwater harvesting in 1,000 buildings",
        "Create bioswales along 50km of roads",
        "Build retention ponds in 20 neighborhoods",
        "Replace concrete with permeable surfaces",
      ],
    },
  ];

  const handleGenerate = () => {
    setIsGenerating(true);
    setTimeout(() => setIsGenerating(false), 2000);
  };

  return (
    <div className="min-h-screen p-4 md:p-8">
      <div className="container mx-auto max-w-5xl space-y-6">
        {/* Header */}
        <div className="space-y-2">
          <h1 className="text-3xl md:text-4xl font-bold text-foreground">AI-Powered Recommendations</h1>
          <p className="text-muted-foreground">
            Data-driven mitigation strategies to reduce Urban Heat Island effects and improve public health
          </p>
        </div>

        {/* Action Bar */}
        <Card className="p-4 flex flex-col sm:flex-row items-center justify-between gap-4 bg-gradient-to-r from-primary/5 via-secondary/5 to-accent/5 border-primary/20">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary rounded-lg">
              <Sparkles className="h-5 w-5 text-primary-foreground" />
            </div>
            <div>
              <div className="font-semibold text-foreground">Generate Custom Report</div>
              <div className="text-sm text-muted-foreground">AI-powered recommendations for your cluster</div>
            </div>
          </div>
          <div className="flex gap-2">
            <Button
              onClick={handleGenerate}
              disabled={isGenerating}
              variant="outline"
              className="border-secondary text-secondary hover:bg-secondary/10"
            >
              {isGenerating ? "Generating..." : "Generate AI Report"}
            </Button>
            <Button className="bg-accent text-accent-foreground hover:bg-accent-dark">
              <Download className="mr-2 h-4 w-4" />
              Download PDF
            </Button>
          </div>
        </Card>

        {/* Recommendations */}
        <div className="space-y-6">
          {recommendations.map((rec, idx) => (
            <Card key={idx} className="p-6 space-y-6 hover:shadow-lg transition-smooth">
              {/* Header */}
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-primary/10 rounded-lg">
                    <rec.icon className="h-6 w-6 text-primary" />
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="text-xl font-semibold text-foreground">{rec.title}</h3>
                      <Badge
                        variant={rec.priority === "High" ? "destructive" : "secondary"}
                        className={rec.priority === "High" ? "bg-accent text-accent-foreground" : ""}
                      >
                        {rec.priority} Priority
                      </Badge>
                    </div>
                    <div className="text-sm text-muted-foreground">{rec.category}</div>
                  </div>
                </div>
              </div>

              {/* Description */}
              <p className="text-muted-foreground leading-relaxed">{rec.description}</p>

              {/* Impact Badge */}
              <div className="p-3 bg-green-500/10 border border-green-500/20 rounded-lg">
                <div className="flex items-center gap-2 text-green-600">
                  <Lightbulb className="h-4 w-4" />
                  <span className="font-semibold text-sm">{rec.impact}</span>
                </div>
              </div>

              {/* Action Items */}
              <div className="space-y-3">
                <h4 className="font-semibold text-foreground text-sm">Recommended Actions:</h4>
                <ul className="space-y-2">
                  {rec.actions.map((action, actionIdx) => (
                    <li key={actionIdx} className="flex items-start gap-3 text-sm text-muted-foreground">
                      <div className="mt-1 h-1.5 w-1.5 rounded-full bg-primary flex-shrink-0" />
                      <span>{action}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </Card>
          ))}
        </div>

        {/* Summary Card */}
        <Card className="p-6 space-y-4 bg-gradient-to-br from-primary/5 to-secondary/5 border-primary/20">
          <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
            <Lightbulb className="h-5 w-5 text-accent" />
            Implementation Summary
          </h3>
          <div className="grid md:grid-cols-3 gap-4">
            <div className="p-4 bg-card rounded-lg border border-border">
              <div className="text-2xl font-bold text-primary mb-1">4</div>
              <div className="text-sm text-muted-foreground">Total Strategies</div>
            </div>
            <div className="p-4 bg-card rounded-lg border border-border">
              <div className="text-2xl font-bold text-accent mb-1">2.5°C</div>
              <div className="text-sm text-muted-foreground">Potential UHI Reduction</div>
            </div>
            <div className="p-4 bg-card rounded-lg border border-border">
              <div className="text-2xl font-bold text-green-500 mb-1">15%</div>
              <div className="text-sm text-muted-foreground">Health Risk Reduction</div>
            </div>
          </div>
          <p className="text-sm text-muted-foreground">
            Implementing these recommendations in combination can significantly reduce Urban Heat Island 
            effects and improve public health outcomes across Maharashtra's regional clusters. Prioritize 
            high-impact interventions in areas with the highest UHI intensity.
          </p>
        </Card>
      </div>
    </div>
  );
};

export default Recommendations;
