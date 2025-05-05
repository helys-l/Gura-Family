// HomeScene: Halaman awal
class HomeScene extends Phaser.Scene {
    constructor() {
        super({ key: 'HomeScene' });
    }

    preload() {
        this.load.image('homeBg', 'assets/Home/gurabg.jpg');
        this.load.audio('mainBGM', 'assets/audio/mainBGM.mp3');
      }
      
    

      create() {
        if (!this.sys.game.globals.bgm) {
            this.sys.game.globals.bgm = this.sound.add('mainBGM', { loop: true, volume: 1 });
            this.sys.game.globals.bgm.play();
        }
    
        this.add.image(400, 300, 'homeBg').setOrigin(0.5);
    
        // Tambahkan teks
        const text = this.add.text(500, 300, 'Tekan Enter untuk Memulai', {
            font: '24px Arial',
            fill: '#ffffff',
            padding: { x: 10, y: 5 }
        }).setOrigin(0.5);
    
        // Hitung ukuran teks untuk buat kotak background
        const bg = this.add.graphics();
        bg.fillStyle(0x000000, 0.5); // warna hitam dengan transparansi 50%
        bg.fillRoundedRect(
            text.x - text.width / 2 - 10,  // posisi X
            text.y - text.height / 2 - 5,  // posisi Y
            text.width + 20,              // lebar background
            text.height + 10,             // tinggi background
            10                            // sudut tumpul
        );
    
        // Pastikan teks tampil di atas background
        text.setDepth(1);
    
        // Input ENTER
        this.input.keyboard.on('keydown-ENTER', () => {
            this.scene.start('IntroScene');
        });
    }
    
}

// IntroScene: Dialog awal
class IntroScene extends Phaser.Scene {
    constructor() {
        super({ key: 'IntroScene' });
    }

    preload() {
        this.load.image('sea', 'assets/Intro/tersesat.jpeg');
        this.load.image('storm', 'assets/Intro/dilaut.jpeg');
        this.load.image('beach', 'assets/Intro/dipantai.jpg');
        this.load.image('forest', 'assets/Intro/hutan.jpeg');
        this.load.image('clone1', 'assets/Intro/double.png');
        this.load.image('challenge', 'assets/Intro/bertarung.png');

    }

    create() {
      
        this.dialogIndex = 0;

        this.backgrounds = [
            'sea', 'sea', 'sea', 'sea',
            'storm', 'storm', 'storm',
            'beach', 'beach', 'beach', 'beach',
            'clone1', 'clone1', 'clone1',
            'challenge', 'challenge', 'challenge', 'challenge',
            'forest','forest','forest',
            'forest'
        ];

        this.dialogs = [
            "Di tengah lautan biru yang luas, Gura menyelam dan menjelajah mencari harta karun tersembunyi.",
            "Gura: \"Hehe~ pasti ada harta karun besar di sini! Aku bisa merasakannya~!\"",
            "Ia mengelilingi samudra dari ujung ke ujung, dari palung terdalam hingga pulau-pulau terpencil.",
            "Gura: \"Aku sudah sampai sejauh ini... pasti tinggal sedikit lagi!\"",
            "Namun karena terlalu asyik mencari harta, Gura tersesat!",
            "Gura: \"Waaaahh! Akuu tersesatt! AKU DI MANAA!!\"",
            "Gura akhirnya mencari pantai terdekat.",
            "Gura: \"Ugh... ada pantai! Di mana ini?\"",
            "Ia pun bangkit dan mulai menyusuri tempat itu... tapi perasaan aneh mulai muncul.",
            "Gura: \"Kenapa rasanya... tempat ini aneh ya? Sepi banget...\"",
            "Tiba-tiba, di ujung pantai, ia melihat sosok yang... mirip dirinya sendiri yang sedang berputar putar ngga jelas?",
            "Gura: \"AHHHHHH?! Siapa loe amjim?? Loe diriku? dan aku dirimu?\"",
            "Gura: \"Hah?! Siapa kamu? Kenapa wajahmu... kayak aku?!\"",
            "Clone: *tersenyum misterius* \"Kalau kau ingin tahu jawabannya... kalahkan aku dulu.\"",
            "Gura: \"Apa maksudmu?! Kita baru bertemu kocag minimal perkenalan dulu!\"",
            "Clone: \"Kau akan tahu... tapi hanya jika kau bisa memenangkan game-ku.\"",
            "Gura menatap sosok itu dalam-dalam... bentuknya, suaranya... semuanya seperti melihat cermin.",
            "Gura: \"Ini... aneh banget. Apa aku sedang mimpi...?\"",
            "Dan begitulah... perjalanan aneh Gura dimulai. Ternyata, dia harus menghadapi 8 clone dirinya, masing-masing membawa sebuah permainan berbeda.",
            "Gura: \"Delapan... clone? Apa mereka semua ingin bermain denganku...?\"",
            "Petualangan pun dimulai...",
            "Tekan E untuk berinteraksi dengan Clone [E]\nTekan arrow key untuk berjalan [← ↑ ↓ →]\nTekan enter untuk lanjut...."
        ];

        // Skala khusus untuk gambar tertentu
        this.backgroundScales = {
            storm: 0.7,
            beach: 1.2,
            forest: 1,
            clone1: 1,
            challenge: 1,
            sea: 1.1
        };

        // Tambahkan background pertama
        const firstKey = this.backgrounds[0];
        this.background = this.add.image(0, 0, firstKey).setOrigin(0);

        this.setBackgroundScale(firstKey);

        // Tambahkan text box
        this.textBackground = this.add.graphics();
        this.textBackground.fillStyle(0x000000, 0.5); // warna hitam, 0.5 transparansi
        this.textBackground.fillRect(40, 490, 920, 90); // posisi dan ukuran kotak

        // Tambahkan text box di atas background
        this.textBox = this.add.text(50, 500, '', {
            font: '20px Arial',
            fill: '#ffffff',
            wordWrap: { width: 900 }
        });

        this.nextDialog();

        // Tekan ENTER untuk lanjut
        this.input.keyboard.on('keydown-ENTER', () => {
            this.nextDialog();
        });
    }

    setBackgroundScale(key) {
        const scale = this.backgroundScales[key] || 1;
        this.background.setScale(scale);

        // Kalau ingin pakai autofit 1000x600:
        let scaleX = 1000 / this.background.width;
        let scaleY = 600 / this.background.height;
        let autoScale = Math.max(scaleX, scaleY);
        this.background.setScale(autoScale);
    }

    nextDialog() {
        if (this.dialogIndex < this.dialogs.length) {
            this.textBox.setText(this.dialogs[this.dialogIndex]);

            if (this.dialogIndex < this.backgrounds.length) {
                const bgKey = this.backgrounds[this.dialogIndex];
                this.background.setTexture(bgKey);
                this.setBackgroundScale(bgKey);
            }

            this.dialogIndex++;
        } else {
            this.scene.start('GameScene');
        }
    }
}



// GameScene: game utama
class GameScene extends Phaser.Scene {
    constructor() {
        super({ key: 'GameScene' });
    }

    

      preload() {
        this.player;
        
        this.cursors
        this.eKey;
        this.enterKey;
        this.npcGroup=null;
        this.dialogueText=null;
        this.activeDialogue = null;
        this.mapBounds;
        this.load.image('tiles', 'assets/tilesets/map.jpg');
        this.load.tilemapTiledJSON('map', 'assets/maps/map.json');
        this.load.json('pokemon_tileset', 'assets/tilesets/pokemon_tileset.json');
        this.load.spritesheet('gura', 'assets/characters/gura.png', {
          frameWidth: 70, frameHeight: 70
        });
        this.load.spritesheet('gura-clone', 'assets/characters/gura-clone.png', {
          frameWidth: 70, frameHeight: 70
        });
        this.load.spritesheet('npc', 'assets/characters/npc.png', { frameWidth: 75, frameHeight: 75 });

      }
      
      create() {
      
        const map = this.make.tilemap({ key: 'map' });
        const tileset = map.addTilesetImage('pokemon_tileset', 'tiles');
        map.createLayer('Ground', tileset, 0, 0);
      
        this.player = this.add.sprite(724, 96, 'gura-clone', 0).setOrigin(0.5, 0.8).setScale(0.7);
        this.anims.create({ key: 'walk-down', frames: this.anims.generateFrameNumbers('gura-clone', { start: 0, end: 2 }), frameRate: 6, repeat: -1 });
        this.anims.create({ key: 'walk-left', frames: this.anims.generateFrameNumbers('gura-clone', { start: 3, end: 5 }), frameRate: 6, repeat: -1 });
        this.anims.create({ key: 'walk-right', frames: this.anims.generateFrameNumbers('gura-clone', { start: 6, end: 8 }), frameRate: 6, repeat: -1 });
        this.anims.create({ key: 'walk-up', frames: this.anims.generateFrameNumbers('gura-clone', { start: 9, end: 11 }), frameRate: 6, repeat: -1 });
        this.anims.create({ key: 'npc-turning', frames: this.anims.generateFrameNumbers('gura', { start: 0, end: 11 }), frameRate: 4, repeat: -1 });
      
        this.cursors = this.input.keyboard.createCursorKeys();
        this.eKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.E);
        this.enterKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ENTER);
      
        this.npcGroup = this.add.group();
        const npcLayer = map.getObjectLayer('NPCs_And_Events');
        npcLayer.objects.forEach(obj => {
            if (obj.type === 'npc') {
              const npc = this.add.sprite(obj.x, obj.y, 'gura-clone', 0).setOrigin(0.5, 0.8).setScale(0.7);
              npc.name = obj.name;
              npc.dialogue = obj.properties?.find(p => p.name === 'dialogue')?.value || '';
              npc.anims.play('npc-turning');
              this.npcGroup.add(npc);
            } else if (obj.type === 'door' || obj.type === 'treasure') {
                const doorOrTreasure = this.add.rectangle(obj.x, obj.y, obj.width, obj.height, 0x000000, 0.01)
                  .setOrigin(0.5);
                doorOrTreasure.name = obj.name;
                doorOrTreasure.dialogue = obj.properties?.find(p => p.name === 'dialogue')?.value || '';
                doorOrTreasure.type = obj.type; // ← ini yang diubah
                this.npcGroup.add(doorOrTreasure);
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
      
        this.cameras.main.startFollow(this.player);
        this.cameras.main.setBounds(0, 0, map.widthInPixels, map.heightInPixels);
        this.mapBounds = { width: map.widthInPixels, height: map.heightInPixels };
      
        this.dialogueText = this.add.text(0, 0, '', {
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
        
        this.won=false;
      }
      
      update() {
        const scene = this;
      
        if (this.scene.isMiniGameActive) {
          this.player.anims.stop();
          return;
        }
        let moving = false;
        const speed = 2;
        let nextX = this.player.x;
        let nextY = this.player.y;
      
        if (this.cursors.left.isDown) nextX -= speed;
        else if (this.cursors.right.isDown) nextX += speed;
        if (this.cursors.up.isDown) nextY -= speed;
        else if (this.cursors.down.isDown) nextY += speed;
      
        let canMove = true;
        this.npcGroup.getChildren().forEach(npc => {
          const dist = Phaser.Math.Distance.Between(nextX, nextY, npc.x, npc.y);
          if (dist < 45) canMove = false;
        });
        this.collisions?.getChildren().forEach(obstacle => {
          if (obstacle.getBounds().contains(nextX, nextY)) canMove = false;
        });
      
        const halfWidth = this.player.displayWidth / 2;
        const halfHeight = this.player.displayHeight / 2;
        if (canMove) {
          if (this.cursors.left.isDown && nextX - halfWidth > 0) {
            this.player.x -= speed;
            this.player.anims.play('walk-left', true);
            moving = true;
          } else if (this.cursors.right.isDown && nextX + halfWidth <this.mapBounds.width) {
            this.player.x += speed;
            this.player.anims.play('walk-right', true);
            moving = true;
          }
      
          if (this.cursors.up.isDown && nextY - halfHeight > 0) {
            this.player.y -= speed;
            this.player.anims.play('walk-up', true);
            moving = true;
          } else if (this.cursors.down.isDown && nextY + halfHeight < this.mapBounds.height) {
            this.player.y += speed;
            this.player.anims.play('walk-down', true);
            moving = true;
          }
        }
      
        if (!moving) this.player.anims.stop();
      
        // Deteksi interaksi NPC
        let nearestNpc = null;
        let minDistance = 50;
        this.npcGroup.getChildren().forEach(npc => {
          const dist = Phaser.Math.Distance.Between(this.player.x, this.player.y, npc.x, npc.y);
          if (dist < minDistance) {
            nearestNpc = npc;
            minDistance = dist;
          }
        });
      
        if (nearestNpc && Phaser.Input.Keyboard.JustDown(this.eKey)) {
          const name = nearestNpc.name || "???";
          const dialogue = nearestNpc.dialogue || "";
          this.dialogueText.setText(`${name}:${dialogue}`);

          this.dialogueText.setPosition(nearestNpc.x - 100, nearestNpc.y - 100);
          this.dialogueText.setVisible(true);
         this.activeDialogue = nearestNpc;
        }
      
        if (this.activeDialogue) {
          const distance = Phaser.Math.Distance.Between(this.player.x, this.player.y, this.activeDialogue.x, this.activeDialogue.y);
          if (distance > 60) {
            this.dialogueText.setVisible(false);
           this.activeDialogue = null;
          }
      
          // Jika Enter ditekan saat dialog aktif
          if (Phaser.Input.Keyboard.JustDown(this.enterKey)) {
            if (this.activeDialogue.name.startsWith("clone")) {
              this.startMiniGame(this.activeDialogue.name); // ← ini akan memicu sesuai clone
              this.dialogueText.setVisible(false);
              this.activeDialogue = null;
            } else if (this.activeDialogue.type === "treasure") {
              if (this.won) {
                  this.scene.start("OutroScene");
              } else {
                  this.dialogueText.setText("Masih terkunci...");
              }
          }
          }
          
        }
      }
      
      playGameClone1() {
        const centerX = this.mapBounds.width / 2;
        const centerY = this.mapBounds.height / 3;
      
        let bg, instructionText, colorText, currentChoiceText, retryText;
        let started = false;
        let ending = false;
        let choiceIndex = 0;
        const colors = ['Merah', 'Hijau', 'Biru', 'Pink'];
        let secretColor = Phaser.Math.RND.pick(colors);
        let winLabel;
      
        const clearTexts = () => {
          instructionText?.destroy();
          colorText?.destroy();
          currentChoiceText?.destroy();
          retryText?.destroy();
          winLabel?.destroy();
          bg?.destroy();
        };
      
        const showInstruction = () => {
          bg = this.add.rectangle(centerX, centerY, this.mapBounds.width, 600, 0x000000, 0.7);
      
          if (this.minigameWins?.clone1) {
            winLabel = this.add.text(centerX, centerY - 150, 'Aku pernah bersamamu dan lautan bukan satu-satunya tempat bermain kita.', {
              fontSize: '16px',
              fill: '#00ffcc'
            }).setOrigin(0.5);
          }
      
          instructionText = this.add.text(centerX, centerY, 'Tebak Warna Rahasia\nTekan [S] untuk mulai', {
            fontSize: '20px',
            fill: '#fff',
            align: 'center',
            wordWrap: { width: this.mapBounds.width - 40 }
          }).setOrigin(0.5);
        };
      
        const startGame = () => {
          if (started || ending) return;
          started = true;
          choiceIndex = 0;
          secretColor = Phaser.Math.RND.pick(colors);
          instructionText?.destroy();
          winLabel?.destroy();
      
          colorText = this.add.text(centerX, centerY - 40, 'Tebak warna:\nGunakan ← → lalu Enter', {
            fontSize: '18px',
            fill: '#fff',
            align: 'center'
          }).setOrigin(0.5);
      
          currentChoiceText = this.add.text(centerX, centerY + 20, `Pilihan: ${colors[choiceIndex]}`, {
            fontSize: '24px',
            fill: '#ff0',
            align: 'center'
          }).setOrigin(0.5);
        };
      
        const updateChoiceText = () => {
          if (currentChoiceText) {
            currentChoiceText.setText(`Pilihan: ${colors[choiceIndex]}`);
          }
        };
      
        const endGame = (message) => {
          if (ending) return;
          ending = true;
      
          colorText.setText(message);
          currentChoiceText.destroy();
      
          retryText = this.add.text(centerX, centerY + 60, 'Main Lagi? [Y] Ya / [T] Tidak', {
            fontSize: '18px',
            fill: '#ffffff',
            align: 'center'
          }).setOrigin(0.5);
      
          const retryHandler = (e) => {
            if (e.code === 'KeyY') {
              this.input.keyboard.off('keydown', retryHandler);
              clearTexts();
              started = false;
              ending = false;
              showInstruction();
            } else if (e.code === 'KeyT') {
              this.input.keyboard.off('keydown', retryHandler);
              clearTexts();
              this.input.keyboard.off('keydown', keyHandler);
              this.scene.isMiniGameActive = false;
              this.checkAllMinigamesComplete(this);
            }
          };
      
          this.input.keyboard.on('keydown', retryHandler);
        };
      
        const keyHandler = (event) => {
          if (ending) return;
      
          if (!started && event.code === 'KeyS') {
            startGame();
            return;
          }
      
          if (!started) return;
      
          switch (event.code) {
            case 'ArrowLeft':
              choiceIndex = (choiceIndex + colors.length - 1) % colors.length;
              updateChoiceText();
              break;
            case 'ArrowRight':
              choiceIndex = (choiceIndex + 1) % colors.length;
              updateChoiceText();
              break;
            case 'Enter':
              if (ending) return; // prevent spam enter
              if (colors[choiceIndex] === secretColor) {
                this.minigameWins.clone1 = true;
                endGame('Tebakan benar!\nHehe~ kamu cukup hebat... !\nMulai ulang minigame untuk lihat petunjuk!');
              } else {
                endGame(`Salah! Jawaban: ${secretColor}`);
              }
              break;
          }
        };
      
        showInstruction();
        this.input.keyboard.on('keydown', keyHandler);
      }
      
      
      
      
      
      
      playGameClone2() {
        const centerX = this.mapBounds.width / 2;
        const centerY = this.mapBounds.height / 3;
      
        let bg, instructionText, gameText, retryText, winLabel;
        let started = false;
        let active = false;
        let waitingForSignal = false;
        let startTime = 0;
        let playerReacted = false;
        let aiReacted = false;
        let aiTime = 0;
        let playerTime = 0;
        let signalTimer = null;
        let aiTimer = null;
        bg = this.add.rectangle(centerX, centerY, this.mapBounds.width, 600, 0x000000, 0.7);
        
      
        const cleanupTimers = () => {
          if (signalTimer) {
            signalTimer.remove(false);
            signalTimer = null;
          }
          if (aiTimer) {
            aiTimer.remove(false);
            aiTimer = null;
          }
        };
      
        const showInstruction = () => {
      
          if (this.minigameWins?.clone2) {
            winLabel = this.add.text(centerX, centerY - 150, 'Suaraku memang mirip, tapi aku lebih suka tertawa seperti kucing nakal', {
              fontSize: '16px',
              fill: '#00ffcc'
            }).setOrigin(0.5);
          }
      
          instructionText = this.add.text(centerX, centerY,
            'Uji Reaksi Refleks!\nTekan [S] untuk mulai\nTekan [A] saat sinyal muncul untuk bereaksi', {
              fontSize: '20px',
              fill: '#fff',
              align: 'center',
              wordWrap: { width: this.mapBounds.width - 40 }
            }).setOrigin(0.5);
        }
      
        const resetGame = () => {
          cleanupTimers();
          active = false;
          waitingForSignal = false;
          playerReacted = false;
          aiReacted = false;
          aiTime = 0;
          playerTime = 0;
        }
      
        const startGame = () => {
          resetGame();
          started = true;
      
          instructionText?.destroy();
          retryText?.destroy();
          winLabel?.destroy();
      
          if (!gameText) {
            gameText = this.add.text(centerX, centerY, '', {
              fontSize: '18px',
              fill: '#fff',
              align: 'center'
            }).setOrigin(0.5);
          }
      
          gameText.setText('Tunggu sinyal...');
          gameText.setVisible(true);
          waitingForSignal = true;
      
          const delay = Phaser.Math.Between(1000, 3000);
          signalTimer = this.time.delayedCall(delay, () => {
            if (!started || !waitingForSignal) return;
            waitingForSignal = false;
            active = true;
            startTime = this.time.now;
            gameText.setText('TEKAN [A] SEKARANG!');
      
            const aiDelay = Phaser.Math.Between(200, 350);
            aiTimer = this.time.delayedCall(aiDelay, () => {
              if (!playerReacted && active) {
                aiTime = this.time.now - startTime;
                aiReacted = true;
                endGame();
              }
            });
          });
        }
      
        const endGame = () => {
          cleanupTimers();
          active = false;
      
          let resultText = '';
          if (playerReacted) {
            if (aiReacted) {
              if (playerTime < aiTime) {
                resultText = `Cepet banget gile? Mulai ulang minigame untuk lihat petunjuk!\nKamu: ${playerTime.toFixed(0)}ms\nGweh: ${aiTime.toFixed(0)}ms`;
                this.minigameWins.clone2 = true;
              } else if (aiTime < playerTime) {
                resultText = `Gweh menang!\nKamu: ${playerTime.toFixed(0)}ms\nGweh: ${aiTime.toFixed(0)}ms`;
              } else {
                resultText = `Seri!\nKamu & Gweh: ${playerTime.toFixed(0)}ms`;
              }
            } else {
              resultText = `Cepet banget gile? Mulai ulang minigame untuk lihat petunjuk!\nWaktu: ${playerTime.toFixed(0)}ms\nGweh: ${aiTime.toFixed(0)}ms`;
              this.minigameWins.clone2 = true;
            }
          } else if (aiReacted) {
            resultText = `Terlambat! Gweh menang!\nKamu: ${playerTime.toFixed(0)}ms\nGweh: ${aiTime.toFixed(0)}ms`;
          }
      
          gameText.setText(resultText);
          showRetryPrompt();
        }
      
        const showRetryPrompt = () => {
          retryText?.destroy();
          retryText = this.add.text(centerX, centerY + 60, 'Main Lagi? [Y] Ya / [T] Tidak', {
            fontSize: '18px',
            fill: '#ffffff',
            align: 'center'
          }).setOrigin(0.5);
      
          const retryHandler = (e) => {
            if (e.code === 'KeyY') {
              this.input.keyboard.off('keydown', retryHandler);
              started = false;
              gameText?.setVisible(false);
              retryText?.destroy();
              showInstruction();
            } else if (e.code === 'KeyT') {
              this.input.keyboard.off('keydown', retryHandler);
              cleanupTimers();
              bg?.destroy();
              gameText?.destroy();
              retryText?.destroy();
              instructionText?.destroy();
              winLabel?.destroy();
              this.input.keyboard.off('keydown', onKeyPress);
              this.scene.isMiniGameActive = false;
              this.checkAllMinigamesComplete(this);
            }
          };
      
          this.input.keyboard.off('keydown', retryHandler);
          this.input.keyboard.on('keydown', retryHandler);
        }
      
        const onKeyPress = (event) => {
          if (!started && event.code === 'KeyS') {
            startGame();
            return;
          }
      
          if (!started) return;
      
          if (event.code === 'KeyA') {
            if (waitingForSignal) {
              waitingForSignal = false;
              active = false;
              started = false; // tambahkan ini
              cleanupTimers();
              gameText.setText('Kecepetan woyyy! Gagal!');
              this.time.delayedCall(1000, () => {
                gameText.setVisible(false);
                resetGame();
                showRetryPrompt();
              });
            } else if (active && !playerReacted) {
              playerTime = this.time.now - startTime;
              playerReacted = true;
              if (!aiReacted) {
                endGame();
              }
            }
          }
        }
      
        showInstruction();
        this.input.keyboard.off('keydown', onKeyPress);
        this.input.keyboard.on('keydown', onKeyPress);
      }
      
      
      
      
      
      
      
      
      playGameClone3() {
        const centerX = this.mapBounds.width / 2;
        const centerY = this.mapBounds.height/2;
      
        const choices = ['Batu', 'Gunting', 'Kertas', 'Lizard', 'Spock', 'Roket'];
        const winRules = {
          'Batu': ['Gunting', 'Lizard'],
          'Gunting': ['Kertas', 'Lizard'],
          'Kertas': ['Batu', 'Spock'],
          'Lizard': ['Spock', 'Kertas'],
          'Spock': ['Gunting', 'Batu'],
          'Roket': ['Spock', 'Lizard']
        };
      
        let bg, instructionText, choiceText, resultText, retryText, winLabel;
        let playerChoice = 0;
        let started = false;
        bg = this.add.rectangle(centerX, centerY, this.mapBounds.width, 600, 0x000000, 0.7);
      
        const showInstruction = () => {
      
          if (this.minigameWins?.clone3) {
            winLabel = this.add.text(centerX, centerY - 170, 'Kita memang berbeda, namun kita berjuang bersama.', {
              fontSize: '16px',
              fill: '#00ffcc'
            }).setOrigin(0.5);
          }
      
          const rules = Object.entries(winRules).map(([key, wins]) => `${key} > ${wins.join(' & ')}`).join('\n');
      
          instructionText = this.add.text(centerX, centerY - 60,
            `Pilih tanganmu!\nGunakan ← → lalu tekan [Enter]\n\n${rules}`, {
              fontSize: '18px',
              fill: '#ffffff',
              align: 'center',
              wordWrap: { width: 500 }
            }).setOrigin(0.5);
      
          choiceText = this.add.text(centerX, centerY + 50, `Pilihanmu: ${choices[playerChoice]}`, {
            fontSize: '22px',
            fill: '#ffff00'
          }).setOrigin(0.5);
      
          resultText = this.add.text(centerX, centerY + 100, '', {
            fontSize: '24px',
            fill: '#ffffff',
            align: 'center'
          }).setOrigin(0.5);
        };
      
        const resetGame = () => {
          playerChoice = 0;
          started = false;
          resultText.setText('');
          choiceText.setText(`Pilihanmu: ${choices[playerChoice]}`);
          instructionText.setText(`Pilih tanganmu!\nGunakan ← → lalu tekan [Enter]\n\n${
            Object.entries(winRules).map(([k, v]) => `${k} > ${v.join(' & ')}`).join('\n')}`);
        };
      
        const getBiasedAIChoice = (playerChoice) => {
          const player = choices[playerChoice];
          const rand = Math.random();
          if (rand < 0.30) return Phaser.Utils.Array.GetRandom(winRules[player]); // Player wins
          else if (rand < 0.45) return player; // Draw
          else {
            const beatsPlayer = choices.filter(c => winRules[c]?.includes(player));
            return Phaser.Utils.Array.GetRandom(beatsPlayer); // AI wins
          }
        };
      
        const startGame = () => {
          started = true;
      
          const aiChoice = getBiasedAIChoice(playerChoice);
          const player = choices[playerChoice];
      
          resultText.setText('Jan!');
          this.time.delayedCall(500, () => {
            resultText.setText('Ken!');
            this.time.delayedCall(500, () => {
              resultText.setText('Pon!');
              this.time.delayedCall(500, () => {
                let outcome = '';
                if (player === aiChoice) {
                  outcome = 'Seri!';
                } else if (winRules[player]?.includes(aiChoice)) {
                  this.minigameWins.clone3 = true;
                  outcome = 'Bagus, kamu menang! Mulai ulang game untuk melihat petunjuk!';
                } else {
                  outcome = 'Kamu kalah!';
                }
      
                instructionText.setText(`Gweh pilih: ${aiChoice}\n${outcome}`);
                choiceText.setText('');
                resultText.setText('');
                showRetryPrompt();
              });
            });
          });
        };
      
        const showRetryPrompt = () => {
          retryText = this.add.text(centerX, centerY + 140, 'Main Lagi? [Y] Ya / [T] Tidak', {
            fontSize: '20px',
            fill: '#ffffff',
            align: 'center'
          }).setOrigin(0.5);
      
          const retryHandler = (e) => {
            if (e.code === 'KeyY') {
              this.input.keyboard.off('keydown', retryHandler);
              retryText.destroy();
              instructionText?.destroy();
              choiceText?.destroy();
              resultText?.destroy();
              winLabel?.destroy(); // ini optional kalau winLabel muncul saat menang
              playerChoice = 0;
              started = false;

              showInstruction();
              this.input.keyboard.on('keydown', onKeyDown);
            } else if (e.code === 'KeyT') {
              this.input.keyboard.off('keydown', retryHandler);
              bg.destroy();
              instructionText.destroy();
              choiceText.destroy();
              resultText.destroy();
              retryText.destroy();
              if (winLabel) winLabel.destroy();
              this.scene.isMiniGameActive = false;
              this.checkAllMinigamesComplete(this);
            }
          };
      
          this.input.keyboard.on('keydown', retryHandler);
        };
      
        const onKeyDown = () => {
          if (!started) {
            if (Phaser.Input.Keyboard.JustDown(this.input.keyboard.addKey('LEFT'))) {
              playerChoice = (playerChoice + choices.length - 1) % choices.length;
              choiceText.setText(`Pilihanmu: ${choices[playerChoice]}`);
            } else if (Phaser.Input.Keyboard.JustDown(this.input.keyboard.addKey('RIGHT'))) {
              playerChoice = (playerChoice + 1) % choices.length;
              choiceText.setText(`Pilihanmu: ${choices[playerChoice]}`);
            } else if (Phaser.Input.Keyboard.JustDown(this.input.keyboard.addKey('ENTER'))) {
              this.input.keyboard.off('keydown', onKeyDown);
              startGame();
            }
          }
        };
      
        showInstruction();
        this.input.keyboard.on('keydown', onKeyDown);
      }
      
      
      
      
      playGameClone4() {
        const centerX = this.mapBounds.width / 2;
        const centerY = this.mapBounds.height/2;
      
        let bg, instructionText, displayText, retryText, winLabel;
        let sequence = [], playerInput = [], inputIndex = 0;
        let playingSequence = false;
        let started = false;
        bg = this.add.rectangle(centerX, centerY, this.mapBounds.width, 600, 0x000000, 0.7);
        const colors = ['🔴', '🟢', '🔵', '🟡'];
      
        const showInstruction = () => {
          
      
          if (this.minigameWins?.clone4) {
            winLabel = this.add.text(centerX, centerY - 130, 'Aku punya senjata unik... biasanya aku pegang trident, tapi clone ini menyembunyikan yang aslinya.', {
              fontSize: '16px',
              fill: '#00ffcc'
            }).setOrigin(0.5);
          }
      
          instructionText = this.add.text(centerX, centerY - 30, 'Uji Pola Ingatan!\nTekan [S] untuk mulai\n', {
            fontSize: '20px',
            fill: '#ffffff',
            align: 'center'
          }).setOrigin(0.5);
      
          displayText = this.add.text(centerX, centerY + 20, '', {
            fontSize: '40px',
            align: 'center'
          }).setOrigin(0.5);
        };
      
        const startGame = () => {
          started = true;
          instructionText.setText('1🔴 2🟢 3🔵 4🟡');
      
          let countdown = 3;
          instructionText.setText(`Mulai dalam ${countdown}...`);
      
          const countdownInterval = this.time.addEvent({
            delay: 1000,
            callback: () => {
              countdown--;
              instructionText.setText(`Mulai dalam ${countdown}...`);
              if (countdown <= 0) {
                this.time.removeEvent(countdownInterval);
                instructionText.setText('START\n\n1🔴 2🟢 3🔵 4🟡');
                this.time.delayedCall(1000, () => {
                  sequence = [];
                  playerInput = [];
                  inputIndex = 0;
                  for (let i = 0; i < 5; i++) sequence.push(Phaser.Math.Between(0, 3));
                  playSequence(0);
                });
              }
            },
            loop: true
          });
        };
      
        const playSequence = (index) => {
          if (index === 0) playingSequence = true;
      
          if (index >= sequence.length) {
            this.time.delayedCall(1000, () => {
              displayText.setText('Ulangi Pola!');
              playingSequence = false;
            });
            return;
          }
      
          displayText.setText(colors[sequence[index]]);
          this.time.delayedCall(1000, () => {
            displayText.setText('');
            this.time.delayedCall(1000, () => playSequence(index + 1));
          });
        };
      
        const endGame = (message, win = false) => {
          displayText.setText(message);
          displayText.setStyle({ fontSize: '20px' });
          if (win) this.minigameWins.clone4 = true;
      
          this.input.keyboard.off('keydown', keyHandler);
      
          this.time.delayedCall(3000, () => {
            displayText.setText('');
            retryText = this.add.text(centerX, centerY + 70, 'Main Lagi? [Y] Ya / [T] Tidak', {
              fontSize: '20px',
              fill: '#ffffff'
            }).setOrigin(0.5);
      
            const retryHandler = (e) => {
              if (e.code === 'KeyY') {
                this.input.keyboard.off('keydown', retryHandler);
                retryText.destroy();
                displayText.setText('');
                instructionText.destroy();
                winLabel?.destroy();
                started = false;
                showInstruction();
                this.input.keyboard.on('keydown', keyHandler);
              } else if (e.code === 'KeyT') {
                this.input.keyboard.off('keydown', retryHandler);
                retryText.destroy();
                bg.destroy();
                instructionText.destroy();
                displayText.destroy();
                if (winLabel) winLabel.destroy();
                this.scene.isMiniGameActive = false;
                this.checkAllMinigamesComplete(this);
              }
            };
      
            this.input.keyboard.on('keydown', retryHandler);
          });
        };
      
        const keyHandler = (event) => {
          if (!started && event.code === 'KeyS') {
            startGame();
            return;
          }
      
          if (!started || playingSequence || playerInput.length >= sequence.length) return;
      
          const keyMap = {
            Digit1: 0,
            Digit2: 1,
            Digit3: 2,
            Digit4: 3
          };
      
          const index = keyMap[event.code];
          if (index !== undefined) {
            playerInput.push(index);
            if (index !== sequence[inputIndex]) {
              endGame('Salah! Gagal!');
              return;
            }
            inputIndex++;
            if (inputIndex === sequence.length) {
              endGame('Benar! Haha! Ternyata kamu serius juga~\nMulai ulang minigame untuk lihat petunjuk!', true);
            }
          }
        };
      
        showInstruction();
        this.input.keyboard.on('keydown', keyHandler);
      }
      
      
      
      
      // Clone 5: Tembak Tepat Sasaran
      playGameClone5() {
        const centerX = this.mapBounds.width / 2;
        const centerY = this.mapBounds.height / 2;
    
        let bg, instructionText, gameText, retryText, winLabel;
        let started = false;
        let target, crosshair, playerShot, aiShot;
        let moveTween = null;
    
        let shootHandler = null;
        let retryHandler = null;
        let startHandler = null;
        bg = this.add.rectangle(centerX, centerY, this.mapBounds.width, 600, 0x000000, 0.7);
    
        const showInstruction = () => {
            resetGame();
            started = false;
    
            instructionText?.destroy();
            instructionText = null;
    
            winLabel?.destroy();
            winLabel = null;
    
            if (this.minigameWins?.clone5) {
                winLabel = this.add.text(centerX, centerY + 150, 'Kami sering disebut keluarga... walau tak sedarah, tapi serasa saudara.', {
                    fontSize: '16px',
                    fill: '#00ffcc'
                }).setOrigin(0.5);
            }
    
            instructionText = this.add.text(centerX, centerY, 'Tekan [S] untuk mulai\nTembak target yang bergerak dengan [SPACE]', {
                fontSize: '20px',
                fill: '#fff',
                align: 'center',
                wordWrap: { width: this.mapBounds.width - 40 }
            }).setOrigin(0.5);
        };
    
        const resetGame = () => {
            playerShot = null;
            aiShot = null;
    
            if (moveTween) {
                moveTween.stop();
                moveTween = null;
            }
    
            if (target) {
                target.destroy();
                target = null;
            }
    
            if (crosshair) {
                crosshair.destroy();
                crosshair = null;
            }
    
            if (gameText) {
                gameText.destroy();
                gameText = null;
            }
    
            if (retryText) {
                retryText.destroy();
                retryText = null;
            }
    
            if (shootHandler) {
                this.input.keyboard.off('keydown', shootHandler);
                shootHandler = null;
            }
    
            if (retryHandler) {
                this.input.keyboard.off('keydown', retryHandler);
                retryHandler = null;
            }
        };
    
        const startGame = () => {
            resetGame();
            started = true;
    
            instructionText?.destroy();
            instructionText = null;
    
            winLabel?.destroy();
            winLabel = null;
    
            gameText = this.add.text(centerX, centerY, 'Target bergerak... Tekan [SPACE] untuk menembak!', {
                fontSize: '18px',
                fill: '#fff',
                align: 'center'
            }).setOrigin(0.5);
    
            target = this.add.rectangle(100, centerY - 100, 30, 30, 0xff0000);
            crosshair = this.add.circle(centerX, centerY - 100, 5, 0x00ff00);
    
            moveTween = this.tweens.add({
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
    
                const bullet = this.add.rectangle(centerX, centerY, 4, 20, 0xffff00);
                this.tweens.add({
                    targets: bullet,
                    y: centerY - 120,
                    duration: 200,
                    onComplete: () => bullet.destroy()
                });
    
                const result = playerShot < aiShot ? 'Yah, akhirnya aku kalah juga.\nMulai ulang minigame untuk lihat petunjuknya!\n' :
                    playerShot > aiShot ? 'Gweh lebih akurat!' :
                    'Kamu Seri!';
    
                gameText.setText(`${result}\nJarakmu: ${playerShot.toFixed(1)} | Gweh: ${aiShot}`);
    
                if (playerShot < aiShot) {
                    this.minigameWins.clone5 = true;
                }
    
                this.input.keyboard.off('keydown', shootHandler);
                shootHandler = null;
    
                this.time.delayedCall(2000, showRetryPrompt);
            };
    
            shootHandler = (e) => {
                if (e.code === 'Space') shoot();
            };
            this.input.keyboard.on('keydown', shootHandler);
        };
    
        const showRetryPrompt = () => {
            retryText = this.add.text(centerX, centerY + 60, 'Main Lagi? [Y] Ya / [T] Tidak', {
                fontSize: '20px',
                fill: '#ffffff',
                align: 'center'
            }).setOrigin(0.5);
    
            retryHandler = (e) => {
                if (e.code === 'KeyY') {
                    this.input.keyboard.off('keydown', retryHandler);
                    retryHandler = null;
                    retryText.destroy();
                    retryText = null;
                    showInstruction();
                } else if (e.code === 'KeyT') {
                    this.input.keyboard.off('keydown', retryHandler);
                    retryHandler = null;
                    retryText.destroy();
                    retryText = null;
                    resetGame();
                    bg?.destroy();
                    bg = null;
                    this.scene.isMiniGameActive = false;
                    this.checkAllMinigamesComplete(this);
                }
            };
    
            this.input.keyboard.on('keydown', retryHandler);
        };
    
        showInstruction();
    
        // Pastikan tidak double trigger
        if (startHandler) this.input.keyboard.off('keydown', startHandler);
    
        startHandler = (event) => {
            if (!started && event.code === 'KeyS') {
                startGame();
            }
        };
        this.input.keyboard.on('keydown', startHandler);
    }
    
    
      
      
      
      // Clone 6: Balapan Lari
      playGameClone6() {
        const centerX = this.mapBounds.width / 2;
        const centerY = this.mapBounds.height / 2;
        const bg = this.add.rectangle(centerX, centerY, this.mapBounds.width, 400, 0x000000, 0.7);
        let winLabel;
        let waitForSHandler = null;
    
        const showInstruction = () => {
            if (winLabel) winLabel.destroy();
    
            if (this.minigameWins.clone6) {
                winLabel = this.add.text(centerX, centerY + 50, 'Mereka bilang kami clone, tapi sebetulnya... kami hanya bermain peran.', {
                    fontSize: '12px',
                    fill: '#00ffcc'
                }).setOrigin(0.5);
            }
    
            const instruction = this.add.text(centerX, centerY - 30, 'Ketik "go" berulang kali untuk berlari lebih cepat dari Gweh!', {
                fontSize: '20px',
                fill: '#ffffff',
                align: 'center',
                wordWrap: { width: 600 }
            }).setOrigin(0.5);
    
            const startText = this.add.text(centerX, centerY + 20, '[S] Mulai', {
                fontSize: '22px',
                fill: '#ffff00',
                align: 'center'
            }).setOrigin(0.5);
    
            if (waitForSHandler) this.input.keyboard.off('keydown', waitForSHandler);
            waitForSHandler = (e) => {
                if (e.code === 'KeyS') {
                    instruction.destroy();
                    startText.destroy();
                    this.input.keyboard.off('keydown', waitForSHandler);
                    waitForSHandler = null;
                    startGame();
                }
            };
            this.input.keyboard.on('keydown', waitForSHandler);
        };
    
        const startGame = () => {
            const finishLineX = 900;
    
            const finishLine = this.add.rectangle(finishLineX, centerY - 75, 4, 100, 0xffffff);
            const finishLabel = this.add.text(finishLineX + 10, centerY - 130, 'FINISH', {
                fontSize: '16px',
                fill: '#ffff00',
                fontStyle: 'bold'
            }).setOrigin(0.5);
    
            const player = this.add.rectangle(300, centerY - 100, 30, 30, 0x00ff00);
            const ai = this.add.rectangle(300, centerY - 50, 30, 30, 0xff0000);
            const infoText = this.add.text(centerX/2.3, centerY - 180, '', { fontSize: '18px', fill: '#fff' });
    
            const targetWord = 'go';
            let currentInputIndex = 0;
            let gameEnded = false;
    
            const raceTimer = this.time.addEvent({
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
                            ? 'Cepat juga kamu gura~\n Mulai ulang minigame untuk melihat petunjuk'
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
    
            this.input.keyboard.on('keydown', move);
    
            const showRetryPrompt = () => {
                const playerWon = player.x >= finishLineX && player.x > ai.x;
    
                if (playerWon) {
                    this.minigameWins.clone6 = true;
                }
    
                const retryText = this.add.text(centerX, centerY + 60, 'Main Lagi? [Y] Ya / [T] Tidak', {
                    fontSize: '20px',
                    fill: '#ffffff'
                }).setOrigin(0.5);
    
                const retryHandler = (e) => {
                    if (e.code === 'KeyY') {
                        this.input.keyboard.off('keydown', retryHandler);
                        retryText.destroy();
                        player.destroy();
                        ai.destroy();
                        finishLine.destroy();
                        finishLabel.destroy();
                        infoText.destroy();
                        this.input.keyboard.off('keydown', move);
                        raceTimer.remove();
                        showInstruction(); // Kembali ke instruksi awal
                    } else if (e.code === 'KeyT') {
                        this.input.keyboard.off('keydown', retryHandler);
                        retryText.destroy();
                        player.destroy();
                        ai.destroy();
                        finishLine.destroy();
                        finishLabel.destroy();
                        infoText.destroy();
                        bg.destroy();
                        this.input.keyboard.off('keydown', move);
                        raceTimer.remove();
                        if (winLabel) winLabel.destroy();
                        this.scene.isMiniGameActive = false;
                        this.checkAllMinigamesComplete(this);
                    }
                };
    
                this.input.keyboard.on('keydown', retryHandler);
            };
        };
    
        // Jalankan instruksi saat pertama kali
        showInstruction();
    }
    
       
      
      
      // Clone 7: Hitung Cepat
      playGameClone7() {
        const scene = this;
        const centerX = scene.mapBounds.width / 2;
        const centerY = scene.mapBounds.height / 1.2;
      
        const bg = scene.add.rectangle(centerX, centerY, scene.mapBounds.width, 400, 0x000000, 0.7);
        let winLabel;
      
        function showInstruction() {
          if (scene.minigameWins.clone7) {
            winLabel = scene.add.text(centerX, centerY + 50, 'Di balik wajah yang mirip ini... tersembunyi tawa yang sudah kamu kenal sejak lama.', {
              fontSize: '16px',
              fill: '#00ffcc'
            }).setOrigin(0.5);
          }
      
          const instruction = scene.add.text(centerX, centerY - 30,
            'Jawab soal matematika dengan cepat!\nTekan [ENTER] untuk konfirmasi jawaban.\nKamu hanya punya 30 detik!',
            {
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
      
          function waitForS(e) {
            if (e.code === 'KeyS') {
              instruction.destroy();
              startText.destroy();
              scene.input.keyboard.off('keydown', waitForS);
              startGame();
            }
          }
      
          scene.input.keyboard.on('keydown', waitForS);
        }
      
        showInstruction();
      
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
            answer = Math.floor(eval(expression));
          } catch {
            answer = 0;
          }
      
          const question = scene.add.text(centerX, centerY - 80, `Hitung: ${expression} = ?`, {
            fontSize: '20px',
            fill: '#ffffff'
          }).setOrigin(0.5);
      
          const inputText = scene.add.text(centerX, centerY - 40, '', {
            fontSize: '22px',
            fill: '#ffff00'
          }).setOrigin(0.5);
      
          let userInput = '';
      
          function inputHandler(e) {
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
          }
      
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
            question.setText(win ? 'Cerdas juga, Gura~\nMulai ulang minigame untuk melihat petunjuk!' : `Salah! Jawaban: ${answer}`);
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
      
            function retryHandler(e) {
              if (e.code === 'KeyY') {
                scene.input.keyboard.off('keydown', retryHandler);
                question.destroy();
                inputText.destroy();
                timerText.destroy();
                retryText.destroy();
                if (winLabel) winLabel.destroy();
                showInstruction();
              } else if (e.code === 'KeyT') {
                scene.input.keyboard.off('keydown', retryHandler);
                question.destroy();
                inputText.destroy();
                timerText.destroy();
                retryText.destroy();
                if (winLabel) winLabel.destroy();
                bg.destroy();
                scene.scene.isMiniGameActive = false;
                scene.checkAllMinigamesComplete(scene);
              }
            }
      
            scene.input.keyboard.on('keydown', retryHandler);
          }
        }
      }
      
      
      
      
      
      // Clone 8: tebak warna
      playGameClone8() {
        const tileSize = 100;
        const gridSize = 3;
        const spacing = 20;
        const centerX = this.mapBounds.width / 2;
        const centerY = this.mapBounds.height / 1.3;
        const scene = this;
      
        const startKey = scene.input.keyboard.addKey('S');
        const enterKey = scene.input.keyboard.addKey('ENTER');
        const cursors = scene.input.keyboard.createCursorKeys();
        const yesKey = scene.input.keyboard.addKey('Y');
        const noKey = scene.input.keyboard.addKey('T');
      
        let winLabel, instructionText, startText;
        let boxes = [];
        let selectionRect;
        let selectedRow = 0;
        let selectedCol = 0;
        let gameStarted = false;
        let gameEnded = false;
        let resultText;
        let retryText;
        const bg = scene.add.rectangle(centerX, centerY, scene.mapBounds.width, scene.mapBounds.height, 0x000000, 0.7);
      
        function showInstruction() {
          if (winLabel) winLabel.destroy();
          if (instructionText) instructionText.destroy();
          if (startText) startText.destroy();
      
          if (scene.minigameWins.clone8) {
            winLabel = scene.add.text(centerX, centerY - 220, 'Semuanya adalah tipuan', {
              fontSize: '16px',
              fill: '#00ffcc'
            }).setOrigin(0.5);
          }
      
          instructionText = scene.add.text(centerX, centerY - 260, 'Gunakan [← ↑ ↓ →] untuk pilih kotak\nTekan [ENTER] untuk memilih', {
            fontSize: '20px',
            fill: '#ffffff',
            align: 'center'
          }).setOrigin(0.5);
      
          startText = scene.add.text(centerX, centerY - 200, '[S] Mulai Game', {
            fontSize: '24px',
            fill: '#ffff00'
          }).setOrigin(0.5);
        }
      
        showInstruction();
      
        function createGrid() {
          const newBoxes = [];
          const positions = [];
      
          const startX = centerX - (gridSize * tileSize + (gridSize - 1) * spacing) / 2 + tileSize / 2;
          const startY = centerY - 150;
      
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
          selectionRect = scene.add.rectangle(boxes[0].x, boxes[0].y, tileSize + 1, tileSize + 1)
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
      
          if (win) scene.minigameWins.clone8 = true;
      
          resultText = scene.add.text(centerX, centerY - 20, win ? 'Keren! kamu benar gura~\nMulai ulang minigame untuk melihat petunjuk!' : 'Kamu salah wlee!', {
            fontSize: '28px',
            fill: win ? '#00ff00' : '#ff0000'
          }).setOrigin(0.5);
      
          retryText = scene.add.text(centerX, centerY + 200, 'Main lagi? Tekan [Y] untuk Ya, [T] untuk Tidak', {
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
          showInstruction();
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
          if (selectedBox && selectionRect) {
            selectionRect.setPosition(selectedBox.x, selectedBox.y);
          }
        });
      
        enterKey.on('down', () => {
          if (!gameStarted || gameEnded) return;
      
          const selectedBox = boxes.find(b => b.row === selectedRow && b.col === selectedCol);
          const win = selectedBox && selectedBox.revealColor === 'blue';
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
              if (instructionText) instructionText.destroy();
              if (startText) startText.destroy();
              bg.destroy();
              scene.scene.isMiniGameActive = false;
              scene.checkAllMinigamesComplete(scene);
            });
          }
        });
      }
      
      
      
      
      
      
      startMiniGame(cloneName) {
        const scene = game.scene.scenes[0]; // Ambil scene utama
      
        this.scene.isMiniGameActive = true; // ⬅️ Aktifkan "kunci" kontrol
        this.scene.activeNPC = this.npcGroup.getChildren().find(npc => npc.name === cloneName); // ← simpan NPC yang aktif
      
      
        switch (cloneName) {
          case 'clone1':
            this.playGameClone1(scene, () => { this.scene.isMiniGameActive = false; });
            break;
          case 'clone2':
            this.playGameClone2(scene, () => { this.scene.isMiniGameActive = false; });
            break;
          case 'clone3':
            this.playGameClone3(scene, () => { this.scene.isMiniGameActive = false; });
            break;
          case 'clone4':
            this.playGameClone4(scene, () => { this.scene.isMiniGameActive = false; });
            break;
          case 'clone5':
            this.playGameClone5(scene, () => { this.scene.isMiniGameActive = false; });
            break;
          case 'clone6':
            this.playGameClone6(scene, () => { this.scene.isMiniGameActive = false; });
            break;
          case 'clone7':
            this.playGameClone7(scene, () => { this.scene.isMiniGameActive = false; });
            break;
          case 'clone8':
            this.playGameClone8(scene, () => { this.scene.isMiniGameActive = false; });
            break;
          default:
            console.log('Clone tidak dikenali:', cloneName);
            scene.isMiniGameActive = false; // Kembali normal kalau error
        }
      }

      updateNPCsAfterWin() {
        this.npcGroup.getChildren().forEach(npc => {
          if (!npc.name?.startsWith('clone')) return;
      
          const cloneNumber = parseInt(npc.name.replace('clone', ''));
          if (!isNaN(cloneNumber)) {
            npc.setTexture('npc'); // ganti spritesheet ke npc.png
            npc.setFrame(cloneNumber - 1); // ambil frame berdasarkan urutan clone
            npc.anims.stop(); // hentikan animasi
            npc.setScale(1.05)
          }
        });
      }
      
      
      checkAllMinigamesComplete(scene) {
        if (!scene || !scene.minigameWins) return;
      
        const allDone = Object.values(scene.minigameWins).every(v => v === true);
        if (allDone) {
          scene.won=true;
          scene.updateNPCsAfterWin()
          const centerX = this.mapBounds.width / 2;
          const centerY = this.mapBounds.height / 2;
          const bg = this.add.rectangle(centerX, centerY, 450, 150, 0x000000, 0.2);
          this.add.text(centerX,centerY,  'Horee!!!\nSemua minigame udah kamu menangin!\nAmbil hadiahnya di Goa yang ada di dalam hutan.\nKiri text ini', {
            fontSize: '16px',
            fill: '#00ff00',
            align: 'center'
          }).setOrigin(0.5);
        }
      }
      
}

class OutroScene extends Phaser.Scene {
  constructor() {
      super({ key: 'OutroScene' });
  }

  preload() {
      this.load.image('tired', 'assets/Outro/tired.jpg');
      this.load.image('reveal', 'assets/Outro/shock.jpg');
      this.load.image('friend', 'assets/Outro/friend.jpg');
      this.load.image('ngomong', 'assets/Outro/kobo.jpg');
      this.load.image('party', 'assets/Outro/party.jpg');
      this.load.image('eat','assets/Outro/eat.jpg');
      

  }

  create() {

      this.dialogIndex = 0;

      this.dialogs = [
          "Setelah melewati berbagai tantangan dan memenangkan semua mini-game dari para clone, Gura akhirnya berdiri di tengah desa dengan napas yang sedikit tersengal.",
          "Namun… sesuatu yang aneh mulai terjadi.",
          "Satu per satu, clone yang tadi menantangnya mulai berubah wujud.",
          "Mereka bukan lagi salinan dirinya… tapi justru wajah-wajah yang sangat Gura kenal!",
          "“Eh?! Kobo?! Ollie?! … Semuanya?!” seru Gura dengan mata membelalak.",
          "Ternyata, semua clone itu adalah teman-teman VTuber-nya yang sedang menyamar!",
          "Mereka sengaja membuat jebakan permainan lucu ini karena… Gura sudah terlalu lama tidak muncul dan mereka sangat merindukannya.",
          "“Gura, kamu itu nggak tersesat… kamu cuma lupa jalan pulang!” canda Kobo sambil tertawa.",
          "Gura menggaruk kepala, sedikit malu, “Ehehe~ shark brain moment…”",
          "Sebagai permintaan maaf atas prank besar-besaran ini (dan karena Gura sudah terlalu lapar setelah semua mini-game), teman-temannya menyiapkan pesta makanan super lezat!",
          "Dari takoyaki, hamburger, sampai es krim rumput laut kesukaan Gura.",
          "Akhirnya mereka pun duduk bersama, makan, tertawa, dan bermain seperti dulu lagi.",
          "🌟 Gura sadar... rumah bukan cuma tempat, tapi di mana teman-teman yang mencintaimu menunggu."
      ];

      this.backgrounds = [
          'tired', 'tired', 'reveal', 'reveal',
          'friend', 'friend', 'friend',
          'ngomong', 'ngomong',  'party', 'party',
          'eat', 'eat'
      ];

      this.backgroundScales = {
          tired: 0.9,
          reveal: 0.9,
          friend: 1,
          ngomong: 0.9,
          party: 1.2,
          eat: 1.1,
      };

      const firstKey = this.backgrounds[0];
      this.background = this.add.image(0, 0, firstKey).setOrigin(0);
      this.setBackgroundScale(firstKey);

      this.textBackground = this.add.graphics();
      this.textBackground.fillStyle(0x000000, 0.5);
      this.textBackground.fillRect(40, 490, 920, 90);

      this.textBox = this.add.text(50, 500, '', {
          font: '20px Arial',
          fill: '#ffffff',
          wordWrap: { width: 900 }
      });

      this.nextDialog();

      this.input.keyboard.on('keydown-ENTER', () => {
          this.nextDialog();
      });
  }

  setBackgroundScale(key) {
      const scale = this.backgroundScales[key] || 1;
      this.background.setScale(scale);

      let scaleX = 1000 / this.background.width;
      let scaleY = 600 / this.background.height;
      let autoScale = Math.max(scaleX, scaleY);
      this.background.setScale(autoScale);
  }

  nextDialog() {
      if (this.dialogIndex < this.dialogs.length) {
          this.textBox.setText(this.dialogs[this.dialogIndex]);

          if (this.dialogIndex < this.backgrounds.length) {
              const bgKey = this.backgrounds[this.dialogIndex];
              this.background.setTexture(bgKey);
              this.setBackgroundScale(bgKey);
          }

          this.dialogIndex++;
      } else {
          this.scene.start('HomeScene'); // atau ganti ke scene lain jika ada
      }
  }
}

  

// Konfigurasi Phaser
const config = {
    type: Phaser.AUTO,
    width: 1000,
    height: 600,
    parent: 'game-container',
    pixelArt: true,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 0 },
            debug: false
        }
    },
    scene: [HomeScene, IntroScene, GameScene,OutroScene],
    audio: {
      disableWebAudio: false
  }
};

const game = new Phaser.Game(config);
game.globals = {
  bgm: null
};