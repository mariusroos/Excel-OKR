import React, { useState } from 'react';
import axios from 'axios';
//import './FileDropZone.css'; // Create this CSS file for styling

function FileUpload() {
  const [file, setFile] = useState(null);
  const [lwpolylines, setLwpolylines] = useState([]);
  const [fileName, setFileName] = useState("");

  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      setFileName(selectedFile.name); // Display the file name after selection
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!file) {
      alert('Please select a file to upload');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await axios.post('http://localhost:5001/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      setLwpolylines(response.data);  // Display the response from Flask
    } catch (error) {
      console.error('Error uploading file:', error);
    }
  };

  // Function to simulate clicking the hidden file input when the button is clicked
  const triggerFileInput = () => {
    const fileInput = document.getElementById('file-input');
    if (fileInput) {
      fileInput.click(); // Trigger the file input click
    } else {
      console.error('File input not found!');
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <div>
          {/* Hidden input with custom button */}
          <input 
            type="file" 
            id="file-input" 
            onChange={handleFileChange} 
            style={{ display: 'none' }} // Hide the default file input
          />
          {/* Custom "Choose File" button */}
          <button 
            type="button" 
            onClick={triggerFileInput} // Trigger file input click on custom button click
          >
            Choose File
          </button>
        </div>
        <button type="submit">Upload DXF</button>
      </form>

      {fileName && <p>Selected File: {fileName}</p>} {/* Display selected file name */}
      
      {lwpolylines.length > 0 && (
        <div>
          <h2>LWPOLYLINE Data:</h2>
          <pre>{JSON.stringify(lwpolylines, null, 2)}</pre>
        </div>
      )}
    </div>
  );
}

export default FileUpload;
