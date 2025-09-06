import React, { useState } from "react";
import { Helmet } from "react-helmet-async";
import { canonical } from "@/lib/seo";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Brain, BookOpen, TrendingUp, MessageCircle, Zap, Target } from "lucide-react";

export default function AIToolsHub() {
  const [prompt, setPrompt] = useState("");
  const [response, setResponse] = useState("");

  const aiTools = [
    {
      id: "coach",
      title: "AI Gaming Coach",
      description: "Get personalized strategy advice and skill improvement tips",
      icon: Brain,
      color: "blue",
      examples: [
        "How to improve my aiming in FPS games?",
        "Best strategies for GTA 6 heists",
        "Team composition tips for competitive play"
      ]
    },
    {
      id: "guide",
      title: "AI Game Guides",
      description: "Instant walkthroughs, tips, and game explanations",
      icon: BookOpen,
      color: "green",
      examples: [
        "GTA 6 mission walkthrough",
        "Hidden secrets in popular games",
        "Boss fight strategies"
      ]
    },
    {
      id: "trading",
      title: "AI Trading Bot",
      description: "Market analysis and digital asset trading predictions",
      icon: TrendingUp,
      color: "yellow",
      examples: [
        "Should I buy this game account?",
        "Market trends for gaming assets",
        "Best time to sell my collection"
      ]
    },
    {
      id: "chat",
      title: "Gaming Assistant",
      description: "Ask questions about games, hardware, and gaming culture",
      icon: MessageCircle,
      color: "purple",
      examples: [
        "What's the best GPU for 4K gaming?",
        "Explain gaming slang and terms",
        "Hardware troubleshooting help"
      ]
    }
  ];

  const handleAIQuery = async (toolId: string) => {
    if (!prompt.trim()) return;

    // Mock AI response - in real implementation, this would call an AI API
    setResponse(`AI ${toolId}: "${prompt}" - Based on your query, here's my analysis... This is a mock response. Real AI integration would provide detailed, contextual gaming advice and insights.`);
  };

  return (
    <>
      <Helmet>
        <title>AI Gaming Tools | Coach, Guides, Trading Bot | GameXBuddy</title>
        <link rel="canonical" href={canonical("/ai-tools")} />
        <meta name="description" content="Advanced AI-powered gaming tools: personal coach, strategy guides, trading analysis, and gaming assistant for ultimate gaming intelligence." />
      </Helmet>
      <div className="space-y-6">
        <div className="text-center">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-[#ff2bd6] to-[#00f5ff] bg-clip-text text-transparent">
            🤖 AI Gaming Intelligence
          </h1>
          <p className="text-white/70 mt-2">Let AI supercharge your gaming experience with expert guidance</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {aiTools.map((tool) => {
            const IconComponent = tool.icon;
            return (
              <Card
                key={tool.id}
                className="border-white/10 bg-gradient-to-br from-black/50 to-gray-900/50 hover:scale-105 transition-all duration-300"
              >
                <CardHeader>
                  <div className={`w-12 h-12 bg-${tool.color}-500/20 rounded-full flex items-center justify-center mb-4`}>
                    <IconComponent className={`w-6 h-6 text-${tool.color}-400`} />
                  </div>
                  <CardTitle className="text-white text-xl">{tool.title}</CardTitle>
                  <p className="text-white/70 text-sm">{tool.description}</p>
                </CardHeader>

                <CardContent>
                  <div className="space-y-3 mb-4">
                    <h4 className="text-sm font-semibold text-white/80">Example Queries:</h4>
                    {tool.examples.map((example, idx) => (
                      <div
                        key={idx}
                        className="text-xs text-white/60 bg-white/5 p-2 rounded cursor-pointer hover:bg-white/10 transition-colors"
                        onClick={() => setPrompt(example)}
                      >
                        "{example}"
                      </div>
                    ))}
                  </div>

                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={() => {
                      setPrompt(`Use ${tool.title} for: ${tool.examples[0]}`);
                      handleAIQuery(tool.id);
                    }}
                  >
                    <Zap className="w-4 h-4 mr-2" />
                    Try {tool.title}
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <Card className="border-primary/30 bg-gradient-to-br from-primary/5 to-secondary/5">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageCircle className="w-5 h-5" />
              AI Gaming Assistant
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Textarea
              placeholder="Ask me anything about gaming... strategies, hardware, market trends, or get personalized coaching tips!"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              className="min-h-[100px]"
            />

            <div className="flex gap-3">
              <Button
                variant="neon"
                onClick={() => handleAIQuery("assistant")}
                disabled={!prompt.trim()}
                className="flex-1"
              >
                <Brain className="w-4 h-4 mr-2" />
                Get AI Response
              </Button>

              <Button
                variant="outline"
                onClick={() => {
                  setPrompt("");
                  setResponse("");
                }}
                className="px-6"
              >
                Clear
              </Button>
            </div>

            {response && (
              <div className="mt-4 p-4 bg-white/5 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Badge variant="secondary">AI Response</Badge>
                  <span className="text-xs text-white/60">Mock Results</span>
                </div>
                <p className="text-white/80">{response}</p>
              </div>
            )}
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="border-blue-500/30 bg-gradient-to-br from-blue-500/5 to-cyan-500/5">
            <CardContent className="p-6 text-center">
              <Brain className="w-12 h-12 text-blue-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-blue-400 mb-2">Personalized Coaching</h3>
              <p className="text-white/70 text-sm">Get tailored strategies based on your gaming style and goals</p>
            </CardContent>
          </Card>

          <Card className="border-green-500/30 bg-gradient-to-br from-green-500/5 to-emerald-500/5">
            <CardContent className="p-6 text-center">
              <BookOpen className="w-12 h-12 text-green-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-green-400 mb-2">Instant Knowledge</h3>
              <p className="text-white/70 text-sm">Access comprehensive game guides and walkthroughs on demand</p>
            </CardContent>
          </Card>

          <Card className="border-yellow-500/30 bg-gradient-to-br from-yellow-500/5 to-orange-500/5">
            <CardContent className="p-6 text-center">
              <TrendingUp className="w-12 h-12 text-yellow-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-yellow-400 mb-2">Market Intelligence</h3>
              <p className="text-white/70 text-sm">Make informed decisions with AI-powered trading analysis</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
}