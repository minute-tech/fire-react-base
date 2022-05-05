import React, { Component } from 'react'
import { storage } from "../../Fire";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import { withTheme } from "styled-components";
import { BsCloudUpload } from "react-icons/bs";
import { CgAttachment } from "react-icons/cg";
import {  FileInput, FileInputLabel } from "../../utils/styles/forms.js";
import { Body, Label } from '../../utils/styles/text';
import { Img } from '../../utils/styles/misc';
import { Button } from '../../utils/styles/buttons';

class FileUpload extends Component {
    constructor(props) {
        super(props)
    
        this.state = {
            submittingUpdateUser: false,
            submittingFile: false,
            shownModals: [],
            files: [],
            uploadProgress: ""
        }
    }

    handleFileSelect = (e) => {
        console.log("e.target.files: ")
        console.log(e.target.files)

        this.setState({
            files: e.target.files
        })
    }

    uploadFile = async (file) => {
        this.setState({
            submittingFile: true
        });

        // https://firebase.google.com/docs/storage/web/upload-files
        // Create the file metadata
        /** @type {any} */
        const metadata = {
            contentType: file.type
        };
        
        // Upload file and metadata to the object "images/mountains.jpg"
        const storageRef = ref(storage, `users/${this.props.user.id}/images/${this.props.name}/` + file.name);
        const uploadTask = uploadBytesResumable(storageRef, file, metadata);
        
        // Listen for state changes, errors, and completion of the upload.
        uploadTask.on("state_changed",
            (snapshot) => {
                // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
                const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                console.log("Upload is " + progress + "% done");
                // this.setState({
                //     uploadProgress: progress
                // })
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
                    break;

                    case "storage/canceled":
                    console.log("User canceled the upload");
                    break;
            
                    case "storage/unknown":
                    console.log("Unknown error occurred, inspect error.serverResponse");
                    break;

                    default:
                    console.log("Default case upload snapshot...");
                    break;
                }
            }, 
            () => {
                // Upload completed successfully, now we can get the download URL
                getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                    this.props.onUploadSuccess(downloadURL)
                });
                
            }
        );
    }
    render() {
        return (
            <div>
                <FileInputLabel for={this.props.name} selected={this.state.files.length > 0 ? true : false}>
                {this.props.selectBtn ? this.props.selectFileBtn : <><CgAttachment /> Select a new file </>}
                    <FileInput
                        id={this.props.name} 
                        type="file" 
                        accept={this.props.accepts} 
                        // multiple
                        onChange={this.handleFileSelect} 
                    />
                    {this.state.files.length > 0 && Array.from(this.state.files).map((file, f) => {
                        const fileSizeMb = (file.size / (1024 ** 2)).toFixed(2);
                        if(this.state.files.length > 1){
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
                    {this.state.uploadProgress && (
                        <span>{this.state.uploadProgress}</span>
                    )}
                    {this.state.files.length > 0 && (
                        <Button 
                            type="button" 
                            onClick={() => this.uploadFile(this.state.files[0])}
                            // onClick={() => this.uploadFile(this.state.files.length > 1 ? this.state.files : this.state.files[0])}
                        >
                            Upload &amp; Save {this.props.name} &nbsp;<BsCloudUpload size={20} />
                        </Button>
                    )}
                </FileInputLabel>
            </div>
        )
    }
}

export default withTheme(FileUpload);
