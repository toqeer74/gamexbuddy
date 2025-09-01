import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Cpu, Lightbulb, Image } from "lucide-react";

const ToolsPage = () => {
  return (
    <div className="container py-8 min-h-[calc(100vh-14rem)]">
      <h1 className="text-4xl font-bold mb-6 text-center">Utility Tools</h1>
      <p className="text-lg text-center text-muted-foreground mb-12">
        Handy tools for every gamer!
      </p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <Card className="bg-white/10 backdrop-blur-md border border-white/20 text-white shadow-lg
                       hover:shadow-cyan-500/70 hover:drop-shadow-[0_0_20px_rgba(0,255,255,0.9)] transition-all duration-300">
          <CardHeader className="flex flex-col items-center text-center">
            <Cpu className="h-12 w-12 text-cyan-400 mb-4 neon-glow" />
            <CardTitle className="text-2xl font-bold">Can My PC Run GTA6?</CardTitle>
          </CardHeader>
          <CardContent className="text-center text-gray-300">
            <p className="mb-4">Check if your rig is ready for the next big title!</p>
            <ul className="list-disc list-inside space-y-1 text-sm text-left mx-auto max-w-xs">
              <li>**Minimum Specs (Placeholder):**</li>
              <li>CPU: Intel Core i5-6600K / AMD Ryzen 5 1600</li>
              <li>GPU: NVIDIA GeForce GTX 1060 6GB / AMD Radeon RX 580 8GB</li>
              <li>RAM: 8 GB</li>
              <li>Storage: 150 GB SSD</li>
            </ul>
            <p className="mt-4 text-sm italic text-gray-400">
              (This is a static placeholder. Real checker coming soon!)
            </p>
          </CardContent>
        </Card>

        <Card className="bg-white/10 backdrop-blur-md border border-white/20 text-white shadow-lg
                       hover:shadow-purple-500/70 hover:drop-shadow-[0_0_20px_rgba(168,85,247,0.9)] transition-all duration-300">
          <CardHeader className="flex flex-col items-center text-center">
            <Lightbulb className="h-12 w-12 text-purple-400 mb-4 neon-glow" />
            <CardTitle className="text-2xl font-bold">Fun Quizzes & Polls</CardTitle>
          </CardHeader>
          <CardContent className="text-center text-gray-300">
            Test your gaming knowledge or vote on the latest hot topics!
            <p className="mt-4 text-sm italic text-gray-400">(Coming Soon!)</p>
          </CardContent>
        </Card>

        <Card className="bg-white/10 backdrop-blur-md border border-white/20 text-white shadow-lg
                       hover:shadow-pink-500/70 hover:drop-shadow-[0_0_20px_rgba(236,72,153,0.9)] transition-all duration-300">
          <CardHeader className="flex flex-col items-center text-center">
            <Image className="h-12 w-12 text-pink-400 mb-4 neon-glow" />
            <CardTitle className="text-2xl font-bold">Meme Generator</CardTitle>
          </CardHeader>
          <CardContent className="text-center text-gray-300">
            Create and share your own gaming memes with our easy-to-use generator.
            <p className="mt-4 text-sm italic text-gray-400">(Coming Soon!)</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ToolsPage;