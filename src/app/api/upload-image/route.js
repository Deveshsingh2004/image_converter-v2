import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { NextResponse } from "next/server";

const s3 = new S3Client();

export async function GET(req) {
  const searchParams = req.nextUrl.searchParams;
  const fileName = searchParams.get("filename");
  const fileType = searchParams.get("fileType");
  const format = searchParams.get("targetFormat");
  const isCompress = searchParams.get("isCompress");

  const params = {
    Bucket: process.env.AWS_S3_BUCKET_NAME,
    Key: `uploads/${fileName}`,
    ContentType: fileType ? `image/${fileType.toLowerCase()}` : undefined, // Set the content type based on the file type
    Metadata: {
      targetFormat: format, // Replace with the actual target format you want
      isCompress: isCompress,
    },
  };

  const command = new PutObjectCommand(params);
  const url = await getSignedUrl(s3, command, { expiresIn: 3600 });

  // console.log(url);

  return NextResponse.json(
    { Message: "Succesfully fetched the presigned url", url },
    { status: 201 }
  );
}
