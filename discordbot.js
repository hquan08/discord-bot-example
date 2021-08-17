require('dotenv').config();

const Discord = require('discord.js');
const client = new Discord.Client();
const fetch = require('node-fetch');
const translator = require('@iamtraction/google-translate');
const weather = require('weather-js');


const memeSubreddit = ['dankmemes', 'memes', 'Animemes']; //array contains some subreddit

const cmd = "!";


function randomSubreddit(num) {
    return Math.floor(Math.random() * num);
}

client.on("ready", () => {
    console.log('the bot is running');
});

function getQuery(str) {
    const message = str.toLowerCase();
    const arrayOfStr = str.slice(cmd.length).split(" "); //cut "!", then put the rest into array - in this case, 'array' variable
    const query = arrayOfStr.slice(1).join(" "); //then we slice 'i.e: weather' or any command you want to use and join the rest to become a string
    return query;
}


client.on("message", async (msg) => {
    if (msg.author.bot)
        return;
    //an interaction with the bot
    if (msg.content === "Hello bot".toLowerCase() || msg.content === "Hi bot".toLowerCase()) {
        msg.reply("Hello there");
    }
    //another interaction with the bot
    if (msg.content === "Stupid bot".toLowerCase()) {
        msg.channel.send("Did your mum not teach you to be a kind person?");
    }
    //yet another interaction with the bot
    if (msg.content === "Handsome bot".toLowerCase()) {
        msg.react('❤️');
        msg.reply("You're damn right!");
    }

    //command to return a joke
    if (msg.content.startsWith(cmd + "joke")) {
        let getData = async () => {
            let resp = await fetch("https://official-joke-api.appspot.com/random_joke");
            let json = resp.json();
            return json;
        }
        let joke = await getData();

        //I use translator.js library
        translator(`Random joke #${joke.id}:\n ${joke.setup} - ${joke.punchline}`, { default: "en" })
            //don't work great for Vietnamese language
            //simply return like msg.reply(`Random joke #${joke.id}:\n ${joke.setup} - ${joke.punchline}`) if you don't need a translator
            .then(res => {
                msg.reply(res.text);
            })
            .catch(e => {
                console.log(e);
            });
    }


    const farenhightToC = (num) => {
        let temp = parseInt(num - 273.15);
        return temp;
    }
    const base_url = "http://api.openweathermap.org/data/2.5/weather?"
    //find weather of a city
    if (msg.content.startsWith(cmd + "weather")) {
        let temp;
        let locQuery = getQuery(msg.content);
        let getInfo = async (string) => {
            const complete_url = base_url + "appid=196c7b88689182f0112c1d4d7bcc2df5" + "&q=" + string;
            await fetch(complete_url)
                .then(resp => resp.json())
                .then(data => {
                    temp = data;
                });
            return temp;
        };
        if (locQuery == "") {
            msg.channel.send("Please input the location");
        }
        else {
            const weather_data = await getInfo(locQuery);
            if (weather_data !== undefined) {
                const temperature = farenhightToC(weather_data.main.temp);
                const embed = new Discord.MessageEmbed()
                    .setTitle('Location: ' + weather_data.name)
                    .addFields(
                        { name: 'Country:', value: weather_data.sys.country, inline: true },
                        { name: "Longitude", value: weather_data.coord.lon, inline: true },
                        { name: "Lattitude", value: weather_data.coord.lat, inline: true }
                    )
                    .addFields(
                        { name: "Main", value: weather_data.weather[0].main, inline: true },
                        { name: "Description", value: weather_data.weather[0].description, inline: true }
                    )
                    .addFields(
                        { name: "Temperature:", value: temperature + "°C", inline: true },
                        { name: "Humidity", value: weather_data.main.humidity + "%", inline: true },
                        { name: "Wind speed", value: weather_data.wind.speed + "km/h", inline: true }
                    )
                    .setThumbnail(`http://openweathermap.org/img/wn/${weather_data.weather[0].icon}@2x.png`)
                    .setTimestamp();
                msg.channel.send(embed);
            }
            else {
                msg.channel.send("There is no location like that");
            }
        }
    }

    //get memes
    if (msg.content.startsWith(cmd + "getmeme")) {
        let index = randomSubreddit(memeSubreddit.length); //get random index of the array
        let endpoint = memeSubreddit[index]; //attach it to the 'endpoint' variable
        let getMeme = async () => {
            let tmp;
            await fetch(`https://meme-api.herokuapp.com/gimme/${endpoint}`)
                .then(resp => resp.json())
                .then(body => {
                    tmp = body;
                });
            return tmp;
        }
        let meme = await getMeme();
        const messageEmbed = new Discord.MessageEmbed()
            .setTitle(meme.title)
            .setImage(meme.url)
            .setAuthor(meme.author)
            .setURL(meme.postlink)
            .setFooter(meme.ups + " upvotes")
            .setTimestamp();
        msg.reply(messageEmbed);
    }

    //covid 19 api
    if (msg.content.startsWith(cmd + "covid")) {
        let loc = getQuery(msg.content);
        if (loc === "") {
            let getData = async () => {
                let data = await fetch('https://api.covid19api.com/summary');
                let resp = data.json();
                return resp;
            };

            let covidData = await getData();
            const messageEmbed = new Discord.MessageEmbed()
                .setTitle('Thống kê Covid-19 toàn thế giới')
                .addFields(
                    { name: "New cases", value: covidData.Global.NewConfirmed, inline: true },
                    { name: "Total cases", value: covidData.Global.TotalConfirmed, inline: true }
                )
                .addFields(
                    { name: "New deaths", value: covidData.Global.NewDeaths, inline: true },
                    { name: "Total deaths", value: covidData.Global.TotalDeaths, inline: true }
                )
                .addFields(
                    { name: "New recovers", value: covidData.Global.NewRecovered, inline: true },
                    { name: "Total recovers", value: covidData.Global.TotalRecovered, inline: true },
                )
                .setFooter("Data collected via covid19api.com")
                .setTimestamp();
            await msg.channel.send(messageEmbed);
        }
        else {
            let getData = async () => {
                let data = await fetch(`https://api.covid19api.com/total/country/${loc}`);
                let resp = data.json();
                return resp;
            };
            let countryData = await getData();
            if (countryData[countryData.length - 1] !== undefined) {
                const messageEmbed = new Discord.MessageEmbed()
                    .setTitle(loc.toUpperCase())
                    .addField("Total cases", countryData[countryData.length - 1].Confirmed)
                    .addFields(
                        { name: "Active cases", value: countryData[countryData.length - 1].Active, inline: true },
                        { name: "Total recovers", value: countryData[countryData.length - 1].Recovered, inline: true },
                        { name: "Total deaths", value: countryData[countryData.length - 1].Deaths, inline: true }
                    )
                    .setFooter("Data collected via covid19api.com")
                    .setTimestamp();
                await msg.channel.send(messageEmbed);
            }
            else {
                await msg.reply("We couldn't find the country you ask for, please search again");
            }
        }
    }


    //see available commands
    if (msg.content.startsWith(cmd + "command")) {
        msg.channel.send("Available commands: !joke, !weather, !getmeme, !covid");
    }
});



client.login(process.env.TOKEN);