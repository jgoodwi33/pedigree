const fs = require("fs");
const csvToJson = require('csvtojson');
const { element } = require("prop-types");

const getCsv = async () => {
    try {
        // current from google drive
        const csvPedigreeUrl = "https://docs.google.com/spreadsheets/d/e/2PACX-1vS_t21NRDGXKya4lVd_Uijhnz-TDwqM36QyYfEncJQO-TCLCNdvT44KTe_ZafSROrJY6DW3YxdAI608/pub?gid=0&single=true&output=csv";

        //read .csv file on a server
        const res = await fetch(csvPedigreeUrl, {
            method: 'get',
            headers: {
                'content-type': 'text/csv;charset=UTF-8',
            }
        });

        if (res.status === 200) {
            const csvData = await res.text();
            return csvData;

        } else {
            console.log(`Error code ${res.status}`);
        }
    } catch (err) {
        console.log(err)
    }
}

function createCsvFile(csv) {
    fs.writeFile("./public/refreshDataAssets/pedigree.csv", csv, (err) => {
        if (err) throw err;
        else {
            console.log("pedigree.csv was created! it can be found at ./public/refreshDataAssets/pedigree.csv");
        }
    })
}

function createFlatJsonFile(json) {
    fs.writeFile("./public/refreshDataAssets/flatPedigree.json", JSON.stringify(json), (err) => {
        if (err) throw err;
        else {
            console.log("flatPedigree.json was created! it can be found at ./public/refreshDataAssets/flatPedigree.json");
        }
    })
}

// saves the output json to the src directory
function createJsonFile(json) {
    fs.writeFile("./src/pedigree.json", JSON.stringify(json, null, 3), (err) => {
        if (err) throw err;
        else {
            console.log("pedigree.json was created! it can be found at ./src/pedigree.json");
        }
    })
}

function TreeNode(element) {
    this.attributes = {
        registrationNum: element["Registration #"],
        registrationType: element["Registration Type"],
        sex: element["Sex"],
        color: element["Color"],
        birthday: element["Birthday"],
        dnaInfo: element["DNA Info"],
        chicNum: element["CHIC #"],
        hips: element["Hips"],
        ofaLink: element["OFA Link"],
        offspringRegistrationNum: element["Child Reg #"]
    };
    this.children = [];
    this.name = element["Registered Name"];
}

function createTree(node, parentMap) {
    if (node.attributes == undefined) {
        // attempt to catch a random error that was showing up?
        console.log("node.attributes is undefined for " + node.name)
        return node
    }
    if (parentMap.has(node.attributes.registrationNum)) {
        let parents = parentMap.get(node.attributes.registrationNum)
        if (parents[0]["Registration #"] != undefined) {
            node.children.push(new TreeNode(parents[0]))
        }
        if (parents[1]["Registration #"] != undefined) {
            node.children.push(new TreeNode(parents[1]))
        }
        if (node.children.length > 0) {
            node.children.forEach((child) => { createTree(child, parentMap) })
        }
    } else {
        // return, because that means that the current node does not have parent nodes  
        return node
    }
}

function createHierarchalJson(flatJson) {
    var root;
    let parentMap = new Map();

    // create a map from the flat json
    //      key: offspring reg # 
    //      value: an array that holds both dogs with that offspring reg #
    flatJson.forEach(element => {
        // if its child reg # is "None", create a root node object with that item's data
        if (element['Child Reg #'] == "None") {
            root = new TreeNode(element);
        } else { // else, check if the child reg # is already in the map
            if (parentMap.has(element['Child Reg #'])) {
                // if it is, insert the object at map[childRegNum][1]
                let parent1 = parentMap.get(element['Child Reg #']);
                let parent2 = element;
                let parentArray = [parent1, parent2]
                parentMap.set(element['Child Reg #'], parentArray)
            } else {
                // if it isn't, insert the object at map[childRegNum][0]
                parentMap.set(element['Child Reg #'], element)
            }
        }
    })

    // create the tree structure by calling a recursive method on the root var
    createTree(root, parentMap);

    // save the tree structure to a file
    createJsonFile(root);
}

async function main() {
    // create a csv from the pedigree data pulled from Google sheets
    getCsv()
        // save the csv to a file
        .then(csv => { createCsvFile(csv); })
        // convert the csv file to a flat json array, then save that to a json file
        .then(() => {
            csvToJson().fromFile("./public/refreshDataAssets/pedigree.csv")
                .then(json => {
                    createFlatJsonFile(json);
                    createHierarchalJson(json);
                });
        })
}

// if this file has been run directly, call the main() function
if (require.main === module) {
    main();
}