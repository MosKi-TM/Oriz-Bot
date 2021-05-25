const { count } = require("console");

function init_player(author_id)
{
    if(!db.get("users_db").find({user: author_id}).value()) {            
        db.get("users_db").push({user: author_id, oriz: 400}).write();   
        return false;   
        }
    else {
        // Vérification que tous les champs sont la
        lst_champs = db.get("users_db").find({user: author_id}).keys().value()
        nb_champs = lst_champs.length
        if (nb_champs < 1){ db.get("users_db").find({user:  author_id}).assign({user:  author_id, oriz : 400}).write();return false;}
        }
    
    return true;
}

function add_money(user_id, amount)
{
    var user_db = db.get("users_db").find({user :user_id}).value()
    if(!init_player(user_id)){    user_db = db.get("users_db").find({user :user_id}).value() }
    db.get("users_db").find({user: user_id}).assign({user: user_id, oriz: user_db.oriz += amount}).write();
}

function has_money(user_id, amount)
{
    var user_db = db.get("users_db").find({user :user_id}).value()
    if(!init_player(user_id)){    user_db = db.get("users_db").find({user :user_id}).value() }
    
    return user_db.oriz >= amount
}

function open_message_collector(message, current_pari, currents_paris)
{ 
     
    var counter = 0
    const filter = m => {
        return m.author.id == message.author.id;
    };
    message.channel.send("Entrez le paris").then(msg => msg.delete({ timeout: 5000 }));

    const collector = message.channel.createMessageCollector(filter, { time: 120000 });

    collector.on('collect', m => {
        m.delete({ timeout: 5000 })
        if(current_pari.message == "")
        {
            current_pari.message = m.content
            m.channel.send("Entrez un nouveau choix (Mettez 0 pour finaliser le pari, maximum de 9 choix)").then(msg => msg.delete({ timeout: 5000 }));
        }
        else{
            if(m.content!="0" && current_pari.choices.length < 9)
            {
                current_pari.choices.push(m.content)
                m.channel.send("Entrez un nouveau choix (Mettez 0 pour finaliser le pari, maximum de 9 choix)").then(msg => msg.delete({ timeout: 5000 }));
            }
            else collector.stop()

        }

        console.log(`Collected ${m.content}`);
    });

    collector.on('end', collected => {
        if(current_pari.choices.length > 1 && current_pari.message != "")
        {
            currents_paris.push(current_pari)
            send_paris(current_pari, message.channel)
        }
        else{
            message.channel.send("Pari got cancelled")
        }
        console.log(`Collected ${collected.size} items`);
});
return collector
}

function open_reaction_collector(message)
{
    const filter = (reaction, user) => true;
    
    const collector = message.createReactionCollector(filter, {});
    
    collector.on('collect', (reaction, user) => {
        console.log(`Collected ${reaction.emoji.name} from ${user.tag}`);
        collector.stop()
    });
    
    collector.on('end', collected => {
        for (const [c_key, c_value] of collected) {
            for (const [u_key, u_value] of c_value.users.cache) {
                console.log(u_value);
              }
          }
        console.log(`Collected ${collected.size} items`);
    })    

    return collector
}

function jackpot_colletor(message)
{
    const filter = (reaction, user) => {
        return user.id != bot.user.id && reaction.emoji.name == "💰"
    };
    
    
    const collector = message.createReactionCollector(filter, {});
    message.react('💰') 

    collector.on('collect', (reaction, user) => {
        reaction.remove("💰")
        add_money(user.id, 20)
        console.log(`Jackpot collected: ${user.username}`)
        collector.stop()
    });
    
    collector.on('end', collected => {  
    })    

    return collector
}

function find_pari_by_id(paris, id)
{
    for(var i = 0; i < paris.length; i++)
    {
        console.log(paris[i])
        if(paris[i].pari_id == id)
            return paris[i];
    }

    return null
}

function compute_pari(pari)
{
    console.log(pari)
    for([key, value] of Object.entries(pari.temp_players))
    {
        var amount = 0
        var choice = 0
        if(value.emojis.length != 2)
            continue;


        for(var j = 0; j < 2; j++)
        {
            console.log("c'est bon 2")
            var c_index = emoji_num.indexOf(value.emojis[j])
            var m_index = mises_emote.indexOf(value.emojis[j])
            if(c_index != -1)
            {
                choice = c_index + 1
                continue;
            }

            if(m_index != -1)
            {
                if( has_money(key , mises[mises_emote[m_index]]))
                    amount = mises[mises_emote[m_index]]
                continue;
            }
        }
        if( choice != 0 && amount != 0)
        {
            pari.players.push(
                new player(value.player_id,amount, choice)
            )
        }
    }
    pari.locked = true;
    console.log(pari)
}

function decision_pari(pari, choice)
{
    for(var i = 0; i<pari.players.length; i++)
    {
        var multiplier = 1;
        if(pari.players[i].choice != choice)
            multiplier = -1;

        add_money(pari.players[i].player_id, pari.players[i].amount * multiplier)
    }
    pari.done = true;
}

function compute_pari(pari)
{
    console.log(pari)
    for([key, value] of Object.entries(pari.temp_players))
    {
        var amount = 0
        var choice = 0
        if(value.emojis.length != 2)
            continue;


        for(var j = 0; j < 2; j++)
        {
            console.log("c'est bon 2")
            var c_index = emoji_num.indexOf(value.emojis[j])
            var m_index = mises_emote.indexOf(value.emojis[j])
            if(c_index != -1)
            {
                choice = c_index + 1
                continue;
            }

            if(m_index != -1)
            {
                if( has_money(key , mises[mises_emote[m_index]]))
                    amount = mises[mises_emote[m_index]]
                continue;
            }
        }
        if( choice != 0 && amount != 0)
        {
            pari.players.push(
                new player(value.player_id,amount, choice)
            )
        }
    }
    pari.locked = true;
    console.log(pari)
}

function send_paris(pari, channel)
{    
    var choices_string = ""
    for(var i = 0; i < pari.choices.length; i++)
    {
        choices_string += emoji_num[i] + ". " + pari.choices[i] + "\n"
    }

    var embed_paris = new Discord.MessageEmbed()
    .setColor('#0099ff')
    .setTitle(`Paris ! (id : ${pari.pari_id})`)
    .addFields(
        { name: pari.message, value: choices_string }
    )
    .addFields(
        {name: "Mises", value: "💵 100\n💶 250\n💴 500\n💷1000\nveuillez selectionner uniquement un choix et une seuls mise"}
    )

    channel.send(embed_paris).then(bot_message => {
        pari.message_id = bot_message.id
        for(var i = 0; i < pari.choices.length; i++)
        {
            bot_message.react(emoji_num[i])
        }
        for([key, value] of Object.entries(mises))
        {
            bot_message.react(key)
        }
    })
}