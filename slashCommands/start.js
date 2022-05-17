const { MessageAttachment, MessageEmbed } = require("discord.js");
const functions = require("../functions");
const gameModel = require("../models/game");
const countries = require("../countries.json")

module.exports = {
    name: "start",
    description: "Start The Game!",
    ephemeral: false,
    async run(client, interaction, args) {
        const getRandomCountry = () => countries[~~(Math.random() * countries.length)];
        const data = await gameModel.findOne({ user: interaction.user.id });
        if (data) return interaction.followUp({ content: "You have already started a game! Use /giveup to stop it." });
        const country = getRandomCountry();
        const attachment = await functions.invert(country.icon);
        await gameModel.create({ country: country, user: interaction.user.id });
        const embed = new MessageEmbed()
            .setTitle("Game Started!")
            .setDescription("Make your first guess by using /guess <country>")
            .setImage("attachment://icon.png")
            .setFooter("Good Luck!")
            .setColor("#A020F0");
        interaction.followUp({ embeds: [embed], files: [attachment] })
    }
}