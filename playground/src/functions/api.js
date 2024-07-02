export async function generateImages(prompt) {
  try {
    const response = await fetch("http://127.0.0.1:8000/generate-images", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        prompt: prompt,
        styles: ["Impressionist"],
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error status: ${response.status}`);
    }
    const data = await response.json();
    console.log(data);
    const urls = await transformFilePathsToUrls(data.images);
    return urls;
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
}

async function transformFilePathsToUrls(filePaths) {
  const urls = [];
  for (const filePath of filePaths) {
    const baseUrl = "http://127.0.0.1:8000/images/";
    const encodedPath = encodeURIComponent(filePath);
    const url = `${baseUrl}${encodedPath}`;
    urls.push(url);
  }
  return urls;
}
