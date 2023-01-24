const fs = require("fs");
const csvToJson = require('csvtojson');

const getCsv = async () => {
    try {
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
            // console.log(csvData);
            return csvData;

        } else {
            console.log(`Error code ${res.status}`);
        }
    } catch (err) {
        console.log(err)
    }
}

function createCsvFile(csv) {
    fs.writeFile("./public/refreshDataOutput/pedigree.csv", csv, (err) => {
        if (err) throw err;
        else {
            console.log("pedigree.csv was created! it can be found at ./public/refreshDataOutput/pedigree.csv");
        }
    })
}

function createFlatJsonFile(json) {
    fs.writeFile("./public/refreshDataOutput/flatPedigree.json", JSON.stringify(json), (err) => {
        if (err) throw err;
        else {
            console.log("flatPedigree.json was created! it can be found at ./public/refreshDataOutput/flatPedigree.json");
        }
    })
}

async function main() {
    // create a csv from the pedigree data pulled from Google sheets
    getCsv()
        // save the csv to a file
        .then(csv => { createCsvFile(csv); })
        // convert the csv file to a flat json array, then save that to a json file
        .then(() => {
            csvToJson().fromFile("./public/refreshDataOutput/pedigree.csv")
                .then(json => { createFlatJsonFile(json); });
        })
        .then(() => { })

}

// if this file has been run directly, call the main() function
if (require.main === module) {
    main();
}