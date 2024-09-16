"use client";
import React, { useState } from "react";

const formats = ["jpg", "png", "webp", "tiff", "avif", "gif"];

const Home = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [format, setFormat] = useState(formats[0]);
  const [isCompress, setIsCompress] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [downloadUrl, setDownloadUrl] = useState(null);

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  const handleFormatChange = (event) => {
    setFormat(event.target.value);
  };

  const handleCompressChange = () => {
    setIsCompress(!isCompress);
  };

  async function downloadImage(url) {
    try {
      const response = await fetch(url);
      const blob = await response.blob();
      const blobUrl = URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = blobUrl;
      // console.log("selected file:", selectedFile);
      // console.log("selected file:", selectedFile.name);
      link.download = selectedFile.name.replace(/\.[^/.]+$/, `.${format}`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(blobUrl);
      setSelectedFile(null);
    } catch (error) {
      console.error("Failed to download image:", error);
    }
  }

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!selectedFile) return;
    setIsSubmitting(true);
    setDownloadUrl(null); // Reset the download URL

    const fileType = selectedFile.type;
    const fileName = selectedFile.name;

    try {
      // 1. Get pre-signed URL from the server
      const response = await fetch(
        `/api/upload-image?filename=${fileName}&fileType=${fileType}&targetFormat=${format}&isCompress=${isCompress}`
      );
      const { url } = await response.json();
      // console.log("Pre-signed URL for upload:", url);

      // 2. Upload the file to S3 using the pre-signed URL
      const uploadResponse = await fetch(url, {
        method: "PUT",
        headers: {
          "Content-Type": fileType,
        },
        body: selectedFile,
      });

      if (uploadResponse.ok) {
        console.log("File uploaded successfully");

        // 3. Trigger image processing by notifying your server
        const processingResponse = await fetch(
          `/api/downlode-image?key=uploads/${fileName}`
        );

        if (processingResponse.ok) {
          const { url: processedUrl } = await processingResponse.json();
          // console.log("Processed image available at:", processedUrl);
          setDownloadUrl(processedUrl); // Set download URL
        } else {
          console.error("Failed to trigger image processing");
        }
      } else {
        console.error("Failed to upload file", uploadResponse);
      }
    } catch (error) {
      console.error("An error occurred while submitting the image", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="home-page bg-gradient-to-r from-sky-500 to-indigo-500 min-h-screen flex justify-center items-center">
      <div className="container max-w-md px-4 py-8 bg-white rounded-lg shadow-md">
        <h1 className="text-3xl font-bold text-center mb-4">Image Converter</h1>
        <p className="text-gray-700 text-center mb-8">
          Convert your images to different formats with ease.
        </p>
        <form onSubmit={handleSubmit}>
          <div className="flex flex-col mb-4">
            <label htmlFor="file" className="text-gray-700 font-medium mb-2">
              Select Image:
            </label>
            <input
              type="file"
              id="file"
              accept="image/*"
              onChange={handleFileChange}
              required
              className="border rounded-md px-2 py-1"
            />
          </div>
          <div className="flex flex-col mb-4">
            <label htmlFor="format" className="text-gray-700 font-medium mb-2">
              Convert To:
            </label>
            <select
              id="format"
              value={format}
              onChange={handleFormatChange}
              className="border rounded-md px-2 py-1"
            >
              {formats.map((format) => (
                <option key={format} value={format}>
                  {format.toUpperCase()}
                </option>
              ))}
            </select>
          </div>
          <div className="flex items-center mb-4">
            <label
              htmlFor="compress"
              className="text-gray-700 font-medium mr-2"
            >
              <input
                type="checkbox"
                id="compress"
                checked={isCompress}
                onChange={handleCompressChange}
                className="mr-2"
              />
              Compress (Recommended)
            </label>
          </div>
          <button
            type="submit"
            disabled={isSubmitting || !selectedFile}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md disabled:opacity-50"
          >
            Convert Image
          </button>
          <button
            type="button"
            onClick={() => downloadUrl && downloadImage(downloadUrl)}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 mx-5 rounded-md disabled:opacity-50"
            disabled={!downloadUrl}
          >
            Download Image
          </button>
        </form>
      </div>
    </div>
  );
};

export default Home;
