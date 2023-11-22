const Discord = require("discord.js");
const fs = require("fs");
const client = new Discord.Client({
  intents: [
    Discord.GatewayIntentBits.Guilds,
    Discord.GatewayIntentBits.GuildMessages,
    Discord.GatewayIntentBits.MessageContent,
  ],
});

const prefix = "!";

client.once("ready", () => {
  console.log("Bot prêt !");
});
client.login(process.env.DISCORD_TOKEN);

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

//  ------- GitHub -------
const createHandler = require("github-webhook-handler");
const express = require("express");
const app = express();
const handler = createHandler({
  path: "/webhook",
  secret: process.env.GITHUB_SECRET,
});
// Middleware avec Express pour gérer les requêtes GitHub
app.use("/webhook", (req, res, next) => {
  handler(req, res, (err) => {
    res.statusCode = 404;
    res.end("Aucune correspondance pour cette route.");
  });
});

// Écoutez le serveur sur le port souhaité (Glitch utilise le port process.env.PORT)
app.listen(process.env.PORT || 3000, () => {
  console.log(
    `Serveur en cours d'écoute sur le port ${process.env.PORT || 3000}`
  );
});

// Gestionnaire d'événements pour les alertes GitHub
handler.on("error", (err) => {
  console.error("Erreur du gestionnaire de webhook:", err.message);
});

handler.on("push", (event) => {
  const repository = event.payload.repository.full_name;
  const branch = event.payload.ref.replace("refs/heads/", "");

  console.log(`Nouveau commit sur ${repository}:${branch}`);
  // Envoyez l'alerte sur le canal Discord approprié ici
});

client.login(process.env.DISCORD_TOKEN);
