import React, { useState} from 'react'
import { SIZES } from '../../../../utils/constants';
import { readTimestamp } from '../../../../utils/misc';
import { ALink, Body, Label } from '../../../../utils/styles/text';

import DataManager from '../../../misc/DataManager';

function ManageMessages(props) {

    const [tableCols, setTableCols] = useState([
        {
            label: "ID",
            value: "id",
            direction: "",
            active: false
        },
        {
            label: "Timestamp",
            value: "timestamp",
            direction: "desc",
            active: true
        },
        {
            label: "Name",
            value: "name",
            direction: "",
            active: false
        },
        {
            label: "Email",
            value: "email",
            direction: "",
            active: false
        },
    ]);

    const renderDetailModal = (item) => {
        return (
            <>
                <Label>{item.name}</Label> <ALink href={`mailto:${item.email}`}>&lt;{item.email}&gt;</ALink>
                <Body margin="0" size={SIZES.SM}><i>{readTimestamp(item.timestamp).date} @ {readTimestamp(item.timestamp).time}</i></Body>
                <Body>{item.body}</Body>
            </>
        )
    }

    return (
        <DataManager 
            pageTitle="Contact Messages"
            user={props.user}
            fireUser={props.fireUser}
            readOnlyFlags={props.readOnlyFlags}
            site={props.site}
            tableCols={tableCols}
            setTableCols={setTableCols}
            dataName={"messages"}
            renderDetailModal={renderDetailModal}
        />
    )
}

export default ManageMessages;