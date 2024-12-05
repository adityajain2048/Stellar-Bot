import fs from "fs";
// Function to write data to a plain text file
export function writeToFile(data:any, filename:any) {
  fs.writeFile(filename, JSON.stringify(data, null, 2), (err) => {
    if (err) {
      console.error("Error writing to file:", err);
    } else {
      console.log("Data written to file successfully!");
    }
  });
}
