import React, { useState } from 'react'
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import { BsCloudUpload } from "react-icons/bs";
import { CgSoftwareUpload } from "react-icons/cg";
import { BiCheck } from 'react-icons/bi';
import { useTheme } from 'styled-components';

import { storage } from "../../Fire";
import {  FileInput, FileInputLabel, Button, FileDragBox, FileDragForm } from "../../utils/styles/forms.js";
import { Body, Label } from '../../utils/styles/text';
import { Div, Hr, Progress } from '../../utils/styles/misc';
import { Img } from '../../utils/styles/images';
import { FormError } from './Misc';
import { SIZES } from '../../utils/constants';
import { toast } from 'react-toastify';

function FileUpload(props) {
    const theme = useTheme();
    const [files, setFiles] = useState([]);
    const [uploadProgress, setUploadProgress] = useState("");
    const [dragActive, setDragActive] = useState(false);

    const handleFileSelect = (files) => {
        props.clearError(props.name);
        let passed = true;
        const mbLimit = 5;
        console.log("files: ")
        console.log(files)
        Array.from(files).forEach((tempFile, key, arr) => {
            const fileSizeMb = (tempFile.size / (1024 ** 2)).toFixed(2);
            if(fileSizeMb > mbLimit){
                passed = false;
            }

            if(Object.is(arr.length - 1, key)) {
                if(passed){
                    setFiles(arr);
                } else {
                    props.setError(props.name, { 
                        type: "big-file", 
                        message: `Some files selected exceed the accept file size limit of ${mbLimit}Mb. Please only select files below this file size to continue.`
                    });
                    setFiles("")
                }
            }
        });
    }

    const handleFileClick = (e) => {
        handleFileSelect(e.target.files);
    }
    
    const handleDrag = (e) => {
        e.preventDefault();
        e.stopPropagation();
        if(e.type === "dragenter" || e.type === "dragover") {
            setDragActive(true);
        } else if(e.type === "dragleave") {
            setDragActive(false);
        }
    };
    
    const handleDrop = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);
        console.log("e.dataTransfer.files: ")
        console.log(e.dataTransfer.files)
        if(e.dataTransfer.files && e.dataTransfer.files[0]) {
            if(!props.multiple && e.dataTransfer.files.length > 1){
                toast.error("Sorry, but you can only add 1 file to this selection!")
            } else {
                handleFileSelect(e.dataTransfer.files);
            }
        }
    };

    const uploadFile = async (file) => {
        props.setSubmitting(prevState => ({
            ...prevState,
            file: true
        }));

        const filePreviewElement = document.getElementsByClassName(props.name);
        Array.from(filePreviewElement).forEach((element, key, arr) => {
            let passed = true;
            if(file.type.includes("image")){
                let naturalHeight = element.naturalHeight;
                let naturalWidth = element.naturalWidth;
                if(naturalWidth / naturalHeight !== 1){
                    passed = false;
                }
            }

            if(Object.is(arr.length - 1, key)) {
                if(passed){
                    // TODO: Does not work for multiple files yet
                    // https://firebase.google.com/docs/storage/web/upload-files
                    // Create the file metadata
                    /** @type {any} */
                    const metadata = {
                        contentType: file.type
                    };
                    
                    // Upload file and metadata to the object
                    const storageRef = ref(storage, `users/${props.user.id}/images/${props.name}/` + file.name);
                    const uploadTask = uploadBytesResumable(storageRef, file, metadata);
                    
                    // Listen for state changes, errors, and completion of the upload.
                    uploadTask.on("state_changed",
                        (snapshot) => {
                            // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
                            const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                            console.log("Upload is " + progress + "% done");

                            setUploadProgress(progress)
                            switch (snapshot.state) {
                                case "paused":
                                console.log("Upload is paused");
                                break;

                                case "running":
                                console.log("Upload is running");
                                break;

                                default:
                                console.log("Default case upload snapshot...");
                                break;
                            }
                        }, 
                        (error) => {
                            // A full list of error codes is available at
                            // https://firebase.google.com/docs/storage/web/handle-errors
                            switch (error.code) {
                                case "storage/unauthorized":
                                console.log("User doesn't have permission to access the object");
                                props.setError(props.name, { 
                                    type: "storage/unauthorized", 
                                    message: "User doesn't have permission to access the object."
                                });
                                break;

                                case "storage/canceled":
                                console.log("User canceled the upload");
                                props.setError(props.name, { 
                                    type: "storage/canceled", 
                                    message: "User canceled the upload."
                                });
                                break;
                        
                                case "storage/unknown":
                                console.log("Unknown error occurred, inspect error.serverResponse");
                                props.setError(props.name, { 
                                    type: "storage/unknown", 
                                    message: `Unknown error, contact ${props.site.emails.support}`
                                });
                                break;

                                default:
                                console.log("Default case upload snapshot...");
                                props.setError(props.name, { 
                                    type: "storage/unknown", 
                                    message: `Default error, contact ${props.site.emails.support}`
                                });
                                break;
                            }
                            
                            props.setSubmitting(prevState => ({
                                ...prevState,
                                file: false
                            }));
                        }, 
                        () => {
                            // Upload completed successfully, now we can get the download URL
                            getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                                props.onUploadSuccess(downloadURL)
                            });
                            props.setSubmitting(prevState => ({
                                ...prevState,
                                file: false
                            }));
                        }
                    );
                } else {
                    props.setError(props.name, { 
                        type: "invalid-aspect-ratio", 
                        message: "A picture selected is not a square aspect ratio. Please only select pictures that are a square. (i.e. 300px tall by 300px wide is a square)"
                    });
                    props.setSubmitting(prevState => ({
                        ...prevState,
                        file: false
                    }));
                }
            }
        })
    }
    return (
        <>
            <FileDragForm dragActive={dragActive} selected={files.length > 0} onDragEnter={handleDrag} onSubmit={(e) => e.preventDefault()}>
                <FileInputLabel htmlFor={props.name} selected={files.length > 0}>
                    {
                        (files.length === 0) 
                        ? 
                        <Body textAlign="center"><CgSoftwareUpload size={60} /><br/> Drag and drop your file{props.multiple ? "s" : ""} here, <br/>or simply click to browse and select file{props.multiple ? "s" : ""}.</Body> 
                        : 
                        <Body textAlign="center" color={theme.colors.red}><CgSoftwareUpload size={60}  /><br/>Change file selection</Body>
                    }
                    <FileInput
                        id={props.name} 
                        type="file" 
                        accept={props.accepts} 
                        multiple={props.multiple ? true : false}
                        onChange={handleFileClick} 
                    />
                    
                    {files.length > 0 && (
                        <>
                        <Hr color={theme.colors.green}/>
                        <Label margin="0">Selected file{props.multiple ? "s" : ""}:</Label> 
                        </>
                    )}
                    {files.length > 0 && Array.from(files).map((file, f) => {
                        const fileSizeMb = (file.size / (1024 ** 2)).toFixed(2);
                        if(files.length > 1){
                            return (
                                <div key={f}>
                                    <Body margin="10px 0">{f + 1}. {file.name} <i>({fileSizeMb}Mb)</i></Body>
                                </div>
                            )
                        } else {
                            if(file.type.includes("image")){
                                return (
                                    <div key={f}>
                                        <Body margin="10px 0">{file.name} <i>({fileSizeMb}Mb)</i></Body>
                                        <Img
                                            style={{border: `2px solid ${theme.colors.green}`}}
                                            width="300px"
                                            className={props.name}
                                            alt="file preview"
                                            src={URL.createObjectURL(file)}
                                        />
                                    </div>
                                    
                                );
                            } else {
                                return (
                                    <div key={f}>
                                        <Body margin="10px 0">{file.name} <i>{fileSizeMb}Mb</i></Body>
                                        <embed 
                                            style={{border: `2px solid ${theme.colors.green}`}}
                                            key={f}
                                            width="100%"
                                            height="auto"
                                            src={URL.createObjectURL(file)}
                                        />
                                    </div>
                                    
                                );
                            }
                        }
                    })}
                    {uploadProgress > 0 && (
                        <Progress uploadProgress={uploadProgress}>
                            <div>
                                <Body>{uploadProgress > 15 ? `${Math.trunc(uploadProgress)}%` : ""}{uploadProgress === 100 ? <BiCheck /> : ""}</Body>
                            </div>
                        </Progress>
                    )}
                </FileInputLabel>
                { dragActive && <FileDragBox onDragEnter={handleDrag} onDragLeave={handleDrag} onDragOver={handleDrag} onDrop={handleDrop}></FileDragBox> }
            </FileDragForm>
            {files.length > 0 && (
                <Div>
                    <Button 
                        type="button" 
                        disabled={props.submitting.file}
                        onClick={() => uploadFile(files[0])}
                    >
                        Upload &amp; Save {props.name} &nbsp;<BsCloudUpload size={20} />
                    </Button>
                </Div>
            )}
            {props.error && (
                <><Body display="inline" size={SIZES.LG} color={props.theme.colors.red}><b>Error</b>:</Body>  <FormError error={props.error} /> </>
            )}
        </>
    )
}

export default FileUpload;
