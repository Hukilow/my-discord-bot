//  ------- GitHub -------
// Utilisez le gestionnaire de webhook avec Express
app.use("/webhook", (req, res) => {
  handler(req, res, () => {
    res.statusCode = 404;
    res.end("Aucune correspondance pour cette route.");
  });
});

// Écoutez le serveur sur le port souhaité
app.listen(3000, () => {
  console.log("Serveur en cours d'écoute sur le port 3000");
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
