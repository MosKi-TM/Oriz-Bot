bot.on('message', message => { 
    
    var args = message.content.substring(prefixe.length).split(" ")
    

    if(!init_player(message.author.id))
    {    
        users_obj = db.get("users_db").find({user :message.author.id}).value()
    }
    var users_obj = db.get("users_db").find({user :message.author.id}).value()
    
    if(Math.floor(Math.random()*100) < jackpot_luck)
    {
        jackpot_colletor(message)
    }
        
    
    if (message.content.startsWith(prefixe)){
        switch (args[0].toLowerCase()){
            case "stat":
                    const stat_embed = new Discord.MessageEmbed()
                        .setColor('#0099ff')
                        .setTitle('Stats')
                        .addFields(
                            { name: `Oriz`, value: users_obj.oriz }
                        )
                        
                    message.channel.send(stat_embed)
            break;
        }
        
        if (message.member.hasPermission("ADMINISTRATOR"))
            switch (args[0].toLowerCase()){
                
                case "decision":
                    if(args.length < 3)
                    {
                        message.channel.send("faut mettre un id de pari et la reponse")
                    }
                    else if (find_pari_by_id(currents_paris,parseInt(args[1])) != null){
                        decision_pari(find_pari_by_id(currents_paris,parseInt(args[1])), parseInt(args[2]))
                        message.channel.send("Decision has been taken")
                    }
                        
                break;

                case "lock":
                    if(args.length < 2)
                    {
                        message.channel.send("faut mettre un id de pari")
                    }
                    else if (find_pari_by_id(currents_paris,parseInt(args[1])) != null){
                        compute_pari(find_pari_by_id(currents_paris,parseInt(args[1])))
                        message.channel.send("pari has been locked")
                    }
                break;

                case "y":
                    open_reaction_collector(message)
                break;  

                case "start_paris":
                    message.delete({ timeout: 5000 })
                    var current_pari = new pari(currents_paris.length)
                    open_message_collector(message ,current_pari, currents_paris);                

                break;

            }

        
    }       
});