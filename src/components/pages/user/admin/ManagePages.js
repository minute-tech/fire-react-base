import React, {useState} from 'react'
import { ITEMS } from '../../../../utils/constants';
import ItemsManager from '../../../items-manager/ItemsManager';

function ManagePages(props) {
    const [itemStructure, setItemStructure] = useState(ITEMS.PAGES.STRUCTURE);
    
    return (
        <ItemsManager 
            pageTitle="Pages"
            itemCollection={ITEMS.PAGES.COLLECTION}
            itemName={ITEMS.PAGES.NAME}
            itemStructure={itemStructure}
            setItemStructure={setItemStructure}
            isUnique={true}
            {...props}
        />
    )
}

export default ManagePages;