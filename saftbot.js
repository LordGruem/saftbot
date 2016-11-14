"use strict";

const Discord = require('discord.js');
const client = new Discord.Client();
const PORT = 80; 

//var http = require('http');

var admins = [];

var currentDispatcher = null;

var volume = 1.0;

var lineReader = require("readline").createInterface(
{
	input: require("fs").createReadStream("admins.txt")
});

lineReader.on("line", function (line) 
{
    admins.push(line);
});

//"SETTINGS": (TOO LAZY TO MAKE A PROPER .TXT READER):
var UseOriginalCmds = false;
var funnyMeme = true;
var EnableAdmins = true;
//if admins is false, this is if normal users can use admin CMDs
var AllowAdminCmds = true;

function isAdmin(name)
{
    if (! EnableAdmins)
    {
        return AllowAdminCmds;
    }

	return admins.indexOf(name) > -1;
}

function saveAdmins()
{
	var fs = require("fs");
	
	fs.writeFile("admins.txt", admins.join("\r\n"));
}

client.on('ready', () => 
{
	console.log('I am ready!');

	for (var key in client.voice.connections)
    {
		if (client.voice.connections[key] != null)
		{
			client.voice.connections[key].disconnect();
		}
	}
});

client.on('message', message => 
{
	if (message.content.startsWith("!") && message.member.user.username != "Saft Bot")
	{
		var splitmessage = message.content.split(" ");
	        var command = splitmessage[0].toLowerCase();
	        var args = splitmessage.slice(1, splitmessage.length).join(" ");
		
                if (command== "!ping")
		{
			message.channel.sendMessage("Pong!");
		}
		
		if (command == "!say" && splitmessage.length > 1 && isAdmin(message.member.user.username))
		{
			message.delete();
			
			message.channel.sendMessage(args);
		}
		
		if (command == "!addadmin" && splitmessage.length > 1 && isAdmin(message.member.user.username))
		{
			if (isAdmin(args))
			{
				message.channel.sendMessage("**" + args + "** is already admin!");
				return;
			}
			
			message.channel.sendMessage("**" + args + "** is now admin!");
			
			admins.push(args);
			
			saveAdmins();
		}
		
		if (command == "!removeadmin" && splitmessage.length > 1 && isAdmin(message.member.user.username))
		{
			if (!isAdmin(args))
			{
				message.channel.sendMessage("**" + args + "** is not an admin!");
				return;
			}
			
			message.channel.sendMessage("**" + args + "** is no longer admin!");
			
			var index = admins.indexOf(args);
			
			if (index > -1)
			{
				admins.splice(index, 1);
			}
			
			saveAdmins();
		}
		
		if (command == "!johncena")
		{
			if (message.member.voiceChannel == null)
			{
				message.channel.sendMessage("Error! Please join a voice channel!");
				return;
			}
			
			message.member.voiceChannel.join().then(connection => 
			{
				var dispatcher = connection.playFile("johncena.mp3");
				
				currentDispatcher = dispatcher;
				
				dispatcher.setVolume(volume);
				
				dispatcher.on("end", () => 
				{
					connection.disconnect();
					
					currentDispatcher = null;
				});
			});
			
			message.channel.sendMessage("Now playing **JOHN CENA**!");
		}
		
		if (command == "!iplaypokemongo")
		{
			if (message.member.voiceChannel == null)
			{
				message.channel.sendMessage("Error! Please join a voice channel!");
				return;
			}
			
			message.member.voiceChannel.join().then(connection => 
			{
				var dispatcher = connection.playFile("pokemongosong.mp3");
				
				currentDispatcher = dispatcher;
				
				dispatcher.setVolume(volume);
				
				dispatcher.on("end", () => 
				{
					connection.disconnect();
					
					currentDispatcher = null;
				});
			});
			
			message.channel.sendMessage("Now playing **Pokemon Go Song (FOR KIDS)**!");
		}
		
		if (command == "!youtube")
		{
			message.channel.sendMessage("!youtube is currently disabled!");
			return;
			
			if (message.member.voiceChannel == null)
			{
				message.channel.sendMessage("Error! Please join a voice channel!");
				return;
			}
			
			var link = splitmessage[1];
			
			var ytstream = require("youtube-audio-stream");
			
			message.member.voiceChannel.join().then(connection => 
			{
				var dispatcher = connection.playStream(ytstream(link));
				
				currentDispatcher = dispatcher;
				
				dispatcher.setVolume(volume);
				
				dispatcher.on("end", () => 
				{
					connection.disconnect();
					
					currentDispatcher = null;
				});
			});
			
			message.channel.sendMessage("Now playing **" + link +"**!");
		}
		
		if (command == "!kill")
		{
			message.delete();
			
			message.channel.sendMessage("**"+message.member.user.username+"** killed **"+args+"**!");
		}
		
		if (command == "!setvolume")
		{
			var value = parseFloat(splitmessage[1]);
			
			if (value == "NaN" || value < 0)
			{
				message.channel.sendMessage("That's not a valid number!");
				return;
			}
			
			volume = value;
			
			if (currentDispatcher != null)
			{
				currentDispatcher.setVolume(volume);
			}
			
			message.channel.sendMessage("Volume was set to " + value);
		}
		
		if (command == "!stop")
		{
			if (currentDispatcher != null)
			{
				currentDispatcher.end();
			}
			
			currentDispatcher = null;
			
			message.channel.sendMessage("All sounds were stopped!");
		}
		
		if (command == "!commands")
		{
			message.channel.sendMessage("Commands: \n\
			!kill [target]     - Kill somebody \n\
			!pokemongosong     - Play the Pokemon Go song \n\
			!johncena          - Play the John Cena theme \n\
			!youtube [link]    - :spindieplates: [BROKEN] \n\
			!setvolume [value] - Set volume for sounds \n\
                        !getname           - Return your name \n\
                        !isonly [noun]     - Play the meme [BROKEN] \n\
                        !square [message]  - Annoy people \n\
                        !mute [target]     - Shut someone up [BROKEN] \n\
                        !say [message]     - Print a message \n\
                        !addadmin [target] - Add someone as Admin \n\
                        !removeadmin [target]Remove an admin \n\");
		}
	
	
	    if (command == "!getname")
            {
	        message.channel.sendMessage(message.member.user.username);
	    }

	    if (command == "!isonly") 
            {
	        if (message.member.voiceChannel == null)
                {
	            message.channel.sendMessage("Only- Is only Error, y u heff to not join voicechannel");
	            return;
	        }

	        if (args == null || args == "game" || args == "gem") 
                {
	            message.member.voiceChannel.join().then(connection => 
                    {
	                var dispatcher = connection.playFile("mad(full).mp3");

	                currentDispatcher = dispatcher;

	                dispatcher.setVolume(volume);

	                dispatcher.on("end", () => {
	                    connection.disconnect();

	                    currentDispatcher = null;
	                });
	            });
	            message.channel.sendMessage("Only- Is only gem, y u heff to be mad");
	        }
	        else 
                {
	            message.channel.sendMessage("This function is still WIP, sorry");
	            message.member.voiceChannel.join().then(connection => 
                    {
	                var dispatcher = connection.playFile("mad(1).mp3");

	                currentDispatcher = dispatcher;

	                dispatcher.setVolume(volume);

	                dispatcher.on("end", () => 
                        {
	                    /* 
                                 TTS STUFF GOES HERE
                            */
	                        var dispatcher = connection.playFile("mad(2).mp3");

	                        currentDispatcher = dispatcher;

	                        dispatcher.setVolume(volume);

	                        dispatcher.on("end", () => 
                                {
	                            connection.disconnect();

	                            currentDispatcher = null;
	                        });
	                    });
	                });
	            
	            message.channel.sendMessage("only- It's only "+args+" y u heff to be mad?");

	        }
	    }

	    if (command == "!square") 
            {
	        message.delete();
	        var toSend = args;
	        var a = 1;
	        while (a < args.length)
	        {
	            toSend += "\n" + args[a];
	            a += 1;
	        }
	        message.channel.sendMessage(toSend);
	    }

        if (command == "!mute")
        {
            //code needed here
        }
	}
	
});

client.login('MjQ1OTU0Njc3MjE5MjYyNDY0.CwTmqg.09WOoLgT6IjMpP4TqsTr32Tb8fY');
