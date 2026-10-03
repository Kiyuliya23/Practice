const dotenv = require("dotenv");
const axios = require("axios");
dotenv.config();

const CITY = process.env.CITY || "London";


async function getWeather(){
    try{
        const response = await axios.get( `https://wttr.in/${CITY}?format=%t`);
        console.log(CITY,response. data);
    }catch(error){
        console.error("Ошибка при получении погоды:", error.message);
    }
}
getWeather();
