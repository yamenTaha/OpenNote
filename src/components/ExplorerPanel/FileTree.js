import React from 'react';
import { StyledFileName, Indent, StyledText } from './styles.js';
import { openFolderInDirectory, closeFolderInDirectory, openImage, openNotes } from '../../helpers/directoryHelper.js';
import { useDispatch, useSelector } from 'react-redux';
import openFolderIcon from './openFolder.svg';
import closedFolderIcon from './closedFolder.svg';
import imgIcon from './img.svg';
import notesIcon from './notes.svg';
const fs = window.require('fs');

const FileTree = ({files, path}) => {
  const dispatch = useDispatch();
  const prevFileLocation = useSelector((state) =>  state.contents.location)

  const handleClick = (file) => {
    if(file.isFolder) {
      const folderLocation = `${path}\\${file.name}`;

      if(!file.isOpen){
        openFolderInDirectory(folderLocation, dispatch);
      } else if (file.isOpen) {
        closeFolderInDirectory(folderLocation, dispatch)
      }
    } else if( !file.isOpen ) {
      const fileLocation = `${path}\\${file.name}`;
      if (file.extension !== "md"){
        openImage(fileLocation, prevFileLocation, dispatch)
      } else {
        openNotes(fileLocation, prevFileLocation, dispatch)
      }
    }
  }

  return <div style={{whiteSpace: "nowrap", overflow: "hidden"}}>
     {files && files.length > 0 ? files.map(file => (
        <div key={`${path}\\${file.name}`}  style={{width: '100%'}}>
          <StyledFileName  onClick={(e) => handleClick(file)} className={file.isOpen && file.isFile ? 'isOpen' : ''}>
            {file.isFolder && <div style={{paddingRight: "10px"}}><img src={file.isOpen ? openFolderIcon : closedFolderIcon}/></div>}
            {file.isFile && file.extension !== 'md' && <div style={{paddingRight: "10px"}}><img src={imgIcon}/></div>}
            {file.isFile && file.extension === 'md' && <div style={{paddingRight: "10px"}}><img src={notesIcon}/></div>}
            {file.name}
          </StyledFileName>
          {file.isFolder && file.isOpen && file.files.length > 0 && <div style={{display: "flex"}}>
              <Indent />
              <div style={{flexGrow: "1"}}>
                <FileTree files={file.files} path={`${path}\\${file.name}`}/>
              </div>
            </div>}
        </div>
      )) : <StyledText>No Directory Selected</StyledText>}
  </div>
}

export default FileTree;

