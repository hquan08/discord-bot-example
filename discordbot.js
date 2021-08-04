require('dotenv').config();

const Discord = require('discord.js'); //install discord-js lib
const client = new Discord.Client();
const fetch = require('node-fetch'); //install fetch library to fetch data from api website
const translator = require('@iamtraction/google-translate'); //install translator.js lib
const weather = require('weather-js'); //install weather-js lib


const memeSubreddit = ['dankmemes', 'memes', 'Animemes']; //array contains some subreddit

const cmd = "!";


function randomSubreddit(num) {
    return Math.floor(Math.random() * num);
}

client.on("ready", () => {
    console.log('the bot is running');
});

//July 28th 2021, added function getQuery to replace the code inside weather command (or any command that relates to search a string after prefix + command
function getQuery(str) {
    const message = str.toLowerCase(); //just to make sure anything will be in lower case to ignore case sensitive
    const arrayOfStr = str.slice(cmd.length).split(" "); //cut "!", then put the rest into array - in this case, 'array' variable
    const query = arrayOfStr.slice(1).join(" "); //then we slice 'i.e: weather' or any command you want to use and join the rest to become a string
    return query;
}


client.on("message", async (msg) => {
    if (msg.author.bot)
        return; //avoid the bot looping some sentence
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

    //find weather of a city
    if (msg.content.startsWith(cmd + "weather")) {
        //July 28th 2021, replace all the code into a function and attach it to a variable, meaning clean code!
        let locQuery = await getQuery(msg.content);
        
        weather.find({ search: locQuery, degreeType: 'C' }, async (err, res) => {
            if (err) {
                msg.reply("Please input the name of location you want to find");
            }
            else {
                if (res[0] !== undefined) {
                    var loc = res[0].location;
                    var cur = res[0].current;
                    const embedMessage = new Discord.MessageEmbed()
                        .setTitle('Thời tiết tại ' + "" + locQuery)
                        .setThumbnail(cur.imageUrl)
                        .setTimestamp()
                        .addField("Địa điểm", `${loc.name}`)
                        .addFields(
                            { name: "Múi giờ", value: loc.timezone, inline: true },
                            { name: "Nhiệt độ", value: cur.temperature + " độ C", inline: true },
                            { name: "Ngày hiện tại", value: cur.date, inline: true }
                        )
                        .addFields(
                            { name: "Quang cảnh", value: cur.skytext, inline: true },
                            { name: "Độ ẩm", value: cur.humidity + "%", inline: true },
                            { name: "Tốc độ gió", value: cur.windspeed, inline: true }
                        )
                        .setFooter('Data collected via weather.service.msn.com');
                    await msg.reply(embedMessage);
                }
                else {
                    await msg.reply(`There is no location **${locQuery}**, you idiot!!`);
                }
            }
        });
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
    
    //covid 19 api by covid19api.com
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
                    { name: "Số ca mắc mới", value: covidData.Global.NewConfirmed, inline: true },
                    { name: "Tổng số ca mắc", value: covidData.Global.TotalConfirmed, inline: true }
                )
                .addFields(
                    { name: "Số ca tử vong mới", value: covidData.Global.NewDeaths, inline: true },
                    { name: "Tổng số ca tử vong", value: covidData.Global.TotalDeaths, inline: true }
                )
                .addFields(
                    { name: "Số ca hồi phục mới", value: covidData.Global.NewRecovered, inline: true },
                    { name: "Tổng số ca hồi phục", value: covidData.Global.TotalRecovered, inline: true },
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
                    .addField("Tổng số ca nhiễm", countryData[countryData.length - 1].Confirmed)
                    .addFields(
                        { name: "Số ca đang điều trị", value: countryData[countryData.length - 1].Active, inline: true },
                        { name: "Số ca phục hồi", value: countryData[countryData.length - 1].Recovered, inline: true },
                        { name: "Số ca tử vong", value: countryData[countryData.length - 1].Deaths, inline: true }
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
        msg.channel.send("Available commands: !joke, !weather, !getmeme");
    }
});



client.login(process.env.TOKEN);
