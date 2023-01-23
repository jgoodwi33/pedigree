const updateJson = async () => {
    try {
        const fs = require("fs");
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
            console.log(csvData);

        } else {
            console.log(`Error code ${res.status}`);
        }
    } catch (err) {
        console.log(err)
    }
}