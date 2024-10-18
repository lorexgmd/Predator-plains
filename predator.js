// Hoofdvariabelen
const canvas = document.getElementById("gameCanvas"); // Verkrijg het canvas element van de HTML
const ctx = canvas.getContext("2d"); // Verkrijg de 2D context voor tekenen op het canvas

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
const foodSize = 10; // Grootte van voedsel
const npcSpeed = 1; // Snelheid van NPC's (verlaagd voor betere gameplay)
const newNpcSize = 30;
const newFoodSize = 10;

// Initialisatie van muispositie
let mouseX = player.x; // Beginpositie van de muis op de X-as
let mouseY = player.y; // Beginpositie van de muis op de Y-as
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
function respawnFood(x, y, delay) {
    setTimeout(function() {
        foodItems.push({
            x: Math.random() * canvas.width, 
            y: Math.random() * canvas.height, 
            size: newFoodSize, // 
            type: Math.random() > 0.5 ? 'plant' : 'meat' // Willekeurig type voedsel: plant of vlees
        });
    }, delay); // Respawn na een bepaald aantal milliseconden
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
            directionY: Math.random() > 0.5 ? 1 : -1 // Willekeurige richting op de Y-as
        });
    }
}
function respawnNPC(x, y, delay) {
    setTimeout(function() {
        npcs.push({
            size: newNpcSize, // De initiële massa is dezelfde als die van de speler aan het begin
            speed: npcSpeed, // NPC-snelheid
            directionX: Math.random() > 0.5 ? 1 : -1, // Willekeurige X-richting
            directionY: Math.random() > 0.5 ? 1 : -1  // Willekeurige Y-richting
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

// Functie voor het controleren van botsingen tussen speler en NPC's
function checkCollisions() {
    // Botsing met voedsel
    for (let i = foodItems.length - 1; i >= 0; i--) { // Loop achteruit om te kunnen verwijderen
        let food = foodItems[i]; // Huidig voedsel item
        let dx = player.x - food.x; // Verschil op de X-as
        let dy = player.y - food.y; // Verschil op de Y-as
        let distance = Math.sqrt(dx * dx + dy * dy); // Bereken afstand tussen speler en voedsel

        // Controleer of er een botsing is
        if (distance < player.size / 2 + food.size / 2) {
            // Absorbeer het voedsel
            player.score += (food.type === 'plant') ? 10 : 20; // Verhoog score op basis van voedseltype
            player.size += 1; // Vergroot de speler een beetje
            foodItems.splice(i, 1); // Verwijder voedsel uit de array
            //
            respawnFood();
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
                respawnNPC (Math.random() * canvas.width, Math.random() * canvas.height, 3000);
            } else { // Als de speler kleiner is
                alert("Game Over"); // Einde van het spel
                document.location.reload(); // Het spel opnieuw starten
            }
        }
    }
}
function checkNPCCollisions() {
    npcs.forEach(npc => {
        for (let i = foodItems.length - 1; i >= 0; i--) {
            let food = foodItems[i];
            let dx = npc.x - food.x;
            let dy = npc.y - food.y;
            let distance = Math.sqrt(dx * dx + dy * dy);

            // Controleer of er een botsing is
            if (distance < npc.size / 2 + food.size / 2) {
                // Controleer of het soort voedsel geschikt is voor de NPC {
                    npc.score += (food.type === 'plant') ? 10 : 20;
                    npc.size += 1; // Vergroot de npc een beetje
                    foodItems.splice(i, 1); // Verwijder voedsel uit de array
                respawnFood();
                }
            }
        }
    )};
    function spawnFoodAgain(intervalTime){
            setInterval(function() {
                if (foodItems.length < foodCount) { // Controleer of het voedsel minder is dan een bepaalde hoeveelheid
                    respawnFood();
                }
            }, intervalTime);
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
    chooseRole(); // ChooseRole
    spawnFood(); // Spawn voedsel items
    spawnNPCs(); // Spawn NPC's;
    gameLoop(); // Start de spelcyclus
}
// Start het spel
startGame();