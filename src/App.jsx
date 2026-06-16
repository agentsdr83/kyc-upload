import { BrowserRouter, Routes, Route } from "react-router-dom";
import KycUploadPage from "./pages/KycUploadPage";
import ConsentPage from "./pages/ConsentPage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/kyc/:leadId"
          element={<KycUploadPage />}
        />

        <Route
          path="/consent/:leadId"
          element={<ConsentPage />}
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;