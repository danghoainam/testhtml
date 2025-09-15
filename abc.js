// ========================================
// AUTO PLAYER TOOL - HOÀN CHỈNH
// ========================================
(function () {
  console.log("�� Auto Player Tool đang khởi tạo...");

  // Đợi game load xong
  let checkInterval = setInterval(() => {
    if (window.Al && window.Al.getInstance) {
      clearInterval(checkInterval);
      initAutoPlayer();
    }
  }, 100);

  function initAutoPlayer() {
    const gameController = window.Al.getInstance();
    if (!gameController) {
      console.error("❌ Không thể tìm thấy game controller!");
      return;
    }

    console.log("✅ Game controller found! Khởi tạo Auto Player...");

    // Auto Player Class
    class AutoPlayer {
      constructor(gameController) {
        this.gameController = gameController;
        this.isActive = false;
        this.safetyDistance = 60;
        this.targetItemDistance = 35;
        this.avoidanceRadius = 45;
        this.movementSpeed = 250;
        this.lastDecisionTime = 0;
        this.decisionInterval = 80;

        this.enemies = [];
        this.scoringItems = [];
        this.boosterItems = [];
        this.specialItems = [];

        this.autoPlayInterval = null;
        this.debugMode = false;

        this.stats = {
          itemsCollected: 0,
          enemiesAvoided: 0,
          startTime: null,
          lastScore: 0,
        };

        console.log("�� Auto Player đã sẵn sàng!");
        console.log("💡 Sử dụng: autoPlayer.start() để bắt đầu");
      }

      start() {
        if (this.isActive) {
          console.log("⚠️ Auto Player đang chạy rồi!");
          return;
        }

        this.isActive = true;
        this.stats.startTime = Date.now();
        console.log("�� Auto Player đã bắt đầu!");

        this.autoPlayInterval = setInterval(() => {
          if (this.isActive) {
            this.updateGameObjects();
            this.makeDecision();
            this.updateStats();
          }
        }, 50);
      }

      stop() {
        this.isActive = false;
        if (this.autoPlayInterval) {
          clearInterval(this.autoPlayInterval);
          this.autoPlayInterval = null;
        }
        console.log("⏹️ Auto Player đã dừng!");
        this.printFinalStats();
      }

      toggle() {
        if (this.isActive) {
          this.stop();
        } else {
          this.start();
        }
      }

      updateGameObjects() {
        try {
          this.enemies =
            this.gameController._enemyManager
              ?.getAll()
              ?.filter((e) => e.isActive) || [];
          this.scoringItems =
            this.gameController._scoringItemManager
              ?.getAll()
              ?.filter((i) => i.isActive && (i.type === 0 || i.type === 1)) ||
            [];
          this.boosterItems =
            this.gameController._scoringItemManager
              ?.getAll()
              ?.filter((i) => i.isActive && (i.type === 2 || i.type === 3)) ||
            [];
          this.specialItems =
            this.gameController._scoringItemManager
              ?.getAll()
              ?.filter((i) => i.isActive && i.type === 1) || [];
        } catch (error) {
          if (this.debugMode)
            console.warn("Error updating game objects:", error);
        }
      }

      makeDecision() {
        try {
          const character = this.gameController._mainCharacter;
          if (!character) return;

          const characterPos = character.position;
          const targetPosition = this.calculateBestMove(characterPos);

          if (targetPosition) {
            this.moveToPosition(targetPosition);
          }
        } catch (error) {
          if (this.debugMode) console.warn("Error making decision:", error);
        }
      }

      calculateBestMove(characterPos) {
        const nearestEnemy = this.findNearestEnemy(characterPos);
        if (
          nearestEnemy &&
          this.getDistance(characterPos, nearestEnemy.position) <
            this.safetyDistance
        ) {
          this.stats.enemiesAvoided++;
          return this.calculateEscapePosition(
            characterPos,
            nearestEnemy.position
          );
        }

        const nearestSpecialItem = this.findNearestItem(
          this.specialItems,
          characterPos
        );
        if (
          nearestSpecialItem &&
          this.isSafeToMove(nearestSpecialItem.position)
        ) {
          return nearestSpecialItem.position;
        }

        const nearestScoringItem = this.findNearestItem(
          this.scoringItems,
          characterPos
        );
        if (
          nearestScoringItem &&
          this.isSafeToMove(nearestScoringItem.position)
        ) {
          return nearestScoringItem.position;
        }

        const nearestBoosterItem = this.findNearestItem(
          this.boosterItems,
          characterPos
        );
        if (
          nearestBoosterItem &&
          this.isSafeToMove(nearestBoosterItem.position)
        ) {
          return nearestBoosterItem.position;
        }

        return this.findSafeZone(characterPos);
      }

      findNearestEnemy(characterPos) {
        let nearest = null;
        let minDistance = Infinity;

        for (const enemy of this.enemies) {
          const distance = this.getDistance(characterPos, enemy.position);
          if (distance < minDistance) {
            minDistance = distance;
            nearest = enemy;
          }
        }

        return nearest;
      }

      findNearestItem(items, characterPos) {
        let nearest = null;
        let minDistance = Infinity;

        for (const item of items) {
          const distance = this.getDistance(characterPos, item.position);
          if (distance < minDistance) {
            minDistance = distance;
            nearest = item;
          }
        }

        return nearest;
      }

      calculateEscapePosition(characterPos, enemyPos) {
        const escapeDirection = {
          x: characterPos.x - enemyPos.x,
          y: characterPos.y - enemyPos.y,
        };

        const length = Math.sqrt(
          escapeDirection.x * escapeDirection.x +
            escapeDirection.y * escapeDirection.y
        );
        if (length > 0) {
          escapeDirection.x /= length;
          escapeDirection.y /= length;
        }

        const escapeDistance = this.safetyDistance + 25;
        return {
          x: characterPos.x + escapeDirection.x * escapeDistance,
          y: characterPos.y + escapeDirection.y * escapeDistance,
        };
      }

      isSafeToMove(targetPos) {
        for (const enemy of this.enemies) {
          if (
            this.getDistance(targetPos, enemy.position) < this.avoidanceRadius
          ) {
            return false;
          }
        }
        return true;
      }

      findSafeZone(characterPos) {
        const safePositions = [
          { x: characterPos.x + 120, y: characterPos.y },
          { x: characterPos.x - 120, y: characterPos.y },
          { x: characterPos.x, y: characterPos.y + 120 },
          { x: characterPos.x, y: characterPos.y - 120 },
          { x: characterPos.x + 80, y: characterPos.y + 80 },
          { x: characterPos.x - 80, y: characterPos.y - 80 },
          { x: characterPos.x + 80, y: characterPos.y - 80 },
          { x: characterPos.x - 80, y: characterPos.y + 80 },
        ];

        for (const pos of safePositions) {
          if (this.isSafeToMove(pos)) {
            return pos;
          }
        }

        return characterPos;
      }

      getDistance(pos1, pos2) {
        const dx = pos1.x - pos2.x;
        const dy = pos1.y - pos2.y;
        return Math.sqrt(dx * dx + dy * dy);
      }

      moveToPosition(targetPos) {
        try {
          const inputManager = this.gameController._inputManager;
          if (inputManager && inputManager.setPointerPosition) {
            inputManager.setPointerPosition(targetPos.x, targetPos.y);
            inputManager.isPointerDown = true;
          }
        } catch (error) {
          if (this.debugMode) console.warn("Error moving to position:", error);
        }
      }

      updateStats() {
        const currentScore = this.gameController._scoreGame?.getScore() || 0;
        if (currentScore > this.stats.lastScore) {
          this.stats.itemsCollected +=
            (currentScore - this.stats.lastScore) / 10;
          this.stats.lastScore = currentScore;
        }
      }

      getStats() {
        const currentTime = this.stats.startTime
          ? Date.now() - this.stats.startTime
          : 0;
        const minutes = Math.floor(currentTime / 60000);
        const seconds = Math.floor((currentTime % 60000) / 1000);

        return {
          isActive: this.isActive,
          runTime: `${minutes}m ${seconds}s`,
          enemiesCount: this.enemies.length,
          scoringItemsCount: this.scoringItems.length,
          boosterItemsCount: this.boosterItems.length,
          specialItemsCount: this.specialItems.length,
          itemsCollected: Math.floor(this.stats.itemsCollected),
          enemiesAvoided: this.stats.enemiesAvoided,
          currentScore: this.gameController._scoreGame?.getScore() || 0,
        };
      }

      printStats() {
        const stats = this.getStats();
        console.log("📊 Thống kê Auto Player:");
        console.log(`   ⏱️ Thời gian chạy: ${stats.runTime}`);
        console.log(`   🎯 Điểm hiện tại: ${stats.currentScore}`);
        console.log(`   🍎 Items đã ăn: ${stats.itemsCollected}`);
        console.log(`   �� Enemies tránh được: ${stats.enemiesAvoided}`);
        console.log(`   👹 Enemies hiện tại: ${stats.enemiesCount}`);
        console.log(
          `   🎁 Items có sẵn: ${
            stats.scoringItemsCount +
            stats.boosterItemsCount +
            stats.specialItemsCount
          }`
        );
      }

      printFinalStats() {
        console.log("�� Thống kê cuối cùng:");
        this.printStats();
      }

      debug() {
        this.debugMode = !this.debugMode;
        console.log(`�� Debug mode: ${this.debugMode ? "ON" : "OFF"}`);

        if (this.debugMode) {
          console.log("🔍 Debug Info:");
          console.log("Game Controller:", this.gameController);
          console.log("Character:", this.gameController._mainCharacter);
          console.log("Enemies:", this.enemies);
          console.log("Scoring Items:", this.scoringItems);
          console.log("Booster Items:", this.boosterItems);
          console.log("Special Items:", this.specialItems);
        }
      }

      setConfig(config) {
        if (config.safetyDistance) this.safetyDistance = config.safetyDistance;
        if (config.targetItemDistance)
          this.targetItemDistance = config.targetItemDistance;
        if (config.avoidanceRadius)
          this.avoidanceRadius = config.avoidanceRadius;
        if (config.decisionInterval)
          this.decisionInterval = config.decisionInterval;

        console.log("⚙️ Cấu hình đã được cập nhật:", config);
      }
    }

    // Tạo instance của Auto Player
    window.autoPlayer = new AutoPlayer(gameController);

    console.log("🎮 Các lệnh có sẵn:");
    console.log("  autoPlayer.start()           - Bắt đầu auto play");
    console.log("  autoPlayer.stop()            - Dừng auto play");
    console.log("  autoPlayer.toggle()          - Bật/tắt auto play");
    console.log("  autoPlayer.getStats()        - Xem thống kê");
    console.log("  autoPlayer.printStats()      - In thống kê ra console");
    console.log("  autoPlayer.debug()           - Bật/tắt debug mode");
    console.log("  autoPlayer.setConfig({...})  - Tùy chỉnh tham số");

    console.log(
      "✅ Auto Player Tool đã sẵn sàng! Sử dụng autoPlayer.start() để bắt đầu."
    );
  }
})();
