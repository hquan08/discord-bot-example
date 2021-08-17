# discord-bot-example
A simple discord bot using Javascript &amp; some JS libraries to display data.
To program the discord bot, you will first need to install the Discord bot library: https://discord.js.org/ <br/>
I use some api websites, which are random joke to get a joke and meme-api to get a random meme post from subreddits.

Random Joke api: https://official-joke-api.appspot.com/random_joke

Reddit meme post api: https://meme-api.herokuapp.com/gimme/<!---[put_your_subreddit_name_here_to_get_a_post]---> (i.e endpoint should be /gimme/memes)

Note:
The Random joke api is created by 15Dkatz (checkout his github: https://github.com/15Dkatz) <br/>
The reddit meme api is created by D3vd (check out his github: https://github.com/D3vd)

Some libraries used: 
1. Translator.js (https://github.com/muaz-khan/Translator)<br/>
I use to translate the joke to Vietnamese but it doesn't feel good when translate the English joke to Vietnamese.

2. Weather.js (https://github.com/devfacet/weather)<br/>
I use it to display the weather data when type in the location you want to find after the prefix command.

Also, you will need to login to discord developer to be able to create a new project, which will have an option to create a new bot for your own work plus a bot token
to make it work in the code.<br/>
#How to run the bot 
Install a library called nodemo and in package.json, add a new line under the "scripts" called "devStart":"nodemon".In the terminal command, type npm run devStart to run the bot. It will automatically restart and compile and run the bot whenever you make a change in your code. <br/><br/>
I am learning JS so it won't be perfect as it seems but I will try to improve myself!<br/>
It's my first time using Github so feel free to help me with this and feel free to comment/edit on my file :)! thanks
