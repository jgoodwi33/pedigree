const fs = require("fs");
const csvToJson = require('csvtojson');

let treeInfo = {
    totalNumNodes: 0,
    numDataRowsProcessed: 0
}

const fileOutputLocation = "./src/refreshedData/current/"

const getCsv = async () => {
    try {
        // "restructured" sheet from google drive
        const csvPedigreeUrl = "https://docs.google.com/spreadsheets/d/e/2PACX-1vS_t21NRDGXKya4lVd_Uijhnz-TDwqM36QyYfEncJQO-TCLCNdvT44KTe_ZafSROrJY6DW3YxdAI608/pub?gid=308395222&single=true&output=csv"

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
    let fileNameAndLocation = fileOutputLocation + "flatPedigree.csv"
    fs.writeFile(fileNameAndLocation, csv, (err) => {
        if (err) throw err;
        else {
            console.log("pedigree.csv was created! it can be found at " + fileNameAndLocation);
        }
    })
}

function createFlatJsonFile(json) {
    let fileNameAndLocation = fileOutputLocation + "flatPedigree.json"
    fs.writeFile(fileNameAndLocation, JSON.stringify(json), (err) => {
        if (err) throw err;
        else {
            console.log("flatPedigree.json was created! it can be found at " + fileNameAndLocation);
        }
    })
}

// saves the output json to the src directory
function createJsonFile(json) {
    let fileNameAndLocation = fileOutputLocation + "pedigree.json"
    fs.writeFile(fileNameAndLocation, JSON.stringify(json, null, 3), (err) => {
        if (err) throw err;
        else {
            console.log("pedigree.json was created! it can be found at " + fileNameAndLocation);
        }
    })
}

// saves the treeInfo json to the src directory
function createTreeInfoJsonFile(json) {
    let fileNameAndLocation = fileOutputLocation + "treeInfo.json"
    fs.writeFile(fileNameAndLocation, JSON.stringify(json), (err) => {
        if (err) throw err;
        else {
            console.log("treeInfo.json was created! it can be found at " + fileNameAndLocation);
        }
    })
}

function TreeNode(element) {
    this.name = element["Registered Name"];
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
        parent1RegistrationNum: element["Mother Reg #"],
        parent2RegistrationNum: element["Father Reg #"]
    };
    this.children = [];
}

function createTree(node, dogMap) {
    // count the total number of nodes in the tree
    treeInfo.totalNumNodes++

    if (node.attributes != undefined) {
        let parent1RegNum = node.attributes.parent1RegistrationNum
        let parent2RegNum = node.attributes.parent2RegistrationNum
        let hasAtLeastOneParent = (parent1RegNum != "Unknown") && (parent2RegNum != "Unknown")
        if (hasAtLeastOneParent) {
            // add the current node and its child nodes (mother and father) to the tree 
            if (dogMap.has(parent1RegNum)) {
                let parent1 = dogMap.get(parent1RegNum)
                node.children.push(new TreeNode(parent1))
            }
            if (dogMap.has(parent2RegNum)) {
                let parent2 = dogMap.get(parent2RegNum)
                node.children.push(new TreeNode(parent2))
            }
            if (node.children.length > 0) {
                node.children.forEach((child) => { createTree(child, dogMap) })
            }
        } else {
            // return, because that means that the current dog does not have known parents  
            return node
        }

        // if (dogMap.has(node.attributes.registrationNum)) {
        //     // let parents = dogMap.get(node.attributes.registrationNum)
        //     if (parents[0]["Registration #"] != undefined) {
        //         node.children.push(new TreeNode(parents[0]))
        //     }
        //     if (parents[1]["Registration #"] != undefined) {
        //         node.children.push(new TreeNode(parents[1]))
        //     }
        //     if (node.children.length > 0) {
        //         node.children.forEach((child) => { createTree(child, dogMap) })
        //     }
        // } else {
        //     // return, because that means that the current node does not have parent nodes  
        //     return node
        // }
    } else {
        // attempt to catch a random error that was showing up?
        console.log("node.attributes is undefined for " + node.name)
        return node
    }
}

function createHierarchalJson(flatJson) {
    // create a map from the flat json
    //      key: registration # 
    //      value: the dog's data as an object
    let dogMap = new Map();
    flatJson.forEach(dog => {
        dogMap.set(dog['Registration #'], dog)
        // count how many rows of data are processed
        treeInfo.numDataRowsProcessed++
    })

    // create the tree structure by calling a recursive method on the root var
    const gilsRegistrationNum = 'PR23772310'
    let root = new TreeNode(dogMap.get(gilsRegistrationNum))
    createTree(root, dogMap)

    // save the tree structure to a file
    createJsonFile(root)
}

async function main() {
    // create a csv from the pedigree data pulled from Google sheets
    getCsv()
        // save the csv to a file
        .then(csv => { createCsvFile(csv); })
        // convert the csv file to a flat json array, then save that to a json file
        .then(() => {
            csvToJson().fromFile("./src/refreshedData/current/flatPedigree.csv")
                .then(json => {
                    createFlatJsonFile(json);
                    createHierarchalJson(json);
                })
                // save other info about the data, like how many total nodes and the depth 
                .then(() => {
                    createTreeInfoJsonFile(treeInfo);
                })
        })
}

// if this file has been run directly, call the main() function
if (require.main === module) {
    main();
}