import { Suspense, lazy } from "react";
import "./App.css";

const Dashboard = lazy(() => import("../pages/Dashboard"));

function App() {
  return (
    <Suspense
      fallback={
        <div className="suspense-loading">
          Loading…
        </div>
      }
    >
      <Dashboard />
    </Suspense>
  );
}

export default App;
