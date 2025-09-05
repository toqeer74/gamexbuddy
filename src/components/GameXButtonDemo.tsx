import { Button } from "@/components/ui/button";

export default function GameXButtonDemo() {
  return (
    <div className="space-y-6 p-8">
      <h2 className="text-2xl font-bold text-center mb-8 text-primary">
        GameXBuddy Button Showcase
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

        {/* Default Brand Button */}
        <div className="space-y-2">
          <p className="text-sm font-medium">Neon Brand</p>
          <Button variant="neon" className="w-full">
            🔥 Get Started
          </Button>
        </div>

        {/* Neon Glow Button */}
        <div className="space-y-2">
          <p className="text-sm font-medium">Neon Glow</p>
          <Button variant="neonGlow" className="w-full">
            ✨ Premium
          </Button>
        </div>

        {/* Cyber Button */}
        <div className="space-y-2">
          <p className="text-sm font-medium">Cyber Punk</p>
          <Button variant="cyber" className="w-full">
            ⚡ Cyber Mode
          </Button>
        </div>

        {/* Default Button */}
        <div className="space-y-2">
          <p className="text-sm font-medium">Brand Default</p>
          <Button size="lg" className="w-full">
            🎮 Game On
          </Button>
        </div>

        {/* Secondary Button */}
        <div className="space-y-2">
          <p className="text-sm font-medium">Brand Secondary</p>
          <Button variant="secondary" size="lg" className="w-full">
            🌟 Explore
          </Button>
        </div>

        {/* Destructive Button */}
        <div className="space-y-2">
          <p className="text-sm font-medium">Brand Accent</p>
          <Button variant="destructive" size="lg" className="w-full">
            🚀 Launch
          </Button>
        </div>

        {/* Animated Examples */}
        <div className="space-y-2">
          <p className="text-sm font-medium">Animated Bounce</p>
          <Button variant="neon" size="lg" className="w-full animate-button-bounce">
            🎉 Party Time
          </Button>
        </div>

        <div className="space-y-2">
          <p className="text-sm font-medium">Gradient Shift</p>
          <Button variant="neonGlow" size="lg" className="w-full animate-gradient-shift">
            🎨 Colors
          </Button>
        </div>

        <div className="space-y-2">
          <p className="text-sm font-medium">Logo Glow</p>
          <Button variant="neon" size="xl" className="w-full animate-logo-glow">
            👑 VIP GameX
          </Button>
        </div>

      </div>

      {/* Size Variations */}
      <div className="mt-8">
        <h3 className="text-lg font-semibold mb-4">Size Variations</h3>
        <div className="flex gap-4 items-center">
          <Button variant="neon" size="sm">Small</Button>
          <Button variant="neon" size="default">Default</Button>
          <Button variant="neon" size="lg">Large</Button>
          <Button variant="neon" size="xl">Extra Large</Button>
        </div>
      </div>

    </div>
  );
}