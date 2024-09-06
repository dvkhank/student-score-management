import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { createClient } from "@supabase/supabase-js";
import { SessionContextProvider } from "@supabase/auth-helpers-react";
const supabase = createClient(
  "https://wskbzrgavbinkjdjlfbt.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Indza2J6cmdhdmJpbmtqZGpsZmJ0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjQ1MTc2NzYsImV4cCI6MjA0MDA5MzY3Nn0.OzkrJ5As7OM5gSGDzeBc7FYCbOTa_ap2kW3JQU0Ax8U"
);

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <SessionContextProvider supabaseClient={supabase}>
      <App />
    </SessionContextProvider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
