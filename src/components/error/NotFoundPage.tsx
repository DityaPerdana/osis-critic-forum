import React from "react";
import { Button } from "@/components/ui/button";
import { RefreshCcw } from "lucide-react";

const NotFoundPage = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
      <div className="text-center space-y-6 max-w-md">
        <h1 className="text-4xl font-bold text-gray-900">404</h1>
        <p className="text-xl text-gray-600">
          Silahkan tutup dan buka tab kembali lagi
        </p>
        <Button
          onClick={() => window.location.reload()}
          className="flex items-center gap-2"
        >
          <RefreshCcw className="h-4 w-4" />
          Refresh Halaman
        </Button>
      </div>
    </div>
  );
};

export default NotFoundPage;
