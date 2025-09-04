import { createRoot } from "react-dom/client";
import "@/lib/i18n";
import App from "./App.tsx";
import "./globals.css";

createRoot(document.getElementById("root")!).render(<App />);
