import React, { useState, useCallback, useRef, useEffect } from "react";
import ImageViewer from "react-simple-image-viewer";
import { Card, CardContent, Typography, Grid, Button } from "@mui/material";
import { CardWithForm } from "./components/prompt-box/prompt"; // Ensure this component is correctly implemented
import { getImages } from "./functions/api.js"; // Ensure this function is correctly implemented

function App() {
  const [currentImage, setCurrentImage] = useState(0);
  const [isViewerOpen, setIsViewerOpen] = useState(false);
  const [images, setImages] = useState([]);
  const [focusedIndex, setFocusedIndex] = useState(-1); // Track the currently focused card
  const [isLoading, setIsLoading] = useState(false);

  const cardsRef = useRef([]); // Refs for each card

  const handleUpdateImages = useCallback(async (newImagesData) => {
    setIsLoading(true);
    console.log("====================================");
    console.log(newImagesData);
    console.log("====================================");

    // Assuming newImagesData contains arrays for images and captions
    const newImages = newImagesData.images.map((imageUrl, index) => ({
      src: imageUrl,
      caption: newImagesData.captions[index], // Use the corresponding caption
    }));

    console.log("====================================");
    console.log(newImages);
    console.log("====================================");

    setImages(newImages);
    setIsLoading(false); // Stop loading
  }, []);

  const closeImageViewer = () => {
    setCurrentImage(0);
    setIsViewerOpen(false);
  };

  const openImageViewer = async (index) => {
    setCurrentImage(index);
    setIsViewerOpen(true);
  };

  const getImageAsBlob = async (url) => {
    const response = await fetch(url);
    const blob = await response.blob();
    return blob;
  };

  const triggerPostRequest = async (blob, caption) => {
    try {
      const formData = new FormData();
      await formData.append("caption", caption); // Stringify the caption if necessary
      // Append visibility as a JSON string
      await formData.append("visibility", "PUBLIC");
      // Append the image blob as binary data
      await formData.append("image", blob, { type: blob.type });

      console.log("====================================");
      console.log(formData);
      console.log("====================================");

      const response = await fetch("http://127.0.0.1:8000/api/v1/image_post", {
        method: "POST",
        body: formData,
      });
      const data = await response.json();
      console.log(data);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (!isViewerOpen || focusedIndex === -1) return; // Only handle if viewer is open and has a focused card
      switch (event.key) {
        case "ArrowRight":
          setFocusedIndex((prevIndex) => (prevIndex + 1) % images.length);
          break;
        case "ArrowLeft":
          setFocusedIndex(
            (prevIndex) => (prevIndex - 1 + images.length) % images.length
          );
          break;
        default:
          break;
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [images.length, isViewerOpen]);

  return (
    <>
      <div className="m-10 flex flex-col space-x-0 gap-11">
        <div>
          <Grid container spacing={2} justifyContent="center">
            {!isLoading &&
              images.map((image, index) => (
                <React.Fragment key={index}>
                  <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
                    <Card
                      ref={(el) => (cardsRef.current[index] = el)}
                      sx={{ maxWidth: 345, margin: "10px auto" }}
                      onClick={() => openImageViewer(index)}
                    >
                      <Grid container direction="column" spacing={2}>
                        <Grid item xs={12}>
                          <img
                            src={image.src}
                            width="100%"
                            style={{ cursor: "pointer", borderRadius: "8px" }}
                            alt={`Generated Image ${index + 1}`}
                          />
                        </Grid>
                        <Grid item xs={12}>
                          <CardContent>
                            <Typography variant="body2" color="text.secondary">
                              {image.caption}
                            </Typography>
                          </CardContent>
                        </Grid>
                        {/* Adjusted to ensure full width */}
                        <Grid item xs={12}>
                          <Button
                            variant="contained"
                            color="primary"
                            fullWidth
                            onClick={async () => {
                              // Fetch the image data as a Blob
                              const imageBlob = await getImageAsBlob(image.src);
                              // Pass the image Blob and caption to triggerPostRequest
                              triggerPostRequest(imageBlob, image.caption);
                            }}
                          >
                            Post
                          </Button>
                        </Grid>
                      </Grid>
                    </Card>
                  </Grid>
                  {focusedIndex === index && (
                    <div
                      style={{
                        position: "absolute",
                        zIndex: 1,
                        backgroundColor: "rgba(255, 255, 255, 0.7)",
                        padding: "10px",
                      }}
                    >
                      <button onClick={() => openImageViewer(index)}>
                        Select
                      </button>
                    </div>
                  )}
                </React.Fragment>
              ))}
            {isViewerOpen && (
              <ImageViewer
                src={images.map((image) => image.src)}
                currentIndex={currentImage}
                disableScroll={false}
                closeOnClickOutside={true}
                onClose={closeImageViewer}
              />
            )}
          </Grid>
        </div>
        <div className="flex justify-center align-middle">
          <CardWithForm onUpdateImages={handleUpdateImages} />
        </div>
      </div>
    </>
  );
}

export default App;
