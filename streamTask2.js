const fs = require("fs");

const data = "Это текст, который записывается в файл с помощью потока.";

const writeStream = fs.createWriteStream("output.txt", "utf8");

writeStream.write(data);

writeStream.end();

writeStream.on("finish", () => {
    console.log("Запись данных завершена");
});

writeStream.on("error", (error) => {
    console.error("Ошибка при записи файла:", error.message);
});