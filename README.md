# Serverless Image Processing and Compression Web App

This is a web application built using **Next.js** that allows users to upload images to an **AWS S3 bucket**, where the images are processed (compressed and/or format conversion) by an **AWS Lambda** function. The processed images are then available for download via a presigned URL.

## Table of Contents

- [Features](#features)
- [Architecture](#architecture)
- [Technologies Used](#technologies-used)
- [Setup and Installation](#setup-and-installation)
- [How It Works](#how-it-works)
- [Challenges and Learnings](#challenges-and-learnings)
- [Future Improvements](#future-improvements)

## Features

- Upload images to S3 via presigned URLs
- Serverless architecture using AWS services
- Image format conversion and compression using AWS Lambda
- Download processed images via presigned URLs
- Optimized for performance with efficient processing and storage

## Architecture

1. **Client Request to Server:** The client requests the Next.js server for a presigned URL to upload an image to the S3 bucket.
2. **Upload Image to S3:** The client uploads the image directly to the S3 bucket using the presigned URL.
3. **Trigger Lambda Processing:**
   - Once the image is uploaded, it triggers the Next.js server API.
   - The API triggers AWS API Gateway, which invokes a Lambda function.
4. **Image Processing in Lambda:**
   - The Lambda function retrieves the uploaded image from the S3 bucket.
   - The image is processed (e.g., format conversion or compression).
   - The processed image is saved back to the S3 bucket with a new extension or compression.
5. **Generate Presigned URL for Processed Image:**
   - A presigned URL is generated for the processed image and returned to the client.
6. **Client Downloads the Image:** The Next.js server sends the presigned URL to the client, allowing them to download the processed image.

## Technologies Used

- **Next.js** - Server-side rendering and handling API routes
- **AWS S3** - Storing the original and processed images
- **AWS Lambda** - Serverless function for image processing (compression and format conversion)
- **AWS API Gateway** - Exposing the Lambda function as an API
- **Node.js** - For server-side scripting and handling API routes
- **React.js** - For building the frontend of the application
- **Axios** - For making HTTP requests to the Next.js server API

## Setup and Installation

### Prerequisites

- **Node.js** installed on your machine
- AWS account with permissions to S3, Lambda, and API Gateway
- Basic knowledge of AWS CLI (optional, but helpful)

### Steps

1. Clone the repository:

   ```bash
   git clone https://github.com/your-username/your-repo-name.git
   cd your-repo-name
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Create a `.env.local` file to store environment variables like AWS credentials, S3 bucket name, etc. Example:

   ```bash
   AWS_ACCESS_KEY_ID=your-access-key-id
   AWS_SECRET_ACCESS_KEY=your-secret-access-key
   S3_BUCKET_NAME=your-s3-bucket-name
   AWS_REGION=your-aws-region
   ```

4. Run the development server:

   ```bash
   npm run dev
   ```

5. Deploy the Lambda function via AWS Console or using the Serverless Framework. Ensure the Lambda is connected to API Gateway and has permission to read/write to the S3 bucket.

## How It Works

1. **Upload Image:**
   - The user uploads an image via the frontend.
   - The Next.js server generates a presigned URL using AWS SDK for S3, which is sent to the client for direct upload to S3.
2. **Trigger Lambda for Image Processing:**

   - Once the image is uploaded to the S3 bucket, the Next.js server triggers the Lambda function via API Gateway.
   - The Lambda function retrieves the image from S3, processes it (compresses or converts the format), and saves the new image back to the S3 bucket.

3. **Download Processed Image:**
   - The Lambda function generates a presigned URL for the processed image, which is sent to the client.
   - The client can download the processed image via the provided URL.

## Challenges and Learnings

- **Integrating AWS Services:** Connecting S3, Lambda, and API Gateway together in a seamless flow required careful configuration and permissions management.
- **Image Processing in Lambda:** Handling large images and optimizing the Lambda function for efficiency and speed was key. Working with image libraries and managing S3 operations took some experimentation.
- **Metrics and Performance Tracking:** Logging and analyzing image processing times, compression ratios, and download/upload speeds was essential for optimizing the system’s performance.

## Future Improvements

- **Multi-format Support:** Extend support for more image formats.
- **Enhanced Error Handling:** Implement more robust error handling for edge cases (e.g., network failures, permission issues).
- **Batch Image Processing:** Allow for multiple image uploads and processing in batches.
- **Front-end Enhancements:** Improve the front-end UI/UX with real-time progress indicators and status messages.
