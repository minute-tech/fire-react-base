import React, { useState} from 'react'
import { ITEMS } from '../../../../utils/constants';
import ItemsManager from '../../../items-manager/ItemsManager';

function ManageFeedback(props) {
    const [itemStructure, setItemStructure] = useState(ITEMS.FEEDBACK.STRUCTURE);

    return (
        <ItemsManager 
            pageTitle="Feedback"
            itemName={ITEMS.FEEDBACK.COLLECTION}
            itemCollection={ITEMS.FEEDBACK.NAME}
            itemStructure={itemStructure}
            setItemStructure={setItemStructure}
            noCreate={true}
            noUpdate={true}
            {...props}
        />
    )
}

export default ManageFeedback;