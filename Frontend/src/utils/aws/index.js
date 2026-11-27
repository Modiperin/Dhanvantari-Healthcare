import { API_BASE_URL } from "../config";
import { callAPI } from "../../services/callAPI";

export const uploadToS3 = async (file, contentType) => {
  try {
    const res = await callAPI(
      `${API_BASE_URL}/aws/presigned?for=healthcare&contentType=${contentType}`
    );

    await fetch(res.data.url, {
      method: "PUT",
      headers: {
        "Content-Type": contentType,
      },
      body: file,
    });

    return res.data.objectUrl;
  } catch (error) {
    console.error("S3 upload error:", error);
  }
};
