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
        // Change cursor to loading
      document.body.style.cursor = "wait";

      const response = await axios.post('http://localhost:5001/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        responseType: 'blob', // Important: set responseType to 'blob' to handle binary data
      });
    
      // Create a link element
      const link = document.createElement('a');
      
      // Create a URL for the Blob object
      const url = window.URL.createObjectURL(new Blob([response.data]));
    
      // Set the download attribute with a default filename
      link.href = url;
      link.setAttribute('download', 'grid_cells_output.xlsx');  // You can dynamically change this filename if needed
      
      // Append the link to the DOM (it’s not displayed, just needs to exist)
      document.body.appendChild(link);
      
      // Trigger the download by simulating a click
      link.click();
      
      // Clean up the link element after downloading
      document.body.removeChild(link);

    } catch (error) {
      console.error('Error uploading file:', error);
    }
   finally {
    // Reset cursor back to normal
    document.body.style.cursor = "default";
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
  <div className="flex flex-col items-center">
    {/* Banner */}
    <div className="bg-red-500 text-white text-4xl py-4 w-full text-center">
      Solareff
    </div>

    {/* Form and Buttons */}
    <form onSubmit={handleSubmit} className="flex flex-col items-center mt-4">
      <div className="flex gap-4">
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
          className="bg-blue-500 text-white py-2 px-4 rounded"
        >
          Choose File
        </button>

        {/* Submit button */}
        <button 
          type="submit" 
          className="bg-green-500 text-white py-2 px-4 rounded"
        >
          Upload DXF
        </button>
      </div>
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
