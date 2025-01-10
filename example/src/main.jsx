import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { FetchProvider } from "use-swr-like";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <FetchProvider
      value={{
        onSuccess: (data) => console.log(data),
        revalidateOnFocus: true,
      }}
    >
      <App />
    </FetchProvider>
  </StrictMode>
);
