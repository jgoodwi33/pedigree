import React, { useState } from 'react';
import { Grommet, grommet } from 'grommet';
import PedigreeTree from './PedigreeTree';
import ManageTree from './ManageTree';
import { generateThemeChanges } from './Theme';
import { deepMerge } from 'grommet/utils';
import Div100vh from 'react-div-100vh'

const pedigree = require('./refreshedData/original/pedigree.json');
const treeInfo = require('./refreshedData/original/treeInfo.json');
const customTheme = deepMerge(grommet, generateThemeChanges());

const radioOptions = [
  { label: "None", value: "none" },
  { label: "Sex", value: "sex" },
  { label: "Color", value: "color" },
  { label: "Birthday", value: "birthday" },
  { label: "Hips", value: "hips" },
];

function App() {
  const [currentNode, setCurrentNode] = useState(pedigree);
  const [visibleAttribute, setVisibleAttribute] = useState(radioOptions[0])

  return (
    <Grommet theme={customTheme}>
      <Div100vh className="App">
        <ManageTree
          currentNode={currentNode}
          visibleAttribute={visibleAttribute}
          setVisibleAttribute={(attributeObj) => setVisibleAttribute(attributeObj)}
          radioOptions={radioOptions}
        />
        <PedigreeTree
          pedigree={pedigree}
          visibleAttribute={visibleAttribute}
          currentNode={currentNode}
          setCurrentNode={(node) => setCurrentNode(node)}
        />
      </Div100vh>
    </Grommet>
  );
}

export default App;
