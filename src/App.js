import React, { useState } from 'react';
import { Grommet, grommet } from 'grommet';
import PedigreeTree from './PedigreeTree';
import ManageTree from './ManageTree';
import { deepMerge } from 'grommet/utils';
import Div100vh from 'react-div-100vh'


// const pedigree = require('./pedigree.json');
const pedigree = require('./newPedigree.json');

const initialAttributes = {
  none: true,
  sex: false,
  color: false,
  birthday: false,
  hips: false,
};
const customTheme = deepMerge(grommet, {
  global: {
    focus: {
      outline: { color: 'focus', size: '5px' },
      border: { color: undefined, style: undefined },
      shadow: { color: undefined, size: undefined },
    },
  },
  heading: {
    level: {
      2: {
        small: {
          size: '20px',
          height: '20px',
        },
      },
    },
  },
  accordion: {
    border: undefined,
  }
});

function App() {
  const [currentNode, setCurrentNode] = useState(pedigree);
  const [visibleAttribute, setVisibleAttribute] = useState(initialAttributes)

  return (
    <Grommet theme={customTheme}>
      <Div100vh className="App">
        <ManageTree
          currentNode={currentNode}
          visibleAttribute={visibleAttribute}
          setVisibleAttribute={(attributeObj) => setVisibleAttribute(attributeObj)}
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
