const Discord = require("discord.js");
const countries = require("../countries.json");

module.exports = async (client) => {
	client.on("interactionCreate", async (interaction) => {

		if (interaction.isCommand()) {
			const cmd = client.slashCommands.get(interaction.commandName);
			await interaction.deferReply({ ephemeral: cmd.ephemeral }).catch(() => { });
			interaction.send = (con, embed) => {
				embed ? interaction.followUp({ embeds: [con] }) : interaction.followUp({ content: con })
			}
			if (!cmd)
				return interaction.followUp({ content: "Slash Command Not Found" });
			const args = [];

			for (let option of interaction.options.data) {
				if (option.type === "SUB_COMMAND") {
					if (option.name) args.push(option.name);
					option.options?.forEach((x) => {
						if (x.value) args.push(x.value);
					});
				} else if (option.value) args.push(option.value);
			}
			interaction.member = interaction.guild.members.cache.get(interaction.user.id);

			cmd.run(client, interaction, args);
		} else if (interaction.isAutocomplete()) {
			const value = interaction.options.getFocused();
			const filtered = countries
				.filter(country => country.name.toLowerCase().startsWith(value.toLowerCase()))
				.slice(0, 24)
				.sort();
			const response = await interaction.respond(
				filtered.map(choice => ({ name: choice.name, value: choice.name }))
			);
		}

	});
}