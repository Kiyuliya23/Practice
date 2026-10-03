const fs = require("fs");

const readStream = fs.createReadStream("largeFile.txt", "utf8");

readStream.on("data", (chunk)=>{
    console.log(chunk);
});
readStream.on("end", ()=>{
    console.log("Чтение файла завершено");
});
readStream.on("error", (error)=>{
    console.error("Ошибка при чтении файла:", error.message);
});
