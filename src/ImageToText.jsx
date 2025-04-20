// ImageToText.jsx or .tsx
import React, { useEffect, useState } from 'react';
import Tesseract from 'tesseract.js';
import axios from 'axios';

const ImageToText = () => {
  const [image, setImage] = useState(null);
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState('');
  const [error, setError] = useState('');

  useEffect(()=> {
    const api = async () => {
      try{
        setLoading(true);
        const res = await axios.post('https://answerbot-backend.onrender.com/find-complexity', {
          prompt:"answer the question option only don't explain " + text,
        });
  
        setResponse(res.data.data);
      }
      catch(error){
        setError(error.message);
      }
      finally{
        setLoading(false);
      }
    };

    if(text !== '') api();

  }, [text]);


  const handleImageChange = (e) => {
    setResponse('');
    const file = e.target.files[0];
    if (file) {
      setImage(URL.createObjectURL(file));
      extractTextFromImage(file);
    }
  };

  const extractTextFromImage = async (file) => {
    setLoading(true);
    try {
      const result = await Tesseract.recognize(file, 'eng', {
        logger: (m) => console.log(m),
      });
      setText(result.data.text);
    } catch (err) {
      console.error('OCR Error:', err);
      setText('Error extracting text.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 max-w-xl mx-auto">
      <h1 className="text-xl flex justify-center font-bold mb-8">🖼️ Answer Bot</h1>
      <h1 className="text-l mb-4 border-2 p-2"> Upload the question image for answer</h1>

      <input type="file" accept="image/*" onChange={handleImageChange} className="mb-4" />

      {image && <img src={image} alt="Selected" className="w-full mb-4 rounded shadow" />}

      {loading && (
        <p className="text-blue-500">🔍 getting response..</p>
      )}

      { response !== '' && (
        <p className='border-2 bg-gray-100 p-4'> Answer : {response} </p>
      )}

      {error !== '' && (
        <p>{error}</p>
      )}
        
    </div>
  );
};

export default ImageToText;
