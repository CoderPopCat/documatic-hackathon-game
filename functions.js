const DIG = require("discord-image-generation")
const { MessageAttachment } = require("discord.js")
module.exports.formatCountryName = str => str.normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[- '()]/g, "").toLowerCase();

module.exports.invert = async (image) => {
    const inverted = await new DIG.Invert().getImage(image);
    const attachment = new MessageAttachment(inverted, "icon.png");
    return attachment;
}