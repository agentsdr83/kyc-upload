import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { uploadDocument } from "../services/uploadService";
import { runOCR } from "../services/ocrService";

export default function KycUploadPage() {
  const { leadId } = useParams();

  const [panFile, setPanFile] = useState(null);
  const [addressFile, setAddressFile] = useState(null);

  const [panLoading, setPanLoading] = useState(false);
  const [addressLoading, setAddressLoading] = useState(false);

  const [panVerified, setPanVerified] = useState(false);
  const [addressVerified, setAddressVerified] = useState(false);

  const handlePanUpload = async () => {
    try {
      setPanLoading(true);

      const uploadResponse = await uploadDocument(
        leadId,
        panFile,
        "PAN"
      );

      console.log("PAN Upload Response:", uploadResponse);

      const ocrResponse = await runOCR({
        leadId,
        bucket: uploadResponse.bucket,
        key: uploadResponse.key,
        documentType: "PAN",
      });

      console.log("PAN OCR Response:", ocrResponse);

      setPanVerified(true);

      alert("PAN verified successfully");
    } catch (err) {
      console.error(err);
      alert(err.message);
    } finally {
      setPanLoading(false);
    }
  };

  const handleAddressUpload = async () => {
    try {
      setAddressLoading(true);

      const uploadResponse = await uploadDocument(
        leadId,
        addressFile,
        "ADDRESS"
      );

      console.log(
        "Address Upload Response:",
        uploadResponse
      );

      const ocrResponse = await runOCR({
        leadId,
        bucket: uploadResponse.bucket,
        key: uploadResponse.key,
        documentType: "ADDRESS",
      });

      console.log(
        "Address OCR Response:",
        ocrResponse
      );

      setAddressVerified(true);

      alert("Address verified successfully");
    } catch (err) {
      console.error(err);
      alert(err.message);
    } finally {
      setAddressLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* Success Banner */}

      <div className="bg-green-600 text-white text-center py-4 font-semibold text-lg shadow">
        ✓ Your Verification is done successfully
      </div>

      {/* Main Content */}

      <main className="flex-grow flex justify-center items-center p-6">
        <div className="bg-white shadow-lg rounded-xl p-8 w-full max-w-3xl">
          <h1 className="text-2xl font-bold text-center mb-10">
            To proceed with KYC please upload the documents
          </h1>

          {/* PAN CARD */}

          <div className="mb-10">
            <label className="block text-lg font-semibold mb-3">
              1. PAN Card
            </label>

            <div className="border-2 border-dashed border-gray-300 rounded-xl p-10 text-center bg-gray-50">
              <div className="text-6xl mb-4">📄</div>

              <p className="font-semibold text-gray-700">
                Drag & Drop PAN Card here
              </p>

              <p className="text-gray-500 text-sm mt-2">
                or click to browse files
              </p>

              <p className="text-xs text-gray-400 mt-2">
                PDF, JPG, JPEG, PNG
              </p>

              <input
                type="file"
                accept=".pdf,.jpg,.jpeg,.png"
                className="mt-4"
                onChange={(e) =>
                  setPanFile(
                    e.target.files[0]
                  )
                }
              />
            </div>

            {panFile && (
              <div className="mt-3 text-green-600">
                ✓ {panFile.name}
              </div>
            )}

            {panVerified && (
              <div className="mt-2 text-green-700 font-semibold">
                ✓ PAN Verified
              </div>
            )}

            <button
              disabled={!panFile || panLoading}
              onClick={handlePanUpload}
              className="mt-4 w-full py-3 rounded-lg text-white font-semibold bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400"
            >
              {panLoading
                ? "Uploading & Verifying..."
                : "Upload PAN"}
            </button>
          </div>

          {/* ADDRESS PROOF */}

          <div className="mb-8">
            <label className="block text-lg font-semibold mb-3">
              2. Address Proof
            </label>

            <div className="border-2 border-dashed border-gray-300 rounded-xl p-10 text-center bg-gray-50">
              <div className="text-6xl mb-4">🏠</div>

              <p className="font-semibold text-gray-700">
                Drag & Drop Address Proof here
              </p>

              <p className="text-gray-500 text-sm mt-2">
                or click to browse files
              </p>

              <p className="text-xs text-gray-400 mt-2">
                Aadhaar, Passport, Voter ID, Utility Bill
              </p>

              <input
                type="file"
                accept=".pdf,.jpg,.jpeg,.png"
                className="mt-4"
                onChange={(e) =>
                  setAddressFile(
                    e.target.files[0]
                  )
                }
              />
            </div>

            {addressFile && (
              <div className="mt-3 text-green-600">
                ✓ {addressFile.name}
              </div>
            )}

            {addressVerified && (
              <div className="mt-2 text-green-700 font-semibold">
                ✓ Address Verified
              </div>
            )}

            <button
              disabled={
                !addressFile ||
                addressLoading
              }
              onClick={handleAddressUpload}
              className="mt-4 w-full py-3 rounded-lg text-white font-semibold bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400"
            >
              {addressLoading
                ? "Uploading & Verifying..."
                : "Upload Address"}
            </button>
          </div>
        </div>
      </main>

      {/* Company Section */}

      <section className="bg-white border-t py-8 text-center">
        <h2 className="text-xl font-bold">
          Loan Assistant Company
        </h2>

        <p className="text-gray-600">
          Secure and hassle-free loan processing platform.
        </p>
      </section>

      {/* Footer */}

      <footer className="bg-gray-900 text-white py-6">
        <div className="max-w-6xl mx-auto flex justify-between px-6">
          <div>
            © {new Date().getFullYear()} Loan Assistant Company
          </div>

          <div className="flex gap-5">
            <a href="/about">About Us</a>
            <a href="/privacy">Privacy Policy</a>
            <a href="/terms">Terms & Conditions</a>
            <a href="/contact">Contact Us</a>
          </div>
        </div>
      </footer>
    </div>
  );
}