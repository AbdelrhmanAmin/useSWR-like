import { useFetchConfig } from "use-swr-like";
import Cats, { CATS_API } from "./components/Cats";

function App() {
  const { revalidate } = useFetchConfig();
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: "100vh",
        width: "100vw",
        textAlign: "center",
      }}
    >
      <h1 className="text-center">Cats</h1>
      <button onClick={() => revalidate(CATS_API)}>Grab new kittens</button>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: "1rem",
        }}
      >
        <Cats id="1" />
        <Cats id="2" />
        <Cats id="3" />
      </div>
    </div>
  );
}

export default App;
