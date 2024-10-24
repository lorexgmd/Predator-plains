// Hoofdvariabelen
const canvas = document.getElementById("gameCanvas"); // Verkrijg het canvas element van de HTML
const ctx = canvas.getContext("2d"); // Verkrijg de 2D context voor tekenen op het canvas

// Speler
let player = {
    x: canvas.width / 2, // Beginpositie van de speler op de X-as (midden van het canvas)
    y: canvas.height / 2, // Beginpositie van de speler op de Y-as (midden van het canvas)
    size: 50, // Begin grootte van de speler
    speed: 1, // Snelheid van de speler
    score: 0, // Begin score van de speler
    role: null, // Rol van de speler (Carnivore of Herbivore)
    color: "blue" // Kleur van de speler
};

// Lijsten voor voedsel en NPC's
let foodItems = []; // Array voor voedsel items
let npcs = []; // Array voor NPC's
let isGameOver = false;
let entities = [player, ...npcs];


// Spelinstellingen
const foodCount = 100; // Aantal voedsel dat gespawnd moet worden
const npcCount = 10; // Aantal NPC's dat gespawnd moet worden
const foodSize = 10; // Grotte van food
const npcSpeed = 1; // Snelheid van NPC's (verlaagd voor betere gameplay)
const newNpcSize = 50; // Begin score van de NPC
const newFoodSize = 10; // Grotte van nieuw food

// Initialisatie van muispositie
let mouseX = player.x; // Beginpositie van de muis op de X-as
let mouseY = player.y; // Beginpositie van de muis op de Y-as

// Function to prompt player to choose role
function chooseRole() {
    document.getElementById('roleSelection').style.display = 'none'; // Hide the role selection
    spawnFood(); // Spawn Voedsel's
    spawnNPCs(); // Spawn NPC's
    playBackgroundMusic(); // Speel achtergrondmuziek
    isGameOver = false; // Zorg ervoor dat het spel nog niet voorbij is
    gameLoop(); // Start de spellus
}
// Installeer gebeurtenishandlers voor knoppen
document.getElementById('carnivoreButton').addEventListener('click', function() {
    player.role = 'carnivore'; // Laten we de rol van Carnivoor instellen
    player.color = 'red'; // De spelerkleur voor Carnivore veranderen
    chooseRole(); // Laten we het spel starten
});

document.getElementById('herbivoreButton').addEventListener('click', function() {
    player.role = 'herbivore'; // Laten we de rol instellen als Herbivoor
    player.color = 'green'; // De spelerkleur voor Herbivore veranderen
    chooseRole(); // Laten we het spel starten
});
function showRoleSelection() {
    document.getElementById('roleSelection').style.display = 'block'; // Een blok tonen met rolselectie
}

// Functie om voedsel te spawnen
function spawnFood() {
    for (let i = 0; i < foodCount; i++) { // Voor elke voedsel item
        foodItems.push({ // Voeg een nieuw voedsel item toe aan de array
            x: Math.random() * canvas.width, // Willekeurige X-positie
            y: Math.random() * canvas.height, // Willekeurige Y-positie
            size: foodSize, // Grootte van het voedsel
            type: Math.random() > 0.5 ? 'plant' : 'meat' // Willekeurig type voedsel: plant of vlees
        });
    }
}
// Functie om voedsel opnieuw te spawnen na een vertraging
function respawnFood(x, y, delay) {
    // Stel een timeout in om voedsel te spawnen na een bepaalde vertraging
    setTimeout(function() {
        foodItems.push({
            x: Math.random() * canvas.width, // Willekeurige X-positie binnen het canvas
            y: Math.random() * canvas.height, // Willekeurige Y-positie binnen het canvas
            size: newFoodSize, // Grootte van het nieuwe voedselitem
            type: Math.random() > 0.5 ? 'plant' : 'meat' // Willekeurig type voedsel: plant (50%) of vlees (50%)
        });
    }, delay); // Wacht een opgegeven aantal milliseconden voordat het voedsel wordt gespawned
}
// Functie om NPC's te spawnen
function spawnNPCs() {
    for (let i = 0; i < npcCount; i++) { // Voor elke NPC
        const type = Math.random() > 0.5 ? 'carnivore' : 'herbivore'; // Willekeurig type
        npcs.push({ // Voeg een nieuwe NPC toe aan de array
            x: Math.random() * canvas.width, // Willekeurige X-positie
            y: Math.random() * canvas.height, // Willekeurige Y-positie
            size: player.size, // Grootte van de NPC gelijk aan de speler
            speed: npcSpeed, // Snelheid van de NPC
            score: 0, // Initialiseer de score van de NPC
            directionX: Math.random() > 0.5 ? 1 : -1, // Willekeurige richting op de X-as
            directionY: Math.random() > 0.5 ? 1 : -1, // Willekeurige richting op de Y-as
            type: type, // NPC-type
            color: type === 'carnivore' ? 'red' : 'green' // Kleur afhankelijk van type
        });
    }
}
function respawnNPC(x, y, delay) {
    setTimeout(function() {
        const type = Math.random() > 0.5 ? 'carnivore' : 'herbivore'; // Willekeurig NPC-type

        npcs.push({
            x: x !== undefined ? x : Math.random() * canvas.width,
            y: y !== undefined ? y : Math.random() * canvas.height,
            size: newNpcSize, // NPC-startgrootte
            speed: npcSpeed, // Snelheid van NPC
            directionX: Math.random() > 0.5 ? 1 : -1,
            directionY: Math.random() > 0.5 ? 1 : -1,
            type: type // Generatie van NPC-type
        });
    }, delay);
}

// Evolutiesysteem voor de speler
function checkEvolution() {
    if (player.role === 'carnivore') { // Als de speler een carnivore is
        if (player.score >= 0 && player.score < 100) {
            player.size = 50;
            player.color = 'red'; // lvl 1
        } else if (player.score >= 100 && player.score < 200) {
            player.size = 55;
            player.color = 'darkred'; // lvl 2
        } else if (player.score >= 200 && player.score < 300) {
            player.size = 60;
            player.color = 'brown'; // lvl 3
        } else if (player.score >= 300 && player.score < 400) {
            player.size = 65;
            player.color = 'sienna'; // lvl 4
        } else if (player.score >= 400 && player.score < 500) {
            player.size = 70;
            player.color = 'chocolate'; // lvl 5
        } else if (player.score >= 500 && player.score < 600) {
            player.size = 75;
            player.color = 'peru'; // lvl 6
        } else if (player.score >= 600 && player.score < 700) {
            player.size = 80;
            player.color = 'saddlebrown'; // lvl 7
        } else if (player.score >= 700 && player.score < 800) {
            player.size = 85;
            player.color = 'black'; // lvl 8
        } else if (player.score >= 800 && player.score < 900) {
            player.size = 90;
            player.color = 'maroon'; // lvl 9
        } else if (player.score >= 900 && player.score < 1000) {
            player.size = 95;
            player.color = 'firebrick'; // lvl 10
        } else if (player.score >= 1000) {
            player.size = 100;
            player.color = 'darkred'; // lvl 11
        }
    } else if (player.role === 'herbivore') { // Als de speler een herbivoor is
        if (player.score >= 0 && player.score < 100) {
            player.size = 50;
            player.color = 'green'; // lvl 1
        } else if (player.score >= 100 && player.score < 200) {
            player.size = 55;
            player.color = 'darkgreen'; // lvl 2
        } else if (player.score >= 200 && player.score < 300) {
            player.size = 60;
            player.color = 'olive'; // lvl 3
        } else if (player.score >= 300 && player.score < 400) {
            player.size = 65;
            player.color = 'forestgreen'; // lvl 4
        } else if (player.score >= 400 && player.score < 500) {
            player.size = 70;
            player.color = 'limegreen'; // lvl 5
        } else if (player.score >= 500 && player.score < 600) {
            player.size = 75;
            player.color = 'yellowgreen'; // lvl 6
        } else if (player.score >= 600 && player.score < 700) {
            player.size = 80;
            player.color = 'mediumseagreen'; // lvl 7
        } else if (player.score >= 700 && player.score < 800) {
            player.size = 85;
            player.color = 'seagreen'; // lvl 8
        } else if (player.score >= 800 && player.score < 900) {
            player.size = 90;
            player.color = 'springgreen'; // lvl 9
        } else if (player.score >= 900 && player.score < 1000) {
            player.size = 95;
            player.color = 'lightgreen'; // lvl 10
        } else if (player.score >= 1000) {
            player.size = 100;
            player.color = 'palegreen'; // lvl 11
        }
    }
}
// Evolutiesysteem voor NPC's
function checkEvolutionForNPC(npc) {
    if (npc.type === 'carnivore') { // Als de NPC een carnivore is
        if (npc.score >= 0 && npc.score < 100) {
            npc.size = 50;
            npc.color = 'red'; // lvl 1
        } else if (npc.score >= 100 && npc.score < 200) {
            npc.size = 55;
            npc.color = 'darkred'; // lvl 2
        } else if (npc.score >= 200 && npc.score < 300) {
            npc.size = 60;
            npc.color = 'brown'; // lvl 3
        } else if (npc.score >= 300 && npc.score < 400) {
            npc.size = 65;
            npc.color = 'sienna'; // lvl 4
        } else if (npc.score >= 400 && npc.score < 500) {
            npc.size = 70;
            npc.color = 'chocolate'; // lvl 5
        } else if (npc.score >= 500 && npc.score < 600) {
            npc.size = 75;
            npc.color = 'peru'; // lvl 6
        } else if (npc.score >= 600 && npc.score < 700) {
            npc.size = 80;
            npc.color = 'saddlebrown'; // lvl 7
        } else if (npc.score >= 700 && npc.score < 800) {
            npc.size = 85;
            npc.color = 'black'; // lvl 8
        } else if (npc.score >= 800 && npc.score < 900) {
            npc.size = 90;
            npc.color = 'maroon'; // lvl 9
        } else if (npc.score >= 900 && npc.score < 1000) {
            npc.size = 95;
            npc.color = 'firebrick'; // lvl 10
        } else if (npc.score >= 1000) {
            npc.size = 100;
            npc.color = 'darkred'; // lvl 11
        }
    } else if (npc.type === 'herbivore') { // Als de NPC een herbivoor is
        if (npc.score >= 0 && npc.score < 100) {
            npc.size = 50;
            npc.color = 'green'; // lvl 1
        } else if (npc.score >= 100 && npc.score < 200) {
            npc.size = 55;
            npc.color = 'darkgreen'; // lvl 2
        } else if (npc.score >= 200 && npc.score < 300) {
            npc.size = 60;
            npc.color = 'olive'; // lvl 3
        } else if (npc.score >= 300 && npc.score < 400) {
            npc.size = 65;
            npc.color = 'forestgreen'; // lvl 4
        } else if (npc.score >= 400 && npc.score < 500) {
            npc.size = 70;
            npc.color = 'limegreen'; // lvl 5
        } else if (npc.score >= 500 && npc.score < 600) {
            npc.size = 75;
            npc.color = 'yellowgreen'; // lvl 6
        } else if (npc.score >= 600 && npc.score < 700) {
            npc.size = 80;
            npc.color = 'mediumseagreen'; // lvl 7
        } else if (npc.score >= 700 && npc.score < 800) {
            npc.size = 85;
            npc.color = 'seagreen'; // lvl 8
        } else if (npc.score >= 800 && npc.score < 900) {
            npc.size = 90;
            npc.color = 'springgreen'; // lvl 9
        } else if (npc.score >= 900 && npc.score < 1000) {
            npc.size = 95;
            npc.color = 'lightgreen'; // lvl 10
        } else if (npc.score >= 1000) {
            npc.size = 100;
            npc.color = 'palegreen'; // lvl 11
        }
    }
}


// Functie om de positie van de speler bij te werken op basis van de muis
function updatePlayerPosition() {
    let dx = mouseX - player.x; // Verschil op de X-as tussen muis en speler
    let dy = mouseY - player.y; // Verschil op de Y-as tussen muis en speler
    let distance = Math.sqrt(dx * dx + dy * dy); // Bereken de afstand tussen de speler en de muis

    // Update positie van de speler als de afstand groter is dan 1
    if (distance > 1) {
        player.x += (dx / distance) * player.speed; // Update de X-positie van de speler
        player.y += (dy / distance) * player.speed; // Update de Y-positie van de speler
    }
}

// Functie om NPC's bij te werken
function updateNPCs() {
    npcs.forEach(npc => { // Voor elke NPC
        // Willekeurig de richting veranderen op intervallen
        if (Math.random() < 0.02) { // 2% kans om van richting te veranderen
            npc.directionX = Math.random() > 0.5 ? 1 : -1; // Willekeurige nieuwe richting op de X-as
            npc.directionY = Math.random() > 0.5 ? 1 : -1; // Willekeurige nieuwe richting op de Y-as
        }
        
        // Update de positie van de NPC
        npc.x += npc.directionX * npc.speed; // Update de X-positie van de NPC
        npc.y += npc.directionY * npc.speed; // Update de Y-positie van de NPC

        // Laat NPC stuiteren als ze de muren raken
        if (npc.x <= 0 || npc.x >= canvas.width) {
            npc.directionX *= -1; // Verander richting op de X-as
        }
        if (npc.y <= 0 || npc.y >= canvas.height) {
            npc.directionY *= -1; // Verander richting op de Y-as
        }
         // Het controleren van de evolutie van elke NPC
         checkEvolutionForNPC(npc);
    });
}

// Verwerk muisbeweging
canvas.addEventListener("mousemove", function(event) {
    let rect = canvas.getBoundingClientRect(); // Verkrijg de afmetingen van het canvas
    mouseX = event.clientX - rect.left; // Update muispositie op de X-as
    mouseY = event.clientY - rect.top; // Update muispositie op de Y-as
});

// Function to play the correct sound based on food type
function playEatingSound(foodType) {
    if (foodType === 'meat') {
        const meatSound = document.getElementById('eatMeat');
        meatSound.play().catch(error => {
            console.error("Error playing meat sound:", error);
        });
    } else if (foodType === 'plant') {
        const leafSound = document.getElementById('eatLeaf');
        leafSound.play().catch(error => {
            console.error("Error playing leaf sound:", error);
        });
    }
}
// Function to handle game over state
function gameOver() {
    const gameOverSound = document.getElementById('gameOver');
    gameOverSound.play().catch(error => {
        console.error("Error playing game over sound:", error);
    });
    isGameOver = true; // Het stoppen van de spellus
    alert("Game Over! Your score was: " + player.score);
restartGame();}
function checkCollisions() {
    // Botsing met voedsel
    for (let i = foodItems.length - 1; i >= 0; i--) { // Loop achteruit om te kunnen verwijderen
        let food = foodItems[i]; // Huidig voedsel item
        let dx = player.x - food.x; // Verschil op de X-as
        let dy = player.y - food.y; // Verschil op de Y-as
        let distance = Math.sqrt(dx * dx + dy * dy); // Bereken afstand tussen speler en voedsel

        // Controleer of er een botsing is
        if (distance < player.size / 2 + food.size / 2) {
            console.log('Collision detected');
            // Absorbeer het voedsel
            playEatingSound(food.type); // Play sound based on food type
    
            console.log('Player score before:', player.score);
            if (player.role === 'carnivore') {
                if (food.type === 'meat') {
                    player.score += 10;
                    console.log('Carnivore ate meat, score:', player.score);
                } else {
                    player.score = Math.max(0, player.score - 5); // Verlaagt de score, maar niet onder 0
                    console.log('Carnivore ate plant, score:', player.score);
                }
            } else if (player.role === 'herbivore') {
                if (food.type === 'plant') {
                    player.score += 10;
                    console.log('Herbivore ate plant, score:', player.score);
                } else {
                    player.score = Math.max(0, player.score - 5); // Verlaagt de score, maar niet onder 0
                    console.log('Herbivore ate meat, score:', player.score);
                }
            }

            foodItems.splice(i, 1); // Verwijder voedsel uit de array
            respawnFood(); // Herspawn van nieuw voedsel
        }
    }
// Botsing met NPC
for (let i = npcs.length - 1; i >= 0; i--) { // We doorlopen de NPC's in omgekeerde volgorde
    let npc = npcs[i]; // Huidige NPC
    let dx = player.x - npc.x; // X-verschil
    let dy = player.y - npc.y; // Y-verschil
    let distance = Math.sqrt(dx * dx + dy * dy); // Afstand tussen speler en NPC

    // Controleer of er een botsing is
    if (distance < player.size / 2 + npc.size / 2) {
        // Het spelerstype en de NPC controleren
        if (player.role === 'carnivore') {
            if (npc.type === 'carnivore') {
                // Als beide carnivoren zijn, controleer dan de score
                if (player.score > npc.score) {
                    player.score += npc.score; // De speler ontvangt NPC-punten
                    npcs.splice(i, 1); // NPC's verwijderen
                    respawnNPC(3000); // Een nieuwe NPC opnieuw oproepen
                    playEatingSound('meat'); // Het geluid van eten
                } else if (npc.score > player.score) {
                    console.log("NPC-хищник съел игрока!");
                    gameOver(); // Het spel is afgelopen als NPC meer punten heeft
                }
            } else {
                // Een roofdier kan een herbivoor NP opetenC
                player.score += npc.score; // De speler ontvangt NPC-punten
                npcs.splice(i, 1); // NPC's verwijderen
                respawnNPC(3000); // Een nieuwe NPC opnieuw oproepen
                playEatingSound('meat'); // Het geluid van eten
            }
        } else if (player.role === 'herbivore') {
            if (npc.type === 'carnivore') {
                // Als de NPC een roofdier is en de speler een herbivoor
                if (npc.score > player.score) {
                    console.log("NPC-хищник съел игрока-травоядного!");
                    gameOver(); // Einde van het spel
                } else {
                    console.log("Игрок травоядный, хищник не может его съесть, так как у игрока больше очков.");
                }
            } else {
                console.log("Травоядный не может съесть других животных.");
            }
        }
    }
}
}
// Function to play background music
function playBackgroundMusic() {
    const bgMusic = document.getElementById('backgroundMusic');
    bgMusic.play().catch(error => {
        console.error("Error playing background music:", error);
    });
}
// Functie om botsingen van NPC's met voedsel te controleren
function checkNPCCollisions() {
    npcs.forEach(npc => { // Voor elke NPC
        for (let i = foodItems.length - 1; i >= 0; i--) { // Loop door alle voedsel items (achteruit om veilig te kunnen verwijderen)
            let food = foodItems[i]; // Huidig voedsel item
            let dx = npc.x - food.x; // Verschil op de X-as tussen NPC en voedsel
            let dy = npc.y - food.y; // Verschil op de Y-as tussen NPC en voedsel
            let distance = Math.sqrt(dx * dx + dy * dy); // Bereken afstand tussen NPC en voedsel


// Controleer of er een botsing is tussen NPC en voedsel
if (distance < npc.size / 2 + food.size / 2) {
            if (npc.type === 'carnivore') {
                if (food.type === 'meat') {
                    npc.score += 10;
                    console.log('Carnivore ate meat, score:', npc.score);
                } else {
                    npc.score = Math.max(0, npc.score - 5); // Verlaagt de score, maar niet onder 0
                    console.log('Carnivore ate plant, score:', npc.score);
                }
            } else if (npc.type === 'herbivore') {
                if (food.type === 'plant') {
                    npc.score += 10;
                    console.log('Herbivore ate plant, score:', npc.score);
                } else {
                    npc.score = Math.max(0, npc.score - 5); // Verlaagt de score, maar niet onder 0
                    console.log('Herbivore ate meat, score:', npc.score);
                }
            }
    foodItems.splice(i, 1); // Verwijder het voedsel uit de array
    respawnFood(); // Respawn het voedsel na een korte vertraging
            }
        }
    });
// Botsingen tussen NPC's controleren
for (let i = 0; i < npcs.length; i++) {
    for (let j = i + 1; j < npcs.length; j++) {
        let npcA = npcs[i];
        let npcB = npcs[j];
        let dx = npcA.x - npcB.x;
        let dy = npcA.y - npcB.y;
        let distance = Math.sqrt(dx * dx + dy * dy);

        // Controleren op botsingen tussen NPC's
        if (distance < npcA.size / 2 + npcB.size / 2) {
            // Interactie logica
            if (npcA.type === 'carnivore' && npcB.type === 'herbivore') {
                npcA.score += npcB.score; // Het roofdier "eet" de herbivoor en krijgt zijn punten
                npcs.splice(j, 1); // Een herbivoor uit de array verwijderen
                console.log(`Carnivore ate herbivore. New score: ${npcA.score}`);
                respawnNPC(3000); // Herbivoor respawnt na 3 seconden
            } else if (npcB.type === 'carnivore' && npcA.type === 'herbivore') {
                npcB.score += npcA.score; // Het roofdier "eet" de herbivoor en krijgt zijn punten
                npcs.splice(i, 1); // Een herbivoor uit de array verwijderen
                console.log(`Carnivore ate herbivore. New score: ${npcB.score}`);
                respawnNPC(3000); // Herbivoor respawnt na 3 seconden
            } else if (npcA.type === 'carnivore' && npcB.type === 'carnivore') {
                // Logica voor roofdieren om elkaar op te eten
                if (npcA.size > npcB.size) {
                    npcA.score += npcB.score; // Het grotere roofdier "eet" de kleinere en krijgt zijn punten
                    npcs.splice(j, 1); // Een kleiner roofdier uit de array verwijderen
                    console.log(`Carnivore A ate Carnivore B. New score: ${npcA.score}`);
                    respawnNPC(3000); // Respawn van een kleiner roofdier na 3 seconden
                } else if (npcB.size > npcA.size) {
                    npcB.score += npcA.score; // Het grotere roofdier "eet" de kleinere en krijgt zijn punten
                    npcs.splice(i, 1); // Een kleiner roofdier uit de array verwijderen
                    console.log(`Carnivore B ate Carnivore A. New score: ${npcB.score}`);
                    respawnNPC(3000); // Respawn van een kleiner roofdier na 3 seconden
                } else {
                    console.log("No interaction; both carnivores are equal in size.");
                }
            } else {
                console.log("No interaction; both are herbivores or equal size.");
            }
        }
    }
}
}
function updateLeaderboard() {
    // Create an array of entities to include player and NPCs
    let entities = [player, ...npcs]; 

    // Sort entities based on their scores
    entities.sort((a, b) => b.score - a.score);

    // Prepare leaderboard data
    leaderboard = entities.slice(0, 5).map(entity => {
        return {
            name: entity === player ? 'Player' : `NPC ${npcs.indexOf(entity) + 1}`,
            score: entity.score
        };
    });
}

// Functie om voedsel automatisch opnieuw te spawnen als het aantal onder een bepaalde limiet komt
function spawnFoodAgain(intervalTime) {
    setInterval(function() {
        if (foodItems.length < foodCount) { // Controleer of er minder voedsel is dan de ingestelde limiet
            respawnFood(); // Respawn nieuw voedsel
        }
    }, intervalTime); // Interval tijd in milliseconden tussen elke controle
}
// Hoofdcodes voor de spelcyclus
function gameLoop() {
    if (!isGameOver) {
    ctx.clearRect(0, 0, canvas.width, canvas.height); // Wis het canvas

    // Update posities van speler en NPC's
    updatePlayerPosition(); // Update de positie van de speler
    updateNPCs(); // Update de posities van de NPC's
    // Teken de speler
    ctx.fillStyle = player.color; // Kleur van de speler
    ctx.beginPath();
    ctx.arc(player.x, player.y, player.size / 2, 0, Math.PI * 2); // Teken de speler
    ctx.fill(); // Vul de speler
    ctx.closePath(); // Sluit het pad
    // Teken voedsel
    foodItems.forEach(food => { // Voor elk voedsel item
        ctx.fillStyle = (food.type === 'plant') ? 'green' : 'red'; // Kleur van voedsel op basis van type
        ctx.beginPath();
        ctx.arc(food.x, food.y, food.size / 2, 0, Math.PI * 2); // Teken het voedsel
        ctx.fill(); // Vul het voedsel
        ctx.closePath(); // Sluit het pad
    });

    // Teken NPC's
    npcs.forEach(npc => { // Voor elke NPC
        ctx.fillStyle = npc.color; // Kleur van NPC's
        ctx.beginPath();
        ctx.arc(npc.x, npc.y, npc.size / 2, 0, Math.PI * 2); // Teken de NPC
        ctx.fill(); // Vul de NPC
        ctx.closePath(); // Sluit het pad
    });
// Spelerscoreweergave
ctx.fillStyle = 'black'; // Tekstkleur
ctx.font = '32px Arial'; // Tekst lettertype
ctx.textAlign = 'left'; // Links uitlijnen
ctx.fillText(`Score: ${player.score}`, 10, 30); // Geef de score weer in de linkerbovenhoek

updateLeaderboard(); // Het klassement bijwerken

// Het klassement tekenen
ctx.fillStyle = 'black';
ctx.font = '20px Arial';
ctx.textAlign = 'right'; // Rechts uitlijnen voor de rechterbovenhoek
ctx.fillText("Leaderboard:", canvas.width - 10, 30); // Rubriek
leaderboard.forEach((entry, index) => {
    ctx.fillText(`${entry.name}: ${entry.score}`, canvas.width - 10, 50 + index * 20); // Geef elk item weer
});
    // Controleer op botsingen
    checkCollisions(); // Controleer botsingen met voedsel en NPC's
    checkNPCCollisions(); // Controleer botsingen tussem Npc's en voedsel
    checkEvolution(); 
    requestAnimationFrame(gameLoop); // Vraag de volgende frame aan
}}
// Functie om NPC te initialiseren
function initNPCs() {
    npcs = []; // De NPC-array wissen
    spawnNPCs(); // Roep de NPC-spawn-functie op
}

// Functie om voedsel te initialiseren
function initFood() {
    foodItems = []; // Het opruimen van de voedselreeks
    spawnFood(); // De voedselspawn-functie oproepen
}
function restartGame() {
    player.speed = 1;
    player.score = 0; // De score van een speler resetten
    player.x = canvas.width / 2; // Het resetten van de positie van een speler
    player.y = canvas.height / 2; // Het resetten van de positie van een speler
    player.size = 50; // Spelergrootte opnieuw instellen
    player.role = ''; // Een spelersrol resetten
    npcs = []; // NPC-array wissen
    foodItems = []; // Voedsel array wissen
    isGameOver = false; // Spelstatus resetten
    ctx.clearRect(0, 0, canvas.width, canvas.height); // Wis het canvas
    showRoleSelection(); // Een rol kiezen voordat je het spel start
}
// Functie om het spel te starten
    function startGame() {
        showRoleSelection(); // ChooseRole
    }

// Start het spel
startGame();