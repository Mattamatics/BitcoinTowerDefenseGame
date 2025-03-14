// Global variables
let path = [
    // Top entrance path - longer and more winding
    [{x: 50, y: 80}, {x: 160, y: 100}, {x: 220, y: 180}, {x: 280, y: 140}, 
     {x: 350, y: 160}, {x: 420, y: 200}, {x: 480, y: 180},
     // Merge point
     {x: 520, y: 250}, {x: 580, y: 280}, {x: 650, y: 240}, {x: 720, y: 260}, {x: 800, y: 250}],
    // Bottom entrance path - different winding pattern
    [{x: 50, y: 420}, {x: 140, y: 380}, {x: 200, y: 420}, {x: 280, y: 380},
     {x: 350, y: 400}, {x: 420, y: 350}, {x: 480, y: 320},
     // Merge point
     {x: 520, y: 250}, {x: 580, y: 280}, {x: 650, y: 240}, {x: 720, y: 260}, {x: 800, y: 250}]
];

  let towerSpots = [
    // Chokepoint spots (premium spots near path intersections and curves)
    {x: 220, y: 120, type: 'choke', unlocked: false},   // Top path first curve - moved up
    {x: 280, y: 340, type: 'choke', unlocked: false},   // Bottom path curve - moved up
    {x: 420, y: 140, type: 'choke', unlocked: false},   // Pre-merge top curve - moved up
    {x: 520, y: 180, type: 'choke', unlocked: false},   // At merge point - moved up
    
    // High ground spots (premium spots overlooking multiple path segments)
    {x: 350, y: 280, type: 'high', unlocked: false},    // Center between paths
    {x: 580, y: 180, type: 'high', unlocked: false},    // Post-merge oversight - moved up
    {x: 650, y: 300, type: 'high', unlocked: false},    // Final approach - moved down
    
    // Power spots (premium offensive positions)
    {x: 480, y: 220, type: 'power', unlocked: false},   // Merge point power - moved up
    {x: 420, y: 290, type: 'power', unlocked: false},   // Bottom approach power - moved up
    
    // Normal spots (good basic coverage positions)
    {x: 160, y: 140, type: 'normal', unlocked: true},   // Early top path
    {x: 140, y: 340, type: 'normal', unlocked: true},   // Early bottom path - moved up
    {x: 420, y: 220, type: 'normal', unlocked: true},   // Mid-merge approach - moved up
    {x: 580, y: 340, type: 'normal', unlocked: true},   // Post-merge coverage - moved down
    {x: 720, y: 200, type: 'normal', unlocked: true}    // Final defense - moved up
];

  let enemies = [];
  let towers = [];
  let projectiles = [];
let satLossEffects = [];  // Global declaration
let floatingTexts = [];
let currency = 100000000;  // 100M sats
let coldStorage = 0;  // Cold storage balance
let highScore = 0;   // All-time high score
let lives = 8;
  let selectedTower = null;
  let waveIndex = 0;
  let waveEnemies = [];
  let waveInterval = 0;
  let waveStartTime = 0;
  let waveTimer = 0;
  let gameState = 'playing';
let showColdStorageDialog = false;  // Flag for cold storage dialog
let coldStorageInput = '';  // Track cold storage input
let endScreenDelay = 0;  // Delay before showing end screen
let endScreenAlpha = 0;  // For fade-in animation
let endScreenButtons = [
  { text: 'Try Again', action: 'restart', hovered: false },
  { text: 'Submit High Score', action: 'submit', hovered: false },
  { text: 'Share on X', action: 'share', hovered: false },
  { text: 'View Leaderboard', action: 'leaderboard', hovered: false }
];
  let bg;
let currentBossWarning = null;  // Add this for boss warnings
let bossWarningTimer = 0;  // Add timer for early warning
  
  let waves = [
    // Group 1 (Waves 1-3): Tax Agent Boss
    { enemies: ['shitcoiner', 'shitcoiner', 'shitcoiner'], interval: 2000 },
    { enemies: ['shitcoiner', 'shitcoiner', 'nft', 'nft'], interval: 1800 },
    { enemies: ['nft', 'nft', 'nft', 'taxAgent'], interval: 1000 },
    
    // Group 2 (Waves 4-6): Ethereum Unicorn Boss
    { enemies: ['fiat', 'fiat', 'FUDster', 'FUDster'], interval: 1600 },
    { enemies: ['fiat', 'nft', 'nft', 'FUDster'], interval: 1400 },
    { enemies: ['FUDster', 'shitcoiner', 'FUDster', 'nft', 'ethUnicorn'], interval: 1000 },
    
    // Group 3 (Waves 7-9): $5 Wrench Gang Boss
    { enemies: ['shitcoiner', 'shitcoiner', 'nft', 'nft', 'CBDC', 'CBDC', 'goldbug'], interval: 1200 },
    { enemies: ['fiat', 'nft', 'CBDC', 'FUDster', 'FUDster'], interval: 1000 },
    { enemies: ['wrenchGang', 'wrenchGang', 'wrenchGang', 'wrenchGang', 'FUDster', 'FUDster', 'FUDster'], interval: 800 },
    
    // Group 4 (Waves 10-12): XRP FUDster Boss
    { enemies: ['shitcoiner', 'shitcoiner', 'nft', 'nft', 'CBDC', 'FUDster', 'FUDster', 'FUDster', 'FUDster', 'goldbug'], interval: 800 },
    { enemies: ['fiat', 'nft', 'CBDC', 'FUDster', 'FUDster', 'FUDster', 'FUDster', 'FUDster'], interval: 700 },
    { enemies: ['nft', 'nft', 'nft', 'xrpFudster', 'FUDster', 'FUDster', 'FUDster', 'FUDster'], interval: 600 },
    
    // Group 5 (Waves 13-15): Day Trading Temptation Boss
    { enemies: ['shitcoiner', 'shitcoiner', 'nft', 'nft', 'CBDC', 'CBDC', 'FUDster', 'FUDster', 'FUDster', 'FUDster'], interval: 600 },
    { enemies: ['fiat', 'nft', 'CBDC', 'FUDster', 'FUDster', 'FUDster', 'FUDster', 'goldbug', 'goldbug', 'FUDster', 'FUDster'], interval: 500 },
    { enemies: ['dayTrader', 'FUDster', 'FUDster', 'FUDster', 'FUDster', 'FUDster', 'FUDster'], interval: 400 },
    
    // Group 6 (Waves 16-18): Deep State Agents
    { enemies: ['shitcoiner', 'shitcoiner', 'nft', 'nft', 'CBDC', 'CBDC', 'FUDster', 'FUDster', 'FUDster', 'FUDster', 'goldbug', 'goldbug', 'goldbug', 'FUDster', 'FUDster'], interval: 400 },
    { enemies: ['fiat', 'nft', 'CBDC', 'FUDster', 'FUDster', 'FUDster', 'FUDster', 'goldbug', 'goldbug', 'goldbug', 'FUDster', 'FUDster', 'FUDster'], interval: 300 },
    { enemies: ['deepState', 'deepState', 'deepState', 'deepState', 'goldbug', 'goldbug', 'goldbug', 'FUDster', 'FUDster', 'FUDster', 'FUDster', 'FUDster', 'FUDster'], interval: 200 },
    
    // Group 7 (Waves 19-20): Lifestyle Inflation Bosses
    { enemies: ['shitcoiner', 'shitcoiner', 'nft', 'nft', 'CBDC', 'CBDC', 'goldbug', 'goldbug', 'goldbug', 'goldbug', 'FUDster', 'FUDster', 'FUDster', 'FUDster', 'FUDster', 'FUDster'], interval: 300 },
    { enemies: ['fiat', 'nft', 'CBDC', 'FUDster', 'goldbug', 'goldbug', 'goldbug', 'goldbug', 'FUDster', 'FUDster', 'FUDster', 'FUDster', 'FUDster', 'FUDster', 'FUDster', 'FUDster'], interval: 200 },
    // Wave 21: Final Boss Wave
    { enemies: ['luxuryCar', 'FUDster', 'FUDster', 'yacht', 'FUDster', 'FUDster', 'privateJet', 'FUDster', 'FUDster', 'mansion'], interval: 2000 }  // 2 second interval, with FUDsters between bosses
  ];
  let towerCosts = {
    'encryption': 45000000,    // 45M sats
    'verification': 85000000,  // 85M sats
    'consensus': 65000000,     // 65M sats
    'backup': 95000000        // 95M sats
};

// Add at the top with other global variables
let selectedTowerForUpgrade = null;  // Track which tower is selected for upgrade
  
  // Setup function
  function setup() {
    try {
    createCanvas(800, 600);
    bg = createGraphics(800, 600);
    drawBackground(bg);
        
        // Initialize game state
        gameState = 'playing';
        currency = 100000000;
        lives = 8;
        waveIndex = 0;
        enemies = [];
        towers = [];
        projectiles = [];
        coldStorage = 0;
        highScore = 0;
        selectedTower = null;
        selectedTowerForUpgrade = null;
        
        // Ensure frame rate is set
        frameRate(60);
        
        // Force a single frame update to ensure everything is initialized
        updateWave();
        for (let tower of towers) {
            tower.attack();
        }
        
        console.log('Game initialized successfully');
    } catch (error) {
        console.error('Failed to initialize game:', error);
    }
  }
  
  // Draw function (game loop)
  function draw() {
    if (gameState === 'playing') {
      image(bg, 0, 0);
      drawPath();
      drawTowerSpots();
      updateWave();
      for (let enemy of enemies.slice()) {
        enemy.move();
        enemy.draw();
      }
      for (let tower of towers) {
        tower.attack();
        tower.draw();
      }
      for (let proj of projectiles.slice()) {
        proj.update();
        proj.draw();
      }
        
        // Draw sat loss effects
        for (let i = satLossEffects.length - 1; i >= 0; i--) {
            let effect = satLossEffects[i];
            effect.alpha -= 4;
            effect.life--;
            
            if (effect.life <= 0) {
                satLossEffects.splice(i, 1);
                continue;
            }
            
            push();
            translate(effect.x, effect.y);
            noStroke();
            fill(255, 0, 0, effect.alpha);
            textSize(16);
            textAlign(CENTER);
            text(`-${effect.amount}M`, 0, 0);
            pop();
        }
        
        // Draw floating text effects
        for (let i = floatingTexts.length - 1; i >= 0; i--) {
            let effect = floatingTexts[i];
            effect.alpha -= 4;
            effect.life--;
            effect.y -= 1;  // Float upward
            
            if (effect.life <= 0) {
                floatingTexts.splice(i, 1);
                continue;
            }
            
            push();
            translate(effect.x, effect.y);
            noStroke();
            fill(effect.color[0], effect.color[1], effect.color[2], effect.alpha);
            textSize(16);
            textAlign(CENTER);
            text(effect.text, 0, 0);
            pop();
        }
        
      drawUI();
        drawUpgradeUI();
      if (lives <= 0) {
        endScreenDelay = frameCount + 300; // 5 seconds at 60fps
        gameState = 'gameover';
      } else if (waveIndex >= waves.length && waveEnemies.length === 0 && enemies.length === 0) {
        endScreenDelay = frameCount + 300; // 5 seconds at 60fps
        gameState = 'victory';
      }
    } else if (gameState === 'gameover' || gameState === 'victory') {
      // Continue drawing game state in background
      image(bg, 0, 0);
      drawPath();
      drawTowerSpots();
      for (let tower of towers) {
        tower.draw();
      }
      
      // Wait for delay before showing end screen
      if (frameCount < endScreenDelay) {
        // Show initial game over/victory text
      textAlign(CENTER);
        textSize(50);
        if (gameState === 'gameover') {
          fill(255, 0, 0);
      text("Game Over", width / 2, height / 2);
        } else {
      fill(0, 255, 0);
      text("Victory!", width / 2, height / 2);
        }
        return;
      }

      // Fade in end screen
      endScreenAlpha = min(endScreenAlpha + 5, 200);
      
      // Semi-transparent overlay
      fill(0, 0, 0, endScreenAlpha);
      noStroke();
      rect(0, 0, width, height);
      
      // End screen content - adjust centerY to move everything up further
      let centerY = height / 2 - 200; // Moved up even more to fit all buttons
      
      // Title with glow effect
      textAlign(CENTER);
      textSize(64);
      let titleColor = gameState === 'victory' ? color(255, 215, 0) : color(255, 50, 50);
      
      // Glow effect
      for (let i = 4; i > 0; i--) {
        let alpha = map(i, 4, 0, 50, 150);
        fill(titleColor.levels[0], titleColor.levels[1], titleColor.levels[2], alpha);
        text(gameState === 'victory' ? "Victory!" : "Game Over", width/2, centerY + i);
      }
      fill(titleColor);
      text(gameState === 'victory' ? "Victory!" : "Game Over", width/2, centerY);
      
      // Score display with Bitcoin symbol
      let btcAmount = coldStorage/100000000;
      let bitcoinerRank = getBitcoinerRank(btcAmount);
      
      // Display Bitcoiner Rank first
      textSize(32);
      fill(255, 215, 0);
      text(`Bitcoiner Rank: ${bitcoinerRank}`, width/2, centerY + 80);
      
      // Then display BTC amount
      textSize(32);
      fill(255, 165, 0);
      text("Final Score", width/2, centerY + 130);
      textSize(48);
      text(`${btcAmount.toFixed(8)} BTC`, width/2, centerY + 180);
      textSize(24);
      fill(255, 165, 0, 200);
      text(`(${coldStorage.toLocaleString()} sats)`, width/2, centerY + 215);
      
      // Buttons - reduce spacing and move up to fit all buttons
      let buttonY = centerY + 260;
      let buttonSpacing = 50; // Further reduced spacing between buttons
      textSize(24);
      
      endScreenButtons.forEach((button, i) => {
        let y = buttonY + i * buttonSpacing;
        button.hovered = mouseX > width/2 - 150 && mouseX < width/2 + 150 &&
                        mouseY > y - 25 && mouseY < y + 25;
        
        // Button background with glow
        if (button.hovered) {
          for (let j = 3; j > 0; j--) {
            fill(255, 165, 0, 20 * j);
            noStroke();
            rect(width/2 - 150 - j, y - 25 - j, 300 + j*2, 50 + j*2, 10);
          }
        }
        
        // Main button
        fill(button.hovered ? color(255, 165, 0) : color(40, 45, 60));
        stroke(255, 165, 0);
        strokeWeight(2);
        rect(width/2 - 150, y - 25, 300, 50, 8);
        
        // Button text - fix vertical alignment
        fill(button.hovered ? color(0) : color(255));
        noStroke();
        textAlign(CENTER, CENTER); // Center both horizontally and vertically
        text(button.text, width/2, y); // Removed the +8 offset
      });

      // Reset text alignment to default
      textAlign(LEFT, BASELINE);
    }
    
    // Draw leaderboard dialogs on top of everything
    drawLeaderboardSubmitDialog();
    drawLeaderboard();
  }
  
  // Handle mouse clicks
  function mousePressed() {
    // Handle leaderboard submission dialog
    if (showLeaderboardSubmitDialog) {
      let dialogWidth = 400;
      let dialogHeight = 300;
      let dialogX = (width - dialogWidth) / 2;
      let dialogY = (height - dialogHeight) / 2;
      
      // Submit button
      let submitButtonX = dialogX + dialogWidth/2 - 110;
      let submitButtonY = dialogY + 240;
      let submitButtonHovered = mouseX > submitButtonX && mouseX < submitButtonX + 100 &&
                               mouseY > submitButtonY && mouseY < submitButtonY + 40;
      
      // Cancel button
      let cancelButtonX = dialogX + dialogWidth/2 + 10;
      let cancelButtonY = dialogY + 240;
      let cancelButtonHovered = mouseX > cancelButtonX && mouseX < cancelButtonX + 100 &&
                               mouseY > cancelButtonY && mouseY < cancelButtonY + 40;
      
      // Nickname input field
      let nicknameFieldHovered = mouseX > dialogX + 30 && mouseX < dialogX + dialogWidth - 30 &&
                                mouseY > dialogY + 90 && mouseY < dialogY + 130;
      
      // Email input field
      let emailFieldHovered = mouseX > dialogX + 30 && mouseX < dialogX + dialogWidth - 30 &&
                             mouseY > dialogY + 160 && mouseY < dialogY + 200;
      
      if (submitButtonHovered) {
        submitScore();
        return;
      } else if (cancelButtonHovered) {
        showLeaderboardSubmitDialog = false;
        leaderboardNickname = "";
        leaderboardEmail = "";
        leaderboardError = "";
        return;
      } else if (nicknameFieldHovered) {
        // Prompt for nickname
        let nickname = prompt("Enter your nickname:", leaderboardNickname);
        if (nickname !== null) {
          leaderboardNickname = nickname.substring(0, 20); // Limit to 20 chars
        }
        return;
      } else if (emailFieldHovered) {
        // Prompt for email
        let email = prompt("Enter your email (private):", leaderboardEmail);
        if (email !== null) {
          leaderboardEmail = email;
        }
        return;
      }
      
      return; // Don't process other clicks when dialog is open
    }
    
    // Handle leaderboard view
    if (showLeaderboard) {
      let boardWidth = 500;
      let boardHeight = 500;
      let boardX = (width - boardWidth) / 2;
      let boardY = (height - boardHeight) / 2;
      
      // Close button
      let closeButtonX = boardX + boardWidth/2 - 50;
      let closeButtonY = boardY + boardHeight - 70;
      let closeButtonHovered = mouseX > closeButtonX && mouseX < closeButtonX + 100 &&
                              mouseY > closeButtonY && mouseY < closeButtonY + 40;
      
      if (closeButtonHovered) {
        showLeaderboard = false;
        return;
      }
      
      return; // Don't process other clicks when leaderboard is open
    }
    
    // Handle end screen buttons
    if ((gameState === 'gameover' || gameState === 'victory') && frameCount >= endScreenDelay) {
      endScreenButtons.forEach(button => {
        if (button.hovered) {
          if (button.action === 'restart') {
            setup(); // Reset game
          } else if (button.action === 'submit') {
            showLeaderboardSubmitDialog = true;
          } else if (button.action === 'share') {
            const btcAmount = coldStorage/100000000;
            const bitcoinerRank = getBitcoinerRank(btcAmount);
            let text = gameState === 'victory' ? 
              `Bitcoiner Rank: ${bitcoinerRank}\nVictory! Just defended my Bitcoin with ${btcAmount.toFixed(8)} BTC (${coldStorage.toLocaleString()} sats) in cold storage! 🏆\n\nCan you beat my high score in BitcoinTowerDefenseGame!\n\nCheck out Mysteries of the Bitcoin Citadel - April 7th @paperstreet_inc #Bitcoin` :
              `Bitcoiner Rank: ${bitcoinerRank}\nGame Over! Secured ${btcAmount.toFixed(8)} BTC (${coldStorage.toLocaleString()} sats) in cold storage!\n\nTry to beat my score in BitcoinTowerDefenseGame!\n\nCheck out Mysteries of the Bitcoin Citadel - April 7th @paperstreet_inc #Bitcoin`;
            window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`, '_blank');
          } else if (button.action === 'leaderboard') {
            fetchLeaderboard();
            showLeaderboard = true;
          }
        }
      });
      return;
    }
    
    if (showColdStorageDialog) {
        let dialogWidth = 400;
        let dialogHeight = 200;
        let dialogX = (width - dialogWidth) / 2;
        let dialogY = (height - dialogHeight) / 2;
        let buttonY = dialogY + 140;
        
        // Handle lock buttons
        if (mouseY > buttonY && mouseY < buttonY + 30) {
            if (mouseX > width/2 - 190 && mouseX < width/2 - 110) {
                // Lock 25%
                let amount = Math.floor(currency * 0.25);
                coldStorage += amount;
                currency -= amount;
            } else if (mouseX > width/2 - 90 && mouseX < width/2 - 10) {
                // Lock 50%
                let amount = Math.floor(currency * 0.5);
                coldStorage += amount;
                currency -= amount;
            } else if (mouseX > width/2 + 10 && mouseX < width/2 + 90) {
                // Lock 75%
                let amount = Math.floor(currency * 0.75);
                coldStorage += amount;
                currency -= amount;
            } else if (mouseX > width/2 + 110 && mouseX < width/2 + 190) {
                // Lock 100%
                coldStorage += currency;
                currency = 0;
            }
        }
        
        // Handle continue button
        if (mouseX > width/2 - 50 && mouseX < width/2 + 50 && 
            mouseY > buttonY + 30 && mouseY < buttonY + 60) {
            showColdStorageDialog = false;
            // Update high score
            highScore = Math.max(highScore, coldStorage);
        }
        return;
    }
    
    if (gameState === 'playing') {
        // Check if clicking outside upgrade UI should close it
        if (selectedTowerForUpgrade) {
            let tower = selectedTowerForUpgrade;
            let options = tower.getUpgradeOptions();
            let cost = tower.getUpgradeCost();
            
            // Check if click is within upgrade UI bounds
            let uiX = tower.position.x;
            let uiY = tower.position.y - 60;
            let uiWidth = 280;
            let uiHeight = 220;  // Updated height to match new UI
            
            if (mouseX >= uiX - uiWidth/2 && mouseX <= uiX + uiWidth/2 &&
                mouseY >= uiY && mouseY <= uiY + uiHeight) {
                
                // Check for sell button click
                let sellButtonY = uiY + uiHeight - 50;
                let buttonWidth = 110;
                let buttonHeight = 45;
                
                if (mouseY >= sellButtonY && mouseY <= sellButtonY + buttonHeight &&
                    mouseX >= uiX - buttonWidth && mouseX <= uiX + buttonWidth) {
                    tower.sell();
                    selectedTowerForUpgrade = null;
                    return;
                }
                
                // Handle upgrade button clicks
                if (mouseY >= uiY + 45 && mouseY <= uiY + 45 + buttonHeight && currency >= cost) {
                    if (mouseX >= uiX - buttonWidth - 10 && mouseX < uiX - 10) {
                        // Path A clicked
                        currency -= cost;
                        tower.applyUpgrade('A');
                        selectedTowerForUpgrade = null;
                        return;
                    } else if (mouseX >= uiX + 10 && mouseX < uiX + buttonWidth + 10) {
                        // Path B clicked
                        currency -= cost;
                        tower.applyUpgrade('B');
                        selectedTowerForUpgrade = null;
                        return;
                    }
                }
            } else {
                // Clicked outside, close upgrade UI
                selectedTowerForUpgrade = null;
                return;
            }
        }
        
        // Check for tower selection for upgrade - only if no tower is currently selected
        if (!selectedTowerForUpgrade) {
            for (let tower of towers) {
                if (dist(mouseX, mouseY, tower.position.x, tower.position.y) < 20) {
                    selectedTowerForUpgrade = tower;
                    return;
                }
            }
        }
        
        // Handle cold storage lock button
        if (mouseX > width - 100 && mouseX < width - 20 && 
            mouseY > height - 40 && mouseY < height - 15) {
            let amount = Number(coldStorageInput);
            if (!isNaN(amount) && amount >= 1 && amount * 1000000 <= currency) {
                coldStorage += amount * 1000000;
                currency -= amount * 1000000;
                coldStorageInput = '';
                // Update high score
                highScore = Math.max(highScore, coldStorage);
            }
            return;
        }
        
        // Start Wave button
        if (mouseY < 35 && mouseX > width - 110 && mouseX < width - 20) {
          startWave();
            return;
        }

        // Tower selection
        if (mouseY > height - 40 && mouseY < height - 5) {
            let buttonWidth = 95;
            let spacing = 20;
            let startX = 20;

            for (let i = 0; i < 4; i++) {
                let buttonX = startX + i * (buttonWidth + spacing);
                if (mouseX > buttonX && mouseX < buttonX + buttonWidth) {
                    selectedTower = ['encryption', 'verification', 'consensus', 'backup'][i];
                    return;
                }
            }
        }

        // Handle unlocking premium spots - moved before tower placement
        for (let spot of towerSpots) {
            if (!spot.unlocked && spot.type !== 'normal' && dist(mouseX, mouseY, spot.x, spot.y) < 20) {
                if (currency >= 10000000) {  // 10M sats
                    currency -= 10000000;
                    spot.unlocked = true;
                }
                return;
            }
        }

        // Handle tower placement
        if (selectedTower) {
        let closestSpot = null;
        let minDist = Infinity;
        for (let spot of towerSpots) {
          let d = dist(mouseX, mouseY, spot.x, spot.y);
          if (d < minDist) {
            minDist = d;
            closestSpot = spot;
          }
        }
            if (minDist < 20 && (closestSpot.unlocked || closestSpot.type === 'normal')) {
          placeTower(closestSpot);
        }
      }
    }
  }
  
  // Draw the Bitcoin-themed background
  function drawBackground(g) {
    // Base background
    g.background(20, 22, 30);
    
    // Grid
    g.stroke(40, 45, 60, 100);
    g.strokeWeight(1);
    for (let i = 0; i < width; i += 40) {
        g.line(i, 0, i, height);
        g.line(0, i, width, i);
        
        // Circuit nodes (15% chance)
        for (let j = 0; j < height; j += 40) {
            if (random() < 0.15) {
                g.push();
                g.translate(i, j);
                
                // Node
                g.stroke(60, 65, 80);
                g.fill(30, 35, 45);
                g.rect(-5, -5, 10, 10);
                
                // Circuit paths
                g.strokeWeight(1);
                let paths = floor(random(1, 4));
                for(let k = 0; k < paths; k++) {
                    let angle = random([0, PI/2, PI, 3*PI/2]);
                    g.line(0, 0, cos(angle) * random(20, 40), sin(angle) * random(20, 40));
                }
                
                // LED (30% chance)
                if (random() < 0.3) {
                    g.fill(255, 165, 0, random(50, 150));
                    g.noStroke();
                    g.ellipse(0, 0, 3, 3);
                }
                
                g.pop();
            }
        }
    }
    
    // Digital noise lines
    g.stroke(40, 45, 60);
    for (let i = 0; i < 30; i++) {
        g.strokeWeight(1);
        g.stroke(40, 45, 60, random(20, 40));
        g.line(0, random(height), width, random(height));
    }
  }
  
  // Draw Bitcoin symbol
  function drawBitcoin(g, x, y, size) {
    g.push();
    g.translate(x, y);
    g.scale(size);
    
    // Main circle
    g.fill(247, 147, 26); // Bitcoin Orange
    g.noStroke();
    g.ellipse(10, 10, 20, 20);
    
    // Bitcoin 'B' symbol in white
    g.fill(255);
    g.noStroke();
    
    // Vertical line of the B
    g.rect(8.5, 4, 1.5, 12);
    
    // Top curve of the B
    g.beginShape();
    g.vertex(8.5, 4);
    g.bezierVertex(13, 4, 15, 5, 15, 8);
    g.bezierVertex(15, 11, 13, 12, 8.5, 12);
    g.endShape(CLOSE);
    
    // Bottom curve of the B
    g.beginShape();
    g.vertex(8.5, 8);
    g.bezierVertex(14, 8, 16, 9, 16, 12);
    g.bezierVertex(16, 15, 14, 16, 8.5, 16);
    g.endShape(CLOSE);
    
    // Horizontal lines
    g.rect(6, 6, 4, 1);  // Top
    g.rect(6, 13, 4, 1); // Bottom
    
    g.pop();
  }
  
  // Draw the blockchain path
  function drawPath() {
    strokeWeight(20);
    noFill();
    
    // Draw each entrance path with different colors
    for (let i = 0; i < path.length; i++) {
        if (i === 0) {
            stroke(255, 200, 0, 200);  // Golden path (top)
        } else {
            stroke(255, 130, 0, 200);  // Dark orange path (bottom)
        }
        
    beginShape();
        for (let j = 0; j < path[i].length; j++) {
            // Fade to the same color after merge point
            if (j >= 4) { // Merge point index
                let progress = (j - 4) / (path[i].length - 4);
                stroke(255, 165, 0, 200 + progress * 55); // Gradually increase opacity
            }
            vertex(path[i][j].x, path[i][j].y);
    }
    endShape();
    }
    strokeWeight(1);
  }
  
// Draw tower placement spots with improved visuals
  function drawTowerSpots() {
    for (let spot of towerSpots) {
        let isHovered = dist(mouseX, mouseY, spot.x, spot.y) < 20;
        let isLocked = !spot.unlocked && spot.type !== 'normal';
        
        push();
        translate(spot.x, spot.y);
        
        // Outer glow for better visibility
        noFill();
        for(let i = 0; i < 3; i++) {
            stroke(60, 70, 90, 100 - i * 20);
            strokeWeight(3 - i);
            ellipse(0, 0, 40 + i * 2, 40 + i * 2);
        }
        
        // Base platform for all spots with improved contrast
        noStroke();
        fill(isLocked ? color(30, 35, 45, 200) : 
             spot.type === 'normal' ? color(60, 70, 90, 230) :
             spot.type === 'high' ? color(100, 150, 255, 230) :
             spot.type === 'power' ? color(255, 140, 0, 230) :
             color(200, 180, 60, 230));
        ellipse(0, 0, 36, 36);
        
        // Platform border for better definition
        stroke(isLocked ? color(40, 45, 60) : color(80, 90, 110));
        strokeWeight(2);
        noFill();
        ellipse(0, 0, 36, 36);
        
        // Unique designs for each type with enhanced visibility
        if (spot.type === 'high') {
            // Mountain-like high ground with better contrast
            fill(140, 180, 255, isLocked ? 100 : 230);
            noStroke();
            triangle(-15, 10, 15, 10, 0, -15);
            fill(160, 200, 255, isLocked ? 100 : 230);
            triangle(-10, 10, 10, 10, 0, -10);
        } else if (spot.type === 'power') {
            // Energy symbol with enhanced glow
            fill(255, 165, 0, isLocked ? 100 : 230);
            stroke(255, 200, 0, isLocked ? 100 : 180);
            strokeWeight(2);
            beginShape();
            vertex(0, -15);
            vertex(8, 0);
            vertex(0, 5);
            vertex(0, 15);
            vertex(-8, 0);
            vertex(0, -5);
            endShape(CLOSE);
        } else if (spot.type === 'choke') {
            // Fortress-like chokepoint with better visibility
            fill(220, 200, 80, isLocked ? 100 : 230);
            stroke(240, 220, 100, isLocked ? 100 : 180);
            strokeWeight(2);
            rect(-12, -12, 24, 24, 4);
            fill(240, 220, 100, isLocked ? 100 : 230);
            noStroke();
            rect(-8, -16, 4, 8);
            rect(4, -16, 4, 8);
        }
        
        // Lock icon with improved visibility
        if (isLocked) {
            stroke(255, 165, 0);
            strokeWeight(2);
            noFill();
            // Lock body
            rect(-6, -2, 12, 14, 3);
            // Lock shackle
            arc(0, -2, 16, 16, PI, TWO_PI);
            // Glow effect
            stroke(255, 165, 0, 100);
            strokeWeight(1);
            rect(-7, -3, 14, 16, 4);
            arc(0, -3, 18, 18, PI, TWO_PI);
        }
        
        pop();
        
        // Range preview with improved visibility
        if (isHovered && selectedTower && (!isLocked || spot.type === 'normal')) {
            let baseRange = selectedTower === 'consensus' ? 110 : 110;  // Fixed consensus tower range to match actual range
            let range = baseRange;
            
            if (spot.type === 'high') range *= 1.3;
            else if (spot.type === 'choke') range *= 1.15;
            
            noFill();
            stroke(255, 255, 255, 80);
            strokeWeight(2);
            ellipse(spot.x, spot.y, range * 2, range * 2);
            stroke(255, 255, 255, 40);
            strokeWeight(1);
            ellipse(spot.x, spot.y, range * 2 - 4, range * 2 - 4);
        }
        
        // Enhanced tooltip
        if (isHovered) {
            let tooltipX = mouseX + 10;
            let tooltipY = mouseY - 60;
            
            // Background with better styling
            fill(20, 22, 30, 230);
            stroke(60, 65, 80);
            strokeWeight(1);
            rect(tooltipX, tooltipY, 150, 50, 5);
            
            // Content
      noStroke();
            fill(255);
            textAlign(LEFT);
            textSize(12);
            if (isLocked) {
                text("Premium Location", tooltipX + 15, tooltipY + 20);
                fill(255, 165, 0);
                text("10M sats to unlock", tooltipX + 15, tooltipY + 40);
            } else {
                let bonusText = spot.type === 'high' ? ["Elevated Position", "+30% Range"] :
                               spot.type === 'power' ? ["Power Location", "+25% Damage"] :
                               spot.type === 'choke' ? ["Strategic Point", "+15% Range & Damage"] :
                               ["Basic Position", "Balanced Coverage"];
                text(bonusText[0], tooltipX + 15, tooltipY + 20);
                fill(this.spotType === 'high' ? color(100, 150, 255) :
                     this.spotType === 'power' ? color(255, 140, 0) :
                     this.spotType === 'choke' ? color(200, 180, 60) :
                     color(200, 200, 200));
                text(bonusText[1], tooltipX + 15, tooltipY + 40);
            }
        }
    }
  }
  
  // Start a new wave
  function startWave() {
    if (waveIndex < waves.length) {
      waveEnemies = waves[waveIndex].enemies.slice();
      waveInterval = waves[waveIndex].interval;
      waveStartTime = millis();
      waveTimer = 0;
      waveIndex++;
        
        // Spawn first enemy immediately
        if (waveEnemies.length > 0) {
            enemies.push(new Enemy(waveEnemies.shift()));
        }

        // Handle sat generation for Laser Eyes towers at wave start
        console.log('Wave starting - checking for Laser Eyes towers');
        towers.forEach(tower => {
            if (tower.type === 'backup' && tower.upgrade === 'B') {
                console.log('Found Laser Eyes tower with satGeneration:', tower.satGeneration);
                if (tower.satGeneration > 0) {
                    console.log('Adding sats to currency. Current:', currency);
                    currency += tower.satGeneration;
                    console.log('New currency:', currency);
                    createFloatingText(tower.position.x, tower.position.y, '+1M sats', color(0, 255, 0));
                    tower.satEffect = {
                        size: 0,
                        alpha: 255,
                        maxSize: 40
                    };
                }
            }
        });
    }
  }
  
  // Update wave progression
  function updateWave() {
    if (waveEnemies.length > 0 && millis() - waveStartTime >= waveTimer) {
        // Check if this is a boss wave (last enemy in wave is a boss)
        let isBossWave = waveEnemies.length === 1 && waveEnemies[0].special !== 'none';
        
        // Add 5 second delay for boss waves
        if (isBossWave && waveTimer === waveInterval) {
            waveTimer += 5000;  // Add 5 seconds
            return;
        }
        
      enemies.push(new Enemy(waveEnemies.shift()));
      waveTimer += waveInterval;
    } else if (waveEnemies.length === 0 && enemies.length === 0 && waveIndex > 0 && waveIndex <= waves.length) {
        // Wave completed, update high score
        highScore = Math.max(highScore, coldStorage);
    }
  }
  
  // Place a tower
  function placeTower(spot) {
    if (currency >= towerCosts[selectedTower]) {
      let canPlace = !towers.some(t => t.position.x === spot.x && t.position.y === spot.y);
      if (canPlace) {
            towers.push(new Tower(selectedTower, spot.x, spot.y, spot.type));
        currency -= towerCosts[selectedTower];
            selectedTower = null;
      }
    }
  }
  
  // Enemy class
  class Enemy {
    constructor(type) {
      this.type = type;
        this.pathIndex = type === 'fiat' || type === 'CBDC' || type === 'goldbug' ? 1 : 
                        type === 'deepState' ? enemies.filter(e => e.type === 'deepState').length % 2 :  // Alternate paths for deep state agents
                        Math.random() < 0.5 ? 0 : 1;
        this.position = { x: path[this.pathIndex][0].x, y: path[this.pathIndex][0].y };
      this.targetIndex = 1;
        
        // Boss types get special speeds
        this.speed = type === 'goldbug' ? 0.48 : // Doubled from 0.24
                     type === 'shitcoiner' ? 1.8 : 
                     type === 'nft' ? 0.7 : 
                     type === 'FUDster' ? 2.2 :
                     type === 'CBDC' ? 0.3 :
                     type === 'taxAgent' ? 0.5 :
                     type === 'ethUnicorn' ? 1.5 :
                     type === 'wrenchGang' ? 1.5 :  // Reduced from 2.5 to 1.5
                     type === 'xrpFudster' ? 2.0 :
                     type === 'dayTrader' ? 1.2 :
                     type === 'deepState' ? 0.8 :
                     type.includes('luxury') || type === 'yacht' || type === 'privateJet' || type === 'mansion' ? 0.75 :
                     0.42;  // Increased from 0.35 by 20%
        
        this.baseSpeed = this.speed;
        
        // Boss types get more health
        this.health = type === 'goldbug' ? 650 : // Twice CBDC health (300 * 2) + 50
                      type === 'shitcoiner' ? 35 : 
                      type === 'nft' ? 95 : 
                      type === 'FUDster' ? 45 :
                      type === 'CBDC' ? 300 :  // Increased from 250 by 20%
                      type === 'taxAgent' ? 600 :  // Added 50 HP
                      type === 'ethUnicorn' ? 700 :  // Added 50 HP
                      type === 'wrenchGang' ? 300 :  // Added 50 HP
                      type === 'xrpFudster' ? 600 :  // Added 50 HP
                      type === 'dayTrader' ? 400 :  // Added 50 HP
                      type === 'deepState' ? 550 :  // Added 50 HP
                      type.includes('luxury') || type === 'yacht' || type === 'privateJet' || type === 'mansion' ? 1100 :  // Added 50 HP
                      180;
        
        // Special abilities for bosses
        this.special = type === 'goldbug' ? 'superArmored' :
                      type === 'nft' ? 'resistant' : 
                      type === 'fiat' ? 'armored' :
                      type === 'CBDC' ? 'superArmored' :
                      type === 'FUDster' ? 'evasive' :
                      type === 'taxAgent' ? 'taxCollector' :
                      type === 'ethUnicorn' ? 'miningImmune' :
                      type === 'wrenchGang' ? 'plebImmune' :
                      type === 'xrpFudster' ? 'lightningImmune' :
                      type === 'dayTrader' ? 'gambler' :
                      type === 'deepState' ? 'towerFreezer' :
                      type.includes('luxury') || type === 'yacht' || type === 'privateJet' || type === 'mansion' ? 'untouchable' :
                      'none';
        
        this.angle = 0;
        this.frozen = false;
        this.frozenTimer = 0;
        this.lastSpecialTime = 0;  // For boss special ability timers
        
        // Special properties for bosses
        if (this.special === 'towerFreezer') {
            this.frozenTowers = new Set();  // Track which towers this boss has frozen
        }
        if (this.special === 'gambler') {
            this.gamblerMultiplier = Math.random() < 0.25 ? 2 : 0;  // 25% chance to double, 75% to lose all
        }
        
        // Add boss warning messages
        if (this.type === 'taxAgent') {
            currentBossWarning = {
                name: "Tax Agent Alert! 🏛️",
                power: "Will steal ALL your hot wallet sats!",
                joke: "Not your keys, now literally not your coins!",
                timer: 420  // 7 seconds at 60 FPS
            };
        } else if (this.type === 'ethUnicorn') {
            currentBossWarning = {
                name: "ETH Unicorn Incoming! 🦄",
                power: "Immune to mining towers",
                joke: "Proof of Prance > Proof of Work",
                timer: 420
            };
        } else if (this.type === 'wrenchGang') {
            currentBossWarning = {
                name: "$5 Wrench Gang Spotted! 🔧",
                power: "Ignores pleb towers",
                joke: "Should've kept your mouth shut about Bitcoin!",
                timer: 420
            };
        } else if (this.type === 'xrpFudster') {
            currentBossWarning = {
                name: "XRP FUDster Approaching! 📉",
                power: "Immune to lightning & slowing",
                joke: "But ser, it's definitely not centralized!",
                timer: 420
            };
        } else if (this.type === 'dayTrader') {
            currentBossWarning = {
                name: "Day Trader Temptation! 📊",
                power: "75% chance to steal all, 25% to double",
                joke: "Trust me bro, this 100x leverage can't go wrong!",
                timer: 420
            };
        } else if (this.type === 'deepState') {
            currentBossWarning = {
                name: "Deep State Agents! 🕴️",
                power: "Can freeze your towers",
                joke: "We're from the government and we're here to help!",
                timer: 420
            };
        } else if (this.type.includes('luxury')) {
            currentBossWarning = {
                name: "Lifestyle Inflation Attack! 💸",
                power: "Immune to all towers",
                joke: "But don't you want to live a little?",
                timer: 420
            };
        }
    }
    
    move() {
        // Handle freeze effect
        if (this.frozen && this.special !== 'lightningImmune' && this.type !== 'FUDster') {  // XRP FUDster and regular FUDster can't be slowed
            if (this.frozenTimer > 0) {
                this.frozenTimer--;
                this.speed = this.baseSpeed * 0.2;  // 80% slower when frozen
            } else {
                this.frozen = false;
                this.speed = this.baseSpeed;
            }
        }
        
        // Process drain effect from Pleb tower
        if (this.drainEffect && this.drainEffect.remainingDamage > 0) {
            let damageThisFrame = Math.min(this.drainEffect.drainRate, this.drainEffect.remainingDamage);
            this.health -= damageThisFrame;
            this.drainEffect.remainingDamage -= damageThisFrame;
            
            // Remove all floating text creation
            
            if (this.health <= 0) {
                enemies.splice(enemies.indexOf(this), 1);
                currency += this.type === 'hacker' ? 12000000 : 
                          this.type === 'malware' ? 20000000 : 
                          35000000;
            }
        }
        
        // Handle boss special abilities
        if (this.special === 'towerFreezer' && millis() - this.lastSpecialTime > 5000) {  // Every 5 seconds
            this.lastSpecialTime = millis();
            // Find a random active tower to freeze
            let availableTowers = towers.filter(t => !this.frozenTowers.has(t));
            if (availableTowers.length > 0) {
                let tower = availableTowers[Math.floor(Math.random() * availableTowers.length)];
                this.frozenTowers.add(tower);
                tower.frozen = true;
                tower.frozenTimer = 300;  // Freeze for 5 seconds (assuming 60 FPS)
            }
        }
        
        let currentPath = path[this.pathIndex];
        let target = currentPath[this.targetIndex];
      let dx = target.x - this.position.x;
      let dy = target.y - this.position.y;
      let distance = sqrt(dx * dx + dy * dy);
        
      if (distance < this.speed) {
        this.position = { x: target.x, y: target.y };
        this.targetIndex++;
            if (this.targetIndex >= currentPath.length) {
                // Special end-of-path effects for bosses
                if (this.special === 'taxCollector') {
                    currency = 0;  // Tax agent takes all your hot wallet
                } else if (this.special === 'gambler') {
                    if (this.gamblerMultiplier === 2) {
                        currency *= 2;  // Double your money
                        createFloatingText(this.position.x, this.position.y, "2x Money!", color(0, 255, 0));
                    } else {
                        currency = 0;  // Lose everything
                        createFloatingText(this.position.x, this.position.y, "Rekt!", color(255, 0, 0));
                    }
                }
          lives--;
                let penalty = Math.floor(currency * 0.1);
                currency = Math.max(0, currency - penalty);
                createSatLossEffect(this.position.x, this.position.y, penalty);
          enemies.splice(enemies.indexOf(this), 1);
        }
      } else {
        this.position.x += (dx / distance) * this.speed;
        this.position.y += (dy / distance) * this.speed;
      }
    }
    
    draw() {
      push();
      translate(this.position.x, this.position.y);
        
        // Draw freeze effect if frozen
        if (this.frozen) {
            // Ice crystal background
            noStroke();
            for (let i = 0; i < 8; i++) {
                let angle = i * PI/4;
                fill(200, 240, 255, 150);
                push();
                rotate(angle);
                triangle(0, -20, -5, -30, 5, -30);
                pop();
            }
            
            // Frost overlay
            fill(200, 240, 255, 100);
            ellipse(0, 0, 40, 40);
        }
        
        // Enhanced health bar with better visibility
        let healthBarWidth = 40;
        let healthBarHeight = 6;
        let maxHealth = this.type === 'shitcoiner' ? 35 : 
                       this.type === 'nft' ? 95 : 
                       this.type === 'FUDster' ? 45 :
                       this.type === 'CBDC' ? 300 :  // Increased from 250 by 20%
                       this.type === 'taxAgent' ? 500 :  // Increased from 400 to 500 (25% more)
                       180;
        let healthPercent = this.health / maxHealth;
        
        // Health bar background with border
        stroke(0);
        strokeWeight(2);
        fill(40, 0, 0);
        rect(-healthBarWidth/2, -40, healthBarWidth, healthBarHeight, 2);
        
        // Health bar fill with gradient effect
        noStroke();
        fill(lerpColor(color(255, 0, 0), color(0, 255, 0), healthPercent));
        rect(-healthBarWidth/2 + 1, -39, (healthBarWidth - 2) * healthPercent, healthBarHeight - 2, 1);
        
        // Draw enemy based on type
        if (this.type === 'CBDC') {
            // CBDC enemy - Digital prison with surveillance elements
            noStroke();
            // Base shape - digital prison
            fill(75, 0, 130);  // Dark purple for dystopian feel
            rect(-20, -20, 40, 40, 5);
            
            // Surveillance eye
            fill(255, 0, 0);
            ellipse(0, 0, 20, 20);
        fill(0);
            ellipse(0, 0, 10, 10);
            
            // Digital chains
            stroke(100, 0, 170);
            strokeWeight(3);
            for(let i = 0; i < 4; i++) {
                let angle = frameCount * 0.1 + i * PI/2;
                line(cos(angle) * 25, sin(angle) * 25,
                     cos(angle + PI/4) * 25, sin(angle + PI/4) * 25);
            }
            
            // "CBDC" text
            noStroke();
        fill(255);
            textSize(10);
            textAlign(CENTER);
            text("CBDC", 0, 5);
            
        } else if (this.type === 'FUDster') {
            // FUDster enemy - Chaotic Twitter/social media troll
            noStroke();
            // Base shape - bird silhouette (Twitter/X reference)
            fill(0, 120, 255);
            beginShape();
            vertex(-15, 0);
            vertex(-5, -15);
            vertex(5, -15);
            vertex(15, 0);
            vertex(5, 15);
            vertex(-5, 15);
            endShape(CLOSE);
            
            // Chaos effect
            stroke(255);
            strokeWeight(1);
            for(let i = 0; i < 3; i++) {
                let angle = frameCount * 0.2 + i * TWO_PI/3;
                line(0, 0, 
                     cos(angle) * 20 * sin(frameCount * 0.1), 
                     sin(angle) * 20 * sin(frameCount * 0.1));
            }
            
            // "FUD" text
            noStroke();
            fill(255);
            textSize(10);
            textAlign(CENTER);
            text("FUD", 0, 5);
            
        } else if (this.type === 'shitcoiner') {
            // Shitcoiner/NFT bro - Ape with laser eyes mockery
            fill(101, 67, 33);  // Brown
            noStroke();
            ellipse(0, 0, 30, 30);  // Head
            
            // Ape features
            fill(70, 45, 20);
            ellipse(-8, -5, 10, 12);  // Left ear
            ellipse(8, -5, 10, 12);   // Right ear
            
            // Mocking laser eyes (glitching/broken)
            stroke(255, 0, 0);
            strokeWeight(2);
            let glitch = sin(frameCount * 0.5) * 2;
            line(-8, -2, -3, 2 + glitch);  // Left eye
            line(8, -2, 3, 2 + glitch);    // Right eye
            
            // "NGMI" text
            noStroke();
            fill(255);
            textSize(8);
            textAlign(CENTER);
            text("NGMI", 0, 5);
            
      } else if (this.type === 'nft') {
            // Ordinal/BRC-20 Spammer
            noStroke();
            fill(138, 43, 226);  // Purple for "rich" jpeg
            rect(-15, -15, 30, 30, 5);  // Base "jpeg" shape
            
            // Spam pattern
            stroke(255);
            strokeWeight(1);
            for(let i = 0; i < 3; i++) {
                line(-10 + i*10, -10, -10 + i*10, 10);
                line(-10, -10 + i*10, 10, -10 + i*10);
            }
            
            // "JPEG" text
            noStroke();
            fill(255);
            textSize(8);
            textAlign(CENTER);
            text("JPEG", 0, 0);
            
        } else if (this.type === 'fiat') {
            // Goldbug/Nocoiner
            stroke(212, 175, 55);  // Gold color
            strokeWeight(2);
            fill(255, 215, 0);
            
            // Rotating gold circle
            let rotationTime = frameCount * 0.1;
            beginShape();
            for(let i = 0; i < 12; i++) {
                let angle = rotationTime + (i * TWO_PI / 12);
                let r = i % 2 === 0 ? 20 : 15;
                vertex(cos(angle) * r, sin(angle) * r);
            }
            endShape(CLOSE);
            
            // "$" symbol
            noStroke();
            fill(0);
            textSize(16);
            textAlign(CENTER);
            text("$", 0, 5);
            
            // "FIAT" text
            textSize(8);
            text("FIAT", 0, -8);
        } else if (this.type === 'taxAgent') {
            // Tax Agent Boss
            noStroke();
            fill(34, 139, 34);  // Forest Green
            rect(-25, -25, 50, 50, 8);  // Larger base for boss
            
            // IRS Badge
            stroke(255);
            strokeWeight(2);
            fill(212, 175, 55);
            beginShape();
            for(let i = 0; i < 5; i++) {
                let angle = frameCount * 0.05 + (i * TWO_PI / 5);
                vertex(cos(angle) * 15, sin(angle) * 15);
            }
            endShape(CLOSE);
            
            // "TAX" text
            noStroke();
            fill(255);
            textSize(12);
            textAlign(CENTER);
            text("TAX", 0, 5);
            
        } else if (this.type === 'ethUnicorn') {
            // Ethereum Unicorn Boss - Pixelated Unicorn Piñata
            noStroke();
            
            // Pixelated body segments
            let pixels = [
                {x: 0, y: 0, w: 8, h: 8, c: color(238, 174, 238)},    // Light purple body
                {x: 8, y: -4, w: 8, h: 8, c: color(255, 182, 193)},   // Pink body
                {x: -8, y: 4, w: 8, h: 8, c: color(221, 160, 221)},   // Purple body
                {x: -4, y: -8, w: 8, h: 8, c: color(255, 192, 203)}   // Pink body
            ];
            
            // Draw pixel body
            pixels.forEach(p => {
                fill(p.c);
                rect(p.x, p.y, p.w, p.h);
            });
            
            // Rainbow mane - animated
            for(let i = 0; i < 6; i++) {
                let rainbowColors = [
                    color(255, 0, 0),   // Red
                    color(255, 165, 0), // Orange
                    color(255, 255, 0), // Yellow
                    color(0, 255, 0),   // Green
                    color(0, 0, 255),   // Blue
                    color(238, 130, 238) // Violet
                ];
                
                fill(rainbowColors[i]);
                let offset = sin(frameCount * 0.1 + i) * 3;
                rect(-15 + i*5, -20 + offset, 5, 10);
            }
            
            // Pixelated horn
            stroke(255, 215, 0);  // Gold
            strokeWeight(2);
            for(let i = 0; i < 4; i++) {
                point(0, -15 - i*3);
                point(-1 - i, -15 - i*3);
                point(1 + i, -15 - i*3);
            }
            
            // ETH symbol with sparkle
            noStroke();
            fill(255);
            textSize(14);
            text("Ξ", 0, 5);
            
            // Sparkle effects
            let sparkleTime = frameCount * 0.2;
            for(let i = 0; i < 4; i++) {
                let angle = sparkleTime + i * PI/2;
                fill(255, 255, 255, 150 + sin(sparkleTime) * 100);
                let x = cos(angle) * 20;
                let y = sin(angle) * 20;
                star(x, y, 3, 6, 4);
            }
            
        } else if (this.type === 'wrenchGang') {
            // $5 Wrench Gang Boss - Hooded Figures
            let figureCount = 3;
            for(let i = 0; i < figureCount; i++) {
                let offset = (i - 1) * 15;
                
                // Hood and body
                fill(40);  // Dark gray
                noStroke();
                
                // Animated running motion
                let bobY = sin(frameCount * 0.2 + i) * 3;
                
                // Hood
                beginShape();
                vertex(-8 + offset, -15 + bobY);
                vertex(8 + offset, -15 + bobY);
                vertex(12 + offset, 0 + bobY);
                vertex(-12 + offset, 0 + bobY);
                endShape(CLOSE);
                
                // Body
                rect(-6 + offset, 0 + bobY, 12, 15);
                
                // Glowing red eyes
                fill(255, 0, 0, 150 + sin(frameCount * 0.1) * 50);
                ellipse(-2 + offset, -8 + bobY, 3, 3);
                ellipse(2 + offset, -8 + bobY, 3, 3);
                
                // Wrench
                stroke(200);
                strokeWeight(2);
                line(-10 + offset, 5 + bobY, 10 + offset, 5 + bobY);
            }
            
        } else if (this.type === 'xrpFudster') {
            // XRP FUDster Boss
            noStroke();
            fill(0, 150, 136);  // Teal
            
            // Ripple logo shape
            for(let i = 0; i < 3; i++) {
                let angle = frameCount * 0.1 + (i * TWO_PI / 3);
                ellipse(cos(angle) * 15, sin(angle) * 15, 20, 20);
            }
            
            // "XRP" text
            fill(255);
            textSize(12);
            text("XRP", 0, 5);
            
        } else if (this.type === 'dayTrader') {
            // Day Trading Temptation Boss - Green and Red Bars
            noStroke();
            fill(255, 215, 0);  // Gold base
            ellipse(0, 0, 35, 35);
            
            // Candlestick chart pattern with green and red bars
            strokeWeight(3);
            for(let i = -2; i <= 2; i++) {
                let height = sin(frameCount * 0.1 + i) * 15;
                let isGreen = height > 0;
                
                // Vertical bar
                stroke(isGreen ? color(0, 255, 0) : color(255, 0, 0));
                line(i * 8, 0, i * 8, height);
                
                // Horizontal caps
                let width = 6;
                line(i * 8 - width/2, height, i * 8 + width/2, height);
                line(i * 8 - width/2, 0, i * 8 + width/2, 0);
            }
            
            // "TRADE" text with flashing effect
            noStroke();
            fill(0);
            textSize(10);
            text("TRADE", 0, 5);
            
            // Pulsing glow effect
            let glowIntensity = sin(frameCount * 0.1) * 50 + 150;
            drawingContext.shadowBlur = 10;
            drawingContext.shadowColor = `rgba(255, 215, 0, ${glowIntensity/255})`;
            
            // Reset shadow
            drawingContext.shadowBlur = 0;
        } else if (this.type === 'deepState') {
            // Government Deep State Agents Boss
            
            // Glowing effect
            drawingContext.shadowBlur = 15;
            drawingContext.shadowColor = 'rgba(255, 0, 0, 0.5)';
            
            // Dark suit
            noStroke();
            fill(20, 20, 20, 200);  // More opaque black
            
            // Shadowy shape with suit details
            beginShape();
            for(let i = 0; i < 12; i++) {
                let angle = frameCount * 0.03 + (i * TWO_PI / 12);
                let r = 22 + sin(angle * 3) * 4;
                vertex(cos(angle) * r, sin(angle) * r);
            }
            endShape(CLOSE);
            
            // Suit details
            stroke(40, 40, 40);
            strokeWeight(2);
            line(-10, 0, 10, 0);  // Tie
            
            // Glowing red eyes
            noStroke();
            fill(255, 0, 0);
            let eyeOffset = sin(frameCount * 0.1) * 2;
            ellipse(-8, -5 + eyeOffset, 4, 4);
            ellipse(8, -5 + eyeOffset, 4, 4);
            
            // Eye glow
            fill(255, 0, 0, 50);
            ellipse(-8, -5 + eyeOffset, 6, 6);
            ellipse(8, -5 + eyeOffset, 6, 6);
            
            // Illuminati symbol
            stroke(255, 215, 0);  // Gold
            strokeWeight(1.5);
            noFill();
            triangle(-12, -3, 12, -3, 0, 12);
            
            // All-seeing eye
            fill(255);
            noStroke();
            ellipse(0, 2, 6, 6);
            fill(0);
            ellipse(0, 2, 3, 3);
            
            // Mysterious aura
            noFill();
            stroke(100, 0, 0, 100);
            strokeWeight(1);
            for(let i = 0; i < 3; i++) {
                let size = 30 + i * 10;
                let offset = sin(frameCount * 0.05 + i) * 5;
                beginShape();
                for(let angle = 0; angle < TWO_PI; angle += 0.5) {
                    let r = size + sin(angle * 6 + frameCount * 0.1) * 3;
                    let x = cos(angle) * r + offset;
                    let y = sin(angle) * r;
                    vertex(x, y);
                }
                endShape(CLOSE);
            }
            
            // Reset shadow
            drawingContext.shadowBlur = 0;
        } else if (this.type.includes('luxury') || this.type === 'yacht' || this.type === 'privateJet' || this.type === 'mansion') {
            // Lifestyle Inflation Boss - Enhanced visuals
            noStroke();
            
            if (this.type === 'yacht') {
                // Luxury Yacht
                // Hull - more detailed shape
                fill(240, 240, 240);  // White
                beginShape();
                vertex(-30, 5);
                vertex(30, 5);
                vertex(25, -5);
                vertex(-25, -5);
                endShape(CLOSE);
                
                // Deck
                fill(220, 220, 220);
                beginShape();
                vertex(-25, -5);
                vertex(25, -5);
                vertex(20, -15);
                vertex(-20, -15);
                endShape(CLOSE);
                
                // Main cabin
                fill(200, 200, 200);
                rect(-15, -15, 30, 15, 2);
                
                // Upper deck
                fill(180, 180, 180);
                rect(-10, -30, 20, 15, 2);
                
                // Windows
                fill(150, 200, 255);
                for(let i = -2; i <= 2; i++) {
                    let x = i * 8;
                    rect(x - 3, -12, 6, 8, 1);
                }
                
                // Upper deck windows
                for(let i = -1; i <= 1; i++) {
                    let x = i * 8;
                    rect(x - 2, -28, 4, 6, 1);
                }
                
                // Main mast
                fill(160, 120, 100);  // Wooden color
                rect(-2, -30, 4, 40);
                
                // Main sail
                fill(255);
                beginShape();
                vertex(0, -30);
                vertex(0, -45);
                vertex(15, -30);
                endShape(CLOSE);
                
                // Secondary sail
                fill(255, 250, 240);
                beginShape();
                vertex(-10, -30);
                vertex(-10, -40);
                vertex(0, -30);
                endShape(CLOSE);
                
                // Water reflection with more detail
                noFill();
                stroke(100, 200, 255, 100);
                strokeWeight(1);
                for(let i = 0; i < 4; i++) {
                    let y = 10 + i * 3;
                    beginShape();
                    for(let x = -30; x <= 30; x += 5) {
                        vertex(x, y + sin(frameCount * 0.1 + x * 0.2) * 2);
                    }
                    endShape();
                }
                
                // Luxury details
                // Railing
                stroke(180, 180, 180);
                strokeWeight(2);
                line(-25, -5, 25, -5);
                
                // Deck lines
                stroke(160, 160, 160);
                strokeWeight(1);
                for(let i = -2; i <= 2; i++) {
                    let x = i * 10;
                    line(x - 5, -5, x + 5, -5);
                }
                
                // Anchor
                fill(100, 100, 100);
                noStroke();
                beginShape();
                vertex(-25, 5);
                vertex(-20, 5);
                vertex(-22, 8);
                vertex(-23, 8);
                endShape(CLOSE);
                
                // Luxury trim
                stroke(255, 215, 0);  // Gold
                strokeWeight(1);
                line(-25, -5, 25, -5);
                line(-20, -15, 20, -15);
                
                // Name plate
                fill(255, 215, 0);
                noStroke();
                textSize(8);
                textAlign(CENTER);
                text("SATOSHI", 0, -35);
            } else if (this.type === 'privateJet') {
                // Luxury Private Jet
                // Main body
                fill(220, 220, 220);
                beginShape();
                vertex(-30, 0);
                vertex(30, 0);
                vertex(20, -10);
                vertex(-15, -10);
                endShape(CLOSE);
                
                // Windows
                fill(150, 200, 255);
                for(let i = -10; i <= 10; i += 7) {
                    ellipse(i, -5, 5, 3);
                }
                
                // Wings
                fill(200, 200, 200);
                beginShape();  // Main wing
                vertex(-5, -5);
                vertex(-25, 10);
                vertex(25, 10);
                vertex(5, -5);
                endShape(CLOSE);
                
                // Tail
                fill(180, 180, 180);
                triangle(15, -10, 25, -25, 25, -10);
                
                // Jet streams
                noFill();
                stroke(200, 200, 255, 150);
                strokeWeight(2);
                for(let i = -1; i <= 1; i += 1) {
                    let y = i * 5;
                    beginShape();
                    for(let x = -40; x <= -30; x += 2) {
                        vertex(x, y + sin(frameCount * 0.2 + x * 0.3) * 2);
                    }
                    endShape();
                }
                
            } else if (this.type === 'mansion') {
                // Luxury Mansion
                // Main building
                fill(235, 225, 215);  // Cream color
                rect(-25, -20, 50, 40, 2);
                
                // Roof
                fill(160, 120, 100);  // Terra cotta
                beginShape();
                vertex(-30, -20);
                vertex(0, -45);
                vertex(30, -20);
                endShape(CLOSE);
                
                // Windows
                fill(180, 200, 255);
                for(let row = 0; row < 2; row++) {
                    for(let col = 0; col < 3; col++) {
                        let x = -15 + col * 15;
                        let y = -10 + row * 15;
                        rect(x, y, 10, 12, 2);
                        // Window frame
                        stroke(160, 120, 100);
                        strokeWeight(1);
                        line(x + 5, y, x + 5, y + 12);
                        line(x, y + 6, x + 10, y + 6);
                    }
                }
                
                // Door
                fill(140, 100, 80);
                rect(-5, 5, 10, 15, 2);
                // Door handle
                fill(255, 215, 0);
                noStroke();
                ellipse(2, 12, 2, 2);
                
                // Luxury garden elements
                stroke(0, 150, 0);
                strokeWeight(1);
                for(let i = -20; i <= 20; i += 10) {
                    beginShape();
                    for(let y = 0; y < 5; y++) {
                        let x = i + sin(frameCount * 0.1 + y) * 2;
                        vertex(x, 15 + y);
                    }
                    endShape();
                }
                
            } else if (this.type === 'luxuryCar') {
                // Luxury Sports Car
                // Main body
                fill(255, 0, 0);  // Ferrari red
                beginShape();
                vertex(-30, 0);
                vertex(30, 0);
                vertex(25, -10);
                vertex(15, -15);
                vertex(-15, -15);
                vertex(-25, -10);
                endShape(CLOSE);
                
                // Windshield
                fill(150, 200, 255);
                beginShape();
                vertex(-12, -15);
                vertex(12, -15);
                vertex(8, -20);
                vertex(-8, -20);
                endShape(CLOSE);
                
                // Wheels
                fill(20);
                ellipse(-15, 0, 12, 12);
                ellipse(15, 0, 12, 12);
                // Wheel rims
                fill(200);
                ellipse(-15, 0, 6, 6);
                ellipse(15, 0, 6, 6);
                
                // Headlights
                fill(255, 255, 200);
                ellipse(-23, -8, 5, 3);
                ellipse(23, -8, 5, 3);
                
                // Ground reflection
                noFill();
                stroke(100, 100, 100, 50);
                strokeWeight(1);
                ellipse(-15, 5, 20, 3);
                ellipse(15, 5, 20, 3);
            }
            
            // Luxury sparkle effects
            noFill();
            stroke(255, 215, 0);  // Gold
            strokeWeight(1);
            for(let i = 0; i < 4; i++) {
                let angle = frameCount * 0.1 + (i * PI/2);
                let x = cos(angle) * 30;
                let y = sin(angle) * 30;
                push();
                translate(x, y);
                rotate(angle);
                // Draw a fancy sparkle
                line(-3, 0, 3, 0);
                line(0, -3, 0, 3);
                point(0, 0);
                pop();
            }
            
            // Money symbol effects
            noStroke();
            fill(50, 205, 50, 150);  // Semi-transparent green
            textSize(10);
            for(let i = 0; i < 2; i++) {
                let angle = frameCount * 0.1 + i * PI;
                let x = cos(angle) * 20;
                let y = sin(angle) * 20;
                text("$", x, y);
            }
        }
        
        if (this.type === 'goldbug') {
            // Gold brick stack effect
            noStroke();
            
            // Shadow effect
            drawingContext.shadowBlur = 10;
            drawingContext.shadowColor = 'rgba(255, 215, 0, 0.5)';
            
            // Stack of gold bricks
            for (let row = 0; row < 3; row++) {
                for (let col = 0; col < 2; col++) {
                    // Gold gradient effect
                    let gradient = drawingContext.createLinearGradient(-15 + col * 15, -15 + row * 10, 0 + col * 15, -5 + row * 10);
                    gradient.addColorStop(0, '#FFD700');    // Gold
                    gradient.addColorStop(0.5, '#FFF8DC');  // Light gold highlight
                    gradient.addColorStop(1, '#DAA520');    // Darker gold
                    drawingContext.fillStyle = gradient;
                    
                    // Brick with 3D effect
                    beginShape();
                    vertex(-15 + col * 15, -15 + row * 10);
                    vertex(0 + col * 15, -15 + row * 10);
                    vertex(0 + col * 15, -5 + row * 10);
                    vertex(-15 + col * 15, -5 + row * 10);
                    endShape(CLOSE);
                    
                    // Brick edges
                    stroke(139, 69, 19, 100);
                    strokeWeight(1);
                    line(-15 + col * 15, -15 + row * 10, 0 + col * 15, -15 + row * 10);
                    line(0 + col * 15, -15 + row * 10, 0 + col * 15, -5 + row * 10);
                }
            }
            
            // Shine effects
            noStroke();
            for (let i = 0; i < 3; i++) {
                let angle = frameCount * 0.1 + i * TWO_PI / 3;
                fill(255, 255, 200, 150 + sin(frameCount * 0.1) * 50);
                let x = cos(angle) * 15;
                let y = sin(angle) * 15;
                ellipse(x, y, 4, 4);
            }
            
            // "$" symbol
            textAlign(CENTER, CENTER);
            textSize(16);
            fill(139, 69, 19);  // Dark gold
            text("$", 0, 0);
            
            // Reset shadow
            drawingContext.shadowBlur = 0;
        }
      pop();
    }
  }
  
  // Tower class
  class Tower {
    constructor(type, x, y, spotType) {
      this.type = type;
      this.position = { x, y };
      this.spotType = spotType;
      this.level = 1;
      this.upgrade = null;
      this.lastAttack = millis();  // Initialize to current time
      this.frozen = false;
      this.frozenTimer = 0;
      this.totalDamage = 0;
      this.laserBeam = false;
      this.satGeneration = 0;
      this.lastSatGen = 0;
        // ... rest of the constructor code ...
        
        // Base stats modified by spot type
        let baseRange = type === 'backup' ? 100 : 110;
        let baseDamage = type === 'encryption' ? 18 : // Increased from 12 to 18
                        type === 'verification' ? 28 : 
                        type === 'consensus' ? 5 : 
                        15; // Increased from 10 to 15 for backup/pleb
        
        // Apply spot type bonuses
        if (spotType === 'high') {
            this.range = baseRange * 1.3;
            this.damage = baseDamage;
        } else if (spotType === 'power') {
            this.range = baseRange;
            this.damage = baseDamage * 1.25;
        } else if (spotType === 'choke') {
            this.range = baseRange * 1.15;
            this.damage = baseDamage * 1.15;
        } else {
            this.range = baseRange;
            this.damage = baseDamage;
        }
        
        this.attackSpeed = type === 'encryption' ? 1.3 : // Increased from 1.1 to 1.3
                          type === 'verification' ? 0.5 : 
                          type === 'consensus' ? 1.2 : 
                          type === 'backup' ? 0.125 :
                          1.0;
        
        // Initialize lastAttack to allow immediate first attack for all towers
        this.lastAttack = 0;  // This ensures the first check will always pass
        this.satGeneration = 0;
        this.lastSatGen = 0;
        this.satEffect = null;   // Initialize satEffect
    }

    getUpgradeCost() {
        return Math.floor(towerCosts[this.type] * 0.75);  // 75% of base tower cost
    }

    getUpgradeOptions() {
        const upgrades = {
            'encryption': {
                'A': { name: 'Zero Knowledge', desc: 'Chain verification: affects 3 nearby enemies with decreasing damage (70% per chain). Faster firing rate.' },
                'B': { name: 'Multi-Sig', desc: 'Split into multiple projectiles' }
            },
            'verification': {
                'A': { name: 'Hash Power', desc: '+100% damage, -50% speed' },
                'B': { name: 'ASIC Boost', desc: '+50% speed, +25% damage' }
            },
            'consensus': {
                'A': { name: 'Channel Factory', desc: 'Hit 5 targets' },
                'B': { name: 'HTLCs', desc: 'Slow affected enemies' }
            },
            'backup': {
                'A': { name: 'Meme Lord', desc: 'Larger explosions, can freeze' },
                'B': { name: 'Laser Eyes', desc: 'Powerful melting beam' }
            }
        };
        return upgrades[this.type];
    }

    applyUpgrade(path) {
        this.upgrade = path;
        
        // Apply upgrade effects
        if (this.type === 'encryption') {
            if (path === 'A') {
                this.chainVerification = true;  // New chain verification system
                this.chainRadius = 100;  // Radius for chain effect
                this.maxChainLength = 3;  // Maximum chain length
                this.chainDamageMultiplier = 0.7;  // Each chain reduces damage by 30%
                this.attackSpeed *= 1.5;  // Increase attack speed by 50%
            } else {
                this.multiShot = true;
            }
        } else if (this.type === 'verification') {
            if (path === 'A') {
                this.damage *= 2;
                this.attackSpeed *= 0.5;
            } else {
                this.attackSpeed *= 1.5;
                this.damage *= 1.25;
            }
        } else if (this.type === 'consensus') {
            if (path === 'A') {
                this.maxTargets = 5;
            } else {
                this.slowEffect = true;
            }
        } else if (this.type === 'backup') {
            if (path === 'A') {
                this.explosionSize = 1.5;  // 50% larger explosions
                this.freezeChance = 0.3;   // 30% chance to freeze
            } else {
                this.laserBeam = true;     // Enable laser beam attack
                this.damage *= 2;          // Double damage for laser
                this.satGeneration = 1000000;  // 1M sats
                console.log('Laser Eyes upgrade applied - satGeneration set to:', this.satGeneration);
            }
        }
    }

    attack() {
      if (millis() - this.lastAttack < 1000 / this.attackSpeed) return;
        
        // Skip attack if tower is frozen by deep state agent
        if (this.frozen) {
            if (this.frozenTimer > 0) {
                this.frozenTimer--;
                return;
            } else {
                this.frozen = false;
            }
        }
        
        // Remove the sat generation check from here since it's handled in startWave()
        
        if (this.type === 'consensus') {
            let maxTargets = this.upgrade === 'A' ? 5 : 3;
            let targetsInRange = enemies.filter(enemy => 
                dist(this.position.x, this.position.y, enemy.position.x, enemy.position.y) < this.range &&
                enemy.special !== 'lightningImmune'  // XRP FUDster is immune to lightning
            ).slice(0, maxTargets);

            if (targetsInRange.length === 0) return;  // No valid targets in range

            // Create lightning projectiles for each target
            targetsInRange.forEach((enemy, index) => {
                let actualDamage = this.damage;
                if (enemy.special === 'resistant') actualDamage *= 0.7;
                if (enemy.special === 'armored') actualDamage *= 0.5;
                if (enemy.special === 'untouchable') actualDamage = 0;  // Lifestyle inflation is immune
                
                // Create a lightning projectile for visual effect
                projectiles.push(new Projectile(
                    this.position.x,
                    this.position.y,
                    enemy,
                    actualDamage,
                    this.type,
                    this.upgrade
                ));
                
                enemy.health -= actualDamage;
                this.totalDamage += actualDamage;
                
                // Apply slow effect if HTLCs upgrade
                if (this.upgrade === 'B' && enemy.special !== 'lightningImmune') {
                    enemy.frozen = true;
                    enemy.frozenTimer = 20;  // Freeze for 20 frames (reduced from 30)
          }
        });
        this.lastAttack = millis();
            return;  // Return after handling consensus tower
        }

        // Handle other tower types
        let targetFound = false;
        let targetEnemy = null;
        
        for (let enemy of enemies) {
            let d = dist(this.position.x, this.position.y, enemy.position.x, enemy.position.y);
            // Check immunities
            if (d < this.range && 
                !(this.type === 'verification' && enemy.special === 'miningImmune') && // Ethereum Unicorn immune to mining
                !(this.type === 'backup' && enemy.special === 'plebImmune') && // Wrench Gang immune to pleb
                !(enemy.special === 'untouchable')) { // Lifestyle inflation immune to all
                targetFound = true;
                targetEnemy = enemy;
            break;
          }
        }
        
        if (!targetFound) return;  // No valid target in range
        
        if (this.type === 'backup') {
            if (this.upgrade === 'B' && this.laserBeam) {
                // Laser beam attack
                let angle = atan2(targetEnemy.position.y - this.position.y, 
                                targetEnemy.position.x - this.position.x);
                projectiles.push(new Projectile(
                    this.position.x,
                    this.position.y,
                    targetEnemy,
                    this.damage,
                    this.type,
                    this.upgrade,
                    angle
                ));
            } else {
                // Orange pill/meme attack
                let actualDamage = this.damage;
                // Apply resistance for regular enemies
                if (targetEnemy.special === 'none') {
                    actualDamage *= 0.3;  // Regular enemies take 30% damage from Pleb tower
                }
                projectiles.push(new Projectile(
                    this.position.x,
                    this.position.y,
                    targetEnemy,
                    actualDamage,
                    this.type,
                    this.upgrade
                ));
            }
        } else if (this.type === 'encryption' || this.type === 'verification') {
            let actualDamage = this.damage;
            
            if (this.type === 'verification' && targetEnemy.type === '51%') actualDamage *= 1.5;
            if (this.type === 'encryption' && targetEnemy.type === 'hacker') actualDamage *= 1.3;
            if (targetEnemy.special === 'untouchable') actualDamage = 0;  // Lifestyle inflation is immune
            
            if (this.type === 'encryption' && this.upgrade === 'A') {
                // Chain verification system
                let chainTargets = enemies.filter(enemy => 
                    dist(targetEnemy.position.x, targetEnemy.position.y, enemy.position.x, enemy.position.y) < this.chainRadius &&
                    enemy !== targetEnemy &&
                    enemy.special !== 'untouchable'
                ).slice(0, this.maxChainLength - 1);  // -1 because main target counts as first in chain
                
                // Create chain projectiles with proper damage reduction
                let chainDamage = actualDamage * this.chainDamageMultiplier;  // Start with reduced damage for main target
                projectiles.push(new Projectile(
                    this.position.x,
                    this.position.y,
                    targetEnemy,
                    chainDamage,
                    this.type,
                    this.upgrade
                ));
                
                // Create chain links to nearby enemies with further reduced damage
                chainTargets.forEach((enemy, index) => {
                    chainDamage *= this.chainDamageMultiplier;
                    projectiles.push(new Projectile(
                        this.position.x,
                        this.position.y,
                        enemy,
                        chainDamage,
                        this.type,
                        this.upgrade
                    ));
                });
            } else if (this.type === 'encryption' && this.upgrade === 'B') {
                // Multi-Sig: Create three separate projectiles with spread
                let spreadAngle = PI / 6;
                let baseAngle = atan2(targetEnemy.position.y - this.position.y, 
                                    targetEnemy.position.x - this.position.x);
                
                [-spreadAngle, 0, spreadAngle].forEach(angleOffset => {
                    projectiles.push(new Projectile(
                        this.position.x,
                        this.position.y,
                        targetEnemy,
                        actualDamage * 0.5,
                        this.type,
                        this.upgrade,
                        baseAngle + angleOffset
                    ));
                });
            } else {
                projectiles.push(new Projectile(
                    this.position.x,
                    this.position.y,
                    targetEnemy,
                    actualDamage,
                    this.type,
                    this.upgrade
                ));
            }
        }
        this.lastAttack = millis();
    }

    draw() {
      push();
      translate(this.position.x, this.position.y);
        
        // Show range circle on hover if not in upgrade selection
        if (dist(mouseX, mouseY, this.position.x, this.position.y) < 20 && !selectedTowerForUpgrade) {
            noFill();
            stroke(255, 255, 255, 80);
            strokeWeight(2);
            ellipse(0, 0, this.range * 2, this.range * 2);
            stroke(255, 255, 255, 40);
            strokeWeight(1);
            ellipse(0, 0, this.range * 2 - 4, this.range * 2 - 4);
        }

        // Draw frozen effect if tower is frozen
        if (this.frozen) {
            // Ice crystal background
            noStroke();
            for (let i = 0; i < 8; i++) {
                let angle = i * PI/4;
                fill(200, 240, 255, 150);
                push();
                rotate(angle);
                triangle(0, -20, -5, -30, 5, -30);
                pop();
            }
            
            // Frost overlay
            fill(200, 240, 255, 100);
            ellipse(0, 0, 40, 40);
            
            // Frozen text
            noStroke();
            fill(200, 240, 255, 200);
            textSize(12);
            textAlign(CENTER);
            text("FROZEN", 0, -40);
        }

      if (this.type === 'encryption') {
            // Bitcoin Node base appearance
            fill(40, 45, 60);
            stroke(60, 70, 90);
            strokeWeight(1);
            rect(-15, -20, 30, 40, 3);
            
            if (this.upgrade === 'A') {
                // Zero Knowledge visual - add piercing effect
                stroke(0, 255, 255, 150);
                strokeWeight(2);
                for (let i = 0; i < 3; i++) {
                    let angle = frameCount * 0.02 + (i * TWO_PI / 3);
                    line(0, 0, cos(angle) * 25, sin(angle) * 25);
                }
            } else if (this.upgrade === 'B') {
                // Multi-Sig visual - show three orbs
                noStroke();
                fill(0, 255, 255, 150);
                for (let i = 0; i < 3; i++) {
                    let angle = frameCount * 0.02 + (i * TWO_PI / 3);
                    let x = cos(angle) * 15;
                    let y = sin(angle) * 15;
                    ellipse(x, y, 8, 8);
                }
            }
            
            // Server lights
            for (let i = -15; i <= 5; i += 10) {
                fill(30, 35, 45);
                rect(-12, i, 24, 8, 2);
                noStroke();
                fill(0, 255, 0);
                ellipse(-8, i + 4, 3, 3);
                fill(255, 165, 0);
                ellipse(-3, i + 4, 3, 3);
            }
            
            // Bitcoin logo
            push();
            translate(0, -15);
            scale(0.7);
            drawBitcoin(window, 0, 0, 1);
            pop();
            
      } else if (this.type === 'verification') {
            if (this.upgrade === 'A') {
                // Hash Power visual - larger, more powerful appearance
                fill(90, 100, 120);
                rect(-25, -20, 50, 35, 3);
                // Add pulsing effect
                let pulseSize = sin(frameCount * 0.1) * 5;
                stroke(255, 165, 0, 150);
                noFill();
                ellipse(0, 0, 40 + pulseSize, 40 + pulseSize);
            } else if (this.upgrade === 'B') {
                // ASIC Boost visual - faster spinning elements
                fill(70, 80, 100);
                rect(-20, -15, 40, 30, 2);
                // Add spinning indicators
                for (let i = 0; i < 4; i++) {
                    let angle = frameCount * 0.3 + (i * PI/2);
                    stroke(0, 255, 255);
                    line(cos(angle) * 15, sin(angle) * 15,
                         cos(angle) * 25, sin(angle) * 25);
                }
            }
            
            // Mining rigs
            for (let i = -15; i <= 5; i += 10) {
                fill(30, 35, 45);
        noStroke();
                rect(-15, i, 30, 8, 1);
                stroke(0, 255, 255);
                strokeWeight(1);
                for (let j = -10; j <= 10; j += 10) {
                    line(j, i, j, i + 8);
                }
            }
            
            // Power symbol
            noStroke();
            fill(255, 165, 0);
            rect(-3, -25, 6, 15);
            ellipse(0, -25, 12, 12);
            
      } else if (this.type === 'consensus') {
            if (this.upgrade === 'A') {
                // Channel Factory visual - more connection points
                fill(255, 165, 0, 150);
                ellipse(0, 0, 35, 35);
                // Add multiple lightning connections
                stroke(255, 255, 0);
                for (let i = 0; i < 5; i++) {
                    let angle = frameCount * 0.02 + (i * TWO_PI / 5);
                    let x = cos(angle) * 25;
                    let y = sin(angle) * 25;
                    line(0, 0, x, y);
                }
            } else if (this.upgrade === 'B') {
                // HTLCs visual - slow effect indicator
                fill(255, 165, 0, 150);
        ellipse(0, 0, 30, 30);
                // Add slow effect waves
                noFill();
                for (let i = 0; i < 3; i++) {
                    let waveSize = ((frameCount * 2 + i * 20) % 60);
                    stroke(255, 255, 0, 150 - waveSize * 2);
                    ellipse(0, 0, waveSize, waveSize);
        }
      } else {
                // Base Lightning Node
                fill(255, 165, 0, 150);
                ellipse(0, 0, 30, 30);
                
                // Lightning effect
                stroke(255, 255, 0);
                strokeWeight(2);
                for (let i = 0; i < 3; i++) {
                    let angle = frameCount * 0.05 + (i * TWO_PI / 3);
                    let len = 15 + sin(frameCount * 0.1) * 5;
                    line(0, 0, cos(angle) * len, sin(angle) * len);
                }
            }
            
            // Add dynamic energy effect
            let energyTime = frameCount * 0.1;
            for (let i = 0; i < 4; i++) {
                let angle = energyTime + (i * TWO_PI / 4);
                stroke(255, 255, 0, 100);
                strokeWeight(1);
                let radius = 20 + sin(energyTime + i) * 3;
                let x1 = cos(angle) * radius;
                let y1 = sin(angle) * radius;
                let x2 = cos(angle + PI/6) * (radius - 5);
                let y2 = sin(angle + PI/6) * (radius - 5);
                line(x1, y1, x2, y2);
            }
        } else if (this.type === 'backup') {
            if (this.upgrade === 'A') {
                // Meme Lord visual
                fill(255, 165, 0);
                stroke(200, 130, 0);
                strokeWeight(2);
                ellipse(0, 0, 35, 35);
                
                // Crown
                fill(255, 215, 0);
                noStroke();
                beginShape();
                vertex(-15, -5);
                vertex(-10, -15);
                vertex(-5, -5);
                vertex(0, -15);
                vertex(5, -5);
                vertex(10, -15);
                vertex(15, -5);
                endShape();
                
                // Meme effects
                let memeTime = frameCount * 0.1;
                for (let i = 0; i < 3; i++) {
                    let angle = memeTime + (i * TWO_PI / 3);
                    push();
                    translate(cos(angle) * 20, sin(angle) * 20);
                    rotate(angle);
                    fill(255, 100);
                    textSize(8);
                    text("HODL", 0, 0);
      pop();
    }
                
            } else if (this.upgrade === 'B') {
                // Laser Eyes visual
                fill(255, 165, 0);
                stroke(200, 130, 0);
                strokeWeight(2);
                ellipse(0, 0, 35, 35);
                
                // Intense laser eyes
                let laserIntensity = sin(frameCount * 0.2) * 3;
                stroke(255, 0, 0);
                strokeWeight(3);
                
                // Left eye beam
                push();
                translate(-8, -5);
                rotate(-PI/6);
                for (let i = 0; i < 3; i++) {
                    let offset = sin(frameCount * 0.3 + i) * 2;
                    stroke(255, 0, 0, 200 - i * 50);
                    line(0, 0, -25 + offset, -25 + laserIntensity);
                }
                pop();
                
                // Right eye beam
                push();
                translate(8, -5);
                rotate(PI/6);
                for (let i = 0; i < 3; i++) {
                    let offset = sin(frameCount * 0.3 + i) * 2;
                    stroke(255, 0, 0, 200 - i * 50);
                    line(0, 0, 25 + offset, -25 + laserIntensity);
                }
                pop();
                
            } else {
                // Completely redesigned Pleb Tower
                // Base tower with gradient effect
                let gradient = drawingContext.createRadialGradient(0, 0, 0, 0, 0, 25);
                gradient.addColorStop(0, color(255, 165, 0));    // Bright orange center
                gradient.addColorStop(0.6, color(255, 140, 0));  // Mid orange
                gradient.addColorStop(1, color(200, 100, 0));    // Dark orange edge
                drawingContext.fillStyle = gradient;
                
                noStroke();
                ellipse(0, 0, 35, 35);
                
                // Decorative ring
                noFill();
                stroke(255, 200, 100);
                strokeWeight(2);
                ellipse(0, 0, 30, 30);
                
                // Inner pattern - abstract network design
                stroke(255, 255, 255, 150);
                strokeWeight(1);
        for (let i = 0; i < 6; i++) {
                    let angle = TWO_PI / 6 * i;
                    line(0, 0, cos(angle) * 12, sin(angle) * 12);
                }
                
                // Animated energy dots at connection points
                for (let i = 0; i < 6; i++) {
                    let angle = TWO_PI / 6 * i + frameCount * 0.02;
                    let x = cos(angle) * 12;
                    let y = sin(angle) * 12;
                    fill(255, 255, 255, 150 + sin(frameCount * 0.1) * 50);
                    noStroke();
                    ellipse(x, y, 4, 4);
                }
                
                // Center core
                fill(255, 220, 150);
                noStroke();
                ellipse(0, 0, 10, 10);
                
                // Pulsing effect
                let pulseSize = 8 + sin(frameCount * 0.1) * 2;
                fill(255, 220, 150, 100);
                ellipse(0, 0, pulseSize, pulseSize);
            }
        }

        // Draw upgrade indicator if upgraded - improved visibility with background
        if (this.upgrade) {
            let textY = -30;  // Default position
            let textX = 0;
            
            // Check if tower is near edges of the screen
            if (this.position.y < 100) {
                textY = 40;  // Move text below if near top
            }
            if (this.position.x < 100) {
                textX = 30;  // Move text right if near left edge
            } else if (this.position.x > width - 100) {
                textX = -30;  // Move text left if near right edge
            }
            
            // Draw text background for better visibility
            let upgradeName = this.getUpgradeOptions()[this.upgrade].name;
            textSize(10);
            let textW = 0;
            try {
                textAlign(LEFT);  // Ensure alignment is set before measuring
                textW = textWidth(upgradeName);
            } catch (e) {
                textW = upgradeName.length * 6;  // Fallback width calculation
            }
            
            // Background shadow with fixed minimum width
            let bgWidth = Math.max(textW + 20, 80);  // Minimum width of 80 pixels
            fill(0, 0, 0, 180);
            noStroke();
            rect(textX - bgWidth/2, textY - 12, bgWidth, 18, 5);
            
            // Main background
            fill(40, 45, 60, 230);
            rect(textX - bgWidth/2 + 1, textY - 11, bgWidth - 2, 16, 4);
            
            // Text
            fill(255, 165, 0);
            textAlign(CENTER);
            text(upgradeName, textX, textY);
        }

        // Show hover tooltip only if not in upgrade selection
        if (dist(mouseX, mouseY, this.position.x, this.position.y) < 20 && !selectedTowerForUpgrade) {
            this.drawHoverTooltip();
        }

        // In the draw method, add this after the existing tower drawing code:
        if (this.satEffect) {
            this.satEffect.size += 2;
            this.satEffect.alpha -= 10;
            if (this.satEffect.alpha <= 0) {
                this.satEffect = null;
      } else {
                noFill();
                stroke(0, 255, 0, this.satEffect.alpha);
                strokeWeight(2);
                ellipse(0, 0, this.satEffect.size, this.satEffect.size);
            }
        }

      pop();
    }

    drawHoverTooltip() {
        let tooltipX = mouseX + 10;
        let tooltipY = mouseY - 60;
        
        // Background
        fill(20, 22, 30, 230);
        stroke(60, 70, 90);
        strokeWeight(1);
        rect(tooltipX, tooltipY, 180, this.upgrade ? 130 : 90, 5);  // Increased height for sell button
        
        // Content
        noStroke();
        textAlign(LEFT);
        textSize(12);
        
        // Tower name with upgrade
        fill(255);
        let displayName = this.getDisplayName();
        if (this.upgrade) {
            displayName += ` (${this.getUpgradeOptions()[this.upgrade].name})`;
        }
        text(displayName, tooltipX + 10, tooltipY + 20);
        
        // Spot type bonus
        let bonusText = this.spotType === 'high' ? "+30% Range" :
                        this.spotType === 'power' ? "+25% Damage" :
                        this.spotType === 'choke' ? "+15% Range & Damage" :
                        "Balanced Coverage";
        fill(this.spotType === 'high' ? color(100, 150, 255) :
             this.spotType === 'power' ? color(255, 140, 0) :
             this.spotType === 'choke' ? color(200, 180, 60) :
             color(200, 200, 200));
        text(bonusText, tooltipX + 10, tooltipY + 40);
        
        // Show upgrade info and stats
        if (this.upgrade) {
            fill(255, 165, 0);
            text("Upgrade Effect:", tooltipX + 10, tooltipY + 60);
            fill(200);
            let desc = getDetailedUpgradeDescription(this.type, this.upgrade);
            // Word wrap the description
            let words = desc.split(' ');
            let line = '';
            let y = tooltipY + 80;
            for (let word of words) {
                let testLine = line + word + ' ';
                if (textWidth(testLine) > 160) {
                    text(line, tooltipX + 10, y);
                    line = word + ' ';
                    y += 20;
                } else {
                    line = testLine;
                }
            }
            text(line, tooltipX + 10, y);
            
            // Sell button
            let sellButtonY = y + 30;
            fill(255, 0, 0);
            rect(tooltipX + 10, sellButtonY, 160, 25, 3);
            fill(255);
            textAlign(CENTER);
            text("Sell Tower (50% Refund)", tooltipX + 90, sellButtonY + 17);
        } else {
            fill(255, 165, 0);
            text("Click to upgrade", tooltipX + 10, tooltipY + 60);
            
            // Sell button
            fill(255, 0, 0);
            rect(tooltipX + 10, tooltipY + 70, 160, 25, 3);
            fill(255);
            textAlign(CENTER);
            text("Sell Tower (50% Refund)", tooltipX + 90, tooltipY + 87);
        }
    }

    getRefundAmount() {
        let baseCost = towerCosts[this.type];
        let upgradeCost = this.upgrade ? this.getUpgradeCost() : 0;
        return Math.floor((baseCost + upgradeCost) * 0.5);  // 50% refund
    }

    sell() {
        let refund = this.getRefundAmount();
        currency += refund;
        // Remove tower from towers array
        towers.splice(towers.indexOf(this), 1);
        // Reset the spot to available
        let spot = towerSpots.find(s => s.x === this.position.x && s.y === this.position.y);
        if (spot) {
            spot.occupied = false;
        }
    }

    getDisplayName() {
        return {
            'encryption': 'Bitcoin Node',
            'verification': 'Mining Warehouse',
            'consensus': 'Lightning Node',
            'backup': 'Pleb Tower'
        }[this.type];
    }
  }
  
  // Projectile class
  class Projectile {
    constructor(x, y, target, damage, type, upgrade = null, fixedAngle = null) {
      this.position = { x, y };
      this.target = target;
      this.speed = type === 'backup' ? 4 : 5;  // Slightly slower for Pleb projectiles
      this.damage = damage;
      this.type = type;
      this.upgrade = upgrade;
      this.piercing = false;  // Remove piercing effect entirely
      this.fixedAngle = fixedAngle;
      this.hitRadius = type === 'backup' ? 12 : 8;  // Larger hit radius for Pleb
      this.explosionSize = 0;  // For explosion animation
      this.explosionAlpha = 255;  // For fade out
    }
    
    update() {
      if (enemies.indexOf(this.target) === -1) {
        if (this.explosionSize > 0) {
          // Continue explosion animation
          this.explosionSize += 2;
          this.explosionAlpha -= 15;
          if (this.explosionAlpha <= 0) {
        projectiles.splice(projectiles.indexOf(this), 1);
          }
      } else {
          projectiles.splice(projectiles.indexOf(this), 1);
        }
        return;
      }
      
      if (this.type === 'backup' && this.upgrade === 'B') {
        // Laser beam behavior
        let dx = cos(this.fixedAngle) * this.speed * 2;
        let dy = sin(this.fixedAngle) * this.speed * 2;
        this.position.x += dx;
        this.position.y += dy;
        
        // Check all enemies in the beam's path
        for (let enemy of enemies) {
          let d = dist(this.position.x, this.position.y, enemy.position.x, enemy.position.y);
          if (d < this.hitRadius) {
            enemy.health -= this.damage;
            if (enemy.health <= 0) {
              enemies.splice(enemies.indexOf(enemy), 1);
              currency += enemy.type === 'hacker' ? 12000000 : 
                        enemy.type === 'malware' ? 20000000 : 
                        35000000;
            }
          }
        }
        
        // Remove if off screen
        if (this.position.x < -50 || this.position.x > width + 50 || 
            this.position.y < -50 || this.position.y > height + 50) {
          projectiles.splice(projectiles.indexOf(this), 1);
        }
        return;
      }
      
        let dx = this.target.position.x - this.position.x;
        let dy = this.target.position.y - this.position.y;
        let distance = sqrt(dx * dx + dy * dy);
      
      if (distance < this.hitRadius) {
        if (this.type === 'backup') {
          // Start explosion
          this.explosionSize = 20;
          let explosionRadius = this.upgrade === 'A' ? 60 : 30;  // Smaller radius for basic Pleb
          
          // Get all enemies in explosion radius
          let enemiesInRange = enemies.filter(enemy => {
            let d = dist(this.position.x, this.position.y, enemy.position.x, enemy.position.y);
            return d < explosionRadius;
          });
          
          // Sort by distance to hit closest enemies first
          enemiesInRange.sort((a, b) => {
            let distA = dist(this.position.x, this.position.y, a.position.x, a.position.y);
            let distB = dist(this.position.x, this.position.y, b.position.x, b.position.y);
            return distA - distB;
          });
          
          // Apply damage over time to enemies
          for (let enemy of enemiesInRange) {
            // Skip immune enemies
            if (enemy.special === 'untouchable' || 
               (enemy.special === 'plebImmune')) continue;
            
            // Initialize or update drain effect
            if (!enemy.drainEffect) {
              enemy.drainEffect = {
                totalDamage: 300, // Increased from 250
                remainingDamage: 300, // Increased from 250
                drainRate: 1.0,  // Increased from 0.5 to 1.0 damage per frame
                drainRadius: explosionRadius,
                position: { x: this.position.x, y: this.position.y }
              };
            } else {
              // Add to existing drain if hit again
              enemy.drainEffect.remainingDamage = 300; // Increased from 250
              enemy.drainEffect.position = { x: this.position.x, y: this.position.y };
            }
            
            // Meme Lord upgrade: chance to freeze
            if (this.upgrade === 'A' && random() < 0.3) {
              enemy.frozen = true;
              enemy.frozenTimer = 60;
            }
          }
        } else {
          this.target.health -= this.damage;
          if (this.target.health <= 0) {
            enemies.splice(enemies.indexOf(this.target), 1);
            currency += this.target.type === 'hacker' ? 12000000 : 
                      this.type === 'malware' ? 20000000 : 
                      35000000;
          }
          if (!this.piercing) {
          projectiles.splice(projectiles.indexOf(this), 1);
          }
        }
        } else {
          this.position.x += (dx / distance) * this.speed;
          this.position.y += (dy / distance) * this.speed;
        }
      }
    
    draw() {
        push();
        translate(this.position.x, this.position.y);
        
        if (this.type === 'backup') {
            if (this.explosionSize > 0) {
                // Draw explosion
                noStroke();
                let explosionColor = this.upgrade === 'A' ? 
                    color(255, 165, 0, this.explosionAlpha) :  // Orange for Meme Lord
                    color(255, 140, 0, this.explosionAlpha);   // Red-orange for normal
                
                fill(explosionColor);
                ellipse(0, 0, this.explosionSize, this.explosionSize);
                
                // Add meme text effects for Meme Lord upgrade
                if (this.upgrade === 'A') {
                    textSize(this.explosionSize/4);
                    textAlign(CENTER);
                    fill(255, this.explosionAlpha);
                    let memes = ["HODL", "WAGMI", "LFG"];
                    for (let i = 0; i < 3; i++) {
                        let angle = TWO_PI/3 * i;
                        let x = cos(angle) * this.explosionSize/3;
                        let y = sin(angle) * this.explosionSize/3;
                        push();
                        translate(x, y);
                        rotate(angle);
                        text(memes[i], 0, 0);
                        pop();
                    }
                }
            } else if (this.upgrade === 'B') {
                // Laser beam
                stroke(255, 0, 0);
                strokeWeight(3);
                line(0, 0, cos(this.fixedAngle) * 20, sin(this.fixedAngle) * 20);
                
                // Glow effect
                for (let i = 1; i <= 2; i++) {
                    stroke(255, 0, 0, 100/i);
                    strokeWeight(3 + i);
                    line(0, 0, cos(this.fixedAngle) * 20, sin(this.fixedAngle) * 20);
                }
            } else {
                // Orange pill projectile
                let rotationAngle = atan2(this.target.position.y - this.position.y,
                                        this.target.position.x - this.position.x);
                rotate(rotationAngle);
                
                // Pill shape
                fill(255, 140, 0);
                noStroke();
                ellipse(-3, 0, 8, 6);
                fill(255, 165, 0);
                ellipse(3, 0, 8, 6);
                
                // Trailing effect
                for (let i = 1; i <= 3; i++) {
                    fill(255, 165, 0, 50/i);
                    ellipse(-3 - i*2, 0, 8, 6);
                    ellipse(3 - i*2, 0, 8, 6);
                }
            }
        } else if (this.type === 'encryption') {
            // Data packet projectile
            let rotationAngle = atan2(this.target.position.y - this.position.y,
                                    this.target.position.x - this.position.x);
            rotate(rotationAngle);
            
            // Base shape
            fill(0, 255, 255);
            noStroke();
            rect(-6, -3, 12, 6, 2);
            
            // Binary pattern
            fill(0, 150, 150);
            textSize(4);
            text("1", -4, 2);
            text("0", 0, 2);
            text("1", 4, 2);
            
            // Chain verification effect
            if (this.upgrade === 'A') {
                noFill();
                for (let i = 1; i <= 3; i++) {
                    stroke(0, 255, 255, 100/i);
                    strokeWeight(1);
                    rect(-6-i, -3-i, 12+i*2, 6+i*2, 2);
                }
                
                // Chain link effect
                let chainLength = 3;
                for (let i = 0; i < chainLength; i++) {
                    let offset = sin(frameCount * 0.2 + i * TWO_PI/chainLength) * 3;
                    noFill();
                    stroke(0, 255, 255, 150);
                    strokeWeight(1);
                    rect(-6, -3 + offset, 12, 6, 2);
                }
            }
            
            // Multi-sig effect
            if (this.upgrade === 'B') {
                noFill();
                stroke(0, 255, 255, 150);
                strokeWeight(1);
                for (let i = 0; i < 3; i++) {
                    let offset = sin(frameCount * 0.2 + i * TWO_PI/3) * 3;
                    rect(-6, -3 + offset, 12, 6, 2);
                }
            }
            
        } else if (this.type === 'verification') {
            // Mining hash projectile
            let rotationAngle = atan2(this.target.position.y - this.position.y,
                                    this.target.position.x - this.position.x);
            rotate(rotationAngle);
            
            // Base shape
            fill(255, 140, 0);
            noStroke();
            beginShape();
            vertex(-8, 0);
            vertex(-4, -4);
            vertex(4, -4);
            vertex(8, 0);
            vertex(4, 4);
            vertex(-4, 4);
            endShape(CLOSE);
            
            // Hash Power upgrade effect
            if (this.upgrade === 'A') {
                noFill();
                for (let i = 1; i <= 3; i++) {
                    stroke(255, 140, 0, 100/i);
                    strokeWeight(2/i);
                    let size = i * 2;
                    beginShape();
                    vertex(-8-size, 0);
                    vertex(-4-size, -4-size);
                    vertex(4+size, -4-size);
                    vertex(8+size, 0);
                    vertex(4+size, 4+size);
                    vertex(-4-size, 4+size);
                    endShape(CLOSE);
                }
            }
            
            // ASIC Boost effect
            if (this.upgrade === 'B') {
                noFill();
                stroke(255, 140, 0, 150);
                strokeWeight(1);
                for (let i = 0; i < 3; i++) {
                    rotate(frameCount * 0.1);
                    beginShape();
                    vertex(-8, 0);
                    vertex(-4, -4);
                    vertex(4, -4);
                    vertex(8, 0);
                    vertex(4, 4);
                    vertex(-4, 4);
                    endShape(CLOSE);
                }
            }
        } else if (this.type === 'consensus') {
            // Lightning projectile with enhanced visuals
            let rotationAngle = atan2(this.target.position.y - this.position.y,
                                    this.target.position.x - this.position.x);
            rotate(rotationAngle);
            
            // Glowing core
            let pulseIntensity = sin(frameCount * 0.2) * 20 + 150;
            fill(255, 255, pulseIntensity, 150);
            noStroke();
            ellipse(0, 0, 12, 12);
            
            // Main lightning bolt with dynamic zigzag
            stroke(255, 255, 0);
            strokeWeight(3);
            let boltLength = 25;  // Increased length
            let zigzagPoints = [];
            let numPoints = 6;  // More points for smoother lightning
            
            // Generate dynamic zigzag pattern
            for (let i = 0; i < numPoints; i++) {
                let x = map(i, 0, numPoints - 1, -boltLength, boltLength);
                let y = sin(frameCount * 0.3 + i) * 4;
                zigzagPoints.push({x, y});
            }
            
            // Draw main bolt with glow effect
            for (let g = 3; g >= 0; g--) {
                stroke(255, 255, 0, 255 - g * 50);
                strokeWeight(4 - g);
                beginShape();
                for (let point of zigzagPoints) {
                    vertex(point.x, point.y);
                }
                endShape();
            }
            
            // Channel Factory effect (multiple parallel bolts)
            if (this.upgrade === 'A') {
                for (let i = -1; i <= 1; i += 2) {
                    let offset = i * 8;
                    stroke(255, 255, 0, 150);
                    strokeWeight(2);
                    beginShape();
                    for (let point of zigzagPoints) {
                        // Add slight variation to parallel bolts
                        let yVar = sin(frameCount * 0.4 + i) * 2;
                        vertex(point.x, point.y + offset + yVar);
                    }
                    endShape();
                }
            }
            
            // HTLCs effect (slow aura with lightning particles)
            if (this.upgrade === 'B') {
                // Circular aura
                noFill();
                for (let i = 1; i <= 2; i++) {
                    stroke(255, 255, 0, 80 - i * 20);
                    strokeWeight(2);
                    let size = i * 15;
                    ellipse(0, 0, size + sin(frameCount * 0.2) * 5, size + cos(frameCount * 0.2) * 5);
                }
                
                // Lightning particles
                for (let i = 0; i < 4; i++) {
                    let angle = frameCount * 0.1 + i * PI/2;
                    let r = 12 + sin(frameCount * 0.3 + i) * 3;
                    let px = cos(angle) * r;
                    let py = sin(angle) * r;
                    
                    stroke(255, 255, 0, 200);
                    strokeWeight(2);
                    point(px, py);
                }
            }
            
            // Add trailing sparks
            for (let i = 0; i < 3; i++) {
                let sparkAngle = rotationAngle + random(-PI/4, PI/4);
                let sparkDist = random(5, 15);
                stroke(255, 255, 0, 150);
                strokeWeight(1);
                line(0, 0,
                     cos(sparkAngle) * sparkDist,
                     sin(sparkAngle) * sparkDist);
            }
        }
        pop();
    }
}

// Draw the user interface
function drawUI() {
    // Top HUD background with slightly increased height for better spacing
    fill(20, 22, 30, 230);
    stroke(60, 70, 90);
    strokeWeight(1);
    rect(0, 0, width, 45);
    
    // Use consistent text properties
    textSize(16);
    noStroke();
    
    // Left section: Available Sats with better spacing
    fill(255, 165, 0);
    textAlign(LEFT);
    text("Available:", 25, 28);
    text(`${Math.floor(currency/1000000)}M`, 95, 28);
    
    // Wave counter with consistent spacing
    let waveX = 170;  // Fixed position
    text(`Wave ${waveIndex}/${waves.length}`, waveX, 28);
    
    // High Score with consistent spacing
    let scoreX = 300;  // Fixed position
    text(`High Score: ${Math.floor(coldStorage/1000000)}M`, scoreX, 28);
    
    // Hearts centered in remaining space
    let heartSize = 16;
    let heartsStartX = 500;
    let heartY = 21;
    
    for (let i = 0; i < lives; i++) {
        heart(heartsStartX + (i * heartSize * 1.2), heartY, heartSize);
    }
    
    // Start Wave button aligned with right edge
    if (waveIndex < waves.length && waveEnemies.length === 0 && enemies.length === 0) {
        let buttonHovered = mouseY < 35 && mouseX > width - 95 && mouseX < width - 15;
        fill(buttonHovered ? color(255, 140, 0) : color(255, 165, 0));
        stroke(200, 130, 0);
        rect(width - 95, 10, 80, 25, 5);  // Taller button for better visibility
        
        fill(0);
        noStroke();
        textAlign(CENTER);
        text("Start Wave", width - 55, 28);
    }

    // Draw all tooltips last to prevent UI reflow
    // Available sats tooltip
    if (mouseX < 150 && mouseY < 40) {
        drawTooltip(mouseX, 45, [
            ["Available Sats", color(255, 165, 0)],
            ["Current balance for buying", color(200)],
            ["and upgrading defenses.", color(200)]
        ]);
    }
    
    // Wave counter tooltip
    if (mouseX > waveX && mouseX < waveX + 100 && mouseY < 40) {
        drawTooltip(mouseX, 45, [
            ["Current Wave", color(255, 165, 0)],
            [`Progress: ${waveIndex}/${waves.length}`, color(200)],
            ["Survive all waves to win!", color(200)]
        ]);
    }
    
    // High Score tooltip
    if (mouseX > scoreX && mouseX < scoreX + 200 && mouseY < 40) {
        drawTooltip(mouseX, 45, [
            ["High Score", color(255, 165, 0)],
            ["Based on your total cold storage.", color(200)],
            ["Lock more sats to increase score!", color(200)]
        ]);
    }
    
    // Hearts tooltip
    if (mouseX > heartsStartX && mouseX < heartsStartX + (lives * heartSize * 1.2) && mouseY < 40) {
        drawTooltip(mouseX, 45, [
            ["Lives Remaining", color(255, 50, 50)],
            [`${lives} lives left`, color(200)],
            ["Lose 10% sats when hit!", color(200)]
        ]);
    }

    // Bottom HUD split into left (defenses) and right (cold storage)
    fill(20, 22, 30, 230);
    stroke(60, 70, 90);
    rect(0, height - 80, width, 80);  // Slightly taller for better spacing
    
    // Left side: Available Defenses
    noStroke();
      fill(255);
    textAlign(LEFT);
    text("Available Defenses", 20, height - 55);
    
    // Tower buttons with better spacing
    let buttonWidth = 95;
    let buttonHeight = 35;
    let spacing = 20;  // Increased spacing between buttons
    let startX = 20;
    
    // Tower selection buttons
    let towers = [
        { name: "Node", type: "encryption", cost: 45000000, color: color(0, 255, 255) },
        { name: "Mining", type: "verification", cost: 85000000, color: color(255, 140, 0) },
        { name: "Lightning", type: "consensus", cost: 65000000, color: color(255, 255, 0) },
        { name: "Pleb", type: "backup", cost: 95000000, color: color(255, 165, 0) }
    ];

    towers.forEach((tower, i) => {
        let x = startX + i * (buttonWidth + spacing);
        let buttonY = height - 40;  // Moved up slightly
        let isHovered = mouseX > x && mouseX < x + buttonWidth && 
                       mouseY > buttonY && mouseY < buttonY + buttonHeight;
        let isSelected = selectedTower === tower.type;
        
        // Button background
        stroke(60, 70, 90);
        fill(isHovered ? color(40, 45, 60) : color(30, 35, 45));
        rect(x, buttonY, buttonWidth, buttonHeight, 5);
        
        // Tower icon
        noStroke();
        fill(tower.color);
        ellipse(x + 15, buttonY + buttonHeight/2, 15, 15);
        
        // Tower info
        textAlign(LEFT);
        textSize(12);
        fill(255);
        text(tower.name, x + 30, buttonY + 15);
        fill(255, 165, 0);
        text(`${Math.floor(tower.cost/1000000)}M`, x + 30, buttonY + 30);
        
        // Selection highlight
        if (isSelected) {
            noFill();
            stroke(255, 165, 0);
            strokeWeight(2);
            rect(x + 2, buttonY + 2, buttonWidth - 4, buttonHeight - 4, 3);
        }
        
        // Tower tooltip on hover
        if (isHovered) {
            let tooltipX = x;
            let tooltipY = buttonY - 100;
            
            let tooltipWidth = 120;  // Increased width
            let tooltipHeight = 90;
            
            fill(20, 22, 30, 230);
            stroke(60, 70, 90);
            strokeWeight(1);
            rect(tooltipX, tooltipY, tooltipWidth, tooltipHeight, 5);
            
            noStroke();
            textAlign(LEFT);
            textSize(12);
            fill(tower.color);
            text(tower.name, tooltipX + 10, tooltipY + 20);
            
            fill(200);
            let stats = {
                encryption: ["Balanced Node", "Good vs Hackers", "Medium Speed"],
                verification: ["Mining Power", "Strong vs 51%", "Slow, High Damage"],
                consensus: ["Lightning Fast", "Chain Attacks", "Low Damage"],
                backup: ["Pleb Power", "Orange Pills", "Slow but Powerful"]
            }[tower.type];
            
            stats.forEach((stat, index) => {
                text(stat, tooltipX + 10, tooltipY + 40 + index * 15);
            });
        }
    });
    
    // Right side: Cold Storage
    let coldStorageX = width - 280;
    
    // Cold storage title and amount
    noStroke();
    fill(255);
    textAlign(RIGHT);
    textSize(16);
    text("Cold Storage:", width - 160, height - 55);
    fill(0, 255, 255);
    text(`${Math.floor(coldStorage/1000000)}M sats`, width - 20, height - 55);
    
    // Input field
    fill(40, 45, 55);
    stroke(60, 70, 90);
    rect(coldStorageX, height - 40, 160, 25, 3);
    
    // Input text
    fill(255);
    textAlign(LEFT);
    textSize(14);
    text(coldStorageInput + (frameCount % 60 < 30 ? "|" : ""), coldStorageX + 10, height - 23);
    
    // Lock button
    let canLock = !isNaN(coldStorageInput) && 
                  Number(coldStorageInput) >= 1 && 
                  Number(coldStorageInput) * 1000000 <= currency;
    
    let lockHovered = mouseX > width - 100 && mouseX < width - 20 && 
                     mouseY > height - 40 && mouseY < height - 15;
    
    fill(canLock && lockHovered ? color(0, 200, 200) : 
         canLock ? color(0, 255, 255) : color(100, 100, 100));
    noStroke();
    rect(width - 100, height - 40, 80, 25, 3);
    
    fill(0);
    textAlign(CENTER);
    textSize(12);
    text("Lock Sats", width - 60, height - 23);
    
    // Draw boss warning if active
    if (currentBossWarning) {
        let warningX = width - 300;
        let warningY = height - 180;  // Moved higher up
        
        // Show warning during countdown and while boss is present
        let shouldShow = currentBossWarning.timer > 0 || enemies.some(e => e.special !== 'none');
        
        if (shouldShow) {
            if (currentBossWarning.timer > 0) {
                currentBossWarning.timer--;
                
                // Flicker effect in first 120 frames (2 seconds)
                if (currentBossWarning.timer > 300 && frameCount % 10 < 5) {
                    return;  // Skip drawing to create flicker
                }
            }
            
            // Warning box with glow effect
            drawingContext.shadowBlur = 10;
            drawingContext.shadowColor = 'rgba(255, 0, 0, 0.5)';
            
            // Background
            fill(20, 22, 30, 230);
            stroke(255, 0, 0);
            strokeWeight(2);
            rect(warningX, warningY, 280, 70, 8);
            
            // Reset shadow
            drawingContext.shadowBlur = 0;
            
            // Warning text - ensure proper text rendering
            textAlign(LEFT);
            textSize(14);
            fill(255, 0, 0);
            text(currentBossWarning.name.replace(/[^\x20-\x7E\u{1F300}-\u{1F9FF}]/gu, ''), warningX + 10, warningY + 20);
            
            textSize(12);
            fill(255);
            text(currentBossWarning.power.replace(/[^\x20-\x7E\u{1F300}-\u{1F9FF}]/gu, ''), warningX + 10, warningY + 40);
            
            fill(255, 165, 0);
            text(currentBossWarning.joke.replace(/[^\x20-\x7E\u{1F300}-\u{1F9FF}]/gu, ''), warningX + 10, warningY + 60);
        }
    }
    
    // Clear warning only when no bosses are present and timer is done
    if (currentBossWarning && currentBossWarning.timer <= 0 && !enemies.some(e => e.special !== 'none')) {
        currentBossWarning = null;
    }
}

// Helper function to draw heart shape
function heart(x, y, size) {
    push();
    translate(x, y);
    
    // Heart shadow
    fill(0, 0, 0, 30);
    noStroke();
    beginShape();
    vertex(2, 2);
    bezierVertex(2 - size/2, 2 - size/2, 2 - size, 2 + size/3, 2, 2 + size);
    bezierVertex(2 + size, 2 + size/3, 2 + size/2, 2 - size/2, 2, 2);
    endShape();
    
    // Main heart
    fill(255, 50, 50);
    stroke(200, 40, 40);
    strokeWeight(1);
    beginShape();
    vertex(0, 0);
    bezierVertex(-size/2, -size/2, -size, size/3, 0, size);
    bezierVertex(size, size/3, size/2, -size/2, 0, 0);
    endShape();
    
    // Highlight
    fill(255, 255, 255, 50);
    noStroke();
    beginShape();
    vertex(-size/4, -size/4);
    bezierVertex(-size/3, -size/3, -size/2, -size/6, -size/3, 0);
    bezierVertex(-size/6, -size/6, -size/6, -size/3, -size/4, -size/4);
    endShape();
    
    pop();
}

// Add keyPressed function to handle cold storage input
function keyPressed() {
    if (gameState === 'playing') {
        // Only allow numbers and backspace
        if ((keyCode >= 48 && keyCode <= 57) || keyCode === BACKSPACE) {
            if (keyCode === BACKSPACE) {
                coldStorageInput = coldStorageInput.slice(0, -1);
            } else if (coldStorageInput.length < 10) {  // Limit input length
                coldStorageInput += key;
            }
            return false;  // Prevent default behavior
        }
    }
}

// Add this new function for visual feedback
function createSatLossEffect(x, y, amount) {
    satLossEffects.push({
        x: x,
        y: y,
        amount: Math.floor(amount/1000000),
        alpha: 255,
        life: 60  // frames the effect will last
    });
}

// Add this helper function for consistent tooltips
function drawTooltip(x, y, lines) {
    push();  // Save the current drawing state
    
    let maxWidth = 0;
    let lineHeight = 20;
    let padding = 10;
    
    // Calculate required width
    textAlign(LEFT);
    textSize(12);
    lines.forEach(line => {
        let w = textWidth(line[0]);
        maxWidth = max(maxWidth, w);
    });
    
    // Ensure tooltip stays within canvas bounds
    x = constrain(x, padding, width - (maxWidth + padding * 2));
    
    // Draw tooltip background
    fill(20, 22, 30, 230);
    stroke(60, 70, 90);
    strokeWeight(1);
    rect(x, y, maxWidth + padding * 2, lines.length * lineHeight + padding * 2, 5);
    
    // Draw lines
    noStroke();
    lines.forEach((line, i) => {
        fill(line[1]);
        text(line[0], x + padding, y + padding + (i + 1) * lineHeight);
    });
    
    pop();  // Restore the previous drawing state
  }

// Add helper function for floating text effects
function createFloatingText(x, y, text, color) {
    floatingTexts.push({
        x: x,
        y: y,
        text: text,
        color: color,
        alpha: 255,
        life: 60
    });
}

// Add new function to draw the upgrade UI
function drawUpgradeUI() {
    if (!selectedTowerForUpgrade) return;
    
    let tower = selectedTowerForUpgrade;
    let options = tower.getUpgradeOptions();
    if (!options || !options.A || !options.B) return;  // Safety check for options
    
    let cost = tower.getUpgradeCost();
    let canAfford = currency >= cost;
    
    push();
    // Semi-transparent overlay
    fill(0, 0, 0, 150);
    noStroke();
    rect(0, 0, width, height);
    
    // Upgrade UI panel - increased height for better text spacing and sell button
    let uiX = tower.position.x;
    let uiY = tower.position.y - 60;
    let uiWidth = 280; // Increased width
    let uiHeight = 220; // Increased height for sell button
    
    // Background
    fill(20, 22, 30, 240);
    stroke(60, 70, 90);
    strokeWeight(2);
    rect(uiX - uiWidth/2, uiY, uiWidth, uiHeight, 8);
    
    // Title
    noStroke();
    fill(255);
    textAlign(CENTER);
    textSize(16);
    text("Choose Upgrade Path", uiX, uiY + 25);
    
    // Upgrade buttons - increased spacing and size
    let buttonWidth = 110; // Wider buttons
    let buttonHeight = 45; // Taller buttons
    let buttonSpacing = 20; // Space between buttons
    
    // Path A button
    let pathAHovered = mouseX >= uiX - buttonWidth - buttonSpacing/2 && 
                      mouseX < uiX - buttonSpacing/2 &&
                      mouseY >= uiY + 45 && 
                      mouseY <= uiY + 45 + buttonHeight;
    
    fill(pathAHovered && canAfford ? color(255, 140, 0) : color(255, 165, 0, canAfford ? 255 : 100));
    rect(uiX - buttonWidth - buttonSpacing/2, uiY + 45, buttonWidth, buttonHeight, 6);
    
    // Path B button
    let pathBHovered = mouseX >= uiX + buttonSpacing/2 && 
                      mouseX < uiX + buttonWidth + buttonSpacing/2 &&
                      mouseY >= uiY + 45 && 
                      mouseY <= uiY + 45 + buttonHeight;
    
    fill(pathBHovered && canAfford ? color(255, 140, 0) : color(255, 165, 0, canAfford ? 255 : 100));
    rect(uiX + buttonSpacing/2, uiY + 45, buttonWidth, buttonHeight, 6);
    
    // Button text - split into two lines if needed
    textSize(13);
    fill(0);
    
    // Path A text
    let nameA = options.A.name || 'Path A';  // Fallback name
    if (nameA.length > 10) {
        let words = nameA.split(' ');
        text(words[0], uiX - buttonWidth/2 - buttonSpacing/2, uiY + 65);
        text(words[1] || '', uiX - buttonWidth/2 - buttonSpacing/2, uiY + 80);
    } else {
        text(nameA, uiX - buttonWidth/2 - buttonSpacing/2, uiY + 70);
    }
    
    // Path B text
    let nameB = options.B.name || 'Path B';  // Fallback name
    if (nameB.length > 10) {
        let words = nameB.split(' ');
        text(words[0], uiX + buttonWidth/2 + buttonSpacing/2, uiY + 65);
        text(words[1] || '', uiX + buttonWidth/2 + buttonSpacing/2, uiY + 80);
    } else {
        text(nameB, uiX + buttonWidth/2 + buttonSpacing/2, uiY + 70);
    }
    
    // Cost
    fill(255, 165, 0);
    textSize(14);
    text(`Cost: ${Math.floor(cost/1000000)}M`, uiX, uiY + 105);
    
    // Detailed hover descriptions with word wrapping
    if (pathAHovered || pathBHovered) {
        let detailedDesc = getDetailedUpgradeDescription(tower.type, pathAHovered ? 'A' : 'B') || '';
        fill(200);
        textSize(12);
        textAlign(CENTER);
        
        // Word wrap the description
        let words = detailedDesc.split(' ');
        let line = '';
        let y = uiY + 130;
        let maxWidth = uiWidth - 40; // Leave some padding
        let maxLines = 2; // Limit to 2 lines to prevent overlap with sell button
        
        for (let word of words) {
            let testLine = line + word + ' ';
            let lineWidth = 0;
            try {
                lineWidth = textWidth(testLine);
            } catch (e) {
                lineWidth = testLine.length * 6;  // Fallback width calculation
            }
            
            if (lineWidth > maxWidth) {
                text(line, uiX, y);
                line = word + ' ';
                y += 20;
                if (y >= uiY + uiHeight - 70) break; // Stop if we're getting too close to sell button
            } else {
                line = testLine;
            }
        }
        if (line && y < uiY + uiHeight - 70) {
            text(line, uiX, y);
        }
    }
    
    // Sell button - smaller dimensions
    let sellButtonY = uiY + uiHeight - 50;
    let sellButtonWidth = 100;  // Reduced from buttonWidth * 2
    let sellButtonHovered = mouseX >= uiX - sellButtonWidth/2 && 
                           mouseX <= uiX + sellButtonWidth/2 &&
                           mouseY >= sellButtonY && 
                           mouseY <= sellButtonY + buttonHeight;
    
    fill(sellButtonHovered ? color(255, 0, 0) : color(200, 0, 0));
    rect(uiX - sellButtonWidth/2, sellButtonY, sellButtonWidth, buttonHeight, 6);
    
    // Sell button text - smaller font size to fit
    fill(255);
    textSize(12);
    textAlign(CENTER, CENTER);
    text(`Sell (${Math.floor(tower.getRefundAmount()/1000000)}M)`, uiX, sellButtonY + buttonHeight/2);
    
    pop();
}

// New helper function for detailed upgrade descriptions
function getDetailedUpgradeDescription(towerType, path) {
    const descriptions = {
        'encryption': {
            'A': 'Chain verification: affects 3 nearby enemies with decreasing damage (70% per chain). 50% faster firing rate.',
            'B': 'Splits into 3 projectiles, each dealing 50% damage'
        },
        'verification': {
            'A': 'Doubles damage but attacks 50% slower',
            'B': '50% faster attacks and 25% more damage'
        },
        'consensus': {
            'A': 'Can chain between 5 targets (up from 3)',
            'B': 'Slows affected enemies by 30% movement speed'
        },
        'backup': {
            'A': '50% larger explosions and 30% chance to freeze enemies',
            'B': 'Generates 1M sats at the start of each wave'
        }
    };
    return descriptions[towerType][path];
}

// Add this helper function for the ETH Unicorn's stars
function star(x, y, radius1, radius2, npoints) {
  let angle = TWO_PI / npoints;
  let halfAngle = angle/2.0;
  beginShape();
  for (let a = 0; a < TWO_PI; a += angle) {
    let sx = x + cos(a) * radius2;
    let sy = y + sin(a) * radius2;
    vertex(sx, sy);
    sx = x + cos(a+halfAngle) * radius1;
    sy = y + sin(a+halfAngle) * radius1;
    vertex(sx, sy);
  }
  endShape(CLOSE);
  }

// Add the getBitcoinerRank function at the top level
function getBitcoinerRank(btcAmount) {
  if (btcAmount === 0) return 'Nocoiner';
  if (btcAmount < 0.01) return 'Plankton';
  if (btcAmount < 0.1) return 'Shrimp';
  if (btcAmount < 0.25) return 'Crab';
  if (btcAmount < 0.5) return 'Lobster';
  if (btcAmount < 1) return 'Octopus';
  if (btcAmount < 2) return 'Salmon';
  if (btcAmount < 3) return 'Tuna';
  if (btcAmount < 5) return 'Dolphin';
  if (btcAmount < 7.5) return 'Shark';
  if (btcAmount < 10) return 'Whale shark';
  if (btcAmount < 15) return 'Whale';
  if (btcAmount < 25) return 'Humpback';
  if (btcAmount < 50) return 'Colossal squid';
  if (btcAmount < 100) return 'Megaladon';
  if (btcAmount < 250) return 'Kraken';
  return 'Cthulhu';
  }

// Firebase Configuration
// Initialize Firebase with your project config
const firebaseConfig = {
  apiKey: "AIzaSyAAPnDr02pkl8qjYFfxf9FrjKveRYOdUFQ",
  authDomain: "bitcointowerdefensegame.firebaseapp.com",
  databaseURL: "https://bitcointowerdefensegame-default-rtdb.firebaseio.com",
  projectId: "bitcointowerdefensegame",
  storageBucket: "bitcointowerdefensegame.firebasestorage.app",
  messagingSenderId: "914790506593",
  appId: "1:914790506593:web:5000cd86898a3b4a79ca20"
};

// Initialize Firebase
let firebaseInitialized = false;
let database;

function initializeFirebase() {
  if (!firebaseInitialized && typeof firebase !== 'undefined') {
    try {
      firebase.initializeApp(firebaseConfig);
      database = firebase.database();
      firebaseInitialized = true;
      console.log("Firebase initialized successfully");
    } catch (error) {
      console.error("Firebase initialization error:", error);
    }
  }
}

// Variables for leaderboard
let showLeaderboardSubmitDialog = false;
let leaderboardNickname = "";
let leaderboardEmail = "";
let showLeaderboard = false;
let leaderboardData = [];
let leaderboardError = "";

// Function to draw the leaderboard submission dialog
function drawLeaderboardSubmitDialog() {
  if (!showLeaderboardSubmitDialog) return;
  
  // Semi-transparent overlay
  fill(0, 0, 0, 200);
  noStroke();
  rect(0, 0, width, height);
  
  // Dialog box
  let dialogWidth = 400;
  let dialogHeight = 300;
  let dialogX = (width - dialogWidth) / 2;
  let dialogY = (height - dialogHeight) / 2;
  
  // Dialog background
  fill(30, 35, 45);
  stroke(60, 70, 90);
  strokeWeight(2);
  rect(dialogX, dialogY, dialogWidth, dialogHeight, 10);
  
  // Title
  fill(255, 165, 0);
  textSize(24);
  textAlign(CENTER);
  text("Submit High Score", width/2, dialogY + 40);
  
  // Nickname field
  fill(255);
  textSize(16);
  textAlign(LEFT);
  text("Nickname:", dialogX + 30, dialogY + 80);
  
  // Nickname input box
  fill(40, 45, 55);
  stroke(100, 110, 130);
  rect(dialogX + 30, dialogY + 90, dialogWidth - 60, 40, 5);
  
  // Nickname text
  fill(255);
  textAlign(LEFT);
  textSize(18);
  text(leaderboardNickname, dialogX + 40, dialogY + 115);
  
  // Email field
  fill(255);
  textSize(16);
  textAlign(LEFT);
  text("Email (private):", dialogX + 30, dialogY + 150);
  
  // Email input box
  fill(40, 45, 55);
  stroke(100, 110, 130);
  rect(dialogX + 30, dialogY + 160, dialogWidth - 60, 40, 5);
  
  // Email text
  fill(255);
  textAlign(LEFT);
  textSize(18);
  text(leaderboardEmail, dialogX + 40, dialogY + 185);
  
  // Error message if any
  if (leaderboardError) {
    fill(255, 50, 50);
    textSize(14);
    textAlign(CENTER);
    text(leaderboardError, width/2, dialogY + 215);
  }
  
  // Submit button
  let submitButtonX = dialogX + dialogWidth/2 - 110;
  let submitButtonY = dialogY + 240;
  let submitButtonHovered = mouseX > submitButtonX && mouseX < submitButtonX + 100 &&
                           mouseY > submitButtonY && mouseY < submitButtonY + 40;
  
  fill(submitButtonHovered ? color(255, 140, 0) : color(255, 165, 0));
  stroke(200, 130, 0);
  rect(submitButtonX, submitButtonY, 100, 40, 5);
  
  fill(0);
  textSize(16);
  textAlign(CENTER, CENTER);
  text("Submit", submitButtonX + 50, submitButtonY + 20);
  
  // Cancel button
  let cancelButtonX = dialogX + dialogWidth/2 + 10;
  let cancelButtonY = dialogY + 240;
  let cancelButtonHovered = mouseX > cancelButtonX && mouseX < cancelButtonX + 100 &&
                           mouseY > cancelButtonY && mouseY < cancelButtonY + 40;
  
  fill(cancelButtonHovered ? color(100, 110, 130) : color(80, 90, 110));
  stroke(120, 130, 150);
  rect(cancelButtonX, cancelButtonY, 100, 40, 5);
  
  fill(255);
  textSize(16);
  textAlign(CENTER, CENTER);
  text("Cancel", cancelButtonX + 50, cancelButtonY + 20);
}

// Function to draw the leaderboard
function drawLeaderboard() {
  if (!showLeaderboard) return;
  
  // Semi-transparent overlay
  fill(0, 0, 0, 200);
  noStroke();
  rect(0, 0, width, height);
  
  // Leaderboard box
  let boardWidth = 500;
  let boardHeight = 500;
  let boardX = (width - boardWidth) / 2;
  let boardY = (height - boardHeight) / 2;
  
  // Leaderboard background
  fill(30, 35, 45);
  stroke(60, 70, 90);
  strokeWeight(2);
  rect(boardX, boardY, boardWidth, boardHeight, 10);
  
  // Title
  fill(255, 215, 0);
  textSize(32);
  textAlign(CENTER);
  text("Leaderboard", width/2, boardY + 50);
  
  // Headers
  fill(255, 165, 0);
  textSize(20);
  textAlign(LEFT);
  text("Rank", boardX + 50, boardY + 100);
  textAlign(LEFT);
  text("Nickname", boardX + 120, boardY + 100);
  textAlign(RIGHT);
  text("BTC / Rank", boardX + boardWidth - 50, boardY + 100);
  
  // Divider
  stroke(60, 70, 90);
  line(boardX + 30, boardY + 110, boardX + boardWidth - 30, boardY + 110);
  
  // Leaderboard entries
  if (leaderboardData.length === 0) {
    fill(200);
    textSize(18);
    textAlign(CENTER);
    text("No scores submitted yet", width/2, boardY + 200);
  } else {
    for (let i = 0; i < Math.min(leaderboardData.length, 10); i++) {
      let entry = leaderboardData[i];
      let y = boardY + 140 + i * 30;
      
      // Highlight current player's score
      if (entry.isCurrentPlayer) {
        fill(40, 45, 55);
        noStroke();
        rect(boardX + 30, y - 20, boardWidth - 60, 30);
      }
      
      // Rank
      fill(i < 3 ? color(255, 215, 0) : color(255));
      textSize(18);
      textAlign(LEFT);
      text(`#${i + 1}`, boardX + 50, y);
      
      // Nickname
      textAlign(LEFT);
      text(entry.nickname, boardX + 120, y);
      
      // Score and Bitcoiner Rank
      textAlign(RIGHT);
      text(`${entry.score.toFixed(8)} (${entry.rank})`, boardX + boardWidth - 50, y);
    }
  }
  
  // Close button
  let closeButtonX = boardX + boardWidth/2 - 50;
  let closeButtonY = boardY + boardHeight - 70;
  let closeButtonHovered = mouseX > closeButtonX && mouseX < closeButtonX + 100 &&
                          mouseY > closeButtonY && mouseY < closeButtonY + 40;
  
  fill(closeButtonHovered ? color(100, 110, 130) : color(80, 90, 110));
  stroke(120, 130, 150);
  rect(closeButtonX, closeButtonY, 100, 40, 5);
  
  fill(255);
  textSize(16);
  textAlign(CENTER, CENTER);
  text("Close", closeButtonX + 50, closeButtonY + 20);
}

// Function to submit score to Firebase
function submitScore() {
  if (!firebaseInitialized) {
    initializeFirebase();
    if (!firebaseInitialized) {
      leaderboardError = "Firebase not initialized. Please try again.";
      return;
    }
  }
  
  // Validate inputs
  if (!leaderboardNickname.trim()) {
    leaderboardError = "Please enter a nickname";
    return;
  }
  
  if (!leaderboardEmail.trim() || !validateEmail(leaderboardEmail)) {
    leaderboardError = "Please enter a valid email address";
    return;
  }
  
  // Get score data
  const btcAmount = coldStorage/100000000;
  const bitcoinerRank = getBitcoinerRank(btcAmount);
  
  // Create a new score entry with a unique key
  const scoreRef = database.ref('scores').push();
  const scoreKey = scoreRef.key;
  
  // Store public data
  database.ref(`scores/public/${scoreKey}`).set({
    nickname: leaderboardNickname,
    score: btcAmount,
    rank: bitcoinerRank,
    timestamp: firebase.database.ServerValue.TIMESTAMP
  });
  
  // Store private data separately
  database.ref(`scores/private/${scoreKey}`).set({
    email: leaderboardEmail,
    timestamp: firebase.database.ServerValue.TIMESTAMP
  });
  
  // Reset form and close dialog
  leaderboardNickname = "";
  leaderboardEmail = "";
  leaderboardError = "";
  showLeaderboardSubmitDialog = false;
  
  // Show leaderboard after submission
  fetchLeaderboard();
  showLeaderboard = true;
}

// Function to fetch leaderboard data
function fetchLeaderboard() {
  if (!firebaseInitialized) {
    initializeFirebase();
    if (!firebaseInitialized) {
      console.error("Firebase not initialized");
      return;
    }
  }
  
  // Get top 10 scores ordered by score (descending)
  database.ref('scores/public').orderByChild('score').limitToLast(10).once('value')
    .then(snapshot => {
      leaderboardData = [];
      const btcAmount = coldStorage/100000000;
      
      // Convert to array and sort
      snapshot.forEach(childSnapshot => {
        const data = childSnapshot.val();
        leaderboardData.push({
          id: childSnapshot.key,
          nickname: data.nickname,
          score: data.score,
          rank: data.rank,
          isCurrentPlayer: data.nickname === leaderboardNickname && Math.abs(data.score - btcAmount) < 0.00000001
        });
      });
      
      // Sort by score (descending)
      leaderboardData.sort((a, b) => b.score - a.score);
    })
    .catch(error => {
      console.error("Error fetching leaderboard:", error);
    });
}

// Email validation function
function validateEmail(email) {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
}