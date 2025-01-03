// import React, { useState } from 'react';
// import axios from 'axios';

// const FileUpload = () => {
//   const [file, setFile] = useState(null);
//   const [message, setMessage] = useState('');

//   const handleFileChange = (e) => setFile(e.target.files[0]);

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     if (!file) return setMessage('Please select a file');

//     const formData = new FormData();
//     formData.append('file', file);

//     try {
//       const response = await axios.post('http://localhost:5000/api/files/upload', formData);
//       setMessage(response.data.message);
//     } catch (error) {
//       setMessage('Error uploading file');
//     }
//   };

//   return (
//     <div>
//       <h2>Upload File</h2>
//       <form onSubmit={handleSubmit}>
//         <input type="file" accept=".csv" onChange={handleFileChange} />
//         <button type="submit">Upload</button>
//       </form>
//       {message && <p>{message}</p>}
//     </div>
//   );
// };

// export default FileUpload;


import React, { useState } from 'react';
import axios from 'axios';

const FileUpload = () => {
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState('');
  const [errors, setErrors] = useState([]);
  const [status, setStatus] = useState('');

  const handleFileChange = (e) => setFile(e.target.files[0]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) return setMessage('Please select a file');

    const formData = new FormData();
    formData.append('file', file);

    try {
      setStatus('Processing file... This may take a while.');
      const response = await axios.post('http://localhost:5000/api/files/upload', formData);
      setTimeout(() => {
        setMessage(response.data.message);
        setErrors(response.data.errors?.filter(err => err.error.includes('required')) || []);
        setStatus('File uploaded successfully');
      }, 3000); // Simulate processing time
    } catch (error) {
      setTimeout(() => {
        setMessage(error.response?.data?.message || 'Error uploading file');
        setErrors(error.response?.data?.errors?.filter(err => err.error.includes('required')) || []);
        setStatus('File upload failed');
      }, 3000); // Simulate processing time
    }
  };

  return (
    <div>
      <h2>Upload File</h2>
      <form onSubmit={handleSubmit}>
        <input type="file" accept=".csv" onChange={handleFileChange} />
        <button type="submit">Upload</button>
      </form>
      {status && <p>{status}</p>}
      {message && <p>{message}</p>}
      {errors.length > 0 && (
        <div>
          <h4>Missing Required Fields:</h4>
          <ul>
            {errors.map((err, index) => (
              <li key={index}>{`Row: ${JSON.stringify(err.row)}, Error: ${err.error}`}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default FileUpload;
