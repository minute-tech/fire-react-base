import React, { useState} from 'react'
import { ITEMS } from '../../../../utils/constants';
import ItemsManager from '../../../items-manager/ItemsManager';

function ManageRoles(props) {
    const [itemStructure, setItemStructure] = useState(ITEMS.ROLES.STRUCTURE);

    // useEffect(() => {
    //     async function fetchClientsData() {
    //         const tempClientNames = [];
    //         const q = query(collection(firestore, "clients"));
    //         const querySnapshot = await getDocs(q);
    //         querySnapshot.forEach((doc) => {
    //             tempClientNames.push(doc.data().name);
    //         });
            
    //         const tempDataStruct = [...itemStructure];

    //         itemStructure.forEach((itemColumn, s) => {
    //             if (itemColumn.type === DATA_TYPE.ARRAY) {
    //                 itemColumn.subColumns.forEach((subColumn, c) => {
    //                     if(subColumn.key === "client") {
    //                         tempDataStruct[s].subColumns[c].options = tempClientNames;
    //                     }
    //                 })
    //             }
    //         });

    //         setItemStructure(tempDataStruct);
    //         setLoading(prevState => ({
    //             ...prevState,
    //             data: false
    //         }));
    //     };

    //     if (!fetched.data) {
    //         fetchClientsData();
    //         setFetched(prevState => ({
    //             ...prevState,
    //             data: true
    //         }));
    //     }

    // }, [fetched.data, itemStructure]); 

    return (
        <ItemsManager 
            pageTitle="Roles"
            itemCollection={ITEMS.ROLES.COLLECTION}
            itemName={ITEMS.ROLES.NAME}
            isUnique={true}
            user={props.user}
            fireUser={props.fireUser}
            customClaims={props.customClaims}
            site={props.site}
            itemStructure={itemStructure}
            setItemStructure={setItemStructure}
        />
    )
}

export default ManageRoles;