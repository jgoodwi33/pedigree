# About

I have a standard poodle named Gilligan who's a pretty great dude. I started doing some research and wanted to collect all of my findings, which led to the creation of this web app. If you want dog pics, check out https://instagram.com/gilthepoodle.

# Resources

https://bkrem.github.io/react-d3-tree/docs/#event-handlers

# To Run Locally
`npm install`

`npm start` 

# To Rebuild & Publish 
`npm run deploy`

# To Generate a New Pedigree JSON

The spreadsheet with this information is stored on Google Drive, and can be viewed at: https://docs.google.com/spreadsheets/d/1p4TJlhcRKeuopBKsnmk4RM5sHm--sjfNvDhhjz4_b_M/edit?usp=sharing. 

Download the spreadsheet as a CSV (manually or by visiting [this link](https://docs.google.com/spreadsheets/d/e/2PACX-1vS_t21NRDGXKya4lVd_Uijhnz-TDwqM36QyYfEncJQO-TCLCNdvT44KTe_ZafSROrJY6DW3YxdAI608/pub?gid=0&single=true&output=csv))

I'm figuring out a new way to do this because I don't remember how I did it before! When my implementation is done, you'll be able to get refreshed data directly from Google Sheets by entering `npm run refresh`

Here's my rough plan for implementation in src/updateJson.js:
1. Grab the data as a CSV from Google Sheets
1. Convert the CSV into a single-level JSON
1. Save each item in the JSON to a key/value data structure with the key for each item being its "Offspring Reg #"
1. Recursively create the nested tree structure
   1. Start with Gil as the root node, then for each node...
   1. Copy its name and attributes values into the node
   1. Find both items in the key/value data structure whose key is equal to the current node's reg #, copy them into the "children" values for the current node, and remove them from the data structure (*this can be slightly confusing... the parents of a dog are being added as the "children" value because that's the terminology used*)
   1. Continue with a depth-first traversal until the key/value data structure is empty
1. Save the JSON data to a file for future reference


