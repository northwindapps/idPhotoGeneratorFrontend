import React, { useState } from 'react';

const ImageUploader = () => {
  const [image, setImage] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [resultUrl, setResultUrl] = useState(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!image) return;

    const formData = new FormData();
    formData.append('image', image);

    try {
        const response = await fetch(
        'https://aws4luvuq8.execute-api.ap-northeast-1.amazonaws.com/dev/process-image',
        {
            method: 'POST',
            body: formData,
        }
        );
      
        if (!response.ok) throw new Error('Upload failed');

        const json = await response.json();

        const base64 = json.body;
        const contentType = json.headers?.['Content-Type'] || 'image/jpeg';

        const byteCharacters = atob(base64);
        const byteNumbers = new Array(byteCharacters.length);
        for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
        }
        const byteArray = new Uint8Array(byteNumbers);
        const blob = new Blob([byteArray], { type: contentType });

        const resultUrl = URL.createObjectURL(blob);
        setResultUrl(resultUrl);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div style={{ textAlign: 'center', marginTop: '2rem' }}>
      <h2>Upload and Process Image</h2>

      <form onSubmit={handleSubmit}>
        <input type="file" accept="image/*" onChange={handleFileChange} />
        <button type="submit" disabled={!image} style={{ marginTop: '1rem' }}>
          Upload and Process
        </button>
      </form>

      {previewUrl && (
        <div style={{ marginTop: '1rem' }}>
          <h4>Preview:</h4>
          <img src={previewUrl} alt="Preview" style={{ maxWidth: '100%' }} />
        </div>
      )}

      {resultUrl && (
        <div style={{ marginTop: '2rem' }}>
          <h4>Result:</h4>
          <img src={resultUrl} alt="Processed" style={{ maxWidth: '100%' }} />
        </div>
      )}
    </div>
  );
};

export default ImageUploader;
