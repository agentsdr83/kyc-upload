import { uploadApi } from "../api/api";

export const uploadDocument = async (
  leadId,
  file,
  documentType
) => {
  if (!file) {
    throw new Error(
      "Please select a file."
    );
  }

  const allowedTypes = [
    "image/png",
    "image/jpeg",
    "image/jpg",
    "application/pdf",
  ];

  if (
    !allowedTypes.includes(file.type)
  ) {
    throw new Error(
      "Only PDF, JPG, JPEG and PNG are allowed."
    );
  }

  if (
    file.size >
    5 * 1024 * 1024
  ) {
    throw new Error(
      "Maximum file size is 5 MB."
    );
  }

  const base64 =
    await convertToBase64(file);

  const payload = {
    leadId,
    documentType,
    fileName: file.name,
    contentType: file.type,
    base64,
  };

  return await uploadApi(
    payload
  );
};

const convertToBase64 = (
  file
) => {
  return new Promise(
    (resolve, reject) => {
      const reader =
        new FileReader();

      reader.readAsDataURL(
        file
      );

      reader.onload = () =>
        resolve(
          reader.result
        );

      reader.onerror =
        reject;
    }
  );
};