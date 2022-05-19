require("dotenv").config()
const Discord = require("discord.js");
const client = new Discord.Client({ intents: ["GUILDS", "GUILD_MESSAGES"] });
const mongoose = require("mongoose");
const config = process.env;
mongoose.connect(config.mongo, { useNewUrlParser: true, useUnifiedTopology: true })
client.config = {
    color: "#A020F0"
};

require("./events/interactionCreate")(client)
client.slashCommands = new Discord.Collection();

require(`./handler/slashCommands`)(client);

client.on("ready", () => {
    client.user.setActivity('/start', { type: 'LISTENING' });
    console.log(`${client.user.tag} Is Ready!`);
})

client.on("messageCreate", message => {
    if(message.mentions.users.first() && message.mentions.users.first().id === client.user.id) {
        const row = new Discord.MessageActionRow().addComponents(
            new Discord.MessageButton()
            .setStyle("LINK")
            .setURL("https://discord.com/oauth2/authorize?client_id=975320653332889630&permissions=2953178134&scope=bot%20applications.commands")
            .setLabel("Invite Me!"),
        )
        const embed = new Discord.MessageEmbed()
        .setTitle(`Hi There, I'm ${client.user.tag}!`).setDescription(`🌎 | Use /start to start a new game session!`)
        .setColor(client.config.color)
        .setThumbnail(client.user.displayAvatarURL({ dynamic: true}));
    
        message.channel.send({ embeds: [embed], components: [row] })
    }
})

client.login(config.token)