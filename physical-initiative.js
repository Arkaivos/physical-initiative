const moduleName = 'physical-initiative';

Hooks.once('init', async function() {
    console.log("Initializing Physical Initiative Module.");
    // Añadimos la configuración de IP al módulo.
    game.settings.register(moduleName,'ipConfig', {
        name: game.i18n.localize("physical-initiative.settings.ipConfig.name"),
        hint: game.i18n.localize("physical-initiative.settings.ipConfig.hint"),
        scope: "world",
        config: true,
        type: String,
        default: "127.0.0.1:5500"
    });
    game.settings.register(moduleName, 'seatPositions', {
        name: game.i18n.localize("physical-initiative.settings.seatPositions.name"),
        hint: game.i18n.localize("physical-initiative.settings.seatPositions.hint"),
        scope: 'world', // Esta configuración estará disponible a nivel mundial.
        config: true,
        type: String,
    });    
});

Hooks.on("updateCombat", async function(combat, changed, options, userId) {
    console.log(game.i18n.localize("physical-initiative.settings.seatPositions.name"))
    const currentTurn = changed.turn;
    const currentCombatant = combat.turns[currentTurn];

    const currentUser = game.user;
    if (currentUser && userId === currentUser.id) { // Solo el jugador que ejecuta el paso de turno, enviará la órden al arduino.

        if (currentCombatant) {
            const actorId = currentCombatant.actorId;
            const actor = game.actors.get(actorId);

            if (actor) { // Comprobamos si el personaje que tiene la iniciativa es PJ o PNJ.
                const player = game.users.find((u) => u.character && u.character._id === actor.id);
                if (player) { // Si es jugador, hay que enviar la orden de iluminar a la mesa.
                    const playerName = player.name;
                    const playerColor = player.color;

                    // Calculamos la posición del jugador actual en la mesa.
                    let playerIndex = -1;
                    const playerSeats = game.settings.get(moduleName, "seatPositions")
                    if (playerSeats === ""){ // Si no hay configuración, se usa el orden de los jugadores en el sistema.
                        for (const user of game.users) {
                            playerIndex++;
                            if (user.id == player.id)
                            {
                                break;
                            }
                        }
                    }
                    else { // Si hay configuración, se usa lo especificado en la configuración.
                        const values = playerSeats.split(',').map(value => value.trim());
                        playerIndex = values.indexOf(player.name)+1;
                        if(playerIndex == 0)
                        {
                            console.warn(game.i18n.format("physical-initiative.messages.playerNotFound", { playerName: playerName }));
                        }
                    }

                    console.log(`Turn ${currentTurn}: ${actor.name} - PC ${playerName} (Position: ${playerIndex} Color: ${playerColor}).`);

                    // Lanzamos la petición de iluminación al servidor.
                    turnOnLight(playerIndex, playerColor.slice(1));


                } else { // Si es no jugador, apagamos todas las luces.
                    console.log(`Turn ${currentTurn}: ${actor.name} - NPC.`);
                    turnOnLight(-1);
                }
            }
        }
    }
});

// Hack para apagar las luces al finalizar el combate.
Hooks.on('ready', () => {
    finCombate = Combat.prototype.endCombat; // Sobrescribe la función endCombat.
    Combat.prototype.endCombat = async function() {
        await finCombate.apply(this, arguments);
        // Apagamos las luces.       
        turnOnLight(-1);    
    };
});

// Función para enviar la petición al servidor de luces y modificar su estado.
async function turnOnLight(playerIndex, playerColor)
{
    const ipConfig = game.settings.get(moduleName, "ipConfig");
    const apiUrl = `http://${ipConfig}?index=${playerIndex}&color=${playerColor}`;
    console.log(apiUrl);
    try {
        const response = await fetch(apiUrl);
        if (!response.ok) {
            throw new Error(`Error during GET request: ${response.statusText}`);
        }

        const data = await response.json();
        console.log(`Response:`, data);
    } catch (error) {
        console.error('Error:', error.message);
    }
}