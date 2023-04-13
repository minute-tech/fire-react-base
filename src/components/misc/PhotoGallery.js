import React, { useState, useCallback, useEffect } from "react";
import Lightbox from 'react-image-lightbox';
import 'react-image-lightbox/style.css';

import { GalleryImg } from "../../utils/styles/images";
import { ProductImg } from "../../utils/styles/products";

export default function PhotoGallery(props) {
    const [currentImage, setCurrentImage] = useState(0);
    const [viewerIsOpen, setViewerIsOpen] = useState(false);

    const [photoSet, setPhotoSet] = useState(props.photos ? props.photos : []);

    useEffect(() => {
        if (props.isProduct && props.productPhotos) {
            let tempPhotos = [];
            // Turn into correct photo set
            props.productPhotos.forEach((photoUrl, p) => {
                tempPhotos.push(
                    {
                        src: photoUrl,
                        alt: props.productName ? `${props.productName} ${p+1}` : `${p+1}`,
                    },
                );
            })
            setPhotoSet(tempPhotos);
        }
    }, [props.isProduct, props.productPhotos, props.productName])

    const openLightbox = useCallback((index) => {
        if (props.isProduct && props.isProductSelected) {
            // Only allow expansion if selected product
            setCurrentImage(index);
            setViewerIsOpen(true);
        } else if (!props.isProduct) {
            setCurrentImage(index);
            setViewerIsOpen(true);
        } else {
            console.log("Not ready to maximize image.");
        }
    }, [props.isProduct, props.isProductSelected]);
  
    const closeLightbox = () => {
        setCurrentImage(0);
        setViewerIsOpen(false);
    };

    return (
      <>
        {
            photoSet && photoSet.map((photo, i) => {
                if (props.isProduct) {
                    return (
                        <ProductImg
                            key={i}
                            size={props.isProductSelected ? "350px" : "250px"}
                            src={photo.src} 
                            alt={photo.alt}
                            onClick={(e) => {e.stopPropagation(); openLightbox(i)}}
                        />
                    )
                } else {
                    return (
                        <GalleryImg
                            key={i}
                            margin="5px"
                            src={photo.src} 
                            alt={photo.alt}
                            onClick={(e) => {e.stopPropagation(); openLightbox(i)}}
                        />
                    )
                }
            })
        }
        {viewerIsOpen ? (
            <div onClick={(e) => {e.stopPropagation()}}>
                <Lightbox
                    mainSrc={photoSet[currentImage].src}
                    nextSrc={photoSet[(currentImage + 1) % photoSet.length].src}
                    prevSrc={photoSet[(currentImage + photoSet.length - 1) % photoSet.length].src}
                    onCloseRequest={closeLightbox}
                    onMovePrevRequest={() =>
                        setCurrentImage((currentImage + photoSet.length - 1) % photoSet.length)
                    }
                    onMoveNextRequest={() =>
                        setCurrentImage((currentImage + 1) % photoSet.length)
                    }
                />
            </div>
        ) : null}
      </>
    );
  }