// import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { RouterProvider } from "react-router-dom";
import "@/lib/firebase/settingFCM";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import router from "@/routes/router";
import "@/index.css";

const queryClient = new QueryClient();

declare global {
  interface Window {
    AndroidInterface: {
      showToast: (msg: string) => void;
    };
  }
}

createRoot(document.getElementById("root")!).render(
  // <StrictMode>
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>
  // </StrictMode>,
);
