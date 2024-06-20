// components/ui/File.jsx
import usericon from '../../picture/user (2).png';
import React, { useContext, useState } from 'react';
import { Input } from './input';
import { Label } from './label';
import { AuthContext } from '../../../src/context/AuthContext.jsx';

export function InputProfileFile() {
  const {profileImage , handleFileChange, user } = useContext(AuthContext);
  const [file, setFile] = useState("");
  const [image , setImage] = useState("")
  const previewFiles = (file) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = () => {
      setImage(reader.result);
      console.log(image);
    };
  }
  /* const handleFileChange = (e) => {
    const file = e.target.files[0];
    setFile(file);
    previewFiles(file);
  }; */

  return (
    <div className='flex justify-center flex-col items-center'>
    <img className="w-24 rounded-full object-cover" src={ profileImage|| user?.profileImage || usericon}/>
    <div className="grid w-full max-w-sm items-center gap-1.5 text-gray-800">
      <Label htmlFor="picture">Picture</Label>
      <Input id="picture" type="file" onChange={handleFileChange} />
    </div>
    </div>
  );
}
