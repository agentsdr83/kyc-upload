import { triggerOCRApi } from "../api/api";

export const runOCR =
  async ({
    leadId,
    bucket,
    key,
    documentType,
  }) => {
    return await triggerOCRApi({
      leadId,
      bucket,
      key,
      documentType,
    });
  };