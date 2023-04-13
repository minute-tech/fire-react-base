import React, { useState } from 'react'
import { FaAnchor } from 'react-icons/fa';
import { BiInfoCircle } from 'react-icons/bi';
import { toast } from 'react-toastify';
import { useTheme } from 'styled-components';

import { SelectInput, TextInput, TextAreaInput, CheckboxInput, CheckboxLabel, TimestampPicker, Button, RadioInput } from '../../../../utils/styles/forms';
import { BTYPES, SIZES } from '../../../../utils/constants.js';
import { HillSeparators, Iframe, IframeContainer, Path, Squiggle, Svg } from '../../../../utils/styles/images.js';
import { Column, Grid, Hr, Wrapper, Row, Centered, FullWidthLine, Container, ColorBlock, Th, Tr, Table, Thead, OverflowXAuto, Tbody, Td } from '../../../../utils/styles/misc';
import { ALink, Body, H1, H2, H3, H4, LLink, SLink, Label, Ol, Ul, Li } from '../../../../utils/styles/text';
import { Tooltip } from '../../../misc/Misc.js';
import { Tabs } from '../../../misc/Tabs.js';

function ManageAssets(props){
    const theme = useTheme();
    const sendAlert = (alertType) => {
        toast[alertType]('🦄 Wow so easy to send an alert!');
    }

    const [columnHover, setColumnHover] = useState();

    const handleColumnHover = (c) => {
        setColumnHover(c);
    };

    const [value, onChange] = useState(new Date());
    const exPeople = [
        {
            id: "1234567890",
            name: "John Doe",
            email: "johndoe@mail.com",
            phone: "+1234567890",
        },
        {
            id: "9964567890",
            name: "Jane Smith",
            email: "janesmith1900@mail.com",
            phone: "+9964567890",
        },
        {
            id: "00011122233",
            name: "Taylor Taylor",
            email: "tt@mail.com",
            phone: "+00011122233",
        },
        {
            id: "1234567890",
            name: "John Doe",
            email: "johndoe@mail.com",
            phone: "+1234567890",
        },
        {
            id: "1234567890",
            name: "John Doe",
            email: "johndoe@mail.com",
            phone: "+1234567890",
        },
    ];
    let rowCount = 0;
    return (
        <>
            <H2>Colors:</H2>
            <Grid fluid>
                <Row>
                    <Column sm={12} md={6} lg={3} textalign="center" >
                        <ColorBlock size="2.5em" color={theme.color.primary} />
                        <Body margin="5px 0">Primary</Body>
                        <Body margin="0" size={SIZES.SM} color={theme.color.grey}>({theme.color.primary})</Body>
                    </Column>
                    <Column sm={12} md={6} lg={3} textalign="center" >
                        <ColorBlock size="2.5em" color={theme.color.secondary} />
                        <Body margin="5px 0">Secondary</Body>
                        <Body margin="0" size={SIZES.SM} color={theme.color.grey}>({theme.color.secondary})</Body>
                    </Column>
                    <Column sm={12} md={6} lg={3} textalign="center" >
                        <ColorBlock size="2.5em" color={theme.color.tertiary} />
                        <Body margin="5px 0">Tertiary</Body>
                        <Body margin="0" size={SIZES.SM} color={theme.color.grey}>({theme.color.tertiary})</Body>
                    </Column>
                    <Column sm={12} md={6} lg={3} textalign="center" >
                        <ColorBlock size="2.5em" color={theme.color.green} />
                        <Body margin="5px 0">Green</Body>
                        <Body margin="0" size={SIZES.SM} color={theme.color.grey}>({theme.color.green})</Body>
                    </Column>
                    <Column sm={12} md={6} lg={3} textalign="center" >
                        <ColorBlock size="2.5em" color={theme.color.red} />
                        <Body margin="5px 0">Red</Body>
                        <Body margin="0" size={SIZES.SM} color={theme.color.grey}>({theme.color.red})</Body>
                    </Column>
                    <Column sm={12} md={6} lg={3} textalign="center" >
                        <ColorBlock size="2.5em" color={theme.color.yellow} />
                        <Body margin="5px 0">Yellow</Body>
                        <Body margin="0" size={SIZES.SM} color={theme.color.grey}>({theme.color.yellow})</Body>
                    </Column>
                    <Column sm={12} md={6} lg={3} textalign="center" >
                        <ColorBlock size="2.5em" color={theme.color.blue} />
                        <Body margin="5px 0">Blue</Body>
                        <Body margin="0" size={SIZES.SM} color={theme.color.grey}>({theme.color.blue})</Body>
                    </Column>
                    <Column sm={12} md={6} lg={3} textalign="center" >
                        <ColorBlock size="2.5em" color={theme.color.grey} />
                        <Body margin="5px 0">Grey</Body>
                        <Body margin="0" size={SIZES.SM} color={theme.color.grey}>({theme.color.grey})</Body>
                    </Column>
                    <Column sm={12} md={6} lg={3} textalign="center" >
                        <ColorBlock size="2.5em" color={theme.color.lightGrey} />
                        <Body margin="5px 0">Light Grey</Body>
                        <Body margin="0" size={SIZES.SM} color={theme.color.grey}>({theme.color.lightGrey})</Body>
                    </Column>
                </Row>
            </Grid>
            <br/>
            <Hr/>
            <br/>
            <H2>Text:</H2>
            <H3>Headings:</H3>
            <H1>H1 Heading</H1>
            <H2>H2 Heading</H2>
            <H3>H3 Heading</H3>
            <H4>H4 Heading</H4>
            <br/><br/>
            <H2>Labels:</H2>
            <Label size={SIZES.XL}>Extra Large Label</Label><br/>
            <Label size={SIZES.LG}>Large Label</Label><br/>
            <Label size={SIZES.MD}>Medium Label</Label><br/>
            <Label size={SIZES.SM}>Small Label</Label><br/>
            <Label size={SIZES.XS}>Extra Small Label</Label><br/>
            <br/><br/>
            <H2>Body:</H2>
            <Body size={SIZES.XL}>Extra Large Body</Body>
            <Body size={SIZES.LG}>Large Body</Body>
            <Body size={SIZES.MD}>Medium Body</Body>
            <Body size={SIZES.SM}>Small Body</Body>
            <Body size={SIZES.XS}>Extra Small Body</Body>
            <H2>Links:</H2>
            <LLink>Internal Link (LLink)</LLink> &&nbsp; &&nbsp;
            <ALink>External Link (ALink)</ALink> &&nbsp; &&nbsp;
            <SLink>Span Link (SLink)</SLink> &&nbsp; &&nbsp;
            <br/>
            <H2>Lists:</H2>
            <Label>Ordered List</Label>
            <Ol>
                <Li>Item 1</Li>
                <Li>Item 2</Li>
                <Li>Item 3</Li>
                <Li>Item 4</Li>
            </Ol>
            <Label>Unordered List</Label>
            <Ul>
                <Li>Item 1</Li>
                <Li>Item 2</Li>
                <Li>Item 3</Li>
                <Li>Item 4</Li>
            </Ul>
            <br/>
            <Hr />
            <br/>
            <H2>Buttons:</H2>
            <Button>Default button</Button>
            <br/><br/>
            <H3>Large:</H3>
            <Button size={SIZES.LG} onClick={() => sendAlert("info")} type="button">Primary Large Normal Button</Button>
            <Button color={theme.color.secondary} size={SIZES.LG} type="button">Secondary Large Normal Button</Button>
            <Button color={theme.color.tertiary} size={SIZES.LG} type="button">Tertiary Large Normal Button</Button>
            <br/>
            <Button size={SIZES.LG} btype={BTYPES.INVERTED} type="button">Primary Large Inverted Button</Button>
            <Button color={theme.color.secondary} btype={BTYPES.INVERTED} size={SIZES.LG} type="button">Secondary Large Inverted Button</Button>
            <Button color={theme.color.tertiary} btype={BTYPES.INVERTED} size={SIZES.LG} type="button">Tertiary Large Inverted Button</Button>
            <br/>
            <Button size={SIZES.LG} rounded={true} type="button">Primary Large Normal Button</Button>
            <Button color={theme.color.secondary} rounded={true} size={SIZES.LG} type="button">Secondary Large Normal Button</Button>
            <Button color={theme.color.tertiary} rounded={true} size={SIZES.LG} type="button">Tertiary Large Normal Button</Button>
            <br/>
            <Button size={SIZES.LG} rounded={true} btype={BTYPES.INVERTED} type="button">Primary Large Inverted Button</Button>
            <Button color={theme.color.secondary} rounded={true} btype={BTYPES.INVERTED} size={SIZES.LG} type="button">Secondary Large Inverted Button</Button>
            <Button color={theme.color.tertiary} rounded={true} btype={BTYPES.INVERTED} size={SIZES.LG} type="button">Tertiary Large Inverted Button</Button>
            <br/><br/>
            <H3>Medium:</H3>
            <Button size={SIZES.MD} type="button">Primary Medium Normal Button</Button>
            <Button color={theme.color.secondary} size={SIZES.MD} type="button">Secondary Medium Normal Button</Button>
            <Button color={theme.color.tertiary} size={SIZES.MD} type="button">Tertiary Medium Normal Button</Button>
            <br/>
            <Button size={SIZES.MD} btype={BTYPES.INVERTED} type="button">Primary Medium Inverted Button</Button>
            <Button color={theme.color.secondary} size={SIZES.MD} btype={BTYPES.INVERTED} type="button">Secondary Medium Inverted Button</Button>
            <Button color={theme.color.tertiary} size={SIZES.MD} btype={BTYPES.INVERTED} type="button">Tertiary Medium Inverted Button</Button>
            <br/>
            <Button size={SIZES.MD} rounded={true} type="button">Primary Medium Normal Button</Button>
            <Button color={theme.color.secondary} rounded={true} size={SIZES.MD} type="button">Secondary Medium Normal Button</Button>
            <Button color={theme.color.tertiary} rounded={true} size={SIZES.MD} type="button">Tertiary Medium Normal Button</Button>
            <br/>
            <Button size={SIZES.MD} rounded={true} btype={BTYPES.INVERTED} type="button">Primary Medium Inverted Button</Button>
            <Button color={theme.color.secondary} rounded={true} size={SIZES.MD} btype={BTYPES.INVERTED} type="button">Secondary Medium Inverted Button</Button>
            <Button color={theme.color.tertiary} rounded={true} size={SIZES.MD} btype={BTYPES.INVERTED} type="button">Tertiary Medium Inverted Button</Button>
            <br/><br/>
            <H3>Small:</H3>
            <Button size={SIZES.SM} type="button">Primary Small Normal Button</Button>
            <Button color={theme.color.secondary} size={SIZES.SM} type="button">Secondary Small Normal Button</Button>
            <Button color={theme.color.tertiary} size={SIZES.SM} type="button">Tertiary Small Normal Button</Button>
            <br/>
            <Button size={SIZES.SM} btype={BTYPES.INVERTED} type="button">Primary Small Inverted Button</Button>
            <Button color={theme.color.secondary} size={SIZES.SM} btype={BTYPES.INVERTED} type="button">Secondary Small Inverted Button</Button>
            <Button color={theme.color.tertiary} size={SIZES.SM} btype={BTYPES.INVERTED} type="button">Tertiary Small Inverted Button</Button>
            <br/>
            <Button size={SIZES.SM} rounded={true} type="button">Primary Small Normal Button</Button>
            <Button color={theme.color.secondary} size={SIZES.SM} rounded={true} type="button">Secondary Small Normal Button</Button>
            <Button color={theme.color.tertiary} size={SIZES.SM} rounded={true} type="button">Tertiary Small Normal Button</Button>
            <br/>
            <Button size={SIZES.SM} rounded={true} btype={BTYPES.INVERTED} type="button">Primary Small Inverted Button</Button>
            <Button color={theme.color.secondary} size={SIZES.SM} rounded={true} btype={BTYPES.INVERTED} type="button">Secondary Small Inverted Button</Button>
            <Button color={theme.color.tertiary} size={SIZES.SM} rounded={true} btype={BTYPES.INVERTED} type="button">Tertiary Small Inverted Button</Button>
            <br/><br/>
            <H3>Additional Variants:</H3>
            <Button rounded={true} type="button">Rounded Button</Button>
            <br/>
            <Button btype={BTYPES.TEXTED} type="button">Texted Button</Button>
            <br/>
            <Button btype={BTYPES.INVERTED} type="button">Inverted Button</Button>
            <br/>
            <Tooltip link={"https://minute.tech"} text="Add more information to an element here!">
                <Button>Tooltip button <BiInfoCircle /></Button>
            </Tooltip>
            <br/>
            <LLink to="/#anchored">
                <Button>Anchor linked button <FaAnchor /></Button>
            </LLink>
            <br/>
            <Hr/>
            <br/>
            <H2>Form Fields</H2>
            <Label>Text Field:</Label>
            <TextInput
                type="text"
                placeholder={`Enter a short text value.`}
            />
            <br/><br/>
            <Label>Textarea Field:</Label>
            <TextAreaInput
                placeholder={`Enter a text value.`}
            />
            <br/><br/>
            <Label>Select Field:</Label>
            <SelectInput width={"100%"}>
                <option key={""} value={""}>No selection</option>
                <option key={"option1"} value={"option1"}>Option 1 </option>
                <option key={"option2"} value={"option2"}>Option 2 </option>
                <option key={"option3"} value={"option3"}>Option 3 </option>
                <option key={"option4"} value={"option4"}>Option 4 </option>
            </SelectInput>
            <br/><br/>
            <Label>Checkbox Field:</Label>
            <br/>
            <CheckboxInput value={value}/>
            <CheckboxLabel>Option 1</CheckboxLabel>
            <br/>
            <CheckboxInput value={value}/>
            <CheckboxLabel>Option 2</CheckboxLabel>
            <br/>
            <CheckboxInput value={value}/>
            <CheckboxLabel>Option 3</CheckboxLabel>
            <br/>
            <CheckboxInput value={value}/>
            <CheckboxLabel>Option 4</CheckboxLabel>
            <br/>
            <br/>
            <Label>Radio Button Field:</Label>
            <br/>
            {/* TODO: Create a <RadioLabel>? */}
            <CheckboxLabel>Option 1</CheckboxLabel>
            <RadioInput
                name={"radioTest"}
                defaultChecked={true}>
            </RadioInput>
            <CheckboxLabel>Option 2</CheckboxLabel>
            <RadioInput
                name={"radioTest"}>
            </RadioInput>
            <CheckboxLabel>Option 3</CheckboxLabel>
            <RadioInput
                name={"radioTest"}>
            </RadioInput>
            <br/>
            <br/>
            <Label>Timestamp Field:</Label>
            <br/>
            <TimestampPicker
                onChange={onChange} 
                value={value}   
            />
            <br />
            <Hr />
            <H2>Alerts:</H2>
            <Button color={theme.color.primary} onClick={() => sendAlert("info")} type="button">"Info"</Button>
            <Button color={theme.color.green} onClick={() => sendAlert("success")} type="button">"Success"</Button>
            <Button color={theme.color.red} onClick={() => sendAlert("error")} type="button">"Error"</Button>
            <Button color={theme.color.yellow} onClick={() => sendAlert("warn")} type="button">"Warn"</Button>
            <H2>Table:</H2>
            <OverflowXAuto>
                <Table columnHover={columnHover}>
                    <Thead>
                        <Tr>
                            <Th
                            onMouseOver={() => handleColumnHover(1)}
                            onMouseLeave={() => handleColumnHover(0)}
                            >
                                ID
                            </Th>
                            <Th 
                                onMouseOver={() => handleColumnHover(2)}
                                onMouseLeave={() => handleColumnHover(0)}
                            >
                                Name
                            </Th>
                            <Th
                                onMouseOver={() => handleColumnHover(3)}
                                onMouseLeave={() => handleColumnHover(0)}
                            >
                                Email
                            </Th>
                            <Th
                                onMouseOver={() => handleColumnHover(4)}
                                onMouseLeave={() => handleColumnHover(0)}
                            >
                                Phone
                            </Th>
                        </Tr>
                    </Thead>
                    <Tbody>
                        {exPeople.map((person, p) => {
                            rowCount++;
                            return (
                                <Tr key={p}>
                                    <Td className={(exPeople.length === (rowCount)? "bottom-cell" : null)}>{person.id}</Td>
                                    <Td className={(exPeople.length === (rowCount)? "bottom-cell" : null)}>{person.name}</Td>
                                    <Td className={(exPeople.length === (rowCount)? "bottom-cell" : null)}>{person.email}</Td>
                                    <Td className={(exPeople.length === (rowCount)? "bottom-cell" : null)}>{person.phone}</Td>
                                </Tr>
                            )
                        })}
                    </Tbody>
                </Table>
            </OverflowXAuto>
            <H2>Tabs:</H2>
            <Tabs>
                <div label="Tab 1">
                    <H3>Content 1 here</H3>
                    <Body>
                        The tab content will be contained below each tab header. Excepteur nisi nulla sint amet incididunt exercitation commodo laboris id pariatur tempor labore minim. 
                        Proident sunt proident quis dolore ex voluptate reprehenderit aute. Veniam duis occaecat veniam incididunt ea mollit nisi sint et Lorem qui veniam. 
                    </Body>
                </div>
                <div label="Tab 2">
                    <H3>Content 2 here</H3>
                    <Body>
                        The tab content will be contained below each tab header. Excepteur nisi nulla sint amet incididunt exercitation commodo laboris id pariatur tempor labore minim. 
                        Proident sunt proident quis dolore ex voluptate reprehenderit aute. Veniam duis occaecat veniam incididunt ea mollit nisi sint et Lorem qui veniam. Dolor irure esse excepteur voluptate eiusmod labore.
                    </Body>
                </div>
                <div label="Tab 3">
                    <H3>Content 3 here</H3>
                    <Body>
                        The tab content will be contained below each tab header. Excepteur nisi nulla sint amet incididunt exercitation commodo laboris id pariatur tempor labore minim. 
                        Proident sunt proident quis dolore ex voluptate reprehenderit aute. Veniam duis occaecat veniam incididunt ea mollit nisi sint et Lorem qui veniam. 
                        Id cupidatat aute adipisicing aliqua consectetur deserunt et ipsum. Et nisi eiusmod magna anim ad nostrud sunt.
                    </Body>
                </div>
                <div label="Tab 4">
                    <H3>Content 4 here</H3>
                    <Body>
                        The tab content will be contained below each tab header. Excepteur nisi nulla sint amet incididunt exercitation commodo laboris id pariatur tempor labore minim. 
                        Proident sunt proident quis dolore ex voluptate reprehenderit aute. Veniam duis occaecat veniam incididunt ea mollit nisi sint et Lorem qui veniam.
                        Dolor officia nulla et aliquip. Sint dolore sint eiusmod veniam aliquip incididunt minim duis sint non cupidatat cillum aliquip. Consectetur deserunt sunt voluptate consequat.
                        Sint commodo nisi Lorem sunt amet sit mollit.
                    </Body>
                </div>
            </Tabs>
            <br/>
            <Hr/>
            <br/>
            <H2>Grid System</H2>
            <Grid fluid>
                <Row>
                    <Column sm={12} textalign="center" background={theme.color.primary}>
                        <H3 color={theme.color.font.solid}>Column 1</H3>
                        <Body color={theme.color.font.solid}>More information below</Body>
                    </Column>
                </Row>
                
                <Row>
                    <Column sm={12} md={6} textalign="center" background={theme.color.primary}>
                        <H3 color={theme.color.font.solid}>Column 2</H3>
                        <Body color={theme.color.font.solid}>More information below, but in this cell we are going to have longer text.</Body>
                    </Column>
                    <Column sm={12} md={6} textalign="center" background={theme.color.primary}>
                        <H3 color={theme.color.font.solid}>Column 3</H3>
                        <Body color={theme.color.font.solid}>More information below, but in this cell we are going to have longer text to see what it is like if a cell has extra content relative to it's neighboring cells in the grid system that we are creating here.</Body>
                    </Column>
                </Row>

                <Row>
                    <Column sm={12} md={4} textalign="center" background={theme.color.primary}>
                        <H3 color={theme.color.font.solid}>Column 4</H3>
                        <Body color={theme.color.font.solid}>More information below, but in this cell we are going to have longer text.</Body>
                    </Column>
                    <Column sm={12} md={4} textalign="center" background={theme.color.primary}>
                        <H3 color={theme.color.font.solid}>Column 5</H3>
                        <Body color={theme.color.font.solid}>More information below, but in this cell we are going to have longer text to see what it is like if a cell has extra content relative to it's neighboring cells in the grid system that we are creating here.</Body>
                    </Column>
                    <Column sm={12} md={4} textalign="center" background={theme.color.primary}>
                        <H3 color={theme.color.font.solid}>Column 6</H3>
                        <Body color={theme.color.font.solid}>More information below, but in this cell we are going to have longer text to see what it is like if a cell has extra content relative to it's neighboring cells in the grid system that we are creating here. 
                        More information below, but in this cell we are going to have longer text to see what it is like if a cell has extra content relative to it's neighboring cells in the grid system that we are creating here.</Body>
                    </Column>
                </Row>

                <Row>
                    <Column sm={12} md={6} lg={3} textalign="center" background={theme.color.primary}>
                        <H3 color={theme.color.font.solid}>Column 7</H3>
                        <Body color={theme.color.font.solid}>More information below, but in this cell we are going to have longer text.</Body>
                    </Column>
                    <Column sm={12} md={6} lg={3} textalign="center" background={theme.color.primary}>
                        <H3 color={theme.color.font.solid}>Column 8</H3>
                        <Body color={theme.color.font.solid}>More information below, but in this cell we are going to have longer text to see what it is like if a cell has extra content relative to it's neighboring cells in the grid system that we are creating here.</Body>
                    </Column>
                    <Column sm={12} md={6} lg={3} textalign="center" background={theme.color.primary}>
                        <H3 color={theme.color.font.solid}>Column 9</H3>
                        <Body color={theme.color.font.solid}>More information below, but in this cell we are going to have longer text to see what it is like if a cell has extra content relative to it's neighboring cells in the grid system that we are creating here. 
                        More information below, but in this cell we are going to have longer text to see what it is like if a cell has extra content relative to it's neighboring cells in the grid system that we are creating here.</Body>
                    </Column>
                    <Column sm={12} md={6} lg={3} textalign="center" background={theme.color.primary}>
                        <H3 color={theme.color.font.solid}>Column 9</H3>
                        <Body color={theme.color.font.solid}>More information below, but in this cell we are going to have longer text to see what it is like if a cell has extra content relative to it's neighboring cells in the grid system that we are creating here. 
                        More information below, but in this cell we are going to have longer text to see what it is like if a cell has extra content relative to it's neighboring cells in the grid system that we are creating here.</Body>
                    </Column>
                </Row>

                <Row>
                    <Column sm={12} md={6} lg={4} xl={2} textalign="center" background={theme.color.primary}>
                        <H3 color={theme.color.font.solid}>Column 10</H3>
                        <Body color={theme.color.font.solid}>More information below, but in this cell we are going to have longer text.</Body>
                    </Column>
                    <Column sm={12} md={6} lg={4} xl={2} textalign="center" background={theme.color.primary}>
                        <H3 color={theme.color.font.solid}>Column 11</H3>
                        <Body color={theme.color.font.solid}>More information below, but in this cell we are going to have longer text to see what it is like if a cell has extra content relative to it's neighboring cells in the grid system that we are creating here.</Body>
                    </Column>
                    <Column sm={12} md={6} lg={4} xl={2} textalign="center" background={theme.color.primary}>
                        <H3 color={theme.color.font.solid}>Column 12</H3>
                        <Body color={theme.color.font.solid}>More information below, but in this cell we are going to have longer text to see what it is like if a cell has extra content relative to it's neighboring cells in the grid system that we are creating here. 
                        More information below, but in this cell we are going to have longer text to see what it is like if a cell has extra content relative to it's neighboring cells in the grid system that we are creating here.</Body>
                    </Column>
                    <Column sm={12} md={6} lg={4} xl={2} textalign="center" background={theme.color.primary}>
                        <H3 color={theme.color.font.solid}>Column 13</H3>
                        <Body color={theme.color.font.solid}>More information below, but in this cell we are going to have longer text to see what it is like if a cell has extra content relative to it's neighboring cells in the grid system that we are creating here. 
                        More information below, but in this cell we are going to have longer text to see what it is like if a cell has extra content relative to it's neighboring cells in the grid system that we are creating here.</Body>
                    </Column>
                    <Column sm={12} md={6} lg={4} xl={2} textalign="center" background={theme.color.primary}>
                        <H3 color={theme.color.font.solid}>Column 14</H3>
                        <Body color={theme.color.font.solid}>More information below, but in this cell we are going to have longer text to see what it is like if a cell has extra content relative to it's neighboring cells in the grid system that we are creating here. 
                        More information below, but in this cell we are going to have longer text to see what it is like if a cell has extra content relative to it's neighboring cells in the grid system that we are creating here.</Body>
                    </Column>
                    <Column sm={12} md={6} lg={4} xl={2} textalign="center" background={theme.color.primary}>
                        <H3 color={theme.color.font.solid}>Column 15</H3>
                        <Body color={theme.color.font.solid}>More information below, but in this cell we are going to have longer text to see what it is like if a cell has extra content relative to it's neighboring cells in the grid system that we are creating here. 
                        More information below, but in this cell we are going to have longer text to see what it is like if a cell has extra content relative to it's neighboring cells in the grid system that we are creating here.</Body>
                    </Column>
                </Row>
                
                <Row>
                    <Column sm={12} md={6} lg={4} xl={2} xxl={1} textalign="center" background={theme.color.primary} padding="10px">
                        <H3 color={theme.color.font.solid}>Column 16</H3>
                        <Body color={theme.color.font.solid}>More information below, but in this cell we are going to have longer text.</Body>
                    </Column>
                    <Column sm={12} md={6} lg={4} xl={2} xxl={1} textalign="center" background={theme.color.primary}>
                        <H3 color={theme.color.font.solid}>Column 17</H3>
                        <Body color={theme.color.font.solid}>More information below, but in this cell we are going to have longer text to see what it is like if a cell has extra content relative to it's neighboring cells in the grid system that we are creating here.</Body>
                    </Column>
                    <Column sm={12} md={6} lg={4} xl={2} xxl={1} textalign="center" background={theme.color.primary}>
                        <H3 color={theme.color.font.solid}>Column 18</H3>
                        <Body color={theme.color.font.solid}>More information below, but in this cell we are going to have longer text to see what it is like if a cell has extra content relative to it's neighboring cells in the grid system that we are creating here. 
                        More information below, but in this cell we are going to have longer text to see what it is like if a cell has extra content relative to it's neighboring cells in the grid system that we are creating here.</Body>
                    </Column>
                    <Column sm={12} md={6} lg={4} xl={2} xxl={1} textalign="center" background={theme.color.primary}>
                        <H3 color={theme.color.font.solid}>Column 19</H3>
                        <Body color={theme.color.font.solid}>More information below, but in this cell we are going to have longer text to see what it is like if a cell has extra content relative to it's neighboring cells in the grid system that we are creating here. 
                        More information below, but in this cell we are going to have longer text to see what it is like if a cell has extra content relative to it's neighboring cells in the grid system that we are creating here.</Body>
                    </Column>
                    <Column sm={12} md={6} lg={4} xl={2} xxl={1} textalign="center" background={theme.color.primary}>
                        <H3 color={theme.color.font.solid}>Column 20</H3>
                        <Body color={theme.color.font.solid}>More information below, but in this cell we are going to have longer text to see what it is like if a cell has extra content relative to it's neighboring cells in the grid system that we are creating here. 
                        More information below, but in this cell we are going to have longer text to see what it is like if a cell has extra content relative to it's neighboring cells in the grid system that we are creating here.</Body>
                    </Column>
                    <Column sm={12} md={6} lg={4} xl={2} xxl={1} textalign="center" background={theme.color.primary}>
                        <H3 color={theme.color.font.solid}>Column 21</H3>
                        <Body color={theme.color.font.solid}>More information below, but in this cell we are going to have longer text to see what it is like if a cell has extra content relative to it's neighboring cells in the grid system that we are creating here. 
                        More information below, but in this cell we are going to have longer text to see what it is like if a cell has extra content relative to it's neighboring cells in the grid system that we are creating here.</Body>
                    </Column>
                    <Column sm={12} md={6} lg={4} xl={2} xxl={1} textalign="center" background={theme.color.primary}>
                        <H3 color={theme.color.font.solid}>Column 22</H3>
                        <Body color={theme.color.font.solid}>More information below, but in this cell we are going to have longer text.</Body>
                    </Column>
                    <Column sm={12} md={6} lg={4} xl={2} xxl={1} textalign="center" background={theme.color.primary}>
                        <H3 color={theme.color.font.solid}>Column 23</H3>
                        <Body color={theme.color.font.solid}>More information below, but in this cell we are going to have longer text to see what it is like if a cell has extra content relative to it's neighboring cells in the grid system that we are creating here.</Body>
                    </Column>
                    <Column sm={12} md={6} lg={4} xl={2} xxl={1} textalign="center" background={theme.color.primary}>
                        <H3 color={theme.color.font.solid}>Column 24</H3>
                        <Body color={theme.color.font.solid}>More information below, but in this cell we are going to have longer text to see what it is like if a cell has extra content relative to it's neighboring cells in the grid system that we are creating here. 
                        More information below, but in this cell we are going to have longer text to see what it is like if a cell has extra content relative to it's neighboring cells in the grid system that we are creating here.</Body>
                    </Column>
                    <Column sm={12} md={6} lg={4} xl={2} xxl={1} textalign="center" background={theme.color.primary}>
                        <H3 color={theme.color.font.solid}>Column 25</H3>
                        <Body color={theme.color.font.solid}>More information below, but in this cell we are going to have longer text to see what it is like if a cell has extra content relative to it's neighboring cells in the grid system that we are creating here. 
                        More information below, but in this cell we are going to have longer text to see what it is like if a cell has extra content relative to it's neighboring cells in the grid system that we are creating here.</Body>
                    </Column>
                    <Column sm={12} md={6} lg={4} xl={2} xxl={1} textalign="center" background={theme.color.primary}>
                        <H3 color={theme.color.font.solid}>Column 26</H3>
                        <Body color={theme.color.font.solid}>More information below, but in this cell we are going to have longer text to see what it is like if a cell has extra content relative to it's neighboring cells in the grid system that we are creating here. 
                        More information below, but in this cell we are going to have longer text to see what it is like if a cell has extra content relative to it's neighboring cells in the grid system that we are creating here.</Body>
                    </Column>
                    <Column sm={12} md={6} lg={4} xl={2} xxl={1} textalign="center" background={theme.color.primary}>
                        <H3 color={theme.color.font.solid}>Column 27</H3>
                        <Body color={theme.color.font.solid}>More information below, but in this cell we are going to have longer text to see what it is like if a cell has extra content relative to it's neighboring cells in the grid system that we are creating here. 
                        More information below, but in this cell we are going to have longer text to see what it is like if a cell has extra content relative to it's neighboring cells in the grid system that we are creating here.</Body>
                    </Column>
                </Row>
            </Grid>

            <H2>Separators:</H2>
            <H3>Horizontal Rule "HR"</H3>
            <Hr/>
            <Centered>
                <H3>Simple SVG</H3>
                <Svg 
                    viewBox="0 0 1366 221"
                    maxWidth="50%"
                >
                    <Path fill={theme.color.primary} d={Squiggle}/>
                </Svg>
            </Centered>
            <H3>Full Width SVG:</H3>
            <Svg 
                viewBox="0 0 1000 149" 
                margin="0 0 -20px 0"
            >
                <Path 
                    fill={theme.color.primary}
                    d={HillSeparators.one}
                />
                <Path 
                    fill={theme.color.primary}
                    d={HillSeparators.two}
                />
            </Svg>
            <FullWidthLine height="auto">
                <Wrapper>
                        <H2 color={theme.color.font.solid} id="anchored">Anchored Section!</H2>
                        <Body color={theme.color.font.solid}>
                            When you click the anchor link button above, it should jump down here! Long body of text to follow Sunt aliqua veniam nisi non quis cupidatat Lorem dolor. 
                            Sit in ad ex deserunt non laboris. Exercitation eu amet nulla laborum ea magna aliquip tempor nulla ipsum duis culpa dolore eu. Nostrud qui enim officia consequat dolore reprehenderit est laboris esse. 
                            Excepteur irure sint culpa exercitation magna irure ad aute qui. Sunt amet eu cupidatat enim sunt elit sunt laborum nisi aute. 
                            Exercitation laborum id dolore et nulla excepteur ullamco ea consectetur excepteur magna amet.
                            Laborum pariatur cillum ad ex aliqua eiusmod ullamco ex qui tempor labore ipsum sint consequat. Tempor sint sunt enim aliquip eiusmod cillum fugiat anim. Dolore in aliqua laboris sit irure nulla. 
                            Et tempor veniam anim proident aliquip exercitation veniam amet laborum consectetur proident. Anim qui aute culpa nisi nulla do esse duis aute. Eu dolore elit cupidatat nulla cupidatat amet qui. 
                            Esse consequat ea est est officia anim reprehenderit occaecat amet qui.
                        </Body>
                        <Container size={SIZES.MD}>
                            <IframeContainer>
                                <Iframe
                                    src="https://www.youtube.com/embed/YE7VzlLtp-4"
                                    id="test-video"
                                    title="Test Video"
                                />
                            </IframeContainer>
                        </Container>
                        <Body color={theme.color.font.solid}>
                            Ipsum nulla tempor proident commodo magna anim sint minim ea culpa eiusmod nisi do enim. Enim nostrud sit exercitation duis culpa. Ullamco ex ullamco est reprehenderit deserunt qui et amet ex minim dolore irure esse consequat. 
                            Culpa ad anim eu commodo irure irure esse enim Lorem ipsum non sunt pariatur cupidatat. Culpa tempor id sit officia duis ipsum mollit cupidatat cupidatat.
                        </Body>
                    </Wrapper>
            </FullWidthLine>
            <Svg 
                viewBox="0 0 1000 149" 
                margin="-20px 0 0 0"
                flipHoriz
            >
                <Path 
                    fill={theme.color.primary}
                    d={HillSeparators.one}
                />
                <Path 
                    fill={theme.color.primary}
                    d={HillSeparators.two}
                />
            </Svg>            
        </>
    );
}

export default ManageAssets;