import React, { useEffect, useState, useRef } from 'react'
import { collection, getDocs, query, onSnapshot, doc } from 'firebase/firestore';

import { firestore } from '../../../../Fire';
import { ADMIN, ITEMS } from '../../../../utils/constants';
import { Spinner } from '../../../../utils/styles/images';
import { H2 } from '../../../../utils/styles/text';
import ItemsManager from '../../../items-manager/ItemsManager';

function ManageUsers(props) {
    const [loading, setLoading] = useState({ 
        roles: true,
        private: true,
    });
    
    const [fetched, setFetched] = useState({ 
        roles: false,
    });

    const [itemStructure, setItemStructure] = useState(ITEMS.USERS.STRUCTURE);

    const [rolesAndUsers, setRolesAndUsers] = useState({});
    
    const unsubPrivate = useRef();

    useEffect(() => {
        async function fetchData() {
            const tempRoleNames = [];
            const q = query(collection(firestore, ITEMS.ROLES.COLLECTION));
            const querySnapshot = await getDocs(q);
            querySnapshot.forEach((doc) => {
                tempRoleNames.push(doc.id);
            });

            // Also add super as a role array
            tempRoleNames.push(ADMIN.SUPER);
            
            const indexOfKeyToUpdate = itemStructure.findIndex((data) => data.key === "role");
            const tempDataStruct = [...itemStructure];
            tempDataStruct[indexOfKeyToUpdate].options = tempRoleNames;
            setItemStructure(tempDataStruct);

            setLoading(prevState => ({
                ...prevState,
                roles: false
            }));
            unsubPrivate.current = onSnapshot(doc(firestore, "site", "private"), (privateDoc) => {
                if(privateDoc.exists()){
                    let privateData = privateDoc.data();
                    // Object of arrays of users in each role
                    const tempRolesAndUsers = {};
                    tempRoleNames.forEach((roleName) => {
                        // Insert arrays into object key for each role
                        tempRolesAndUsers[roleName] = privateData[roleName];
                    })
                    setRolesAndUsers(tempRolesAndUsers);
    
                    setLoading(prevState => ({
                        ...prevState,
                        private: false
                    }));
                } else {
                    console.log("No custom site set, can't properly find private.")
                    setLoading(prevState => ({
                        ...prevState,
                        private: false
                    }));
                }
            });
        };

    
        if (!fetched.roles) {
            fetchData();
            setFetched(prevState => ({
                ...prevState,
                roles: true
            }));
        }

        return () => {
            if (unsubPrivate.current) {
                unsubPrivate?.current();
            }
        };
    }, [fetched.roles, itemStructure]);

    if(loading.roles || loading.private){
        return (
            <>
                <H2>Loading... <Spinner /> </H2> 
            </>
        )
    } else {
        return (
            <ItemsManager 
                pageTitle="Users"
                itemCollection={ITEMS.USERS.COLLECTION}
                itemName={ITEMS.USERS.NAME}
                rolesAndUsers={rolesAndUsers}
                itemStructure={itemStructure}
                setItemStructure={setItemStructure}
                noCreate={true}
                {...props}
            />
        )
    }
}

export default ManageUsers;