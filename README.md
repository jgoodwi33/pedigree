# About

I have a standard poodle named Gilligan who's a pretty great dude. I started doing some research and wanted to collect all of my findings, which led to the creation of this web app. Check it out at https://arielrezinn.github.io/pedigree/! 

If you want more dog pics, take a look at https://instagram.com/gilthepoodle.

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
1. ~~Grab the data as a CSV from Google Sheets~~
1. ~~Convert the CSV into a single-level JSON~~
1. ~~Save each item in the flat JSON to a key/value data structure with the key for each item being its "Offspring Reg #"~~
1. Recursively create the nested tree structure
   1. Start with Gil as the root node, then for each node...
   1. Copy its name and attributes values into the node
   1. Find both items in the key/value data structure whose key is equal to the current node's reg #, copy them into the "children" values for the current node, and remove them from the data structure (*this can be slightly confusing... the parents of a dog are being added as the "children" value because that's the terminology used*)
   1. Continue with a depth-first traversal until the key/value data structure is empty
1. Save the JSON data to a file for future reference

# // TODO
1. ~~Add a link to the published site that leads to the project's Github~~
1. ~~Move the toolbar from the bottom to the left hand side of the window~~
1. ~~Add a picture of Gil~~
1. ~~Only start off showing 4-5 generations on the tree~~
1. ~~Change my website so it links to this instead of Gil's instagram~~
1. ~~Make the "About" section in the sidebar collapsible~~
1. ~~Always display the focus indicator on whichever dog has its details displayed on the sidebar~~
1. ~~Ensure that a tree node is "selected" at all times~~
1. ~~Create skip links for easy keyboard navigation between the dog details and the tree~~
1. ~~Finish implementing the code that automatically creates a new  JSON from the spreadsheet in Google Drive~~
1. Add a collapsible section like the about section that explains how to use keyboard nav on the site
1. Make the collapsible sections only be open by default if there's room in the parent container for it
1. Test my JSON creation code a little bit more to make sure it works properly
1. Try to design it so it works on mobile devices/phone screens
1. Figure out how to address multiple instances of the same dog (aka line breeding)
1. Fix the tab focus management behavior so when the skip link is used, focus is shifted back to the specific instance of a dog that they started at, instead of the first insatnce of that dog in the tree
1. Add data from http://www.standardpoodledatabase.com
1. Add a toggle that allows the user to have a node automatically centered when it receives focus
1. Make the radio button group have an initial value of "none" set when the page loads
1. Display a count of the total number of generations (aka the tree depth) and the currently displayed number of generations
1. Add a toggle to switch between light and dark mode
1. Make the "About" section stay sticky to the bottom
1. Change the base URL to my personal site instead of Github when I get a chance
