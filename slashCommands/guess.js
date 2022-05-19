const { MessageAttachment, MessageEmbed } = require("discord.js");
const geolib = require("geolib");
const historyModel = require("../models/history");
const functions = require("../functions")
const gameModel = require("../models/game");
const countries = require("../countries.json")

module.exports = {
    name: "guess",
    description: "Guess a country!",
    options: [
        {
            name: "country",
            type: "STRING",
            required: true,
            description: "Country to guess",
            autocomplete: true
        }
    ],
    async run(client, interaction, args) {
        const data = await gameModel.findOne({ user: interaction.user.id });
        if (!data) return interaction.followUp({ content: "You haven't started a game! Use /start to start a new game", ephemeral: true });
        const guess = interaction.options.getString("country");
        const attachment = await functions.invert(data.country.icon);
        const [formattedGuess, formattedCountryName] = [functions.formatCountryName(guess), functions.formatCountryName(data.country.name)];
        if (formattedGuess === formattedCountryName) {
            const embed = new MessageEmbed()
                .setTitle("Game Started!")
                .setDescription(`🎉 **You guessed the correct country!**`)
                .addField("Guesses", `\`${data.guesses + 1}\``, true)
                .setImage("attachment://icon.png")
                .setFooter("Congratulations!")
                .setColor("GREEN");
            interaction.followUp({ embeds: [embed], files: [attachment] });
            await data.delete();
            const history = await historyModel.findOne({ user: interaction.user.id });
            if (!history) {
                historyModel.create({ user: interaction.user.id, sessions: [{ country: data.country, time: Date.now(), attempts: 0 }] })
            } else {
                history.sessions.push({
                    country: data.country,
                    time: Date.now(),
                    attempts: data.guesses + 1
                })
                history.save();
            }
        } else {
            const guessedCountryData = countries.find(country => functions.formatCountryName(country.name) === formattedGuess);
            if (!guessedCountryData) return interaction.followUp({ content: "Invalid Country Name" });
            const embed = new MessageEmbed()
                .setColor("RED")
                .setTitle("Wrong!")
                .addField("Your Guess", `\`${guess}\``, true)
                .addField("Distance From Target", `\`${geolib.getDistance(
                    { latitude: data.country.latitude, longitude: data.country.longitude },
                    { latitude: guessedCountryData.latitude, longitude: guessedCountryData.longitude }
                ) / 1000} KM\``, true)
                .setImage("attachment://icon.png");
            interaction.followUp({ embeds: [embed], files: [attachment]})
            data.guesses++;
            data.save();
        }
    }
}