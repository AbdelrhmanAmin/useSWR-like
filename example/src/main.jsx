import { createRoot } from "react-dom/client";
import { FetchProvider } from "use-swr-like";
import App from "./App.jsx";
import "./index.css";

createRoot(document.getElementById("root")).render(
  <>
    <FetchProvider
      config={{
        onSuccess: (data) => console.log(data),
        revalidateOnFocus: true,
      }}
    >
      <App />
    </FetchProvider>
  </>
);
