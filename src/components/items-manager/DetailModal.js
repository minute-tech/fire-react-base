import React from 'react'
import { useTheme } from 'styled-components';
import { FaShieldAlt, FaShieldVirus } from 'react-icons/fa';
import { BsEye } from 'react-icons/bs';
import { FaPencilAlt } from 'react-icons/fa';
import { CgClose } from 'react-icons/cg';

import { Button } from '../../utils/styles/forms';
import { ALink, Body, LLink } from '../../utils/styles/text';
import { checkIfRoleIsAdmin, checkUserAdminPermission, renderDetails, searchRoleArraysForUserRole, urlify } from '../../utils/misc';
import { SIZES, CRUD, BTYPES, ADMIN, ITEMS } from '../../utils/constants';
import { Img } from "../../utils/styles/images.js";
import { renderEmotion } from '../misc/Feedback';
import { ModalCard, Hr,  ModalContainer, Column, Row } from '../../utils/styles/misc';

const DetailModal = (props) => {
    const theme = useTheme();

    const renderAdminBadges = (incUser, rolesAndUsers, roles) => {
        let usersRole = null;
        usersRole = searchRoleArraysForUserRole(rolesAndUsers, incUser.objectID);
        if (usersRole === ADMIN.SUPER) {
            // Super admin
            return (
                <Body margin="10px 0 0 0" display="inline-block" color={theme.color.red}><FaShieldVirus /> Super Admin</Body>
            )
        } else if(checkIfRoleIsAdmin(usersRole, roles)){
            return (
                // Normal admin
                <Body margin="10px 0 0 0" display="inline-block" color={theme.color.red}><FaShieldAlt /> Admin</Body>
            )
        } else {
            // Not admin
            return (
                ""
            )
        }
    };

    const BottomButtons = () => {
        return (
            <>
                <Hr />
                {(!props.noUpdate && (checkUserAdminPermission(props.itemCollection, CRUD.UPDATE, props.roles, props.customClaims) || props.itemCollection === ITEMS.ROLES.COLLECTION || props.itemCollection === ITEMS.USERS.COLLECTION)) && (
                    <Button 
                        type="button" 
                        color={theme.color.green} 
                        onClick={() => props.toggleEditor("update", props.item, props.i)}
                    >
                        Update {props.itemName} &nbsp;<FaPencilAlt />
                    </Button>
                )}
                <Button 
                    type="button"
                    size={SIZES.SM} 
                    color={theme.color.red}
                    onClick={() => props.toggleModal(false, props.i)}
                >
                    <CgClose /> Close 
                </Button>
            </>
        )
    }

    return (
        <ModalContainer onClick={() => props.toggleModal(false, props.i)}>
            <ModalCard onClick={(e) => e.stopPropagation()}>
                {(props.item.avatar || props.item.avatar === "") &&
                    <Row style={{ height: "200px" }}>
                        <Column sm={12} textalign="center">
                            <Img 
                                src={props.item.avatar || require("../../assets/images/misc/user.png")}
                                rounded
                                alt={`${props.user.firstName} profile picture`}
                                width={"150px"}
                                paddingTop={"3%"}
                            />
                        </Column>
                    </Row>
                }
                
                {props.item.emotionLabel &&
                    <Row style={{ height: "200px" }}>
                        <Column sm={12} textalign="center">
                            {renderEmotion (props.item.rangeValue, "5em")}                     
                        </Column>
                    </Row>
                }
                {<div dangerouslySetInnerHTML={{  __html: renderDetails(props.item, props.localItemStructure, true, props.setSearchParams, props.setSearch)  }}/>}



                {props.itemCollection === ITEMS.PAGES.COLLECTION && 
                    <LLink
                        to={`/${urlify(props.item.name)}`}
                    >
                        <Button size={SIZES.SM} type={"button"} color={theme.color.primary}>View Page <BsEye /></Button>
                    </LLink>
                }

                {props.item.url && 
                    <ALink 
                        href={
                            (props.item.url).startsWith("https://") || (props.item.url).startsWith("http://")
                            ?
                            props.item.url 
                            :
                            `https://${props.item.url}`
                        }
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        <Button btype={BTYPES.INVERTED} size={SIZES.SM} type={"button"} color={theme.color.green}>View Site <BsEye /></Button>
                    </ALink>
                }

                {props.itemCollection === ITEMS.USERS.COLLECTION && renderAdminBadges(props.item, props.rolesAndUsers, props.roles)}
                <BottomButtons />
            </ModalCard>
        </ModalContainer>
    )
}


export default DetailModal; 