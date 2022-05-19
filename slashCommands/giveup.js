const { MessageEmbed } = require('discord.js');
const functions = require("../functions");
const gameModel = require("../models/game");

module.exports = {
    name: "giveup",
    description: "Give Up On The Game.",
    ephemeral: true,

    async run(client, interaction, args) {
        const data = await gameModel.findOne({ user: interaction.user.id });
        if (!data) return interaction.followUp({ content: "You need to start a game first! Use /start to start a game." });
        const attachment = await functions.invert(data.country.icon);
        const embed = new MessageEmbed()
            .setColor("RED")
            .setTitle("You Gave Up!")
            .addField("Your Guesses", `\`${data.guesses}\``, true)
            .addField("Country", `\`${data.country.name}\``, true)
            .setImage('attachment://icon.png');
        interaction.followUp({ embeds: [embed], files: [attachment] })
        data.delete()
    }
}