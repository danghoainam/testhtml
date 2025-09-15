// ========================================
// GAME HELPER TOOL - CÔNG CỤ ĐIỀU CHỈNH GAME
// ========================================

(function () {
  console.log("🎮 Game Helper Tool đang khởi tạo...");

  // Đợi game load xong
  let checkInterval = setInterval(() => {
    if (window.Al && window.Al.getInstance) {
      clearInterval(checkInterval);
      initGameHelper();
    } else if (window.wl && window.wl.getInstance) {
      clearInterval(checkInterval);
      initGameHelper();
    }
  }, 100);

  function initGameHelper() {
    const gameController = window.Al?.getInstance() || window.wl?.getInstance();
    if (!gameController) {
      console.error("❌ Không thể tìm thấy game controller!");
      return;
    }

    console.log("✅ Game Helper Tool đã sẵn sàng!");

    // Tạo Game Helper Object
    window.gameHelper = {
      // Lấy game controller
      getController: () => gameController,

      // ===== ĐIỀU CHỈNH SCORE =====
      setScore: (score) => {
        try {
          gameController._scoreGame.setScore(score);
          console.log(`✅ Đã đặt score: ${score}`);
          return true;
        } catch (error) {
          console.error("❌ Lỗi khi đặt score:", error);
          return false;
        }
      },

      getScore: () => {
        try {
          return gameController._scoreGame.getScore();
        } catch (error) {
          console.error("❌ Lỗi khi lấy score:", error);
          return 0;
        }
      },

      addScore: (points) => {
        try {
          const currentScore = gameController._scoreGame.getScore();
          gameController._scoreGame.setScore(currentScore + points);
          console.log(
            `✅ Đã thêm ${points} điểm. Score mới: ${currentScore + points}`
          );
          return true;
        } catch (error) {
          console.error("❌ Lỗi khi thêm score:", error);
          return false;
        }
      },

      setTargetScore: (target) => {
        try {
          gameController._scoreGame.setTargetScore(target);
          console.log(`✅ Đã đặt target score: ${target}`);
          return true;
        } catch (error) {
          console.error("❌ Lỗi khi đặt target score:", error);
          return false;
        }
      },

      // ===== ĐIỀU CHỈNH LIVES =====
      setLives: (lives) => {
        try {
          gameController._liveGame.setLive(lives);
          console.log(`✅ Đã đặt lives: ${lives}`);
          return true;
        } catch (error) {
          console.error("❌ Lỗi khi đặt lives:", error);
          return false;
        }
      },

      getLives: () => {
        try {
          return gameController._liveGame.getLive();
        } catch (error) {
          console.error("❌ Lỗi khi lấy lives:", error);
          return 0;
        }
      },

      addLives: (lives) => {
        try {
          const currentLives = gameController._liveGame.getLive();
          gameController._liveGame.setLive(currentLives + lives);
          console.log(
            `✅ Đã thêm ${lives} mạng. Lives mới: ${currentLives + lives}`
          );
          return true;
        } catch (error) {
          console.error("❌ Lỗi khi thêm lives:", error);
          return false;
        }
      },

      setMaxLives: (maxLives) => {
        try {
          gameController._liveGame.setMaxLive(maxLives);
          console.log(`✅ Đã đặt max lives: ${maxLives}`);
          return true;
        } catch (error) {
          console.error("❌ Lỗi khi đặt max lives:", error);
          return false;
        }
      },

      // ===== ĐIỀU CHỈNH GAME STATE =====
      startGame: () => {
        try {
          gameController.startGame();
          console.log("✅ Đã bắt đầu game!");
          return true;
        } catch (error) {
          console.error("❌ Lỗi khi bắt đầu game:", error);
          return false;
        }
      },

      pauseGame: () => {
        try {
          gameController.pauseGame();
          console.log("⏸️ Đã tạm dừng game!");
          return true;
        } catch (error) {
          console.error("❌ Lỗi khi tạm dừng game:", error);
          return false;
        }
      },

      resumeGame: () => {
        try {
          gameController.resumeGame();
          console.log("▶️ Đã tiếp tục game!");
          return true;
        } catch (error) {
          console.error("❌ Lỗi khi tiếp tục game:", error);
          return false;
        }
      },

      replayGame: () => {
        try {
          gameController.replayGame();
          console.log("🔄 Đã chơi lại game!");
          return true;
        } catch (error) {
          console.error("❌ Lỗi khi chơi lại game:", error);
          return false;
        }
      },

      finishGame: () => {
        try {
          gameController.finishGame();
          console.log("🏁 Đã kết thúc game!");
          return true;
        } catch (error) {
          console.error("❌ Lỗi khi kết thúc game:", error);
          return false;
        }
      },

      // ===== ĐIỀU CHỈNH CHARACTER =====
      setCharacterPosition: (x, y, z = 0) => {
        try {
          gameController._mainCharacter.position.set(x, y, z);
          console.log(`✅ Đã đặt vị trí character: (${x}, ${y}, ${z})`);
          return true;
        } catch (error) {
          console.error("❌ Lỗi khi đặt vị trí character:", error);
          return false;
        }
      },

      getCharacterPosition: () => {
        try {
          const pos = gameController._mainCharacter.position;
          return { x: pos.x, y: pos.y, z: pos.z };
        } catch (error) {
          console.error("❌ Lỗi khi lấy vị trí character:", error);
          return { x: 0, y: 0, z: 0 };
        }
      },

      setCharacterRotation: (x, y, z) => {
        try {
          gameController._mainCharacter.rotation.set(x, y, z);
          console.log(`✅ Đã đặt rotation character: (${x}, ${y}, ${z})`);
          return true;
        } catch (error) {
          console.error("❌ Lỗi khi đặt rotation character:", error);
          return false;
        }
      },

      // ===== ĐIỀU CHỈNH ENEMIES =====
      clearAllEnemies: () => {
        try {
          const enemies = gameController._enemyManager.getAll();
          enemies.forEach((enemy) => {
            enemy.isActive = false;
          });
          console.log(`✅ Đã xóa ${enemies.length} enemies!`);
          return true;
        } catch (error) {
          console.error("❌ Lỗi khi xóa enemies:", error);
          return false;
        }
      },

      spawnEnemy: () => {
        try {
          gameController._enemyManager.spawn();
          console.log("✅ Đã tạo enemy mới!");
          return true;
        } catch (error) {
          console.error("❌ Lỗi khi tạo enemy:", error);
          return false;
        }
      },

      getEnemyCount: () => {
        try {
          return gameController._enemyManager.getAll().filter((e) => e.isActive)
            .length;
        } catch (error) {
          console.error("❌ Lỗi khi đếm enemies:", error);
          return 0;
        }
      },

      // ===== ĐIỀU CHỈNH ITEMS =====
      clearAllItems: () => {
        try {
          const items = gameController._scoringItemManager.getAll();
          items.forEach((item) => {
            item.isActive = false;
          });
          console.log(`✅ Đã xóa ${items.length} items!`);
          return true;
        } catch (error) {
          console.error("❌ Lỗi khi xóa items:", error);
          return false;
        }
      },

      spawnItem: (type = 0) => {
        try {
          const pos = gameController._mainCharacter.position;
          const item = gameController._scoringItemManager.spawn(pos, 0, type);
          console.log(`✅ Đã tạo item type ${type}!`);
          return true;
        } catch (error) {
          console.error("❌ Lỗi khi tạo item:", error);
          return false;
        }
      },

      getItemCount: () => {
        try {
          return gameController._scoringItemManager
            .getAll()
            .filter((i) => i.isActive).length;
        } catch (error) {
          console.error("❌ Lỗi khi đếm items:", error);
          return 0;
        }
      },

      // ===== ĐIỀU CHỈNH BOOSTERS =====
      activateShieldBooster: () => {
        try {
          gameController._boosterController.handleCollectShieldBooster();
          console.log("🛡️ Đã kích hoạt Shield Booster!");
          return true;
        } catch (error) {
          console.error("❌ Lỗi khi kích hoạt Shield Booster:", error);
          return false;
        }
      },

      activateScoreBooster: () => {
        try {
          gameController._boosterController.handleCollectAbilityBooster();
          console.log("⭐ Đã kích hoạt Score Booster!");
          return true;
        } catch (error) {
          console.error("❌ Lỗi khi kích hoạt Score Booster:", error);
          return false;
        }
      },

      // ===== ĐIỀU CHỈNH AUDIO =====
      muteAudio: () => {
        try {
          window.r.muteAll(true);
          console.log("🔇 Đã tắt âm thanh!");
          return true;
        } catch (error) {
          console.error("❌ Lỗi khi tắt âm thanh:", error);
          return false;
        }
      },

      unmuteAudio: () => {
        try {
          window.r.muteAll(false);
          console.log("🔊 Đã bật âm thanh!");
          return true;
        } catch (error) {
          console.error("❌ Lỗi khi bật âm thanh:", error);
          return false;
        }
      },

      playSound: (soundName, loop = false, volume = 1.0) => {
        try {
          window.r.play(soundName, loop, volume);
          console.log(`🔊 Đã phát âm thanh: ${soundName}`);
          return true;
        } catch (error) {
          console.error("❌ Lỗi khi phát âm thanh:", error);
          return false;
        }
      },

      // ===== THÔNG TIN GAME =====
      getGameInfo: () => {
        try {
          return {
            score: gameController._scoreGame.getScore(),
            targetScore: gameController._scoreGame.getTargetScore(),
            lives: gameController._liveGame.getLive(),
            maxLives: gameController._liveGame.getMaxLive(),
            isPlaying: gameController._isPlaying,
            enemyCount: gameController._enemyManager
              .getAll()
              .filter((e) => e.isActive).length,
            itemCount: gameController._scoringItemManager
              .getAll()
              .filter((i) => i.isActive).length,
            characterPosition: {
              x: gameController._mainCharacter.position.x,
              y: gameController._mainCharacter.position.y,
              z: gameController._mainCharacter.position.z,
            },
          };
        } catch (error) {
          console.error("❌ Lỗi khi lấy thông tin game:", error);
          return null;
        }
      },

      // ===== CHEAT MODES =====
      godMode: () => {
        try {
          this.setLives(999);
          this.setMaxLives(999);
          console.log("👑 GOD MODE ACTIVATED!");
          return true;
        } catch (error) {
          console.error("❌ Lỗi khi kích hoạt God Mode:", error);
          return false;
        }
      },

      instantWin: () => {
        try {
          const targetScore = this.getGameInfo().targetScore;
          this.setScore(targetScore);
          console.log("🏆 INSTANT WIN!");
          return true;
        } catch (error) {
          console.error("❌ Lỗi khi kích hoạt Instant Win:", error);
          return false;
        }
      },

      clearAll: () => {
        try {
          this.clearAllEnemies();
          this.clearAllItems();
          console.log("🧹 Đã dọn sạch tất cả!");
          return true;
        } catch (error) {
          console.error("❌ Lỗi khi dọn sạch:", error);
          return false;
        }
      },

      // ===== DEBUG =====
      debug: () => {
        console.log("🔍 Debug Info:");
        console.log("Game Controller:", gameController);
        console.log("Score Game:", gameController._scoreGame);
        console.log("Live Game:", gameController._liveGame);
        console.log("Main Character:", gameController._mainCharacter);
        console.log("Enemy Manager:", gameController._enemyManager);
        console.log("Item Manager:", gameController._scoringItemManager);
        console.log("Booster Controller:", gameController._boosterController);
      },
    };

    // Hiển thị hướng dẫn sử dụng
    console.log("🎮 Các lệnh có sẵn:");
    console.log("  gameHelper.setScore(1000)        - Đặt điểm số");
    console.log("  gameHelper.addScore(500)         - Thêm điểm");
    console.log("  gameHelper.setLives(10)          - Đặt số mạng");
    console.log("  gameHelper.addLives(5)           - Thêm mạng");
    console.log("  gameHelper.startGame()           - Bắt đầu game");
    console.log("  gameHelper.pauseGame()            - Tạm dừng game");
    console.log("  gameHelper.replayGame()          - Chơi lại");
    console.log("  gameHelper.godMode()             - Kích hoạt God Mode");
    console.log("  gameHelper.instantWin()          - Thắng ngay lập tức");
    console.log("  gameHelper.clearAll()            - Dọn sạch tất cả");
    console.log("  gameHelper.getGameInfo()         - Xem thông tin game");
    console.log("  gameHelper.debug()               - Debug mode");

    console.log(
      "✅ Game Helper Tool đã sẵn sàng! Sử dụng gameHelper. để điều chỉnh game."
    );
  }
})();
