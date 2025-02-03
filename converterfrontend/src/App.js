import React, { useState } from 'react';
import axios from 'axios';

function FileUpload() {
  const [file, setFile] = useState(null);
  const [lwpolylines, setLwpolylines] = useState([]);

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
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
      const response = await axios.post('http://localhost:5000/upload-dxf', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      setLwpolylines(response.data);
    } catch (error) {
      console.error('There was an error uploading the file:', error);
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <input type="file" onChange={handleFileChange} />
        <button type="submit">Upload DXF</button>
      </form>

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
