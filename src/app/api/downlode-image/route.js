import { NextResponse } from "next/server";
import { LambdaClient, InvokeCommand } from "@aws-sdk/client-lambda";

// Initialize AWS Lambda Client
const lambdaClient = new LambdaClient({ region: "ap-south-1" });

export async function GET(req) {
  const searchParams = req.nextUrl.searchParams;
  const key = searchParams.get("key");

  if (!key) {
    return NextResponse.json(
      { message: "Missing required 'key' parameter." },
      { status: 400 }
    );
  }

  try {
    console.log(
      "✅ Triggering Lambda function and waiting for presigned URL..."
    );

    // Define the payload to send to the Lambda function
    const payload = {
      Records: [
        {
          eventSource: "aws:s3",
          eventName: "ObjectCreated:Put",
          awsRegion: "ap-south-1",
          s3: {
            bucket: { name: "samman-s3bucket" },
            object: {
              key: key,
            },
          },
        },
      ],
    };

    // 📝 Invoke Lambda with payload
    const command = new InvokeCommand({
      FunctionName: "imageConverter", // Change to your Lambda function name
      InvocationType: "RequestResponse", // Waits for response
      Payload: Buffer.from(JSON.stringify(payload)),
    });

    // 🚀 Invoke the Lambda function
    const response = await lambdaClient.send(command);

    // 📝 Decode Lambda response
    const responsePayload = JSON.parse(
      new TextDecoder().decode(response.Payload)
    );

    console.log("🔁 Lambda Response:", responsePayload);

    // ✅ Extract downloadUrl from the Lambda response
    let lambdaBody = JSON.parse(responsePayload.body);
    const downloadUrl = lambdaBody.downloadUrl;

    if (!downloadUrl) {
      throw new Error("Presigned URL not found in Lambda response.");
    }

    console.log("📥 Presigned URL generated:", downloadUrl);

    // 🎉 Return the presigned URL to the frontend
    return NextResponse.json(
      { url: downloadUrl },
      { status: 200 }
    );
  } catch (error) {
    console.error("❌ Error triggering image processing:", error);
    return NextResponse.json(
      {
        message: "Error triggering image processing.",
        error: error.message,
      },
      { status: 503 }
    );
  }
}
