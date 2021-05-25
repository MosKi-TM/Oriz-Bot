bot.on("ready", message => {
    bot.user.setPresence({ game: { name: 'heyo', type: 0}});
    console.log("bot Ready !");
});
