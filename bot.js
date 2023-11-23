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
const channelId = "1177235905761779862";

client.once("ready", () => {
  console.log("Bot prêt !");
  // Définir l'intervalle pour envoyer le message toutes les 4 minutes
  setInterval(() => {
    const channel = client.channels.cache.get(channelId);

    if (channel) {
      channel.send("Ceci est un message automatique toutes les 4 minutes.");
    } else {
      console.error("Le salon n'a pas été trouvé. Vérifiez l'ID du salon.");
    }
  }, 4 * 60 * 1000); // 4 minutes en millisecondes
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
const crypto = require("crypto"); // Ajout de la bibliothèque crypto
const app = express();

const handler = createHandler({
  path: "/webhook",
  secret: process.env.GITHUB_SECRET,
});

app.use(express.json());

app.post("/webhook", (req, res, next) => {
  const signature = req.headers["x-hub-signature"];
  const githubSecret = process.env.GITHUB_SECRET;
  console.log("Signature reçue :", signature);

  handler(req, res, (err) => {
    if (err) {
      // Si une erreur se produit, passez-la au gestionnaire d'erreurs Express
      return next(err);
    }
    // Si tout va bien, laisser le flux de la requête se poursuivre
    next();
  });
});

// Gestionnaire d'erreurs Express
app.use((err, req, res, next) => {
  console.error("Erreur du gestionnaire de webhook:", err.message);
  res
    .status(500)
    .send("Une erreur est survenue lors du traitement du webhook.");
});

handler.on("push", (event) => {
  console.log("Nouveau commit:", event.payload.commits[0].message);
});

const port = process.env.PORT || 8080;
app.listen(port, () => {
  console.log(`Serveur en cours d'écoute sur le port ${port}`);
});

client.login(process.env.DISCORD_TOKEN);
