import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Analytics } from "@vercel/analytics/react";
import { Databuddy } from "@databuddy/sdk/react";
import { useEffect } from "react";
import "./components/BottomSheet.css";

// Page imports
import { HomePage } from "./pages/HomePage";
import { AdminPage } from "./pages/AdminPage";
import { SubmitPage } from "./pages/SubmitPage";

function App() {
  useEffect(() => {
    // Update page title and meta description dynamically
    document.title = "toolss - Discover the Best AI Tools & Startup Resources";
    
    // Add structured data for better SEO
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.text = JSON.stringify({
      "@context": "https://schema.org",
      "@type": "WebApplication",
      "name": "toolss",
      "url": "https://toolss.vercel.app",
      "description": "Discover the best AI tools, productivity apps, and startup resources",
      "applicationCategory": "BusinessApplication",
      "operatingSystem": "Any",
      "offers": {
        "@type": "Offer",
        "price": "0",
        "priceCurrency": "USD"
      }
    });
    document.head.appendChild(script);
    
    return () => {
      document.head.removeChild(script);
    };
  }, []);

  return (
    <BrowserRouter>
      <Databuddy clientId="rzgzxIRFjLiP5-y4HNrlo" enableBatching={true} />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/submit" element={<SubmitPage />} />
        <Route path="/admin" element={<AdminPage />} />
        {/* Catch all unknown routes and redirect to home */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      <Analytics />
    </BrowserRouter>
  );
}

export default App;
