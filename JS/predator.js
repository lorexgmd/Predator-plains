// Hoofdvariabelen
const canvas = document.getElementById("gameCanvas"); // Verkrijg het canvas element van de HTML
const ctx = canvas.getContext("2d"); // Verkrijg de 2D context voor tekenen op het canvas
const backgroundMusic = new Audio("GitHub/Predator-plains/mp3/Background-music.mp3"); // De pad naar de achtergrondmuziek.
const eatSound = new Audio('GitHub/Predator-plains/mp3/eat-sound.mp3'); // De pad naar het geluid van het eten.
const gameOverSound = new Audio('GitHub/Predator-plains/mp3/game-over.mp3'); // De pad naar het geluid van het einde van het spel.

// Speler
let player = {
    x: canvas.width / 2, // Beginpositie van de speler op de X-as (midden van het canvas)
    y: canvas.height / 2, // Beginpositie van de speler op de Y-as (midden van het canvas)
    size: 30, // Begin grootte van de speler
    speed: 1, // Snelheid van de speler
    score: 0, // Begin score van de speler
    role: null, // Rol van de speler (Carnivore of Herbivore)
    color: "blue" // Kleur van de speler
};

// Lijsten voor voedsel en NPC's
let foodItems = []; // Array voor voedsel items
let npcs = []; // Array voor NPC's

// Spelinstellingen
const foodCount = 100; // Aantal voedsel dat gespawnd moet worden
const npcCount = 10; // Aantal NPC's dat gespawnd moet worden
const foodSize = 10; // Grotte van food
const npcSpeed = 1; // Snelheid van NPC's (verlaagd voor betere gameplay)
const newNpcSize = 30; // Begin score van de NPC
const newFoodSize = 10; // Grotte van nieuw food

// Initialisatie van muispositie
let mouseX = player.x; // Beginpositie van de muis op de X-as
let mouseY = player.y; // Beginpositie van de muis op de Y-as
// Functie voor het afspelen van achtergrondmuziek.
function playBackgroundMusic() {
    backgroundMusic.loop = true; // Het herhalen van de muziek.
    backgroundMusic.play().catch(error => {
        console.error("Fout bij het afspelen van muziek:", error);; // Het afspelen van muziek.
});
}
// Function to prompt player to choose role
function chooseRole() {
    const role = prompt("Choose your role: Carnivore or Herbivore");
    if (role.toLowerCase() === "carnivore" || role.toLowerCase() === "herbivore") {
        player.role = role;
    } else {
        chooseRole(); // Retry if invalid input
    }
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
        npcs.push({ // Voeg een nieuwe NPC toe aan de array
            x: Math.random() * canvas.width, // Willekeurige X-positie
            y: Math.random() * canvas.height, // Willekeurige Y-positie
            size: player.size, // Grootte van de NPC gelijk aan de speler
            speed: npcSpeed, // Snelheid van de NPC
            directionX: Math.random() > 0.5 ? 1 : -1, // Willekeurige richting op de X-as
            directionY: Math.random() > 0.5 ? 1 : -1, // Willekeurige richting op de Y-as
            type: Math.random() > 0.5 ? 'carnivore' : 'herbivore' // Willekeurig type
        });
    }
}
function respawnNPC(x, y, delay) { // Functie om NPC's te respawnen als ze dood zijn
    setTimeout(function() {
        npcs.push({
            x:Math.random() * canvas.width,
            y:Math.random() * canvas.height,
            size: newNpcSize, // De initiële massa is dezelfde als die van de speler aan het begin
            speed: npcSpeed, // NPC-snelheid
            directionX: Math.random() > 0.5 ? 1 : -1, // Willekeurige X-richting
            directionY: Math.random() > 0.5 ? 1 : -1,  // Willekeurige Y-richting
            type: Math.random() > 0.5 ? 'carnivore' : 'herbivore' // Willekeurig type
        });
    }, delay); // Respawn na een bepaald aantal milliseconden
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
    });
}

// Verwerk muisbeweging
canvas.addEventListener("mousemove", function(event) {
    let rect = canvas.getBoundingClientRect(); // Verkrijg de afmetingen van het canvas
    mouseX = event.clientX - rect.left; // Update muispositie op de X-as
    mouseY = event.clientY - rect.top; // Update muispositie op de Y-as
});

function checkCollisions() {
    // Loop achteruit om veilig te kunnen verwijderen
    for (let i = foodItems.length - 1; i >= 0; i--) {
        let food = foodItems[i]; // Huidig voedsel item
        let dx = player.x - food.x; // Verschil op de X-as tussen speler en voedsel
        let dy = player.y - food.y; // Verschil op de Y-as tussen speler en voedsel
        let distance = Math.sqrt(dx * dx + dy * dy); // Bereken afstand tussen speler en voedsel

        // Controleer of er een botsing is
        if (distance < player.size / 2 + food.size / 2) {
            // Als de speler een herbivoor is en het voedsel vlees is
            if (player.role === 'herbivore' && food.type === 'meat') {
                player.score -= 1; // Trawiajder verliest 1 punt voor het eten van vlees
            } 
            // Controleer of de speler een carnivoor is
            else if (player.role === 'carnivore') {
                // Als het voedsel een plant is
                if (food.type === 'plant') {
                    player.score -= 1; // Carnivoor verliest 1 punt voor het eten van een plant
                } 
                // Als het voedsel vlees is
                else if (food.type === 'meat') {
                    player.score += 1; // Carnivoor krijgt 1 punt voor het eten van vlees
                }
            } 
            // Anders, als de speler geen carnivoor of herbivoor is
            else {
                // Verhoog de score op basis van het voedseltype
                player.score += (food.type === 'plant') ? 20 : 20; // 10 punten voor planten, 20 voor vlees
                player.size += 1; // Vergroot de speler met 1
                eatSound.currentTime = 0; // De afspeeltijd resetten.
                eatSound.play(); // Het afspelen van het geluid van het eten.
            }
            foodItems.splice(i, 1); // Verwijder het gegeten voedsel uit de array
            respawnFood(); // Roep de functie aan om nieuw voedsel te laten verschijnen
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
            if (player.size > npc.size) { // Als de speler meer is
                player.score += 50; // Punten verhogen
                player.size += 5; // Het vergroten van de spelersgrootte
                let npcX = npc.x; // Bewaar de coördinaten van de opgegeten NPC
                let npcY = npc.y;

                npcs.splice(i, 1); // NPC's verwijderen

                // Respawnt een nieuwe NPC na 3 seconden op de plaats van degene die is opgegeten
                respawnNPC (3000);
            } else { // Als de speler kleiner is
                gameOverSound.play();
                alert("Game Over"); // Einde van het spel
                document.location.reload(); // Het spel opnieuw starten
            }
        }
    }
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
    // Controleer of het voedseltype geschikt is voor de NPC (bijvoorbeeld planten voor herbivoren)
    npc.score += (food.type === 'plant') ? 20 : 20; // Verhoog de score van de NPC afhankelijk van het voedseltype
    npc.size += 1; // Vergroot de NPC een beetje
    foodItems.splice(i, 1); // Verwijder het voedsel uit de array
    respawnFood(); // Respawn het voedsel na een korte vertraging
            }
        }
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
        ctx.fillStyle = 'orange'; // Kleur van NPC's
        ctx.beginPath();
        ctx.arc(npc.x, npc.y, npc.size / 2, 0, Math.PI * 2); // Teken de NPC
        ctx.fill(); // Vul de NPC
        ctx.closePath(); // Sluit het pad
    });

    // Controleer op botsingen
    checkCollisions(); // Controleer botsingen met voedsel en NPC's
    checkNPCCollisions(); // Controleer botsingen tussem Npc's en voedsel
    requestAnimationFrame(gameLoop); // Vraag de volgende frame aan
}
// Functie om het spel te starten
function startGame() {
    playBackgroundMusic(); // Background music
    chooseRole(); // ChooseRole
    spawnFood(); // Spawn voedsel items
    spawnNPCs(); // Spawn NPC's;
    gameLoop(); // Start de spelcyclus
}
// Start het spel
startGame();
//test