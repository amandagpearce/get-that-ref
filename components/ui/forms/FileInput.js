import React, { useState, useEffect } from 'react';

import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { styled } from '@mui/material/styles';
import Button from '@mui/material/Button';
import FormLabel from '@mui/joy/FormLabel';

const FileInput = ({ onFileChange, shouldClearFileName }) => {
  const [fileName, setFileName] = useState();

  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];

    if (selectedFile) {
      setFileName(selectedFile.name);
      const blob = new Blob([selectedFile], { type: selectedFile.type });

      // console.log('blob.type', blob.type);
      // setFile(blob);

      onFileChange(blob);
    } else {
      onFileChange(null);
    }
  };

  const clearFileName = () => {
    setFileName('');
  };

  useEffect(() => {
    if (shouldClearFileName) {
      clearFileName();
    }
  }, [shouldClearFileName]);

  const VisuallyHiddenInput = styled('input')({
    clip: 'rect(0 0 0 0)',
    clipPath: 'inset(50%)',
    height: 1,
    overflow: 'hidden',
    position: 'absolute',
    bottom: 0,
    left: 0,
    whiteSpace: 'nowrap',
    width: 1,
  });

  return (
    <>
      <FormLabel sx={{ fontSize: '1.1rem' }}>
        Scene screenshot/print/image
      </FormLabel>

      <Button
        component="label"
        variant="contained"
        startIcon={<CloudUploadIcon />}
        sx={{ backgroundColor: '#777cf6' }}
      >
        Upload file
        <VisuallyHiddenInput
          name="file"
          type="file"
          accept=".png, .jpeg, .jpg"
          onChange={handleFileChange}
        />
      </Button>
      {fileName && <span>Selected file: {fileName}</span>}
      {!fileName && <span>No file selected.</span>}
    </>
  );
};

export default FileInput;
