import { BrowserRouter, Routes, Route } from "react-router-dom";
import KycUploadPage from "./pages/KycUploadPage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/kyc/:leadId"
          element={<KycUploadPage />}
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;