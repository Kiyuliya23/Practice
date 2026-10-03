const fs = require("fs");

const readStream = fs.createReadStream("sourceFile.jpg");
const writeStream = fs.createWriteStream("destinationFile.jpg");

readStream.pipe(writeStream);

writeStream.on("finish", () => {
    console.log("Копирование файла завершено");
});

writeStream.on("error", (error) => {
    console.error("Ошибка при копировании файла:", error.message);
});

readStream.on("error", (error) => {
    console.error("Ошибка при чтении исходного файла:", error.message);
});