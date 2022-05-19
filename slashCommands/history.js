const { MessageEmbed, MessageActionRow, MessageButton } = require('discord.js');
const functions = require("../functions");
const historyModel = require('../models/history');

module.exports = {
    name: "history",
    description: "View A User's Past Sessions",
    ephemeral: true,
    options: [
        {
            name: "user",
            type: "USER",
            description: "View this user's past sessions",
            required: true
        }
    ],

    async run(client, interaction, args) {
        const user = interaction.options.getUser("user");
        const data = await historyModel.findOne({ user: user.id });
        if (!data) return interaction.followUp({ content: `**${user.tag}** has no past sessions!${user.id === interaction.user.id ? ` Use /start to start a game.` : ''}` });
        let index = 0;
        const next = new MessageButton()
            .setStyle("SUCCESS")
            .setLabel("Next")
            .setCustomId("next");
        const previous = new MessageButton()
            .setStyle("DANGER")
            .setLabel("Previous")
            .setCustomId("previous")
        const row = new MessageActionRow().addComponents(previous, next);
        const createEmbed = (index) => {
            const item = data.sessions[index];
            const embed = new MessageEmbed()
                .setTitle(`${user.tag}'s Sessions | **Item ${index + 1}/${data.sessions.length}**`)
                .setImage(item.country.icon)
                .addField("Date", `<t:${Math.floor(item.time / 1000)}:f>`, true)
                .addField("Country", `\`${item.country.name}\``, true)
                .addField("Attempts", `\`${item.attempts}\``, true)
                .setColor("#A020F0");
            return embed;
        }
        interaction.followUp({ embeds: [createEmbed(index)], components: [row] });
        const filter = i => i.customId === "next" || i.customId === "previous" && i.user.id === interaction.member.user.id;
        const collector = interaction.channel.createMessageComponentCollector({ filter, time: 50000 });
        collector.on('collect', async i => {
            if (i.customId === "next") {
                index++;
                if (index === data.sessions.length) return i.update({ content: "You've Reached The End!", embeds: [], components: [] });
                await i.update({ embeds: [createEmbed(index)], components: [row] });
            } else if (i.customId === "previous") {
                if (index === 0) return i.update({ embeds: [createEmbed(index)], components: [row], content: "You cannot go further back." })
                index--;
                await i.update({ content: "_ _", embeds: [createEmbed(index)], components: [row] })
            }
        });
    }
}