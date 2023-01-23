import { Anchor, Avatar, Box, Heading, RadioButtonGroup, Text } from 'grommet';
import React from 'react';
import gilHeadshot from './assets/gilHeadshot.png';

const radioOptions = [
  { label: "None", value: "none" },
  { label: "Sex", value: "sex" },
  { label: "Color", value: "color" },
  { label: "Birthday", value: "birthday" },
  { label: "Hips", value: "hips" },
];

const attributes = {
  sex: false,
  color: false,
  birthday: false,
  hips: false,
};

function setAttributeFromRadio(selectedValue, setVisibleAttribute) {
  console.log(selectedValue)
  var newAttributes = JSON.parse(JSON.stringify(attributes))
  newAttributes[selectedValue] = true
  setVisibleAttribute(newAttributes)
}

export default function ManageTree({ currentNode, manageTreeRef, setVisibleAttribute }) {
  return (
    <div className="manageTree">
      <Box direction="row" gap="10px" alignContent="center">
        <Avatar display="inline" round="large" background="accent-1" a11yTitle="the head of a red standard poodle staring into the camera" src={gilHeadshot} />
        <Heading size="small" margin="none">
          Gil's Pedigree
        </Heading>
      </Box>
      <div className="dogDetails" tabIndex={-1} ref={manageTreeRef}>
        <div className="sectionHeader">{currentNode.name}</div>
        <div className="dogAttributes">
          <div>Sex: {currentNode.attributes.sex}<br></br></div>
          <div>Color: {currentNode.attributes.color}<br></br></div>
          <div>Birthday: {currentNode.attributes.birthday}<br></br></div>
          <div>CHIC #: {currentNode.attributes.chicNum}<br></br></div>
          <div>Hips: {currentNode.attributes.hips}<br></br></div>
          <div>
            Reg #: {currentNode.attributes.registrationType} {currentNode.attributes.registrationNum}
            <br></br>
          </div>
          <div>DNA: {currentNode.attributes.dnaInfo}<br></br></div>
          {currentNode.attributes.ofaLink !== "None"
            && currentNode.attributes.ofaLink !== ""
            &&
            <div>
              <Anchor
                default
                href={currentNode.attributes.ofaLink}
                target="_blank"
                label="Open OFA Page in New Tab"
              />
            </div>
          }
        </div>
      </div>
      <div className="controls">
        <div className="sectionHeader">Show on Pedigree</div>
        <RadioButtonGroup
          name="Show on Pedigree"
          options={radioOptions}
          onChange={(e) => setAttributeFromRadio(e.target.value, setVisibleAttribute)}
        />
      </div>
      <div className="about">
        <div className="sectionHeader">About</div>
        <Text>
          This web app is a work in progress and
          is not compatible with small screens. Please
          reach out with any accessibility errors.
        </Text>
        <Text margin={{ "top": "10px", "bottom": "10px" }}>
          You can also&nbsp;
          <Anchor href="https://github.com/arielrezinn/pedigree" label="view this project on Github!" />
        </Text>
        <Text size="small" margin={{ "top": "auto" }}>
          Created with &#9829; by&nbsp;
          <Anchor href="https://arielrezin.com" target="_blank" label="Ariel Rezin" />
        </Text>
      </div>
    </div>
  );
}