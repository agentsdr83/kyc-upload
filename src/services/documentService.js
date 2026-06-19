const API_URL = 'https://cxju4ypso2.execute-api.ap-south-1.amazonaws.com/prod/document-details';

export async function saveDocumentDetails(payload) {
  const response = await fetch(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(payload)
  });

  const data = await response.json();

  if (!response.ok || !data.success) {
    throw new Error(data.message || "Failed to save document details.");
  }

  return data;
}