const fs = require("fs");
const csvToJson = require('csvtojson');

let treeInfo = {
    totalNumNodes: 0,
    numDataRowsProcessed: 0
}
const csvPedigreeUrlMaster = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vR83JOZGkPgcr9c62zHgYQYCKUICpeIsomrfbrkqmj6LkKMGb4EU7B_AvoT9w2ErzWmFsdDDqfmfrPR/pub?gid=0&single=true&output=csv'

const fileOutputLocation = "./src/refreshedData/current/"

const getCsv = async () => {
    try {
        // "restructured" sheet from google drive
        const csvPedigreeUrlMaster = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vR83JOZGkPgcr9c62zHgYQYCKUICpeIsomrfbrkqmj6LkKMGb4EU7B_AvoT9w2ErzWmFsdDDqfmfrPR/pub?gid=0&single=true&output=csv'


        //read .csv file on a server
        const res = await fetch(csvPedigreeUrlMaster, {
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
    this.name = element["name"];
    this.attributes = {
        registrationNum: element["regNum"],
        regName: element["regName"],
        gender: element["gender"],
        color: element["color"],
        sire: element["sire"],
        dam: element["dam"],
        testing: element["testing"],
        ofa: element["ofa"],
        img: element["img"],
        bgColor: element["bgColor"],
        sireId: element["sireId"],
        damId: element["damId"]
    };
    this.children = [];
}

function createTree(node, dogMap) {
    // count the total number of nodes in the tree
    treeInfo.totalNumNodes++

    if (node.attributes != undefined) {
        let sireId = node.attributes.sireId
        let damId = node.attributes.damId
        let hasAtLeastOneParent = (sireId != "Unknown") && (damId != "Unknown")
        if (hasAtLeastOneParent) {
            // add the current node and its child nodes (mother and father) to the tree 
            if (dogMap.has(sireId)) {
                let sire = dogMap.get(sireId)
                node.children.push(new TreeNode(sire))
            }
            if (dogMap.has(damId)) {
                let dam = dogMap.get(damId)
                node.children.push(new TreeNode(dam))
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
        dogMap.set(dog['regNum'], dog)
        // count how many rows of data are processed
        treeInfo.numDataRowsProcessed++
    })

    // create the tree structure by calling a recursive method on the root var
    const gilsRegistrationNum ='1'
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
