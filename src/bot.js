try {
    require('dotenv').config();

    const {Client, MessageEmbed, MessageAttachment} = require('discord.js');
    const client = new Client();

    const {getEmbeded} = require('./messageEmbeder.js');
    const {randomQuote} = require('./quotes.js');
    const Memer = require("random-jokes-api");
    const wiki = require('wikipedia');
    const fetch = require('node-fetch');

    const embedMessage = getEmbeded(MessageEmbed);
    const tup = new MessageAttachment('./thumbsUp.gif');

    const getTime = () => {
        let currDate = new Date();
        let hours = currDate.getHours();
        let minutes = currDate.getMinutes();
        let ap = hours >= 12 ? "PM" : "AM";
        if (hours > 12)
            hours -= 1;
        hours = hours + "";
        minutes = minutes + "";
        if (hours.length == 1)
            hours = "0" + hours;
        if (minutes.length == 1)
            minutes = "0" + minutes;
        return `${hours}:${currDate.getMinutes()} ${ap}`;
    };

    const getDate = () => {
        let currDate = new Date();
        let date = currDate.getDate();
        let month = currDate.getMonth();
        let year = currDate.getFullYear();
        let months = [
            "January", 
            "February", 
            "March", 
            "April", 
            "May", 
            "June", 
            "July", 
            "August",
            "September",
            "October", 
            "November",
            'December'
        ];
        return `${months[month]} ${date}, ${year} (${date}-${month + 1}-${year})`;
    };

    const helperMessage = [
        "$bruce tell time - Tells Time",
        "$bruce tell date - Tells Date",
        "$bruce tell quote - Tells Quote",
        "$bruce tell joke - Tells Joke",
        "$bruce show cat - Sends Cat's Picture",
        "$bruce show dog - Sends Dog's Picture",
        "$bruce show fox - Sends Fox's Picture",
        "$bruce show panda - Sends Panda's Picture",
        "$bruce show bunny - Sends Rabbit's Picture",
        "$bruce show meme - Sends Meme",
        "$bruce info context - Fetches content about 'context' from Wikipedia if available [eg: $bruce info facebook]",
        "$bruce clear cnt - Deletes 'cnt' messages (1 <= cnt <= 100) [eg: $bruce clear 42]",
        "$bruce st time message - Send 'message' after 'time' second(s) [eg: $bruce st 5 Hello Everyone]",
        "$bruce dict word - Tells the definition of 'word' [eg: $bruce dict apple]",
        "$bruce ss status_message - Sets the status of Bruce Wayne to 'status_message'",
        "$bruce spam cnt message_to_spam - Sends 'message_to_spam' 'cnt' times to the channel in which command was given [eg: $bruce spam 7 This is an spam]"
    ].join("\n");

    const messageToSend = (oChannel, text, user) => {
        oChannel.send(embedMessage(
            "Scheduled Message", 
            text, 
            "",
            "",
            user.avatarURL(),
            `This message was scheduled by ${user.username}`
        ));
    }

    client.on('ready', () => {
        console.log(`${client.user.tag} logged in`);
        // client.user.setPresence({ 
        //     activity: { name: 'as Batman' }, 
        //     status: 'online' }
        // );
        // client.user.setStatus("I'm idiot");
        client.user.setActivity('$bruce --help', {
            type: 'LISTENING'
        });
        // console.log(client.guilds.cache);
        // console.log(client.guilds.cache.guilds);
        // let guildList = client.guilds.cache;
        // try {
        //     guildList.forEach(guild => guild.channels.cache.find(channel => ["general", "chatterbox", "பொது"].includes(channel.name)).send(embedMessage(
        //         `Hello Everyone, you can now spam a text channel with ${client.user.tag} using this command`,
        //         "$bruce spam cnt message_to_spam - Sends 'message_to_spam' 'cnt' times to the channel in which command was given [eg: $bruce spam 7 This is an spam]"
        //     )));
        // } catch (err) {
        //     console.log(err);
        // }
    });

    client.on('guildCreate', guild => {
        const channel = guild.channels.cache.find(ch => ch.name === 'general');
        const gifURL = "https://media1.tenor.com/images/696126b61e6549f4929585268bf22170/tenor.gif?itemid=12150720";
        channel.send(embedMessage(
            "Thank you for adding me to the server!!\nGet Started with '$bruce --help'",
            "",
            gifURL,
            0x9b539d
        ));
    });

    client.on('guildMemberAdd', member => {
        const channel = member.guild.channels.cache.find(ch => ["general", "chatterbox", "பொது"].includes(ch.name));
        const gifURL = "https://i.pinimg.com/originals/d1/9f/43/d19f43eef8f62486f0add859b18f4852.gif";
        channel.send(embedMessage(
            "A Knight just joined the server", 
            `Welcome to the server, ${member}`, 
            gifURL,
            0x9b539d));
    });

    const showDictResult = (dictObj, channelObj) => {
        for (let def of dictObj)
            channelObj.send(embedMessage(def.meanings[0].definitions[0].definition));
    }

    client.on('message', async message => {
        // if (message.reference) {
        //     let endResult;
        //     message.channel.messages.fetch(message.reference.messageID).then(data =>
        //         message.channel.send(data.content));
        // }
        if (message.author.bot)
            return;
        let {content, channel, reference} = message;
        if (content === '$bruce')
            channel.send(embedMessage("Don't just call me. Give some command (Try $bruce --help)"));
        else if (content === '$bruce tell time')
            channel.send(embedMessage(getTime()));
        else if (content === '$bruce tell date')
            channel.send(embedMessage(getDate()));
        else if (content === '$bruce tell quote') {
            let quote = randomQuote();
            let description = `"${quote.quote}" \n- ${quote.author}`;
            channel.send(embedMessage(description, "", "", quote.color));
        }
        else if (content === '$bruce tell joke') 
            channel.send(embedMessage(Memer.joke()));
        else if (content === '$bruce show cat')
            channel.send(embedMessage("", "", Memer.cat()));
        else if (content === '$bruce show dog')
            channel.send(embedMessage("", "", Memer.dog()));
        else if (content === '$bruce show fox')
            channel.send(embedMessage("", "", Memer.fox()));
        else if (content === '$bruce show panda')
            channel.send(embedMessage("", "", Memer.redpanda()));
        else if (content === '$bruce show bunny')
            channel.send(embedMessage("", "", Memer.bunny()));
        else if (content === '$bruce show meme') {
            let meme = Memer.meme();
            channel.send(embedMessage(meme.title, "", meme.url));
        }
        else if (content.includes('$bruce info')){
            content = content.replace('$bruce info', "").substring(1);
            try {
                const page = await wiki.page(content);
                const summary = await page.summary();
                let resImg = "";
                let resTitle = "";
                let resDescription = "";
                if (summary.thumbnail) 
                    resImg = summary.thumbnail.source;
                if (summary.title)
                    resTitle = summary.title;
                if (summary.extract)
                    resDescription = summary.extract;
                channel.send(embedMessage(resTitle, resDescription, resImg));
            } catch (error) {
                channel.send(embedMessage("No Result"));
            }
        }
        else if (content.includes('$bruce clear')) {
            content = content.replace('$bruce clear', "").substring(1);
            content = content.split(' ')[0];
            if (isNaN(content))
                return;
            content = parseInt(content);
            if (content > 100) {
                channel.send("Can't delete more than 100 messages");
                return;
            }
            if (content < 1) {
                channel.send("Must delete 1 atleast message");
                return;
            }
            let temp = await message.channel.messages.fetch({limit: content}).then(messages => {
                message.channel.bulkDelete(messages);
            });
            channel.send(embedMessage(`Deleted ${content} message(s) Successfully!!`));
        }
        else if (content == "$bruce --help") {
            channel.send(embedMessage(
                `Commands for ${client.user.tag}`, 
                helperMessage, 
                "",
                "",
                "https://i.imgur.com/2SsKXwm.jpg"
            ));
        }
        else if (content.includes("$bruce st")) {
            content = content.replace('$bruce st', "").substring(1);
            let [time, ...text] = content.split(' ');
            if (isNaN(time)) {
                channel.send("Are you sure the time is in seconds ?");
                return;
            }
            time = parseInt(time);
            if (time < 1) {
                channel.send("Time must be atleast 1 second");
                return;
            }
            time = time * 1000;
            text = text.join(' ');
            if (text.length < 1) {
                channel.send("Message must be atleast 1 character long");
                return;
            }
            if (text.length > 2000) {
                channel.send("Message length can't be more than 2000 characters");
                return;
            }
            setTimeout(() => messageToSend(channel, text, message.author), time);
            message.reply("Message has been scheduled successfully");
        }
        else if (content.includes("$bruce dict")) {
            let requiredWord = content.replace("$bruce dict ", "");
            let recievedData;
            await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en_US/${requiredWord}`)
                .then(res => res.json())
                .then(data => {recievedData = data;});
            showDictResult(recievedData, channel);
        }
        else if (content.includes("$bruce ss")) {
            let requiredWord = content.replace("$bruce ss ", "");
            if (requiredWord.length < 1)
                channel.send(embedMessage("Status must be alteast 1 character long"));
            else {
                client.user.setActivity(requiredWord, {
                    type: 'LISTENING'
                });
                channel.send(embedMessage("Status has been updated successfully"));
            }
        }
        else if (content.includes("$bruce spam")) {
            let requiredWord = content.replace("$bruce spam ", "");
            let [cnt, ...username] = [...requiredWord.split(" ")];
            if (isNaN(cnt)) {
                channel.send(embedMessage("Count must be an integer"));
                return;
            }
            cnt = parseInt(cnt);
            if (cnt < 1 || cnt > 185) {
                channel.send(embedMessage("Count must be in the range [1, 185]"));
                return;
            }
            channel.send(`Spam initiated by ${message.author}`);
            for (let i = 0; i < cnt; i += 1)
                channel.send(username.join(' '));
        }
    });

    client.login(process.env.DISCORDJS_BOT_TOKEN);
} catch(error) {
    console.log(error.message);
}