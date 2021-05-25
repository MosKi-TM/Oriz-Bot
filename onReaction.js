bot.on('messageReactionAdd', (reaction, user) => {
    for(var i = 0; i < currents_paris.length; i++)
    {
        if(reaction.message.id == currents_paris[i].message_id && !currents_paris[i].locked)
        {
            if(!(user.id.toString() in currents_paris[i].temp_players))
            {
                currents_paris[i].temp_players[user.id.toString()] = new temp_player(user.id)   
            }

            currents_paris[i].temp_players[user.id.toString()].emojis.push(reaction.emoji.name)
            console.log(currents_paris[i].temp_players[user.id.toString()].emojis)
        }
    }
});

bot.on('messageReactionRemove', (reaction, user) => {
    for(var i = 0; i < currents_paris.length; i++)
    {
        if(reaction.message.id == currents_paris[i].message_id && !currents_paris[i].locked)
        {
            var index = currents_paris[i].temp_players[user.id.toString()].emojis.indexOf(reaction.emoji.name);
            if (index > -1) {
                currents_paris[i].temp_players[user.id.toString()].emojis.splice(index, 1);
            }

            console.log(currents_paris[i].temp_players[user.id.toString()].emojis)
        }
    }
    
}); 
