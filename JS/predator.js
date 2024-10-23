// Hoofdvariabelen
const canvas = document.getElementById("gameCanvas"); // Verkrijg het canvas element van de HTML
const ctx = canvas.getContext("2d"); // Verkrijg de 2D context voor tekenen op het canvas
// Speler
let player = {
    x: canvas.width / 2, // Начальная позиция игрока по X
    y: canvas.height / 2, // Начальная позиция игрока по Y
    size: 30, // Начальный размер игрока
    speed: 1, // Скорость игрока
    score: 0, // Начальный счет игрока
    role: null, // Роль игрока (плотоядный или травоядный)
    color: "blue" // Цвет игрока
};

// Списки для еды и NPC
let foodItems = []; // Массив для еды
let npcs = []; // Массив для NPC

// Настройки игры
const foodCount = 100; // Количество еды
const npcCount = 10; // Количество NPC
const foodSize = 10; // Размер еды
const npcSpeed = 1; // Скорость NPC
const newNpcSize = 30; // Начальный размер NPC
const newFoodSize = 10; // Размер новой еды

// Инициализация позиции мыши
let mouseX = player.x; // Начальная позиция мыши по X
let mouseY = player.y; // Начальная позиция мыши по Y

// Загрузка фона
const backgroundImage = new Image();
backgroundImage.src = "Images/Savannah background.jpg"; // Путь к фону

// Функции загрузки изображений
playerImage.onload = function () {
    drawPlayer(); // Перерисовать игрока после загрузки
};

backgroundImage.onload = function() {
    requestAnimationFrame(gameLoop); // Запустить игровой цикл после загрузки фона
};

// Функция обновления изображения игрока
function updatePlayerImage() {
    let maxScore = 500;
    let level = Math.min(Math.floor(player.score / (maxScore / 11)), 10);
    if (player.role === "carnivore") {
        playerImage.src = carnivoreImages[level];
    } else if (player.role === "herbivore") {
        playerImage.src = herbivoreImages[level];
    }
}

// Функция рисования игрока
function drawPlayer() {
    ctx.drawImage(playerImage, player.x - player.size / 2, player.y - player.size / 2, player.size, player.size);
}

// Функция выбора роли
function chooseRole() {
    document.getElementById('roleSelection').style.display = 'none'; // Скрыть блок выбора
    spawnFood(); // Спавн еды
    spawnNPCs(); // Спавн NPC
    gameLoop(); // Запуск игрового цикла
}
// Установим обработчики событий для кнопок
document.getElementById('carnivoreButton').addEventListener('click', function() {
    player.role = 'carnivore'; // Установим роль как Carnivore
    player.color = 'red'; // Меняем цвет игрока для Carnivore
    chooseRole(); // Запускаем игру
});

document.getElementById('herbivoreButton').addEventListener('click', function() {
    player.role = 'herbivore'; // Установим роль как Herbivore
    player.color = 'green'; // Меняем цвет игрока для Herbivore
    chooseRole(); // Запускаем игру
});
function showRoleSelection() {
    document.getElementById('roleSelection').style.display = 'block'; // Показать выбор роли
}

// Функции спавна еды и NPC
function spawnFood() {
    for (let i = 0; i < foodCount; i++) {
        foodItems.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            size: foodSize,
            type: Math.random() > 0.5 ? 'plant' : 'meat'
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
    }, delay); 
}

function spawnNPCs() {
    for (let i = 0; i < npcCount; i++) {
        npcs.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            size: player.size,
            speed: npcSpeed,
            directionX: Math.random() > 0.5 ? 1 : -1,
            directionY: Math.random() > 0.5 ? 1 : -1,
            type: Math.random() > 0.5 ? 'carnivore' : 'herbivore'
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
    }, delay);
}

// Функция обновления позиции игрока
function updatePlayerPosition() {
    let dx = mouseX - player.x;
    let dy = mouseY - player.y;
    let distance = Math.sqrt(dx * dx + dy * dy);
    if (distance > 1) {
        player.x += (dx / distance) * player.speed;
        player.y += (dy / distance) * player.speed;
    }
}

// Функция обновления NPC
function updateNPCs() {
    npcs.forEach(npc => {
        if (Math.random() < 0.02) {
            npc.directionX = Math.random() > 0.5 ? 1 : -1;
            npc.directionY = Math.random() > 0.5 ? 1 : -1;
        }
        npc.x += npc.directionX * npc.speed;
        npc.y += npc.directionY * npc.speed;
        if (npc.x <= 0 || npc.x >= canvas.width) {
            npc.directionX *= -1;
        }
        if (npc.y <= 0 || npc.y >= canvas.height) {
            npc.directionY *= -1;
        }
    });
}

// Обработка движения мыши
canvas.addEventListener("mousemove", function(event) {
    let rect = canvas.getBoundingClientRect();
    mouseX = event.clientX - rect.left;
    mouseY = event.clientY - rect.top;
});

// Проверка коллизий
function checkCollisions() {
    // Коллизия с едой
    for (let i = foodItems.length - 1; i >= 0; i--) {
        let food = foodItems[i];
        let dx = player.x - food.x;
        let dy = player.y - food.y;
        let distance = Math.sqrt(dx * dx + dy * dy);
        if (distance < player.size / 2 + food.size / 2) {
            player.score += (food.type === 'plant') ? 10 : 20;
            player.size += 1;
            foodItems.splice(i, 1);
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
                respawnNPC (3000);
            } 
            else if (player.size === npc.size) {
                console.log("De speler en NPC zijn gelijk in grootte.");
                // Deze regel verhelpt deze bug: NPC's kunnen aan het begin van het spel in de speler spawnen, waardoor je onmiddellijk verliest.
               }
            else { // Als de speler kleiner is
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
    }
}

// Functie om voedsel automatisch opnieuw te spawnen als het aantal onder een bepaalde limiet komt
function spawnFoodAgain(intervalTime) {
    setInterval(function() {
        if (foodItems.length < foodCount) { // Controleer of er minder voedsel is dan de ingestelde limiet
            respawnFood(); // Respawn nieuw voedsel
        }
    }, intervalTime); // Interval tijd in milliseconden tussen elke controle
}
// Load the background image
const backgroundImage = new Image();
backgroundImage.src = "/Images/Savannah background.jpg"; // Path to your background image

// Hoofdcodes voor de spelcyclus
function gameLoop() {
    ctx.drawImage(backgroundImage, 0, 0, canvas.width, canvas.height);//voeg background image toe   

    // Update posities van speler en NPC's
    updatePlayerPosition(); // Update de positie van de speler
    updateNPCs(); // Update de posities van de NPC's
    // Teken de speler
    ctx.fillStyle = player.color; // Kleur van de speler
    ctx.beginPath();
    ctx.arc(player.x, player.y, player.size / 2, 0, Math.PI * 2); // Teken de speler
    ctx.fill(); // Vul de speler
    ctx.closePath(); // Sluit het pad

    // Отрисовка еды
    foodItems.forEach(food => {
        ctx.fillStyle = food.type === 'plant' ? 'green' : 'red';
        ctx.beginPath();
        ctx.arc(food.x, food.y, food.size, 0, Math.PI * 2);
        ctx.fill();
    });

    // Отрисовка NPC
    npcs.forEach(npc => {
        ctx.fillStyle = npc.type === 'herbivore' ? 'yellow' : 'brown';
        ctx.beginPath();
        ctx.arc(npc.x, npc.y, npc.size, 0, Math.PI * 2);
        ctx.fill();
    });

    // Controleer op botsingen
    checkCollisions(); // Controleer botsingen met voedsel en NPC's
    checkNPCCollisions(); // Controleer botsingen tussem Npc's en voedsel
    requestAnimationFrame(gameLoop); // Vraag de volgende frame aan
}
// Functie om het spel te starten
function startGame() {
    showRoleSelection();
}
// Start het spel
startGame();
