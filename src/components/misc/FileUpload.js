import React, { useState } from 'react'
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import { BsCloudUpload } from "react-icons/bs";
import { CgAttachment } from "react-icons/cg";
import { BiCheck } from 'react-icons/bi';

import { storage } from "../../Fire";
import {  FileInput, FileInputLabel } from "../../utils/styles/forms.js";
import { Body, Label } from '../../utils/styles/text';
import { Img, Progress } from '../../utils/styles/misc';
import { Button } from '../../utils/styles/buttons';
import FormError from './FormError';
import { SIZES } from '../../utils/constants';

function FileUpload(props) {
    const [files, setFiles] = useState([]);
    const [uploadProgress, setUploadProgress] = useState("");

    const handleFileSelect = (e) => {
        let passed = true;
        const mbLimit = 5;
        console.log("files: ")
        console.log(e.target.files)
        Array.from(e.target.files).forEach((tempFile, key, arr) => {
            const fileSizeMb = (tempFile.size / (1024 ** 2)).toFixed(2);
            if(fileSizeMb > mbLimit){
                passed = false;
            }

            if(Object.is(arr.length - 1, key)) {
                if(passed){
                    setFiles(arr);
                } else {
                    props.setErrors(prevState => ({
                        ...prevState,
                        file: `Some files selected exceed the accept file size limit of ${mbLimit}Mb. Please only select files below this file size to continue.`
                    }))
                    setFiles("")
                }
            }
          });
    }

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
                                props.setErrors(prevState => ({
                                    ...prevState,
                                    file: "User doesn't have permission to access the object."
                                }))
                                break;

                                case "storage/canceled":
                                console.log("User canceled the upload");
                                props.setErrors(prevState => ({
                                    ...prevState,
                                    file: "User canceled the upload."
                                }))
                                break;
                        
                                case "storage/unknown":
                                console.log("Unknown error occurred, inspect error.serverResponse");
                                props.setErrors(prevState => ({
                                    ...prevState,
                                    file: `Unknown error, contact ${props.site.emails.support}`
                                }))
                                break;

                                default:
                                console.log("Default case upload snapshot...");
                                props.setErrors(prevState => ({
                                    ...prevState,
                                    file: `Default error, contact ${props.site.emails.support}`
                                }))
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
                    props.setErrors(prevState => ({
                        ...prevState,
                        file: `A picture selected is not a square aspect ratio. Please only select pictures that are a square. (i.e. 300px tall by 300px wide is a square)`
                    }))
                    props.setSubmitting(prevState => ({
                        ...prevState,
                        file: false
                    }));
                }
            }
        })
    }
    
    return (
        <div>
            <FileInputLabel htmlFor={props.name} selected={files.length > 0 ? true : false}>
            {props.selectBtn ? props.selectFileBtn : <><CgAttachment /> Select a new file </>}
                <FileInput
                    onKeyUp={() => 
                        props.setErrors(prevState => ({
                            ...prevState,
                            file: ""
                        }))
                    }
                    onClick={() => 
                        props.setErrors(prevState => ({
                            ...prevState,
                            file: ""
                        }))
                    }
                    id={props.name} 
                    type="file" 
                    accept={props.accepts} 
                    // multiple
                    onChange={handleFileSelect} 
                />
                {files.length > 0 && Array.from(files).map((file, f) => {
                    const fileSizeMb = (file.size / (1024 ** 2)).toFixed(2);
                    if(files.length > 1){
                        return (
                            <div key={f} style={{ margin: "15px 0" }}>
                                <Body>{f + 1}. {file.name} <i>({fileSizeMb}Mb)</i></Body>
                            </div>
                        )
                    } else {
                        if(file.type.includes("image")){
                            return (
                                <div key={f} style={{ margin: "15px 0" }}>
                                    <Body>{file.name} <i>({fileSizeMb}Mb)</i></Body>
                                    <br />
                                    <Img
                                        width="300px"
                                        className={props.name}
                                        alt="file preview"
                                        src={URL.createObjectURL(file)}
                                    />
                                </div>
                                
                            );
                        } else {
                            return (
                                <div key={f} style={{ margin: "15px 0" }}>
                                    <Label>{file.name} <i>{fileSizeMb}Mb</i></Label>
                                    <br />
                                    <embed 
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
                {files.length > 0 && (
                    <Button 
                        type="button" 
                        disabled={props.submitting.file}
                        onClick={() => uploadFile(files[0])}
                    >
                        Upload &amp; Save {props.name} &nbsp;<BsCloudUpload size={20} />
                    </Button>
                )}
            </FileInputLabel>
            
            {props.errors.file && (
                <><Body display="inline" size={SIZES.LG} color={props.theme.colors.red}><b>Error</b>:</Body> <FormError stateError={props.errors.file} /></>
            )}
        </div>
    )
}

export default FileUpload;
