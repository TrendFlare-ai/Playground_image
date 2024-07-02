import React, { useState, useCallback, useEffect } from "react";
import ImageViewer from "react-simple-image-viewer";
import { Card, CardContent, Typography, Grid } from "@mui/material";
import { CardWithForm } from "./components/prompt-box/prompt";
import { getImages } from "./functions/api.js"; // Adjust the import path as necessary

function App() {
  const [currentImage, setCurrentImage] = useState(0);
  const [isViewerOpen, setIsViewerOpen] = useState(false);
  const [images, setImages] = useState([]);

  const handleUpdateImages = useCallback(
    async (newImagesData) => {
      const newImages = newImagesData.map((imageUrl) => ({
        src: imageUrl,
        caption: "New Generated Image",
      }));
      setImages(newImages);
    },
    [images]
  );

  const openImageViewer = useCallback((index) => {
    setCurrentImage(index);
    setIsViewerOpen(true);
  }, []);

  const closeImageViewer = () => {
    setCurrentImage(0);
    setIsViewerOpen(false);
  };

  return (
    <>
      <div className="m-10 flex flex-col space-x-0 gap-11">
        <div>
          <Grid container spacing={2} justifyContent="center">
            {images.map((image, index) => (
              <Grid item xs={12} sm={6} md={4} lg={3} xl={2} key={index}>
                <Card sx={{ maxWidth: 345, margin: "10px auto" }}>
                  <Grid container direction="column" spacing={2}>
                    <Grid item xs={12}>
                      <img
                        src={image.src}
                        onClick={() => openImageViewer(index)}
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
                  </Grid>
                </Card>
              </Grid>
            ))}
          </Grid>
          {isViewerOpen && (
            <ImageViewer
              src={images.map((image) => image.src)}
              currentIndex={currentImage}
              disableScroll={false}
              closeOnClickOutside={true}
              onClose={closeImageViewer}
            />
          )}
        </div>
        <div className="flex justify-center align-middle">
          <CardWithForm onUpdateImages={handleUpdateImages} />
        </div>
      </div>
    </>
  );
}

export default App;
