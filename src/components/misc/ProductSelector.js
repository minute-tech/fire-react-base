import React from 'react'
import _ from "lodash";
import { FaCheck, FaExclamation, FaTrash } from 'react-icons/fa';
import { toast } from 'react-toastify';

import { useTheme } from 'styled-components';
import { Centered, Column, Hr, Row } from '../../utils/styles/misc.js';
import { BTYPES, SIZES, VARIANT_LAYOUT } from '../../utils/constants.js';
import { Body, Label } from '../../utils/styles/text.js';
import { H4Product, InventoryCount, NonVariantInventoryCount, OptionLabel, ProductPreview, VariantButtons, VariantGroup, VariantOptions } from '../../utils/styles/products.js';
import { Button, SelectInput } from '../../utils/styles/forms.js';
import PhotoGallery from '../misc/PhotoGallery.js';

function ProductSelector(props) {
    const theme = useTheme();

    const handleKeyPress = (e, product) => {
        if (e.key === 'Enter') {
            productSelected(product);
        }
    }

    // const showSizeChart = () => {
    //     let sizeToggle = !props.sizeChart;
    //     props.handleSizeChart(sizeToggle);
    // }

    const productConfirmed = (product) => {
        let productChoiceCloned = _.cloneDeep(product);
        console.log("productChoiceCloned: ");
        console.log(productChoiceCloned);
        // product clicked was NOT previously selected
        if(props.productChoices.filter((previousChoices) => previousChoices.objectID === product.objectID).length === 0){
            // if unselected clicked, check to make sure we can add to Choice
            if((props.productChoices.length + 1) > (props.formSettings?.reqChoices ?? 1)){
                // if we cannot add to Choice, throw error alert to user
                toast.warn(`Sorry, but you can only select ${props.formSettings?.reqChoices ?? 1} products. Please delete an item from your choices!`);
            } else {
                // if we can add to Choices, then add Choice to productChoices array
                props.setProductChoices( [...props.productChoices, productChoiceCloned] )
            }
        } 
    }

    const productSelected = (product) => {
        if(props.selectedChoice.objectID !== product.objectID){
            // only add product choice if this isn't already the selected product
            let selectedChoiceCloned = _.cloneDeep(product);
            selectedChoiceCloned.optionChoices = [];
            props.setSelectedChoice(selectedChoiceCloned);
        }
    }

    const renderConfirmButtons = ( product, isProductSelected, isProductChosen ) => {
        // First check if we are showing a button at all
        if(!(product?.flags?.isSoldOut ?? false)) {
            if (
                isProductSelected && 
                (product?.variant?.name ?? "")  && 
                !isProductChosen &&
                props.selectedChoice.optionChoices.length > 0
            ) {
                // For showing button on product with options
                return (
                    <Button 
                        size={SIZES.SM} 
                        btype={BTYPES.INVERTED} 
                        type="button" 
                        onClick={() => productConfirmed(props.selectedChoice)}
                    >
                        <FaCheck /> &nbsp; Confirm choice
                    </Button>
                ) 
            } else if (
                isProductSelected && 
                !(product?.variant?.name ?? "")  &&
                props.productChoices.filter((choice) => choice.objectID === product.objectID).length < 1
            ) {
                // For showing button on product with NO options
                return (
                    <Button 
                        size={SIZES.SM} 
                        btype={BTYPES.INVERTED} 
                        type="button" 
                        onClick={() => productConfirmed(props.selectedChoice)}
                    >
                        <FaCheck /> &nbsp; Confirm choice
                    </Button>
                )
            } else if (
                isProductSelected && 
               (product?.variant?.name ?? "") && 
                !isProductChosen &&
                props.selectedChoice.optionChoices.length === 0
            ) {
                return (
                    <Button 
                        size={SIZES.SM} 
                        btype={BTYPES.INVERTED} 
                        type="button"
                    >
                        <FaExclamation color={theme.color.red} /> &nbsp; Select option above to confirm choice
                    </Button>
                ) 
            } else if (isProductChosen) {
                return (
                    <Button 
                        color={theme.color.red} 
                        type="button" 
                        onClick={(e) => {props.deleteProductChoice(product); e.stopPropagation()}} 
                        style={{position:"relative", zIndex: "5"}}
                    >
                        <FaTrash />&nbsp; Delete choice
                    </Button> 
                )
            } else {
                return (
                    <></>
                )
            }
        } else {
            return (
                <></>
            )
        }
        
    }

    // const handleVariantChange = (e, productSelection, subSku) => {
    const handleVariantChange = (e, productSelection) => {
        let subSku = Object.values(productSelection.variant.options).find(o => o.name === e.target.value)?.subSku;
        console.log("subSku: " + subSku)
        let clonedSelection = _.cloneDeep(props.selectedChoice);
        if (props.productChoices.some((product) => product.objectID === clonedSelection.objectID)) {
            props.deleteProductChoice(clonedSelection);
        }
        // Check if choice of this variant has been selected previously
        if(clonedSelection.optionChoices.length > 0 && clonedSelection.optionChoices.some(choice => choice.name === productSelection.variant.name)){
            // Selected previously, so lets find it, and replace with new value
            clonedSelection.optionChoices.find((choice, c) => {
                if (choice.name === productSelection.variant.name) {
                    clonedSelection.optionChoices[c] = {
                        name: productSelection.variant.name,
                        choice: e.target.value,
                        subSku: subSku
                    };
                    return true; // stop searching
                } else {
                    return false;
                }
            });
        } else {
            // No variant choices made yet, just push to array
            clonedSelection.optionChoices.push({
                name: productSelection.variant.name,
                choice: e.target.value,
                subSku: subSku
            })
        }
        props.setSelectedChoice(clonedSelection)
    }

    return (
        props.products.map((product, p) => {
            let isProductSelected = props.selectedChoice.objectID === product.objectID;
            let isProductChosen = props.productChoices.filter(choice => choice.objectID === product.objectID).length > 0;
            let isProductChosenUnselected = (!isProductChosen || isProductSelected);
            let isInventory4NonVariantItemShown = 
                (
                    (isProductSelected) &&
                    props.formSettings?.showInventory &&
                    (product.inventory > 0) &&
                    !(product?.flags?.isSoldOut ?? false)
                );

            if(!product.isHidden){
                return (
                    <ProductPreview
                        key={p}
                        onKeyPress={(e) => handleKeyPress(e, product)}
                        onClick={() => productSelected(product)}
                        size={isProductSelected ? "250px" : "100px"} 
                        selected={isProductSelected}
                        isSoldOut={product?.flags?.isSoldOut ?? false}
                    >
                        <div tabIndex="0">
                            <Row align="center">
                                <Column md={12} lg={8} style={{padding: "25px"}}>
                                    {/* <Row start={"lg"}> */}
                                    <Row>
                                        <Column xs={12}>
                                            <H4Product>{product.name}</H4Product>
                                            {isInventory4NonVariantItemShown && (
                                                <NonVariantInventoryCount
                                                    productCount={product.inventory - product.sold}
                                                >
                                                    {(product.inventory - product.sold)} left
                                                </NonVariantInventoryCount>
                                            )}

                                            <div>{(product?.flags?.isSoldOut ?? false) ? <Body size={SIZES.LG} color={theme.color.red}>OUT OF STOCK</Body> : ""}</div>
                                            
                                            {/* Only show details about product if currently selected or chosen index, except description */}
                                            {isProductSelected && (<div dangerouslySetInnerHTML={{__html: product.description}}></div>)}

                                            {(isProductSelected || isProductChosen) && (
                                                <>            
                                                    { ((product?.variant?.name ?? "") && Object.keys(product.variant).length !== 0) && (
                                                        <>
                                                        {(isProductSelected) && (<Label>{product.variant.name}:&nbsp;</Label>)}
                                                        <VariantGroup isProductSelected={isProductSelected}>
                                                            {product.variant.inputLayout === VARIANT_LAYOUT.SELECT &&
                                                                <SelectInput
                                                                    onChange={(e) => handleVariantChange(e, _.cloneDeep(product))}
                                                                    defaultValue={""}
                                                                >
                                                                    <option value={""}> Please choose a {product.variant.name.toLowerCase()}.</option>
                                                                    { 
                                                                        product.variant.options.map((option, o) => {
                                                                            let isOptionOutOfStock = (props.formSettings?.hasInventory && option.inventory !== 0 && option.sold >= option.inventory);
                                                                            let isOptionDisabled = (props.formSettings?.hasInventory && option.inventory !== 0 && option.sold >= option.inventory);
                                                                            return (
                                                                                <option
                                                                                    key={o} 
                                                                                    label={`${option.name} ${isOptionOutOfStock? ' - Out of Stock' : (props.formSettings?.showInventory? `- ${option.inventory - option.sold} left` : '')}`}
                                                                                    name={`${product.variant.name}-option`}
                                                                                    value={option.name}
                                                                                    disabled={isOptionDisabled}
                                                                                >
                                                                                </option>
                                                                            )}
                                                                        )
                                                                    }
                                                                </SelectInput>
                                                            }     
                                                            {
                                                                product.variant.name 
                                                                && 
                                                                (product.variant.inputLayout === VARIANT_LAYOUT.BUTTONS || !product.variant.inputLayout)
                                                                &&
                                                                product.variant.options.map((option, o) => {
                                                                    let isOptionChosen = 
                                                                        (props?.productChoices?.find(productChoice => productChoice.objectID === product.objectID)?.optionChoices || [])
                                                                            .some(optionChoice => optionChoice.choice === option.name) 
                                                                        || 
                                                                        (props?.selectedChoice?.optionChoices || [])
                                                                            .some(optionChoice => optionChoice.choice === option.name);
                                                                    let isOptionOutOfStock = (props.formSettings?.hasInventory && option.inventory !== 0 && option.sold >= option.inventory);
                                                                    let isOptionDisabled = (props.formSettings?.hasInventory && option.inventory !== 0 && option.sold >= option.inventory);
                                                                    
                                                                    return (
                                                                        <VariantOptions 
                                                                            handleVariant
                                                                            key={o}
                                                                            variantLabel={product.variant.name}
                                                                        >
                                                                            <Centered>
                                                                                <VariantButtons
                                                                                    type="button"
                                                                                    label={option.name}
                                                                                    name={`${product.variant.name}-option`}
                                                                                    value={option.name}
                                                                                    chosen={isOptionChosen}
                                                                                    hidden={!isOptionChosen && !isProductSelected}
                                                                                    onClick={(e) => handleVariantChange(e, product, option.subSku)}
                                                                                    outOfStock={isOptionOutOfStock} 
                                                                                    disabled={isOptionDisabled}
                                                                                    subSku={option.subSku}
                                                                                    variantLabel={product.variant.name}
                                                                                    optionColor={option.bgColor}
                                                                                >
                                                                                    {option.bgColor ? (isOptionChosen ? <FaCheck style={{ color: (option.bgColor === "white" ? theme.color.font.inverted : theme.color.font.solid)}} />  : "") : option.subSku}
                                                                                </VariantButtons>
                                                                                {(isOptionChosen || isProductSelected) && (
                                                                                    <OptionLabel>
                                                                                        {option.name}
                                                                                    </OptionLabel>
                                                                                )}
                                                                                
                                                                                {(props.formSettings?.showInventory && isProductChosenUnselected) && (
                                                                                    <InventoryCount
                                                                                        productCount={option.inventory - option.sold} 
                                                                                        optionColor={option.bgColor}
                                                                                    > 
                                                                                        {(option.inventory - option.sold)} left
                                                                                    </InventoryCount>
                                                                                )}
                                                                            </Centered>
                                                                        </VariantOptions>
                                                                    )
                                                                })
                                                            } 
                                                        </VariantGroup>                            
                                                    </>
                                                )} 
                                                </>
                                            )}
                                        
                                            {/* {isProductSelected && (
                                                <Row>
                                                    <Column xs={12}>
                                                        { product.variant.chartLabel && 
                                                            <SizeChartButton
                                                                type='button'
                                                                onClick={() => showSizeChart()}
                                                            > 
                                                                {props.sizeChart ? "Hide" : "Show"} {(product.variant.chartLabel).toLowerCase()}
                                                            </SizeChartButton>
                                                        }
                                                    </Column>
                                                </Row>
                                            )} */}
                                        </Column>
                                    </Row>
                                    {/* <Row bottom="xs"> */}
                                    <Row>
                                        <Column xs={12} style={{padding: "0"}}>
                                            {isProductSelected ? <Hr/> : <br/>}
                                            {renderConfirmButtons( product, isProductSelected, isProductChosen )}
                                        </Column>
                                    </Row>
                                </Column>
                                <Column md={12} lg={4}> 
                                    {/* <Row center={"md"} end={"lg"}> */}
                                    <Row>
                                        <Column xs={12}>
                                            <PhotoGallery
                                                isProduct={true}
                                                isProductSelected={isProductSelected}
                                                productName={product.name}
                                                productPhotos={product.images ? product.images : ["https://via.placeholder.com/300x300.png?text=No+Image"]}
                                            />
                                        </Column>
                                    </Row>
                                </Column>
                            </Row>
                            {/* {
                                (isProductSelected) && (
                                    <Row bottom="xs">
                                        <Col xs={12}>
                                            { 
                                                (
                                                    product.variant.chartParts && 
                                                    product.variant.chartParts.length && 
                                                    props.sizeChart
                                                ) 
                                                && 
                                                (
                                                    <div>
                                                        <Label>{product?.variant?.chartLabel}</Label>
                                                        <OverflowXAuto>
                                                            <Table>
                                                                <Thead>
                                                                    <Tr>
                                                                        <Th></Th>
                                                                        { product.variant?.options.map((option, o) => {
                                                                            return (
                                                                                <Th key={o}>{option.name}</Th>
                                                                            )
                                                                        })}
                                                                    </Tr>
                                                                </Thead>
                                                                <Tbody>
                                                                    { product?.variant?.chartParts.map((part, p) => {
                                                                        return (
                                                                            <Tr key={p}>
                                                                                <TColumnHead>{part}</TColumnHead>
                                                                                { product?.variant.options.map((option, o) => {
                                                                                    return (
                                                                                        <Td key={o}>{option.measurements[p]}</Td>
                                                                                    )
                                                                                })}
                                                                            </Tr>
                                                                        )
                                                                    })}
                                                                </Tbody>
                                                            </Table>
                                                        </OverflowXAuto>
                                                    </div>
                                                )
                                            }                 
                                        </Col>
                                    </Row>
                                )
                            }       */}
                        </div>
                    </ProductPreview>
                )
            } else {
                // TODO: is this needed here?
                return (
                    <br key={p} />
                )
            }
        })
    )
}

export default ProductSelector
