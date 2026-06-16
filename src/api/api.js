const UPLOAD_API =
  "https://u3hbqhid06.execute-api.ap-south-1.amazonaws.com/prod/upload-document";

const OCR_API =
  "https://hnujwpmg00.execute-api.ap-south-1.amazonaws.com/prod/ocr-document";

export const uploadApi = async (payload) => {
  const response = await fetch(UPLOAD_API, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message || "Upload failed"
    );
  }

  return data;
};

export const triggerOCRApi = async ({
  leadId,
  bucket,
  key,
  documentType,
}) => {
  const response = await fetch(OCR_API, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      leadId,
      bucket,
      key,
      documentType,
    }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message || "OCR failed"
    );
  }

  return data;
};