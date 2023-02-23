import {
  Accordion,
  AccordionPanel,
  Anchor,
  Avatar,
  Box,
  Button,
  Heading,
  NameValueList,
  NameValuePair,
  RadioButtonGroup,
  Text
} from 'grommet';
import React from 'react';
import gilHeadshot from './assets/gilHeadshot.png';

const radioOptions = [
  { label: "None", value: "none" },
  { label: "Sex", value: "sex" },
  { label: "Color", value: "color" },
  { label: "Birthday", value: "birthday" },
  { label: "Hips", value: "hips" },
];

const blankAttributes = {
  none: false,
  sex: false,
  color: false,
  birthday: false,
  hips: false,
};

function setAttributeFromRadio(selectedValue, setVisibleAttribute) {
  console.log(selectedValue)
  let newAttributes = JSON.parse(JSON.stringify(blankAttributes))
  newAttributes[selectedValue] = true
  setVisibleAttribute(newAttributes)
}

function dogAttributesList(currentNode) {
  return (
    <>
      <NameValueList nameProps={{ width: 'xsmall' }} valueProps={{ width: 'small' }} margin={{ top: "none", bottom: "xsmall" }}>
        <NameValuePair name="Sex">{currentNode.attributes.sex}</NameValuePair>
        <NameValuePair name="Color">{currentNode.attributes.color}</NameValuePair>
        <NameValuePair name="Birthday">{currentNode.attributes.birthday}</NameValuePair>
        <NameValuePair name="CHIC #">{currentNode.attributes.chicNum}</NameValuePair>
        <NameValuePair name="Hips">{currentNode.attributes.hips}</NameValuePair>
        <NameValuePair name="Reg #">{currentNode.attributes.registrationType} {currentNode.attributes.registrationNum}</NameValuePair>
        <NameValuePair name="DNA">{currentNode.attributes.dnaInfo}</NameValuePair>
      </NameValueList>
      {currentNode.attributes.ofaLink !== "None" && currentNode.attributes.ofaLink !== "" &&
        <Box>
          <Anchor
            default
            href={currentNode.attributes.ofaLink}
            target="_blank"
            label="Open OFA Page in New Tab"
            margin={{ bottom: "small" }}
          />
        </Box>
      }
    </>
  )
}

function showOnPedigreePanelContent(setVisibleAttribute) {
  return (
    <Box margin={{ bottom: "medium" }}>
      <RadioButtonGroup
        name="Show on Pedigree"
        options={radioOptions}
        onChange={(e) => setAttributeFromRadio(e.target.value, setVisibleAttribute)}
      />
    </Box>
  )
}

function navigationInfoPanelContent() {
  return (
    <Box gap="10px" margin={{ bottom: "medium" }}>
      <Text>Press the spacebar to show or hide the selected dog's parents</Text>
      <Text>Press enter to move focus to the selected dog's details in the sidebar</Text>
      <Text>When navigating via keyboard, a skip link appears at the end of the dog details list that moves focus back to the tree</Text>
    </Box>
  )
}

function aboutInfoPanelContent() {
  return (
    <Box>
      <Text>
        This web app is a work in progress and
        is not compatible with small screens. Please
        reach out with any accessibility errors.
      </Text>
      <Text margin={{ "top": "10px", "bottom": "10px" }}>
        <Anchor href="https://github.com/arielrezinn/pedigree" label="View this project on Github!" />
      </Text>
      <Text size="small" margin={{ "top": "auto" }}>
        Created with &#9829; by&nbsp;
        <Anchor href="https://arielrezin.com" target="_blank" label="Ariel Rezin" />
      </Text>
    </Box>
  )
}

export default function ManageTree({ currentNode, visibleAttribute, setVisibleAttribute }) {
  return (
    <Box flex={{ grow: 1, shrink: 1 }} basis="0" background="light-2" pad="20px" overflow={{ vertical: "scroll", horizontal: "scroll" }}>
      <Box gap="xsmall" basis="full" height={{ min: "max-content" }}>
        <Box direction="row" gap="10px" align="center" width="100%" flex={{ grow: 0, shrink: 2 }}>
          <Avatar round="large" background="accent-1" a11yTitle="the head of a red standard poodle staring into the camera" src={gilHeadshot} />
          <Heading level='1' size="medium" margin="none">
            Gil's Pedigree
          </Heading>
        </Box>
        <Box id="dogDetails" tabIndex={-1} width="100%" flex={{ grow: 0, shrink: 0 }}>
          <Heading level='2' size='small' margin={{ top: "small", bottom: "small" }}>{currentNode.name}</Heading>
          {dogAttributesList(currentNode)}
          <Button
            className="moveFocusButton"
            onClick={() => document.getElementsByClassName("currentlySelected")[0].focus()}
            label="Move focus to the tree"
            plain={true}
          />
        </Box>
        <Box flex={{ grow: 1, shrink: 0 }} justify="end">
          <Accordion multiple>
            <AccordionPanel label={<Heading level='2' size='small' margin={{ top: "small", bottom: "small" }}>Show</Heading>}>
              {showOnPedigreePanelContent(setVisibleAttribute)}
            </AccordionPanel>
            <AccordionPanel label={<Heading level='2' size='small' margin={{ top: "small", bottom: "small" }}>Navigation</Heading>}>
              {navigationInfoPanelContent()}
            </AccordionPanel>
            <AccordionPanel label={<Heading level='2' size='small' margin={{ top: "small", bottom: "xsmall" }}>About</Heading>}>
              {aboutInfoPanelContent()}
            </AccordionPanel>
          </Accordion>
        </Box>
      </Box>
    </Box >
  );
}