import RetellButton from "./components/retell-button"; // Adjust path as needed

export default function Home() {
  return (
    <main
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "100vh",
        width: "100%",
      }}
    >
      <RetellButton />
    </main>
  );
}
