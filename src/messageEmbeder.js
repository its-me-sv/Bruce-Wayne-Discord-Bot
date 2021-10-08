const getEmbeded = MessageEmbed => (title="", description="", imgSrc="", color="", thumbnail="", footer = "") => {
    let colors = [
        0x16a085,
        0x27ae60,
        0x2c3e50,
        0xf39c12,
        0xe74c3c,
        0x9b59b6,
        0xFB6964,
        0x342224,
        0x472E32,
        0xBDBB99,
        0x77B1A9,
        0x73A857
    ];
    if (color.length === 0)
        color = colors[Math.floor(Math.random()*colors.length)];
    if (description.length > 2048)
        description = description.substring(0, 2045) + "...";
    const messageToSend = new MessageEmbed()
        .setTitle(title)
        .setDescription(description)
        .setFooter(footer)
        .setImage(imgSrc)
        .setThumbnail(thumbnail)
        .setColor(color);
    return messageToSend;
};

module.exports = {getEmbeded};