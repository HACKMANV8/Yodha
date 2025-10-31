// src/main.jsx
import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css"; // ensure Tailwind or CSS loaded

createRoot(document.getElementById("root")).render(<App />);
