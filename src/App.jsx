import Navbar from "./pages/navbar/Navbar";
import AppRoutes from "./routes";

function App() {
  return (
    <>
      <Navbar />
      <main className="sg-main">
        <AppRoutes />
      </main>
    </>
  );
}

export default App;
