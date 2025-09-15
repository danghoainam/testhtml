# 🎮 Game Helper Tool - Công cụ điều chỉnh game

## 📋 Mô tả

Game Helper Tool là một công cụ JavaScript cho phép bạn điều chỉnh game thông qua console hoặc giao diện web một cách dễ dàng.

## 🚀 Cách sử dụng

### 1. Mở game

- Mở file `simple-game.html` trong trình duyệt
- Hoặc mở file `game.html` nếu muốn giao diện đơn giản hơn

### 2. Sử dụng qua Console (F12 → Console)

#### Điều chỉnh Score (Điểm số):

```javascript
// Đặt điểm số
gameHelper.setScore(1000);

// Thêm điểm
gameHelper.addScore(500);

// Đặt điểm mục tiêu
gameHelper.setTargetScore(200);

// Xem điểm hiện tại
gameHelper.getScore();
```

#### Điều chỉnh Lives (Mạng sống):

```javascript
// Đặt số mạng
gameHelper.setLives(10);

// Thêm mạng
gameHelper.addLives(5);

// Đặt số mạng tối đa
gameHelper.setMaxLives(20);

// Xem số mạng hiện tại
gameHelper.getLives();
```

#### Điều chỉnh Game State:

```javascript
// Bắt đầu game
gameHelper.startGame();

// Tạm dừng game
gameHelper.pauseGame();

// Tiếp tục game
gameHelper.resumeGame();

// Chơi lại
gameHelper.replayGame();

// Kết thúc game
gameHelper.finishGame();
```

#### Điều chỉnh Character:

```javascript
// Đặt vị trí character
gameHelper.setCharacterPosition(100, 200, 0);

// Lấy vị trí character
gameHelper.getCharacterPosition();

// Đặt rotation character
gameHelper.setCharacterRotation(0, 0, Math.PI / 4);
```

#### Điều chỉnh Enemies:

```javascript
// Xóa tất cả enemies
gameHelper.clearAllEnemies();

// Tạo enemy mới
gameHelper.spawnEnemy();

// Đếm số enemies
gameHelper.getEnemyCount();
```

#### Điều chỉnh Items:

```javascript
// Xóa tất cả items
gameHelper.clearAllItems();

// Tạo item mới (type: 0=scoring, 1=special, 2=shield, 3=score)
gameHelper.spawnItem(0);

// Đếm số items
gameHelper.getItemCount();
```

#### Điều chỉnh Boosters:

```javascript
// Kích hoạt Shield Booster
gameHelper.activateShieldBooster();

// Kích hoạt Score Booster
gameHelper.activateScoreBooster();
```

#### Điều chỉnh Audio:

```javascript
// Tắt âm thanh
gameHelper.muteAudio();

// Bật âm thanh
gameHelper.unmuteAudio();

// Phát âm thanh cụ thể
gameHelper.playSound("shoot", false, 0.5);
```

### 3. Cheat Modes (Chế độ gian lận):

```javascript
// God Mode - Bất tử
gameHelper.godMode();

// Thắng ngay lập tức
gameHelper.instantWin();

// Dọn sạch tất cả
gameHelper.clearAll();
```

### 4. Thông tin Game:

```javascript
// Xem thông tin tổng quan
gameHelper.getGameInfo();

// Debug mode
gameHelper.debug();
```

## 🎯 Các lệnh nhanh phổ biến:

```javascript
// Thắng game ngay lập tức
gameHelper.instantWin();

// Bật God Mode
gameHelper.godMode();

// Đặt điểm cao
gameHelper.setScore(9999);

// Đặt mạng vô hạn
gameHelper.setLives(999);

// Dọn sạch enemies
gameHelper.clearAllEnemies();

// Xem trạng thái game
gameHelper.getGameInfo();
```

## ⚠️ Lưu ý quan trọng:

1. **Đợi game load xong** trước khi sử dụng các lệnh
2. **Kiểm tra console** để xem thông báo lỗi/thành công
3. **Sử dụng đúng cú pháp** - phân biệt chữ hoa/chữ thường
4. **Backup game state** trước khi thay đổi lớn
5. **Test từng lệnh** trước khi kết hợp nhiều lệnh

## 🔧 Troubleshooting:

### Lỗi "Game Helper chưa sẵn sàng":

- Đợi thêm vài giây để game load
- Kiểm tra console có lỗi gì không
- Refresh trang nếu cần

### Lỗi "Cannot read properties of undefined":

- Game chưa load xong
- Kiểm tra file `main.js` có được load không
- Đợi thêm thời gian

### Lệnh không hoạt động:

- Kiểm tra console để xem lỗi cụ thể
- Đảm bảo game đang chạy
- Thử lệnh khác để test

## 📁 Cấu trúc file:

- `main.js` - Game engine chính
- `abc.js` - Auto Player Tool
- `game-helper.js` - Game Helper Tool
- `simple-game.html` - Giao diện test game
- `game.html` - Giao diện game đơn giản

## 🎮 Chúc bạn chơi game vui vẻ!

Nếu có vấn đề gì, hãy kiểm tra console và đảm bảo tất cả file đã được load đúng cách.
