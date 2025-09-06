import React from "react";
import { Helmet } from "react-helmet-async";
import { useApiStatus } from "@/hooks/useApiStatus";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, XCircle, AlertCircle, TestTube } from "lucide-react";

const ApiStatusPage: React.FC = () => {
  const { apiStatus, testAPI, testAllAPIs, totalConfigured, totalWorking } = useApiStatus();

  const getStatusIcon = (status: any) => {
    if (status.working) return <CheckCircle className="w-5 h-5 text-green-500" />;
    if (status.tested && !status.working) return <XCircle className="w-5 h-5 text-red-500" />;
    if (status.available) return <AlertCircle className="w-5 h-5 text-yellow-500" />;
    return <XCircle className="w-5 h-5 text-gray-400" />;
  };

  const getStatusBadge = (status: any) => {
    if (status.working) return <Badge className="bg-green-500">Working</Badge>;
    if (status.tested && !status.working) return <Badge variant="destructive">Failed</Badge>;
    if (status.available) return <Badge className="bg-yellow-500">Ready to Test</Badge>;
    return <Badge variant="secondary">Not Configured</Badge>;
  };

  return (
    <>
      <Helmet>
        <title>API Status Dashboard | GameXBuddy</title>
        <meta name="description" content="Monitor the status of all integrated gaming APIs and services" />
      </Helmet>
      <div className="space-y-6">
        <div className="text-center">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-[#ff2bd6] to-[#00f5ff] bg-clip-text text-transparent">
            🧪 API Status Dashboard
          </h1>
          <p className="text-white/70 mt-2">Check the status of all your gaming APIs</p>
        </div>

        <div className="flex justify-center gap-4 mb-6">
          <Button onClick={testAllAPIs} variant="neon">
            <TestTube className="w-4 h-4 mr-2" />
            Test All APIs
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <Card className="border-green-500/30">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-green-400">{totalConfigured}</div>
              <div className="text-sm text-white/70">APIs Configured</div>
            </CardContent>
          </Card>
          <Card className="border-blue-500/30">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-blue-400">{totalWorking}</div>
              <div className="text-sm text-white/70">APIs Working</div>
            </CardContent>
          </Card>
          <Card className="border-purple-500/30">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-purple-400">
                {Math.round((totalWorking / Math.max(totalConfigured, 1)) * 100)}%
              </div>
              <div className="text-sm text-white/70">Success Rate</div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {Object.entries(apiStatus).map(([name, status]) => (
            <Card key={name} className="border-white/10 bg-gradient-to-br from-black/50 to-gray-900/50">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center justify-between text-white">
                  <span className="uppercase text-sm font-bold">{name}</span>
                  <div className="flex items-center gap-2">
                    {getStatusIcon(status)}
                    {getStatusBadge(status)}
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-white/70">Configured:</span>
                    <span className={status.available ? "text-green-400" : "text-red-400"}>
                      {status.available ? "Yes" : "No"}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-white/70">Tested:</span>
                    <span className={status.tested ? "text-green-400" : "text-yellow-400"}>
                      {status.tested ? "Yes" : "No"}
                    </span>
                  </div>
                  {status.tested && status.error && (
                    <div className="text-xs text-red-400 bg-red-500/10 p-2 rounded">
                      Error: {status.error}
                    </div>
                  )}
                  {status.available && (
                    <Button
                      onClick={() => testAPI(name)}
                      disabled={status.tested && status.working}
                      className="w-full"
                      size="sm"
                    >
                      {status.tested ? "Retest" : "Test"} {name.toUpperCase()} API
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <Card className="border-yellow-500/30 bg-gradient-to-br from-yellow-500/5 to-orange-500/5">
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold text-yellow-400 mb-4">🔧 Setup Instructions</h3>
            <div className="space-y-2 text-sm">
              <p className="text-white/70">
                <strong>1.</strong> Copy <code className="bg-black/50 px-1 rounded">.env.example</code> to <code className="bg-black/50 px-1 rounded">.env</code>
              </p>
              <p className="text-white/70">
                <strong>2.</strong> Follow the <code className="bg-black/50 px-1 rounded">API_SETUP_GUIDE.md</code> to get your keys
              </p>
              <p className="text-white/70">
                <strong>3.</strong> Fill in your API keys in the .env file
              </p>
              <p className="text-white/70">
                <strong>4.</strong> Restart the development server
              </p>
              <p className="text-white/70">
                <strong>5.</strong> Come back here and test the APIs
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
};

export default ApiStatusPage;