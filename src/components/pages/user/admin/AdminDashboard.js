import React, { useEffect, useState } from 'react'
import { useTheme } from 'styled-components'
import { BiLock, BiUser } from "react-icons/bi"
import { FaChevronLeft, FaSitemap } from 'react-icons/fa'
import { Helmet } from 'react-helmet-async'

import { Button } from '../../../../utils/styles/forms'
import { Hr } from '../../../../utils/styles/misc'
import { Body, H1, H2, LLink } from '../../../../utils/styles/text'
import { ITEMS, CRUD, SIZES, ADMIN } from '../../../../utils/constants'
import { checkUserAdminPermission, ucFirst } from '../../../../utils/misc'
import { Tabs } from '../../../misc/Tabs'
import { Img } from '../../../../utils/styles/images'
import { Icon } from '../../../misc/Misc'
import { RiPagesLine } from 'react-icons/ri'

function AdminDashboard(props) {
    const theme = useTheme();
    const [orderedItems, setOrderedItems] = useState([]);
    
    useEffect(() => {
        const tempItems = [];
        for (const key in ITEMS) {
            if(checkUserAdminPermission(ITEMS?.[key].COLLECTION, CRUD.READ, props.roles, props.customClaims) && ITEMS?.[key] !== ITEMS.ROLES && ITEMS?.[key] !== ITEMS.USERS && ITEMS?.[key] !== ITEMS.PAGES) {
                // Dont need to show users and roles buttons on top, always shown for super admin below!
                tempItems.push(ITEMS?.[key]);
            } else {
                console.log("Role not set on database or user so don't show button.");
            }
        }
        
        tempItems.sort((a, b) => a.ORDER - b.ORDER)

        setOrderedItems(tempItems)
    }, [props.roles, props.customClaims])
    

    return (
        <>
            <Helmet>
                <title>Admin Dashboard {props.site.name ? `| ${props.site.name}` : ""}</title>
            </Helmet>
            <LLink to="/dashboard">
                <Button type="button">
                    <FaChevronLeft />
                    &nbsp; Back to User Dashboard
                </Button>
            </LLink>
            <div>
                <H1 margin={"0"} inline>Admin Dashboard</H1>
                <Body margin={"0 0 0 10px"} size={SIZES.LG} display={"inline"} color={theme.color.grey}>
                    {
                        props.customClaims.role === ADMIN.SUPER ? "Super Admin" : props.customClaims.role
                    }
                </Body>
            </div>
            {
                orderedItems.map((item, i) => {
                    if (item) {
                        return (
                            <LLink key={i} to={`/dashboard/admin/${item.COLLECTION}`}> 
                                <Button type="button" color={item.COLOR}>
                                    {item.ICON}
                                    <br/>  
                                    Manage {ucFirst(item.COLLECTION)}
                                </Button>
                            </LLink>
                        )
                    } else {
                        return null;
                    }
                    
                })
            }
            <Hr />
            {props.customClaims.role === ADMIN.SUPER && (
                <>
                <LLink to={`/dashboard/admin/site`}> 
                    <Button type="button">
                        <FaSitemap size={25} />
                        <br/> 
                        Manage Site
                    </Button>
                </LLink>
                <LLink to={`/dashboard/admin/pages`}> 
                    <Button type="button" color={theme.color.green}>
                        <RiPagesLine size={25} />
                        <br/> 
                        Manage Pages
                    </Button>
                </LLink>
                <LLink to={`/dashboard/admin/users`}> 
                    <Button type="button" color={theme.color.secondary}>
                        <BiUser size={25} />
                        <br/> 
                        Manage Users
                    </Button>
                </LLink>
                <LLink to={`/dashboard/admin/roles`}> 
                    <Button type="button" color={theme.color.tertiary}>
                        <BiLock size={25} />
                        <br/> 
                        Manage Roles
                    </Button>
                </LLink>
                </>
            )}
            <Hr/>
            <H2>Quick Links</H2>
            <Tabs>
                {  
                    props.site.menus.quickTabs.map((tab, i) => {
                        return (
                            <div key={i} label={tab.name}>
                                {
                                    props.site.menus.quickLinks.filter((link) => link.tab === tab.name).map((link, l) => {
                                        return (
                                            <LLink key={l} to={link.link} target="_blank" rel="noopener noreferrer">
                                                <Button type="button" color={link.color || theme.color.primary}>
                                                    {link.icon && (
                                                        <Icon name={link.icon} />
                                                    )}
                                                    {!link.icon && (
                                                        <Img
                                                            src={`${link.link}/favicon.ico` ? `${link.link}/favicon.ico` : require("../../../../assets/images/logos/logo.png")}
                                                            width={"0.9em"}
                                                        />
                                                    )}
                                                    &nbsp;
                                                    {link.name}
                                                </Button>
                                            </LLink>
                                        )
                                    })
                                }
                            </div>
                        )}
                    )
                }
            </Tabs>
        </>
    )
}

export default AdminDashboard;