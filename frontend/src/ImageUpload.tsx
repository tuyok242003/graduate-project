import axios from 'axios';
import React, { ChangeEvent, useState } from 'react';

const ImageUpload = () => {
  const [image, setImage] = useState<File | string>('');

  const handleImage = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      console.log(e.target.files);
      setImage(e.target.files[0]);
    }
  };

  const handleApi = () => {
    if (image instanceof File) {
      const formData = new FormData();
      formData.append('image', image);
      axios.post('url', formData).then((res) => {
        console.log(res);
      });
    }
  };

  return (
    <div>
      <input type='file' name='file' onChange={handleImage} />
      <button onClick={handleApi}>Submit</button>
    </div>
  );
};

export default ImageUpload;
