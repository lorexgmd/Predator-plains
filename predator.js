// Initialize constants
let playerScore = 0; // Initialize player's score
const INITIAL_POINTS = 10; // value
const NPC_RESPAWN_TIME = 5; // seconds
const MAX_LEADERBOARD_SIZE = 10;
const HERBIVORE_EVOLUTION_THRESHOLD = 50; // points value
const CARNIVORE_EVOLUTION_THRESHOLD = 50; // points value
const plants = 1; // points for plants
const meat = 2;  // points for meat
// Initialize player object
let player = {
    role: null,
    x: 0, // Default position (can be set later)
    y: 0,
    score: INITIAL_POINTS,
    speed: 5
};
// Function to prompt player to choose role
function chooseRole() {
    const role = prompt("Choose your role: Carnivore or Herbivore");
    if (role.toLowerCase() === "carnivore" || role.toLowerCase() === "herbivore") {
        player.role = role;
    } else {
        chooseRole(); // Retry if invalid input
    }
}
chooseRole ();
