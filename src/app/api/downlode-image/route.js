import axios from "axios";
import { NextResponse } from "next/server";

export async function GET(req) {
  const searchParams = req.nextUrl.searchParams;
  const key = searchParams.get("key");
  // console.log("key", key);

  const apiGatewayUrl = process.env.AWS_API_GATEWAY_URL;

  try {
    const response = await axios.post(apiGatewayUrl, { key });
    // console.log("response", response);
    const presignedUrl = response.data.url;

    return NextResponse.json({ url: presignedUrl }, { status: 203 });
  } catch (error) {
    console.error("Error triggering image processing", error);
    return NextResponse.json(
      {
        message: "Error triggering image processing",
        error: error.message,
      },
      { status: 503 }
    );
  }
}
