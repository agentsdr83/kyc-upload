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

  const [panData, setPanData] = useState(null);
  const [addressData, setAddressData] = useState(null);

  const [panError, setPanError] = useState("");
  const [addressError, setAddressError] = useState("");
  const [photoFile, setPhotoFile] = useState(null);

  const handlePanUpload = async () => {
    try {
      setPanLoading(true);
      setPanError("");
      setPanData(null);

      const uploadResponse = await uploadDocument(leadId, panFile, "PAN");

      const ocrResponse = await runOCR({
        leadId,
        bucket: uploadResponse.bucket,
        key: uploadResponse.key,
        documentType: "PAN",
      });

      console.log("PAN OCR:", ocrResponse);

      const documentType = ocrResponse?.structuredSummary?.documentType || "";

      // Validate PAN document
      if (!documentType.toLowerCase().includes("permanent account number")) {
        setPanVerified(false);
        setPanError(
          "This is an invalid document. Please upload a valid PAN card.",
        );
        return;
      }

              const entities =
          ocrResponse?.structuredSummary?.keyEntities || [];

        let panDataObj = {
          panNumber: "",
          name: "",
          fatherName: "",
          dob: "",
        };

        // New OCR format
        if (
          entities.length > 0 &&
          typeof entities[0] === "object"
        ) {
          const entityMap = Object.fromEntries(
            entities.map((e) => [e.entityType, e.entityValue])
          );

          panDataObj = {
            panNumber: entityMap["PAN Number"] || entityMap["PAN"] || "",
            name: entityMap["Name"] || "",
            fatherName: entityMap["Father's Name"] || "",
            dob: entityMap["Date of Birth"] || "",
          };
        }
        // Old OCR format
        else {
          panDataObj = {
            panNumber: entities[0] || "",
            name: entities[1] || "",
            fatherName: entities[2] || "",
            dob: entities[3] || "",
          };
        }

        setPanData({
          ...panDataObj,
          documentType,
          summary: ocrResponse?.structuredSummary?.summary || "",
        });

      setPanVerified(true);
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
      setAddressError("");
      setAddressData(null);

      const uploadResponse = await uploadDocument(
        leadId,
        addressFile,
        "ADDRESS",
      );

      const ocrResponse = await runOCR({
        leadId,
        bucket: uploadResponse.bucket,
        key: uploadResponse.key,
        documentType: "ADDRESS",
      });

      console.log("AADHAAR OCR:", ocrResponse);

      const documentType = ocrResponse?.structuredSummary?.documentType || "";

      // Validate Aadhaar
      if (!documentType.toLowerCase().includes("aadhaar")) {
        setAddressVerified(false);
        setAddressError(
          "This is an invalid document for address proof. Please upload a valid Aadhaar.",
        );
        return;
      }

      const entities =
        ocrResponse?.structuredSummary?.keyEntities || [];

      let aadhaarData = {
        name: "",
        fatherName: "",
        aadhaarNumber: "",
        dob: "",
      };

      // New OCR format
      if (
        entities.length > 0 &&
        typeof entities[0] === "object"
      ) {
        const entityMap = Object.fromEntries(
          entities.map((e) => [e.entityType, e.entityValue])
        );

        aadhaarData = {
          name: entityMap["Name"] || "",
          fatherName: entityMap["Father's Name"] || "",
          aadhaarNumber: entityMap["Aadhaar Number"] || "",
          dob: entityMap["Date of Birth"] || "",
        };
      }
      // Old OCR format
      else {
        aadhaarData = {
          name: entities[2] || "",
          fatherName: entities[3] || "",
          aadhaarNumber: entities[4] || "",
          dob: entities[6] || "", // if available
        };
      }

      setAddressData({
        ...aadhaarData,
        documentType,
      });

      setAddressVerified(true);
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

          {/* ================= PAN CARD ================= */}
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

              <p className="text-xs text-gray-400 mt-2">PDF, JPG, JPEG, PNG</p>

              <input
                type="file"
                accept=".pdf,.jpg,.jpeg,.png"
                className="mt-4"
                onChange={(e) => setPanFile(e.target.files[0])}
              />
            </div>

            {panFile && (
              <div className="mt-3 text-green-600">✓ {panFile.name}</div>
            )}

            {panVerified && (
              <div className="mt-2 text-green-700 font-semibold">
                ✓ PAN Verified
              </div>
            )}
            {panError && (
              <div className="mt-3 p-3 rounded-lg bg-red-100 border border-red-400 text-red-700">
                {panError}
              </div>
            )}

            <button
              disabled={!panFile || panLoading}
              onClick={handlePanUpload}
              className="mt-4 w-full py-3 rounded-lg text-white font-semibold bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400"
            >
              {panLoading ? "Uploading & Verifying..." : "Upload PAN"}
            </button>

            {panVerified && panData && (
              <div className="mt-6 p-5 border rounded-xl bg-green-50">
                <h3 className="text-lg font-bold mb-3 text-green-700">
                  PAN Details
                </h3>

                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <span className="font-semibold">Name:</span>{" "}
                    {panData.name || "-"}
                  </div>

                  <div>
                    <span className="font-semibold">PAN Number:</span>{" "}
                    {panData.panNumber || "-"}
                  </div>

                  <div>
                    <span className="font-semibold">Date of Birth:</span>{" "}
                    {panData.dob || "-"}
                  </div>

                  <div>
                    <span className="font-semibold">Father's Name:</span>{" "}
                    {panData.fatherName || "-"}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* ================= ADDRESS ================= */}
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
                onChange={(e) => setAddressFile(e.target.files[0])}
              />
            </div>

            {addressFile && (
              <div className="mt-3 text-green-600">✓ {addressFile.name}</div>
            )}

            {addressVerified && (
              <div className="mt-2 text-green-700 font-semibold">
                ✓ Address Verified
              </div>
            )}
            {addressError && (
              <div className="mt-3 p-3 rounded-lg bg-red-100 border border-red-400 text-red-700">
                {addressError}
              </div>
            )}

            <button
              disabled={!addressFile || addressLoading}
              onClick={handleAddressUpload}
              className="mt-4 w-full py-3 rounded-lg text-white font-semibold bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400"
            >
              {addressLoading ? "Uploading & Verifying..." : "Upload Address"}
            </button>

            {addressVerified && addressData && (
              <div className="mt-6 p-5 border rounded-xl bg-blue-50">
                <h3 className="text-lg font-bold mb-3 text-blue-700">
                  Address Details
                </h3>

                <div className="text-sm space-y-2">
                  <div>
                    <span className="font-semibold">Name:</span>{" "}
                    {addressData.name || "-"}
                  </div>

                  <div>
                    <span className="font-semibold">Father's Name:</span>{" "}
                    {addressData.fatherName || "-"}
                  </div>
                  <div>
                    <span className="font-semibold">Document Type:</span>{" "}
                    {addressData.documentType || "-"}
                  </div>
                </div>
                <div className="mt-6 border-t pt-5">
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input type="checkbox" className="w-5 h-5" />
                    <span className="font-medium text-gray-700">
                      Continue with Residential Address same as Permanent
                      Address
                    </span>
                  </label>
                </div>
              </div>
            )}
          </div>

          {/* ================= PHOTO ================= */}

          <div className="mb-10">
            <label className="block text-lg font-semibold mb-3">
              3. Upload Photograph
            </label>

            <div className="border-2 border-dashed border-indigo-300 rounded-xl p-8 bg-indigo-50 hover:bg-indigo-100 transition">
              <div className="flex flex-col items-center">
                <div className="w-20 h-20 rounded-full bg-white flex items-center justify-center shadow mb-4">
                  <span className="text-4xl">👤</span>
                </div>

                <h3 className="font-semibold text-lg">
                  Upload Passport Size Photo
                </h3>

                <p className="text-sm text-gray-500 mt-2">
                  Recent color photograph with white background
                </p>

                <label className="mt-5 cursor-pointer bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2 rounded-lg">
                  Choose Photo
                  <input
                    type="file"
                    accept=".jpg,.jpeg,.png"
                    hidden
                    onChange={(e) => setPhotoFile(e.target.files[0])}
                  />
                </label>

                {photoFile && (
                  <div className="mt-4 text-green-600 font-medium">
                    ✓ {photoFile.name}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>

      <section className="bg-white border-t py-8 text-center">
        <h2 className="text-xl font-bold">Loan Assistant Company</h2>

        <p className="text-gray-600">
          Secure and hassle-free loan processing platform.
        </p>
      </section>

      <footer className="bg-gray-900 text-white py-6">
        <div className="max-w-6xl mx-auto flex justify-between px-6">
          <div>© {new Date().getFullYear()} Loan Assistant Company</div>

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
