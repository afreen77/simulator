import React from 'react';
import { Button } from '@material-ui/core';

 
    export const FileUploader = (props: { handleFileLoaded: (arg0: string[]) => void }) => {

      const OnChange = async (e: any) => {
        let files = e.target.files;
        console.log(files);
        let reader = new FileReader();
        reader.readAsText(files[0]);
      
        reader.onload = async e => {
          console.log(e?.target?.result);
          const resultString = e?.target?.result;
          props.handleFileLoaded((resultString as string)?.split('\n'));
        };
      }
  
        return (
          <>
          <Button size="small">Upload File Here</Button>
            <input type="file" name="file" onChange={e => OnChange(e)} />
          </>
            )
      }