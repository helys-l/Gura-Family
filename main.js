const config = {
  type: Phaser.AUTO,
  width: window.innerWidth,
  height: window.innerHeight,
  pixelArt: true,
  zoom: 1,
  scene: {
    preload,
    create,
    update
  }
};

let player, cursors, eKey, enterKey;
let npcGroup, dialogueText, activeDialogue = null;
let mapBounds;
const game = new Phaser.Game(config);

function preload() {
  this.load.image('tiles', 'assets/tilesets/map.jpg');
  this.load.tilemapTiledJSON('map', 'assets/maps/map.json');
  this.load.json('pokemon_tileset', 'assets/tilesets/pokemon_tileset.json');
  this.load.spritesheet('gura', 'assets/characters/gura.png', {
    frameWidth: 70, frameHeight: 70
  });
  this.load.spritesheet('gura-clone', 'assets/characters/gura-clone.png', {
    frameWidth: 70, frameHeight: 70
  });
}

function create() {
  const map = this.make.tilemap({ key: 'map' });
  const tileset = map.addTilesetImage('pokemon_tileset', 'tiles');
  map.createLayer('Ground', tileset, 0, 0);

  player = this.add.sprite(500, 500, 'gura-clone', 0).setOrigin(0.5, 0.8).setScale(0.7);
  this.anims.create({ key: 'walk-down', frames: this.anims.generateFrameNumbers('gura-clone', { start: 0, end: 2 }), frameRate: 6, repeat: -1 });
  this.anims.create({ key: 'walk-left', frames: this.anims.generateFrameNumbers('gura-clone', { start: 3, end: 5 }), frameRate: 6, repeat: -1 });
  this.anims.create({ key: 'walk-right', frames: this.anims.generateFrameNumbers('gura-clone', { start: 6, end: 8 }), frameRate: 6, repeat: -1 });
  this.anims.create({ key: 'walk-up', frames: this.anims.generateFrameNumbers('gura-clone', { start: 9, end: 11 }), frameRate: 6, repeat: -1 });
  this.anims.create({ key: 'npc-turning', frames: this.anims.generateFrameNumbers('gura', { start: 0, end: 11 }), frameRate: 4, repeat: -1 });

  cursors = this.input.keyboard.createCursorKeys();
  eKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.E);
  enterKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ENTER);

  npcGroup = this.add.group();
  const npcLayer = map.getObjectLayer('NPCs_And_Events');
  npcLayer.objects.forEach(obj => {
    if (obj.type === 'npc') {
      const npc = this.add.sprite(obj.x, obj.y, 'gura-clone', 0).setOrigin(0.5, 0.8).setScale(0.7);
      npc.name = obj.name;
      npc.dialogue = obj.properties?.find(p => p.name === 'dialogue')?.value || '';
      npc.anims.play('npc-turning');
      npcGroup.add(npc);
    } else if (obj.type === 'door') {
      // Untuk objek seperti pintu tanpa sprite
      const door = this.add.rectangle(obj.x, obj.y, obj.width, obj.height, 0x000000,0.01)
        .setOrigin(0.5)
        .setInteractive(); // opsional jika ingin klik mouse
      door.name = obj.name;
      door.dialogue = obj.properties?.find(p => p.name === 'dialogue')?.value || 'Sebuah pintu.';
      npcGroup.add(door);
    }
  });

  this.collisions = this.add.group();
  const collisionsLayer = map.getObjectLayer('Collisions');
  collisionsLayer?.objects?.forEach(obj => {
    if (obj.type === 'barrier' && obj.properties?.some(p => p.name === 'collides' && p.value === true)) {
      const obstacle = this.add.rectangle(obj.x, obj.y, obj.width, obj.height).setVisible(false).setOrigin(0.5);
      this.collisions.add(obstacle);
    }
  });

  this.cameras.main.startFollow(player);
  this.cameras.main.setBounds(0, 0, map.widthInPixels, map.heightInPixels);
  mapBounds = { width: map.widthInPixels, height: map.heightInPixels };

  dialogueText = this.add.text(0, 0, '', {
    fontSize: '16px', fill: '#ffffff',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    padding: { x: 8, y: 4 },
    wordWrap: { width: 200 }
  }).setVisible(false);

  window.addEventListener('resize', () => {
    this.scale.resize(window.innerWidth, window.innerHeight);
  });
  
  this.minigameWins = {
    clone1: false,
    clone2: false,
    clone3: false,
    clone4: false,
    clone5: false,
    clone6: false,
    clone7: false,
    clone8: false
  };
  
}

function update() {
  const scene = this;

  if (scene.isMiniGameActive) {
    player.anims.stop();
    return; // Skip semua update kalau lagi main mini-game
  }
  let moving = false;
  const speed = 2;
  let nextX = player.x;
  let nextY = player.y;

  if (cursors.left.isDown) nextX -= speed;
  else if (cursors.right.isDown) nextX += speed;
  if (cursors.up.isDown) nextY -= speed;
  else if (cursors.down.isDown) nextY += speed;

  let canMove = true;
  npcGroup.getChildren().forEach(npc => {
    const dist = Phaser.Math.Distance.Between(nextX, nextY, npc.x, npc.y);
    if (dist < 45) canMove = false;
  });
  this.collisions?.getChildren().forEach(obstacle => {
    if (obstacle.getBounds().contains(nextX, nextY)) canMove = false;
  });

  const halfWidth = player.displayWidth / 2;
  const halfHeight = player.displayHeight / 2;
  if (canMove) {
    if (cursors.left.isDown && nextX - halfWidth > 0) {
      player.x -= speed;
      player.anims.play('walk-left', true);
      moving = true;
    } else if (cursors.right.isDown && nextX + halfWidth < mapBounds.width) {
      player.x += speed;
      player.anims.play('walk-right', true);
      moving = true;
    }

    if (cursors.up.isDown && nextY - halfHeight > 0) {
      player.y -= speed;
      player.anims.play('walk-up', true);
      moving = true;
    } else if (cursors.down.isDown && nextY + halfHeight < mapBounds.height) {
      player.y += speed;
      player.anims.play('walk-down', true);
      moving = true;
    }
  }

  if (!moving) player.anims.stop();

  // Deteksi interaksi NPC
  let nearestNpc = null;
  let minDistance = 50;
  npcGroup.getChildren().forEach(npc => {
    const dist = Phaser.Math.Distance.Between(player.x, player.y, npc.x, npc.y);
    if (dist < minDistance) {
      nearestNpc = npc;
      minDistance = dist;
    }
  });

  if (nearestNpc && Phaser.Input.Keyboard.JustDown(eKey)) {
    dialogueText.setText(nearestNpc.dialogue);
    dialogueText.setPosition(nearestNpc.x - 100, nearestNpc.y - 100);
    dialogueText.setVisible(true);
    activeDialogue = nearestNpc;
  }

  if (activeDialogue) {
    const distance = Phaser.Math.Distance.Between(player.x, player.y, activeDialogue.x, activeDialogue.y);
    if (distance > 60) {
      dialogueText.setVisible(false);
      activeDialogue = null;
    }

    // Jika Enter ditekan saat dialog aktif
    if (Phaser.Input.Keyboard.JustDown(enterKey)) {
      if (activeDialogue.name.startsWith("clone")) {
        startMiniGame(activeDialogue.name); // ← ini akan memicu sesuai clone
        dialogueText.setVisible(false);
        activeDialogue = null;
      }
    }
    
  }
}

function playGameClone1(scene, callback) {
  const centerX = scene.cameras.main.width / 2;
  const centerY = scene.cameras.main.height / 2;

  let bg, instructionText, guessText, currentGuessText, retryText;
  let started = false;
  let guess = 1;
  let secretNumber = Phaser.Math.Between(1, 5);
  let winLabel;

  const showInstruction = () => {
    bg = scene.add.rectangle(centerX, centerY, scene.cameras.main.width, 330, 0x000000, 0.7);
    
    if (scene.minigameWins?.clone1) {
      winLabel = scene.add.text(centerX, centerY - 150, 'Pernah Dimenangkan', {
        fontSize: '16px',
        fill: '#00ffcc'
      }).setOrigin(0.5);
    }
    instructionText = scene.add.text(centerX, centerY, 'Tebak Angka Rahasia\nTekan [S] untuk mulai', {
      fontSize: '20px',
      fill: '#fff',
      align: 'center',
      wordWrap: { width: scene.cameras.main.width - 40 }
    }).setOrigin(0.5);
  };

  const startGame = () => {
    started = true;
    guess = 1;
    secretNumber = Phaser.Math.Between(1, 5);
    instructionText?.destroy();

    guessText = scene.add.text(centerX, centerY - 40, 'Tebak angka 1–5\nGunakan ← → lalu Enter', {
      fontSize: '18px',
      fill: '#fff',
      align: 'center'
    }).setOrigin(0.5);

    currentGuessText = scene.add.text(centerX, centerY + 20, `Tebakan: ${guess}`, {
      fontSize: '24px',
      fill: '#ff0',
      align: 'center'
    }).setOrigin(0.5);
  };

  const updateGuessText = () => {
    if (currentGuessText) {
      currentGuessText.setText(`Tebakan: ${guess}`);
    }
  };

  const endGame = (message) => {
    guessText.setText(message);
    currentGuessText.destroy();

    retryText = scene.add.text(centerX, centerY + 60, 'Main Lagi? [Y] Ya / [T] Tidak', {
      fontSize: '18px',
      fill: '#ffffff',
      align: 'center'
    }).setOrigin(0.5);

    const retryHandler = (e) => {
      if (e.code === 'KeyY') {
        scene.input.keyboard.off('keydown', retryHandler);
        guessText.destroy();
        retryText.destroy();
        startGame();
      } else if (e.code === 'KeyT') {
        scene.input.keyboard.off('keydown', retryHandler);
        guessText.destroy();
        retryText.destroy();
        bg.destroy();
        if (winLabel) winLabel.destroy();
        scene.input.keyboard.off('keydown', keyHandler);
        checkAllMinigamesComplete(scene); // ← Tambahkan ini

        callback();
      }
    };

    scene.input.keyboard.on('keydown', retryHandler);
  };

  const keyHandler = (event) => {
    if (!started && event.code === 'KeyS') {
      startGame();
      return;
    }

    if (!started) return;

    switch (event.code) {
      case 'ArrowLeft':
        guess = guess > 1 ? guess - 1 : 5;
        updateGuessText();
        break;
      case 'ArrowRight':
        guess = guess < 5 ? guess + 1 : 1;
        updateGuessText();
        break;
      case 'Enter':
        if (guess === secretNumber && Math.random()) {
          scene.minigameWins.clone1 = true;
          endGame('Tebakan benar!\nKamu menang!');
          scene.minigameWins.clone1 = true;
        } else {
          endGame(`Salah! Jawaban: ${secretNumber}`);
        }
        break;
    }
  };

  showInstruction();
  scene.input.keyboard.on('keydown', keyHandler);
}




function playGameClone2(scene, callback) {
  const centerX = scene.cameras.main.width / 2;
  const centerY = scene.cameras.main.height / 2;

  let bg, instructionText, gameText, retryText, winLabel;
  let started = false;
  let active = false;
  let waitingForSignal = false;
  let startTime = 0;
  let playerReacted = false;
  let aiReacted = false;
  let aiTime = 0;
  let playerTime = 0;

  function showInstruction() {
    bg = scene.add.rectangle(centerX, centerY, scene.cameras.main.width, 330, 0x000000, 0.7);

    if (scene.minigameWins?.clone2) {
      winLabel = scene.add.text(centerX, centerY - 150, 'Pernah Dimenangkan', {
        fontSize: '16px',
        fill: '#00ffcc'
      }).setOrigin(0.5);
    }

    instructionText = scene.add.text(centerX, centerY,
      'Uji Reaksi Refleks!\nTekan [S] untuk mulai\nTekan [A] saat sinyal muncul untuk bereaksi', {
        fontSize: '20px',
        fill: '#fff',
        align: 'center',
        wordWrap: { width: scene.cameras.main.width - 40 }
      }).setOrigin(0.5);
  }

  function resetGame() {
    active = false;
    waitingForSignal = false;
    playerReacted = false;
    aiReacted = false;
    aiTime = 0;
    playerTime = 0;
  }

  function startGame() {
    resetGame();
    started = true;

    instructionText?.destroy();
    retryText?.destroy();
    winLabel?.destroy();

    if (!gameText) {
      gameText = scene.add.text(centerX, centerY, '', {
        fontSize: '18px',
        fill: '#fff',
        align: 'center'
      }).setOrigin(0.5);
    } else {
      gameText.setText('');
      gameText.setVisible(true);
    }

    gameText.setText('Tunggu sinyal...');
    waitingForSignal = true;

    const delay = Phaser.Math.Between(1000, 3000);
    scene.time.delayedCall(delay, () => {
      if (!started) return;

      waitingForSignal = false;
      active = true;
      startTime = scene.time.now;
      gameText.setText('TEKAN [A] SEKARANG!');

      const aiDelay = Phaser.Math.Between(200, 350);
      scene.time.delayedCall(aiDelay, () => {
        if (!playerReacted && active) {
          aiTime = scene.time.now - startTime;
          aiReacted = true;
          endGame();
        }
      });
    });
  }

  function endGame() {
    active = false;
    let resultText = '';

    if (playerReacted) {
      if (aiReacted) {
        if (playerTime < aiTime) {
          resultText = `Kamu menang!\nKamu: ${playerTime.toFixed(0)}ms\nGweh: ${aiTime.toFixed(0)}ms`;
          scene.minigameWins.clone2 = true;
        } else if (aiTime < playerTime) {
          resultText = `Gweh menang!\nKamu: ${playerTime.toFixed(0)}ms\nGweh: ${aiTime.toFixed(0)}ms`;
        } else {
          resultText = `Seri!\nKamu & Gweh: ${playerTime.toFixed(0)}ms`;
        }
      } else {
        resultText = `Kamu menang!\nWaktu: ${playerTime.toFixed(0)}ms`;
        scene.minigameWins.clone2 = true;
      }
    } else if (aiReacted) {
      resultText = `Terlambat! Gweh menang!\nGweh: ${aiTime.toFixed(0)}ms`;
    }

    if (!gameText) {
      gameText = scene.add.text(centerX, centerY, resultText, {
        fontSize: '18px',
        fill: '#fff',
        align: 'center'
      }).setOrigin(0.5);
    } else {
      gameText.setText(resultText);
      gameText.setVisible(true);
    }

    showRetryPrompt();
  }

  function showRetryPrompt() {
    if (retryText) {
      retryText.destroy();
    }

    retryText = scene.add.text(centerX, centerY + 60, 'Main Lagi? [Y] Ya / [T] Tidak', {
      fontSize: '18px',
      fill: '#ffffff',
      align: 'center'
    }).setOrigin(0.5);

    const retryHandler = (e) => {
      if (e.code === 'KeyY') {
        scene.input.keyboard.off('keydown', retryHandler);
        startGame();
      } else if (e.code === 'KeyT') {
        scene.input.keyboard.off('keydown', retryHandler);
        bg?.destroy();
        gameText?.destroy();
        retryText?.destroy();
        instructionText?.destroy();
        winLabel?.destroy();
        scene.input.keyboard.off('keydown', onKeyPress);
        checkAllMinigamesComplete(scene); // ← Tambahkan ini

        callback();
      }
    };

    scene.input.keyboard.on('keydown', retryHandler);
  }

  function onKeyPress(event) {
    if (!started && event.code === 'KeyS') {
      startGame();
      return;
    }

    if (!started) return;

    if (event.code === 'KeyA') {
      if (waitingForSignal) {
        waitingForSignal = false;
        active = false;
        if (gameText) gameText.setText('Kecepetan! Gagal!');

        scene.time.delayedCall(1000, () => {
          if (gameText) gameText.setVisible(false); // tidak destroy agar aman
          showRetryPrompt();
        });
      } else if (active && !playerReacted) {
        playerTime = scene.time.now - startTime;
        playerReacted = true;
        if (!aiReacted) {
          endGame();
        }
      }
    }
  }

  showInstruction();
  scene.input.keyboard.off('keydown', onKeyPress);
  scene.input.keyboard.on('keydown', onKeyPress);
}







function playGameClone3(scene, callback) {
  const centerX = scene.cameras.main.width / 2;
  const centerY = scene.cameras.main.height;

  const choices = ['Batu', 'Gunting', 'Kertas', 'Lizard', 'Spock', 'Roket'];
  let playerChoice = 0;

  const winRules = {
    'Batu': ['Gunting', 'Lizard'],
    'Gunting': ['Kertas', 'Lizard'],
    'Kertas': ['Batu', 'Spock'],
    'Lizard': ['Spock', 'Kertas'],
    'Spock': ['Gunting', 'Batu'],
    'Roket': ['Spock', 'Lizard']
  };

  const bg = scene.add.rectangle(centerX, centerY, scene.cameras.main.width, 400, 0x000000, 0.7);
  let winLabel;
  if (scene.minigameWins?.clone3) {
    {
      winLabel = scene.add.text(centerX, centerY - 180, 'Pernah Dimenangkan', {
        fontSize: '16px',
        fill: '#00ffcc'
      }).setOrigin(0.5);
    }
  }

  const rulesText = Object.entries(winRules).map(([key, wins]) => {
    return `${key} > ${wins.join(' & ')}`;
  }).join('\n');

  const instructionText = scene.add.text(centerX, centerY - 90,
    `Pilih tanganmu!\nGunakan ← → lalu tekan [Enter]\n\n${rulesText}`, {
      fontSize: '18px',
      fill: '#ffffff',
      align: 'center',
      wordWrap: { width: 500 }
    }).setOrigin(0.5);

  const choiceText = scene.add.text(centerX, centerY + 50, `Pilihanmu: ${choices[playerChoice]}`, {
    fontSize: '22px',
    fill: '#ffff00',
    align: 'center'
  }).setOrigin(0.5);

  const messageText = scene.add.text(centerX, centerY + 100, '', {
    fontSize: '24px',
    fill: '#ffffff',
    align: 'center'
  }).setOrigin(0.5);

  const leftKey = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT);
  const rightKey = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT);
  const enterKey = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ENTER);

  function updateChoice() {
    choiceText.setText(`Pilihanmu: ${choices[playerChoice]}`);
  }

  function result(player, ai) {
    if (player === ai) return 'Seri!';
    if (winRules[player].includes(ai)) {
      // Jika player menang, set status kemenangan
      scene.minigameWins.clone3 = true;
      return 'Kamu menang!';
    }
    return 'Kamu kalah!';
  }
  
  

  function getBiasedAIChoice(playerChoice) {
    const player = choices[playerChoice];

    const rand = Math.random();
    if (rand < 0.40) {
      // player wins
      return Phaser.Utils.Array.GetRandom(winRules[player]);
    } else if (rand < 0.30) {
      // draw
      return player;
    } else {
      // AI wins
      const beatsPlayer = choices.filter(c => winRules[c].includes(player));
      return Phaser.Utils.Array.GetRandom(beatsPlayer);
    }
  }

  function showRetryPrompt() {
    const retryText = scene.add.text(centerX, centerY + 140, 'Main Lagi? [Y] Ya / [T] Tidak', {
      fontSize: '20px',
      fill: '#ffffff',
      align: 'center'
    }).setOrigin(0.5);

    const retryHandler = (e) => {
      if (e.code === 'KeyY') {
        scene.input.keyboard.off('keydown', retryHandler);
        retryText.destroy();
        messageText.setText('');
        instructionText.setText(`Pilih tanganmu!\nGunakan ← → lalu tekan [Enter]\n\n${rulesText}`);
        playerChoice = 0;
        updateChoice();
        scene.input.keyboard.on('keydown', onKeyDown);
      } else if (e.code === 'KeyT') {
        scene.input.keyboard.off('keydown', retryHandler);
        bg.destroy();
        instructionText.destroy();
        choiceText.destroy();
        messageText.destroy();
        retryText.destroy();
        if (winLabel) winLabel.destroy();
        checkAllMinigamesComplete(scene); // ← Tambahkan ini

        callback();
      }
    };

    scene.input.keyboard.on('keydown', retryHandler);
  }

  function onKeyDown() {
    if (Phaser.Input.Keyboard.JustDown(leftKey)) {
      playerChoice = (playerChoice + choices.length - 1) % choices.length;
      updateChoice();
    } else if (Phaser.Input.Keyboard.JustDown(rightKey)) {
      playerChoice = (playerChoice + 1) % choices.length;
      updateChoice();
    } else if (Phaser.Input.Keyboard.JustDown(enterKey)) {
      scene.input.keyboard.off('keydown', onKeyDown);
      const aiChoice = getBiasedAIChoice(playerChoice);

      messageText.setText('Jan!');
      scene.time.delayedCall(500, () => {
        messageText.setText('Ken!');
        scene.time.delayedCall(500, () => {
          messageText.setText('Pon!');
          scene.time.delayedCall(500, () => {
            const hasil = result(choices[playerChoice], aiChoice);
            instructionText.setText(`Gweh pilih: ${aiChoice}\n${hasil}`);
            choiceText.setText('');
            messageText.setText('');
            showRetryPrompt();
          });
        });
      });
    }
  }

  scene.input.keyboard.on('keydown', onKeyDown);
}



function playGameClone4(scene, callback) {
  const centerX = scene.cameras.main.width / 2;
  const centerY = scene.cameras.main.height;

  const colors = ['🔴', '🟢', '🔵', '🟡'];
  let sequence = [];
  let playerInput = [];
  let inputIndex = 0;
  let playingSequence = false; // Flag penting untuk mengunci input saat pola dimainkan

  const bg = scene.add.rectangle(centerX, centerY, scene.cameras.main.width, 330, 0x000000, 0.7);

  let winLabel;
  if (scene.minigameWins?.clone4) {
    winLabel = scene.add.text(centerX, centerY - 150, 'Pernah Dimenangkan', {
      fontSize: '16px',
      fill: '#00ffcc'
    }).setOrigin(0.5);
  }

  const instruction = scene.add.text(centerX, centerY - 30, 'Uji Pola Ingatan!\nTekan [S] untuk mulai', {
    fontSize: '20px',
    fill: '#ffffff',
    align: 'center'
  }).setOrigin(0.5);

  const display = scene.add.text(centerX, centerY + 20, '', {
    fontSize: '40px',
    align: 'center'
  }).setOrigin(0.5);

  const keys = [
    scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ONE),
    scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.TWO),
    scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.THREE),
    scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.FOUR)
  ];

  const sKey = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S);
  let started = false;

  function startGame() {
    started = true;
    instruction.setText('1🔴 2🟢 3🔵 4🟡');

    let countdown = 3;
    instruction.setText(`Mulai dalam ${countdown}...`);

    const countdownInterval = scene.time.addEvent({
      delay: 1000,
      callback: () => {
        countdown--;
        instruction.setText(`Mulai dalam ${countdown}...`);
        if (countdown <= 0) {
          scene.time.removeEvent(countdownInterval);
          instruction.setText('START\n1🔴 2🟢 3🔵 4🟡');
          scene.time.delayedCall(1000, () => {
            sequence = [];
            playerInput = [];
            inputIndex = 0;

            for (let i = 0; i < 5; i++) {
              sequence.push(Phaser.Math.Between(0, 3));
            }

            playSequence(0);
          });
        }
      },
      loop: true
    });
  }

  function playSequence(index) {
    if (index === 0) {
      playingSequence = true;
    }

    if (index >= sequence.length) {
      scene.time.delayedCall(1000, () => {
        display.setText('Ulangi Pola!');
        playingSequence = false;
      });
      return;
    }

    display.setText(colors[sequence[index]]);
    scene.time.delayedCall(1000, () => {
      display.setText('');
      scene.time.delayedCall(1000, () => {
        playSequence(index + 1);
      });
    });
  }

  function onKeyDown(e) {
    if (!started && Phaser.Input.Keyboard.JustDown(sKey)) {
      startGame();
      return;
    }

    if (!started || playerInput.length >= sequence.length || playingSequence) return;

    for (let j = 0; j < keys.length; j++) {
      if (Phaser.Input.Keyboard.JustDown(keys[j])) {
        playerInput.push(j);
        if (j !== sequence[inputIndex]) {
          display.setText('Salah! Gagal!');
          showRetryPrompt();
          return;
        }
        inputIndex++;
        if (inputIndex === sequence.length) {
          display.setText('Benar! Kamu Menang!');
          scene.minigameWins.clone4 = true;
          showRetryPrompt();
        }
      }
    }
  }

  function showRetryPrompt() {
    scene.input.keyboard.off('keydown', onKeyDown);
    scene.time.delayedCall(1500, () => {
      display.setText('');
      const retryText = scene.add.text(centerX, centerY + 70, 'Main Lagi? [Y] Ya / [T] Tidak', {
        fontSize: '20px',
        fill: '#ffffff'
      }).setOrigin(0.5);

      const retryHandler = e => {
        if (e.code === 'KeyY') {
          scene.input.keyboard.off('keydown', retryHandler);
          retryText.destroy();
          display.setText('');
          startGame();
          scene.input.keyboard.on('keydown', onKeyDown);
        } else if (e.code === 'KeyT') {
          scene.input.keyboard.off('keydown', retryHandler);
          retryText.destroy();
          bg.destroy();
          instruction.destroy();
          display.destroy();
          if (winLabel) winLabel.destroy();
          checkAllMinigamesComplete(scene); // ← Tambahkan ini

          callback();
        }
      };

      scene.input.keyboard.on('keydown', retryHandler);
    });
  }

  scene.input.keyboard.on('keydown', onKeyDown);
}




// Clone 5: Tembak Tepat Sasaran
function playGameClone5(scene, callback) {
  const centerX = scene.cameras.main.width / 2;
  const centerY = scene.cameras.main.height;

  const bg = scene.add.rectangle(centerX, centerY, scene.cameras.main.width, 300, 0x000000, 0.7);
  let winLabel;

  if (scene.minigameWins?.clone5) {
    winLabel = scene.add.text(centerX, centerY - 130, 'Pernah Dimenangkan', {
      fontSize: '16px',
      fill: '#00ffcc'
    }).setOrigin(0.5);
  }

  const instruction = scene.add.text(centerX, centerY - 30, 'Tekan [S] untuk menembak target yang bergerak.', {
    fontSize: '20px',
    fill: '#ffffff',
    align: 'center'
  }).setOrigin(0.5);

  const startText = scene.add.text(centerX, centerY + 20, '[S] Mulai', {
    fontSize: '22px',
    fill: '#ffff00',
    align: 'center'
  }).setOrigin(0.5);

  const startKeyHandler = e => {
    if (e.code === 'KeyS') {
      instruction.destroy();
      startText.destroy();
      scene.input.keyboard.off('keydown', startKeyHandler);
      startGame();
    }
  };

  scene.input.keyboard.on('keydown', startKeyHandler);

  function startGame() {
   
    const target = scene.add.rectangle(100, centerY - 100, 30, 30, 0xff0000);
    const infoText = scene.add.text(centerX, centerY - 50, 'Target bergerak... tekan [SPACE]!', {
      fontSize: '18px',
      fill: '#ffffff'
    }).setOrigin(0.5);

    const crosshair = scene.add.circle(centerX, centerY - 100, 5, 0x00ff00);

    let playerShot = null, aiShot = null;
    const moveTween = scene.tweens.add({
      targets: target,
      x: centerX + 200,
      duration: 2000,
      yoyo: true,
      repeat: -1
    });

    const shoot = () => {
      if (playerShot !== null) return;

      playerShot = Math.abs(target.x - centerX);
      aiShot = Phaser.Math.Between(1, 10);
      moveTween.stop();

      const bullet = scene.add.rectangle(centerX, centerY, 4, 20, 0xffff00);
      scene.tweens.add({
        targets: bullet,
        y: centerY - 120,
        duration: 200,
        onComplete: () => bullet.destroy()
      });

      const result =
        playerShot < aiShot ? 'Kamu lebih akurat!'  :
        playerShot > aiShot ? 'Gweh lebih akurat!' :
        'Kamu Seri!';

      infoText.setText(`${result}\nJarakmu: ${playerShot.toFixed(1)} | Gweh: ${aiShot}`);
      if (playerShot < aiShot) {
        scene.minigameWins.clone5 = true;
      }

      scene.input.keyboard.off('keydown', shoot);

      scene.time.delayedCall(2000, () => {
        showRetryPrompt(target, infoText, crosshair);
      });
    };

    scene.input.keyboard.on('keydown', e => {
      if (e.code === 'Space') shoot();
    });
  }

  function showRetryPrompt(target, infoText, crosshair) {
    const retryText = scene.add.text(centerX, centerY + 80, 'Main Lagi? [Y] Ya / [T] Tidak', {
      fontSize: '20px',
      fill: '#ffffff'
    }).setOrigin(0.5);

    const retryHandler = e => {
      if (e.code === 'KeyY') {
        scene.input.keyboard.off('keydown', retryHandler);
        retryText.destroy();
        target.destroy();
        infoText.destroy();
        crosshair.destroy();
        startGame();
      } else if (e.code === 'KeyT') {
        scene.input.keyboard.off('keydown', retryHandler);
        retryText.destroy();
        target.destroy();
        infoText.destroy();
        crosshair.destroy();
        if (winLabel) winLabel.destroy();
        bg.destroy();
        checkAllMinigamesComplete(scene); // ← Tambahkan ini

        callback(); // kembali ke game utama
      }
    };

    scene.input.keyboard.on('keydown', retryHandler);
  }
}



// Clone 6: Balapan Lari
function playGameClone6(scene, callback) {
  const centerX = scene.cameras.main.width / 2;
  const centerY = scene.cameras.main.height;
  const bg = scene.add.rectangle(centerX, centerY, scene.cameras.main.width, 400, 0x000000, 0.7);
  let winLabel;
  // Tambahkan tulisan jika pernah menang
  if (scene.minigameWins.clone6) {
    winLabel=scene.add.text(centerX, centerY + 50, 'Pernah Dimenangkan', {
      fontSize: '12px',
      fill: '#00ffcc'
    }).setOrigin(0.5);
  }
  

  const instruction = scene.add.text(centerX, centerY - 30, 'Ketik "go" berulang kali untuk berlari lebih cepat dari Gweh!', {
    fontSize: '20px',
    fill: '#ffffff',
    align: 'center',
    wordWrap: { width: 600 }
  }).setOrigin(0.5);

  const startText = scene.add.text(centerX, centerY + 20, '[S] Mulai', {
    fontSize: '22px',
    fill: '#ffff00',
    align: 'center'
  }).setOrigin(0.5);

  scene.input.keyboard.on('keydown', function waitForS(e) {
    if (e.code === 'KeyS') {
      instruction.destroy();
      startText.destroy();
      scene.input.keyboard.off('keydown', waitForS);
      startGame();
    }
  });

  function startGame() {
    
    const finishLineX = 600;

    const finishLine = scene.add.rectangle(finishLineX, centerY - 75, 4, 100, 0xffffff);
    const finishLabel = scene.add.text(finishLineX + 10, centerY - 130, 'FINISH', {
      fontSize: '16px',
      fill: '#ffff00',
      fontStyle: 'bold'
    }).setOrigin(0.5);

    const player = scene.add.rectangle(100, centerY - 100, 30, 30, 0x00ff00);
    const ai = scene.add.rectangle(100, centerY - 50, 30, 30, 0xff0000);
    const infoText = scene.add.text(300, centerY - 180, '', { fontSize: '18px', fill: '#fff' });

    const targetWord = 'go';
    let currentInputIndex = 0;
    let gameEnded = false;

    const raceTimer = scene.time.addEvent({
      delay: 100,
      loop: true,
      callback: () => {
        if (gameEnded) return;

        ai.x += Phaser.Math.Between(2, 4);
        if (player.x >= finishLineX || ai.x >= finishLineX) {
          gameEnded = true;
          const result = player.x >= finishLineX && ai.x >= finishLineX
            ? 'Seri!'
            : player.x >= finishLineX
            ? 'Kamu Menang!'
            : 'Gweh Menang!';
          infoText.setText(result);
          showRetryPrompt();
        }
      }
    });

    const move = (e) => {
      if (gameEnded) return;

      const expectedKey = targetWord[currentInputIndex];
      const typedKey = e.key.toLowerCase();

      if (typedKey === expectedKey) {
        currentInputIndex++;
        if (currentInputIndex >= targetWord.length) {
          player.x += 8;
          currentInputIndex = 0;
        }
      } else {
        currentInputIndex = 0;
      }
    };

    scene.input.keyboard.on('keydown', move);

    function showRetryPrompt() {
      // Cek siapa yang menang
      const playerWon = player.x >= finishLineX && player.x > ai.x;
    
      // Jika menang, tandai
      if (playerWon) {
        scene.minigameWins.clone6 = true;
      }
    
      const retryText = scene.add.text(centerX, centerY + 60, 'Main Lagi? [Y] Ya / [T] Tidak', {
        fontSize: '20px',
        fill: '#ffffff'
      }).setOrigin(0.5);
    
      const retryHandler = (e) => {
        if (e.code === 'KeyY') {
          scene.input.keyboard.off('keydown', retryHandler);
          retryText.destroy();
          player.destroy();
          ai.destroy();
          finishLine.destroy();
          finishLabel.destroy();
          infoText.destroy();
          scene.input.keyboard.off('keydown', move);
          raceTimer.remove();
          startGame();
        } else if (e.code === 'KeyT') {
          scene.input.keyboard.off('keydown', retryHandler);
          retryText.destroy();
          player.destroy();
          ai.destroy();
          finishLine.destroy();
          finishLabel.destroy();
          infoText.destroy();
          bg.destroy();
          scene.input.keyboard.off('keydown', move);
          raceTimer.remove();
          if (winLabel) winLabel.destroy(); // Hapus tulisan pernah menang
          checkAllMinigamesComplete(scene); // ← Tambahkan ini

          callback();
        }
      };
    
      scene.input.keyboard.on('keydown', retryHandler);
    }
  }}    


// Clone 7: Hitung Cepat
function playGameClone7(scene, callback) {
  const centerX = scene.cameras.main.width / 2;
  const centerY = scene.cameras.main.height;

  const bg = scene.add.rectangle(centerX, centerY, scene.cameras.main.width, 400, 0x000000, 0.7);
  let winLabel;
  if (scene.minigameWins.clone7) {
    winLabel=scene.add.text(centerX, centerY + 30, 'Pernah Dimenangkan', {
      fontSize: '16px',
      fill: '#00ffcc'
    }).setOrigin(0.5);
  }

  const instruction = scene.add.text(centerX, centerY - 30, 'Jawab soal matematika dengan cepat!\nTekan [ENTER] untuk konfirmasi jawaban.\nKamu hanya punya 30 detik!', {
    fontSize: '20px',
    fill: '#ffffff',
    align: 'center',
    wordWrap: { width: 600 }
  }).setOrigin(0.5);

  const startText = scene.add.text(centerX, centerY + 20, '[S] Mulai', {
    fontSize: '22px',
    fill: '#ffff00',
    align: 'center'
  }).setOrigin(0.5);

  scene.input.keyboard.on('keydown', function waitForS(e) {
    if (e.code === 'KeyS') {
      instruction.destroy();
      startText.destroy();
      scene.input.keyboard.off('keydown', waitForS);
      startGame();
    }
  });

  function startGame() {
    const randNum = () => Phaser.Math.Between(1, 50);
    const randOp = () => ['+', '-', '*', '/'][Phaser.Math.Between(0, 3)];

    const n = randNum();
    const r = randNum();
    const s = randNum();
    const o = randNum();
    const op1 = randOp();
    const op2 = randOp();
    const op3 = randOp();

    const expression = `${n} ${op1} ${r} ${op2} ${s} ${op3} ${o}`;
    let answer;

    try {
      answer = Math.floor(eval(expression)); // pakai eval dengan pengaman
    } catch {
      answer = 0; // fallback
    }

    const question = scene.add.text(centerX, centerY - 80, `Hitung: ${expression} = ?`, {
      fontSize: '20px', fill: '#ffffff'
    }).setOrigin(0.5);

    const inputText = scene.add.text(centerX, centerY - 40, '', {
      fontSize: '22px', fill: '#ffff00'
    }).setOrigin(0.5);

    let userInput = '';

    const inputHandler = e => {
      if (e.code.startsWith('Digit') || e.code.startsWith('Numpad')) {
        userInput += e.key;
        inputText.setText(userInput);
      } else if (e.code === 'Minus') {
        if (userInput.length === 0) {
          userInput = '-' + userInput;
          inputText.setText(userInput);
        }
      } else if (e.code === 'Backspace') {
        userInput = userInput.slice(0, -1);
        inputText.setText(userInput);
      } else if (e.code === 'Enter') {
        validateAnswer();
      }
    };

    scene.input.keyboard.on('keydown', inputHandler);

    const timerText = scene.add.text(centerX, centerY - 120, 'Waktu: 30', {
      fontSize: '18px',
      fill: '#ffcc00'
    }).setOrigin(0.5);

    let timeLeft = 30;
    const countdown = scene.time.addEvent({
      delay: 1000,
      repeat: 29,
      callback: () => {
        timeLeft--;
        timerText.setText(`Waktu: ${timeLeft}`);
        if (timeLeft === 0) {
          question.setText(`Waktu Habis! Jawaban: ${answer}`);
          endGame(false);
        }
      }
    });

    function validateAnswer() {
      const userAns = parseInt(userInput);
      const win = userAns === answer;
      question.setText(win ? 'Kamu Benar!' : `Salah! Jawaban: ${answer}`);
      endGame(win);
    }

    function endGame(win) {
      countdown.remove();
      scene.input.keyboard.off('keydown', inputHandler);

      if (win) {
        scene.minigameWins.clone7 = true;
      }
      
      const retryText = scene.add.text(centerX, centerY + 60, 'Main Lagi? [Y] Ya / [T] Tidak', {
        fontSize: '20px',
        fill: '#ffffff'
      }).setOrigin(0.5);

      const retryHandler = e => {
        if (e.code === 'KeyY') {
          scene.input.keyboard.off('keydown', retryHandler);
          question.destroy();
          inputText.destroy();
          timerText.destroy();
          retryText.destroy();
          startGame(); // ulangi
        } else if (e.code === 'KeyT') {
          scene.input.keyboard.off('keydown', retryHandler);
          question.destroy();
          inputText.destroy();
          timerText.destroy();
          retryText.destroy();
          if (winLabel) winLabel.destroy(); // hapus tulisan pernah menang
          bg.destroy();
          checkAllMinigamesComplete(scene);

          callback(); // kembali ke game utama
        }
      };

      scene.input.keyboard.on('keydown', retryHandler);
    }
  }
}



// Clone 8: tebak warna
function playGameClone8(scene, callback) {
  const tileSize = 100;
  const gridSize = 3;
  const spacing = 20;
  const centerX = scene.cameras.main.width / 2;
  const centerY = scene.cameras.main.height / 0.9;

  const startKey = scene.input.keyboard.addKey('S');
  const enterKey = scene.input.keyboard.addKey('ENTER');
  const cursors = scene.input.keyboard.createCursorKeys();
  const yesKey = scene.input.keyboard.addKey('Y');
  const noKey = scene.input.keyboard.addKey('T');

  const bg = scene.add.rectangle(centerX, centerY, scene.cameras.main.width, scene.cameras.main.height, 0x000000, 0.7);
  let winLabel;
  if (scene.minigameWins.clone8) {
    winLabel=scene.add.text(centerX, centerY - 220, 'Pernah Dimenangkan', {
      fontSize: '16px',
      fill: '#00ffcc'
    }).setOrigin(0.5);
  }

  const instructionText = scene.add.text(centerX, centerY - 260, 'Gunakan [← ↑ ↓ →] untuk pilih kotak\nTekan [ENTER] untuk memilih', {
    fontSize: '20px',
    fill: '#ffffff',
    align: 'center'
  }).setOrigin(0.5);

  let startText = scene.add.text(centerX, centerY - 200, '[S] Mulai Game', {
    fontSize: '24px',
    fill: '#ffff00'
  }).setOrigin(0.5);

  let boxes = [];
  let selectionRect;
  let selectedRow = 0;
  let selectedCol = 0;
  let gameStarted = false;
  let gameEnded = false;
  let resultText;
  let retryText;

  function createGrid() {
    const newBoxes = [];
    const positions = [];

    const startX = centerX - (gridSize * tileSize + (gridSize - 1) * spacing) / 2 + tileSize / 2;
    const startY = centerY - 50;

    for (let row = 0; row < gridSize; row++) {
      for (let col = 0; col < gridSize; col++) {
        const x = startX + col * (tileSize + spacing);
        const y = startY + row * (tileSize + spacing);
        const box = scene.add.rectangle(x, y, tileSize, tileSize, 0x111111).setStrokeStyle(2, 0xffffff);
        box.row = row;
        box.col = col;
        box.revealColor = 'black';
        newBoxes.push(box);
        positions.push({ row, col });
      }
    }

    boxes = newBoxes;
    selectedRow = 0;
    selectedCol = 0;

    if (selectionRect) selectionRect.destroy();
    selectionRect = scene.add.rectangle(boxes[0].x, boxes[0].y, tileSize + 8, tileSize + 8)
      .setStrokeStyle(3, 0xffff00)
      .setFillStyle();

    Phaser.Utils.Array.Shuffle(positions);
    const bluePos = positions[0];

    boxes.forEach(box => {
      box.revealColor = (box.row === bluePos.row && box.col === bluePos.col) ? 'blue' : 'black';
    });
  }

  function endGame(win) {
    gameEnded = true;

    boxes.forEach(box => {
      const color = box.revealColor === 'blue' ? 0x0000ff : 0x111111;
      box.setFillStyle(color);
    });

    if (win) {
      scene.minigameWins.clone8 = true;
    }
    
    resultText = scene.add.text(centerX, centerY + 255, win ? 'Kamu Menang!' : 'Kamu Kalah!', {
      fontSize: '28px',
      fill: win ? '#00ff00' : '#ff0000'
    }).setOrigin(0.5);

    retryText = scene.add.text(centerX, centerY + 280, 'Main lagi? Tekan [Y] untuk Ya, [T] untuk Tidak', {
      fontSize: '20px',
      fill: '#ffffff'
    }).setOrigin(0.5);
  }

  function resetGame() {
    boxes.forEach(b => b.destroy());
    if (resultText) resultText.destroy();
    if (retryText) retryText.destroy();
    if (selectionRect) selectionRect.destroy();
    gameStarted = false;
    gameEnded = false;
    startText = scene.add.text(centerX, centerY - 200, '[S] Mulai Game', {
      fontSize: '24px',
      fill: '#ffff00'
    }).setOrigin(0.5);
  }

  startKey.on('down', () => {
    if (gameStarted) return;
    gameStarted = true;
    if (startText) startText.destroy();
    createGrid();
  });

  scene.input.keyboard.on('keydown', (e) => {
    if (!gameStarted || gameEnded) return;

    if (e.code === 'ArrowUp') selectedRow = (selectedRow + gridSize - 1) % gridSize;
    if (e.code === 'ArrowDown') selectedRow = (selectedRow + 1) % gridSize;
    if (e.code === 'ArrowLeft') selectedCol = (selectedCol + gridSize - 1) % gridSize;
    if (e.code === 'ArrowRight') selectedCol = (selectedCol + 1) % gridSize;

    const selectedBox = boxes.find(b => b.row === selectedRow && b.col === selectedCol);
    selectionRect.setPosition(selectedBox.x, selectedBox.y);
  });

  enterKey.on('down', () => {
    if (!gameStarted || gameEnded) return;

    const selectedBox = boxes.find(b => b.row === selectedRow && b.col === selectedCol);
    const win = selectedBox.revealColor === 'blue';
    endGame(win);
  });

  yesKey.on('down', () => {
    if (gameEnded) resetGame();
  });

  noKey.on('down', () => {
    if (gameEnded) {
      scene.time.delayedCall(500, () => {
        boxes.forEach(b => b.destroy());
        if (resultText) resultText.destroy();
        if (retryText) retryText.destroy();
        if (selectionRect) selectionRect.destroy();
        if (winLabel) winLabel.destroy();
        bg.destroy();
        instructionText.destroy();
        if (startText) startText.destroy();
        checkAllMinigamesComplete(scene);
        callback();
      });
    }
  });
}




function startMiniGame(cloneName) {
  const scene = game.scene.scenes[0]; // Ambil scene utama

  scene.isMiniGameActive = true; // ⬅️ Aktifkan "kunci" kontrol
  scene.activeNPC = npcGroup.getChildren().find(npc => npc.name === cloneName); // ← simpan NPC yang aktif


  switch (cloneName) {
    case 'clone1':
      playGameClone1(scene, () => { scene.isMiniGameActive = false; });
      break;
    case 'clone2':
      playGameClone2(scene, () => { scene.isMiniGameActive = false; });
      break;
    case 'clone3':
      playGameClone3(scene, () => { scene.isMiniGameActive = false; });
      break;
    case 'clone4':
      playGameClone4(scene, () => { scene.isMiniGameActive = false; });
      break;
    case 'clone5':
      playGameClone5(scene, () => { scene.isMiniGameActive = false; });
      break;
    case 'clone6':
      playGameClone6(scene, () => { scene.isMiniGameActive = false; });
      break;
    case 'clone7':
      playGameClone7(scene, () => { scene.isMiniGameActive = false; });
      break;
    case 'clone8':
      playGameClone8(scene, () => { scene.isMiniGameActive = false; });
      break;
    default:
      console.log('Clone tidak dikenali:', cloneName);
      scene.isMiniGameActive = false; // Kembali normal kalau error
  }
}

function checkAllMinigamesComplete(scene) {
  if (!scene || !scene.minigameWins) return;

  const allDone = Object.values(scene.minigameWins).every(v => v === true);
  if (allDone) {
    const centerX = scene.cameras.main.width / 2;
    const centerY = scene.cameras.main.height / 2;
    bg = scene.add.rectangle(centerX, centerY, scene.cameras.main.width, 330, 0x000000, 0.7);
    scene.add.text(centerX,centerY,  'Horee!!!\nSemua minigame udah kamu menangin!\nPermintaan maaf kami ada di hutan yaa!\nJalannya ikutin garis hitam sebelah kiri bawah\ntext ini!!', {
      fontSize: '28px',
      fill: '#00ff00',
      align: 'center'
    }).setOrigin(0.5);
  }
}
