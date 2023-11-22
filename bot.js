const Discord = require("discord.js");
const createHandler = require("github-webhook-handler");
const fs = require("fs");
const client = new Discord.Client({
  intents: [
    Discord.GatewayIntentBits.Guilds,
    Discord.GatewayIntentBits.GuildMessages,
    Discord.GatewayIntentBits.MessageContent,
  ],
});

const handler = createHandler({ path: "/webhook", secret: "Heylokiama" });

const prefix = "!";

client.once("ready", () => {
  console.log("Bot prêt !");
});

client.login(
  "MTE3NjU5Mzk0NzQ4NTgwNjczNg.GQmFUx.DHr8jEy0mt5I0zEqnaEBveOhUNf9s15GfLVddE"
);

// Charger les commandes
client.commands = new Map();
const commandFiles = fs
  .readdirSync("./commands")
  .filter((file) => file.endsWith(".js"));

for (const file of commandFiles) {
  const command = require(`./commands/${file}`);
  client.commands.set(command.name, command);
}

client.on("messageCreate", (message) => {
  console.log(message);
  // Ne traitez pas les messages du bot lui-même
  if (message.author.bot) return;

  // Vérifiez si le message commence par le préfixe
  if (message.content.startsWith(prefix)) {
    const args = message.content.slice(prefix.length).split(/ +/);
    const commandName = args.shift().toLowerCase();

    // Obtenez la commande correspondante
    const command =
      client.commands.get(commandName) ||
      client.commands.find(
        (cmd) => cmd.aliases && cmd.aliases.includes(commandName)
      );

    if (!command) return;

    try {
      // Exécutez la commande
      command.execute(message, args);
    } catch (error) {
      console.error(error);
      message.reply(
        "Une erreur est survenue lors de l'exécution de la commande."
      );
    }
  }
});

client.login(
  "MTE3NjU5Mzk0NzQ4NTgwNjczNg.GQmFUx.DHr8jEy0mt5I0zEqnaEBveOhUNf9s15GfLVddE"
);
