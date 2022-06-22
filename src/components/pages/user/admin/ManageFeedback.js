import React, { useState} from 'react'
import { useTheme } from 'styled-components';

import { SIZES } from '../../../../utils/constants';
import { readTimestamp } from '../../../../utils/misc';
import { Centered } from '../../../../utils/styles/misc';
import { Body, H3 } from '../../../../utils/styles/text';
import DataManager from '../../../misc/DataManager';
import { renderEmotion } from '../../../misc/Feedback';

function ManageFeedback(props) {
    const theme = useTheme();
    const [tableCols, setTableCols] = useState([
        {
            label: "ID",
            key: "id",
            direction: "",
            active: false,
        },
        {
            label: "Timestamp",
            key: "timestamp",
            direction: "desc",
            active: true,
        },
        {
            label: "Emotion",
            key: "emotionSymbol",
            direction: "",
            active: false,
        },
        {
            label: "Score out of 100",
            key: "rangeValue",
            direction: "",
            active: false,
        },
        {
            label: "Message?",
            key: "body",
            direction: "",
            active: false,
        },
    ]);

    const renderDetailModal = (item) => {
        return (
            <Centered>
                <H3 margin="0">{renderEmotion(item.rangeValue, "3em")}</H3>
                <Body margin="0" size={SIZES.SM}><i>{readTimestamp(item.timestamp).date} @ {readTimestamp(item.timestamp).time}</i></Body>
                {item.body ? <Body>{item.body}</Body> : <Body color={theme.colors.red}><i>No message body</i></Body>}
            </Centered>
        )
    }

    return (
        <DataManager 
            pageTitle="Feedback"
            user={props.user}
            fireUser={props.fireUser}
            readOnlyFlags={props.readOnlyFlags}
            site={props.site}
            tableCols={tableCols}
            setTableCols={setTableCols}
            dataName={"feedback"}
            renderDetailModal={renderDetailModal}
        />
    )
}

export default ManageFeedback;