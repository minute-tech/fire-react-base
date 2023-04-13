import React, { useState} from 'react'
import { ITEMS } from '../../../../utils/constants';
import ItemsManager from '../../../items-manager/ItemsManager';

function ManageMessages(props) {

    const [itemStructure, setItemStructure] = useState(ITEMS.MESSAGES.STRUCTURE);

    return (
        <ItemsManager 
            pageTitle="Contact Messages"
            itemCollection={ITEMS.MESSAGES.COLLECTION}
            itemName={ITEMS.MESSAGES.NAME}
            itemStructure={itemStructure}
            setItemStructure={setItemStructure}
            noCreate={true}
            {...props}
        />
    )
}

export default ManageMessages;