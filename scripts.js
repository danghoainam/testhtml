document.getElementById("get_token").addEventListener("click", function () {
  get_token("mmlive");
});
document.getElementById("get_token_qq").addEventListener("click", function () {
  get_token("qqlive");
});
document.getElementById("relogin").addEventListener("click", function () {
  login();
});
document.getElementById("relogin_qq").addEventListener("click", function () {
  loginqq();
});
const KEY = CryptoJS.enc.Utf8.parse("ugxxmyfrbh9cgg2s");
const IV = CryptoJS.enc.Utf8.parse("a4cehrwwtew8pwty");
function decrypt(str, keyStr, ivStr) {
  let key = KEY;
  let iv = IV;

  // Nếu có khóa và IV được cung cấp, sử dụng chúng
  if (keyStr && ivStr) {
    key = CryptoJS.enc.Utf8.parse(keyStr);
    iv = CryptoJS.enc.Utf8.parse(ivStr);
  }

  // Chuyển đổi chuỗi base64 thành dạng có thể giải mã
  let base64 = CryptoJS.enc.Base64.parse(str);
  let src = CryptoJS.enc.Base64.stringify(base64);

  // Giải mã
  var decrypt = CryptoJS.AES.decrypt(src, key, {
    iv: iv,
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.Pkcs7,
  });

  return CryptoJS.enc.Utf8.stringify(decrypt).toString(); // Trả về chuỗi đã giải mã
}
function decryptLast(par) {
  let qweKey = decrypt(par.abc.substring(13)); // Giải mã phần abc
  let decryptData = decrypt(par.qwe, qweKey, "a4cehrwwtew8pwty"); // Giải mã phần qwe

  if (isJSON(decryptData)) {
    decryptData = JSON.parse(decryptData); // Chuyển đổi thành đối tượng JSON nếu cần
  }
  return decryptData; // Trả về dữ liệu đã giải mã
}
function isJSON(str) {
  if (typeof str === "string") {
    try {
      var obj = JSON.parse(str);
      return typeof obj === "object" && obj !== null;
    } catch (e) {
      return false;
    }
  }
  return false;
}
function encrypt(str, keyStr, ivStr) {
  let key = KEY;
  let iv = IV;

  if (keyStr && ivStr) {
    key = CryptoJS.enc.Utf8.parse(keyStr);
    iv = CryptoJS.enc.Utf8.parse(ivStr);
  }

  let srcs = CryptoJS.enc.Utf8.parse(str);
  let encrypt = CryptoJS.AES.encrypt(srcs, key, {
    iv: iv,
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.Pkcs7,
  });
  return CryptoJS.enc.Base64.stringify(encrypt.ciphertext);
}

// Hàm mã hóa cuối cùng
function encryptLast(data) {
  let num = suijione(true, false, false, 16);
  let encryptData = {
    abc: new Date().getTime() + encrypt(num),
    qwe: encrypt(JSON.stringify(data), num, "a4cehrwwtew8pwty"),
  };
  return encryptData;
}
function suijione(num, maxA, minlA, fqy) {
  let arr = [];
  let arr1 = [];
  let arr2 = [];
  if (num) {
    for (let m = 0; m <= 9; m++) {
      arr.push(m);
    }
  }
  if (maxA) {
    for (let m = 65; m <= 90; m++) {
      arr1.push(m);
    }
  }
  if (minlA) {
    for (let m = 97; m <= 122; m++) {
      arr2.push(m);
    }
  }
  if (!fqy) {
    console.log("生成位数必传");
  }
  let mergeArr = arr.concat(arr1);
  let mergeArr1 = mergeArr.concat(arr2);
  let _length = mergeArr1.length;
  let text = "";
  for (let m = 0; m < fqy; m++) {
    let text1 = "";
    let random = getRandom(0, _length);
    if (mergeArr1[random] <= 9) {
      text1 = mergeArr1[random];
    } else {
      text1 = String.fromCharCode(mergeArr1[random]);
    }
    text += text1;
  }
  return text;
}
function getRandom(a, b) {
  var max = a;
  var min = b;
  if (a < b) {
    max = b;
    min = a;
  }
  return parseInt(Math.random() * (max - min)) + min;
}
// Sử dụng hàm decryptLast để giải mã dữ liệu
function decryptL(par) {
  let data = localStorage.getItem("keyqq");

  let key = JSON.parse(data).randomKey;
  let iv = JSON.parse(data).randomVector;
  let decryptData = decrypt(par, key, iv);
  return decryptData;
}
function decryptString(encryptedString) {
  const key = "star@livega*963."; // Khóa giải mã
  const iv = "0608040307010502"; // Vector khởi tạo (IV)

  // Chuỗi đã mã hóa cần giải mã

  // Hàm giải mã
  function decrypt(encrypted, key, iv) {
    try {
      const parsedKey = CryptoJS.enc.Utf8.parse(key);
      const parsedIv = CryptoJS.enc.Utf8.parse(iv);
      const decrypted = CryptoJS.AES.decrypt(encrypted, parsedKey, {
        iv: parsedIv,
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7,
      });
      return decrypted.toString(CryptoJS.enc.Utf8);
    } catch (error) {
      console.error("Decryption failed:", error);
      return null;
    }
  }

  // Thực hiện giải mã
  return decrypt(encryptedString, key, iv);
}

////////////
function getlist() {
  const url =
    "https://gateway.mmlive.online/live-client/live/new/4231/1529/list";

  fetch(url, {
    method: "POST",
    headers: {
      "x-timestamp": 1722326222690,
      "x-udid": "4f20d7258366d7c7d1090af96474e260",
      "x-sign": "0d315027f868dd33df0f8640b3724437",
      Referer: "https://mm-live.online",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ type: 1, uid: 2026328074 }), // Chuyển dữ liệu thành chuỗi JSON
  })
    .then((response) => response.json())
    .then((data) => {
      var html = ``;
      for (var i = 0; i < data.data.length; i++) {
        html += `<div class="live" liveId="${data.data[i].liveId}" type="${data.data[i].type}" liveStatus="${data.data[i].liveStatus}" anchorId="${data.data[i].anchorId}"><p>${data.data[i].nickname}</p><image style="width:120px;height:120px;object-fit: cover;" src="${data?.data[i].avatar}"/></div>`;
      }
      document.getElementById("list_idol").innerHTML = html;
    })
    .catch((error) => {
      console.error("Error:", error);
    });
}
function getlistqq() {
  const url =
    "https://gateway.qqlive.online/live-client/live/new/4231/1529/list";

  fetch(url, {
    method: "POST",
    targetUrl: "https://qqlive.online/",
    headers: {
      "x-timestamp": 1723520610607,
      "x-udid": "05991a20be781bc01fd54e34a16021ed",
      "x-sign": "61efc8af4c507a4859784791fa5a697a",
      "Content-Type": "application/json",
      Referer: "https://qqlive.online/",
      appid: "QQlive",
      "p-ae": "n",
    },
    body: JSON.stringify({
      abc: "1723524119772aMyJ4QMkJxgtmhvp8vtg/OIrvycNydurD4aElgzdXh0=",
      qwe: "rxQFoAcPh/tfvPCxvf7brCjrwIPz9isOopVrEv4vo/0=",
    }), // Chuyển dữ liệu thành chuỗi JSON
    referrerPolicy: "no-referrer",
  })
    .then((response) => response.json())
    .then((data) => {
      const decryptedResult = decryptLast(data);
      console.log("Success:", decryptedResult);
      data = decryptedResult;
      var html = ``;
      for (var i = 0; i < data.data.length; i++) {
        html += `<div class="liveqq" liveId="${data.data[i].liveId}" type="${data.data[i].type}" liveStatus="${data.data[i].liveStatus}" anchorId="${data.data[i].anchorId}"><p>${data.data[i].nickname}</p><image style="width:120px;height:120px;object-fit: cover;" src="${data?.data[i].avatar}"/></div>`;
      }
      document.getElementById("list_idol_qqllive").innerHTML = html;
    })
    .catch((error) => {
      console.error("Error:", error);
    });
}
function getlistyy() {
  // Gọi tới Node.js proxy server thay vì API gốc
  const url = "https://luminous-sfogliatella-fea5ac.netlify.app/api/proxy-live";

  fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    // Nếu muốn truyền tham số động, thêm body ở đây
    // body: JSON.stringify({ pageNum: 1, pageSize: 50, labelId: 1 }),
  })
    .then((response) => response.json())
    .then((data) => {
      var html = ``;
      for (var i = 0; i < data.records.length; i++) {
        html += `<div class="liveyy" liveId="${data.records[i].id}" type="${data.records[i].payType}" liveStatus="${data.records[i].showType}" anchorId="${data.records[i].anchorId}"><p>${data.records[i].anchorNickname}</p><image style="width:120px;height:120px;object-fit: cover;" src="${data?.records[i].coverUrl}"/></div>`;
      }
      document.getElementById("list_idol_yyllive").innerHTML = html;
    })
    .catch((error) => {
      console.error("Error:", error);
    });
}
function getlist789() {
  // Gọi tới Node.js proxy server thay vì API gốc
  const url = "http://localhost:3001/api/proxy-live-789";

  fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    // Nếu muốn truyền tham số động, thêm body ở đây
    // body: JSON.stringify({ pageNum: 1, pageSize: 50, labelId: 1 }),
  })
    .then((response) => response.json())
    .then((data) => {
      var html = ``;
      for (var i = 0; i < data.records.length; i++) {
        html += `<div class="live789" liveId="${data.records[i].id}" type="${data.records[i].payType}" liveStatus="${data.records[i].showType}" anchorId="${data.records[i].anchorId}"><p>${data.records[i].anchorNickname}</p><image style="width:120px;height:120px;object-fit: cover;" src="${data?.records[i].coverUrl}"/></div>`;
      }
      document.getElementById("list_idol_789live").innerHTML = html;
    })
    .catch((error) => {
      console.error("Error:", error);
    });
}
function get_token(key) {
  const url = "https://be-mmlive.vercel.app/users";

  fetch(url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
    allow: "*",
  })
    .then((response) => response.json())
    .then((data) => {
      const item = data.find((item) => item.key === key);
      localStorage.setItem(key, JSON.stringify(item.token));
    })
    .catch((error) => {
      console.error("Error:", error);
    });
}
function set_token(key, token) {
  const url = "https://be-mmlive.vercel.app/users";

  fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ key: key, token: token }), // Chuyển dữ liệu thành chuỗi JSON
  })
    .then((response) => response.json())
    .then((data) => {
      localStorage.setItem(key, JSON.stringify(data.token));
    })
    .catch((error) => {
      console.error("Error:", error);
    });
}
function login() {
  const url =
    "https://gateway.mmlive.online/center-client/sys/auth/new/phone/login";

  fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      os: 0,
      sign: "21c6066ff81e18305b5186108248e312",
      timestamp: 1722330828163,
      udid: "4f20d7258366d7c7d1090af96474e260",
      model: "IOS",
      password: "namnam123",
      version: "1.0.2",
      softVersion: "1.0.0",
      mobile: "0708893821",
    }), // Chuyển dữ liệu thành chuỗi JSON
  })
    .then((response) => response.json())
    .then((data) => {
      set_token("mmlive", data.data.token);
    })
    .catch((error) => {
      console.error("Error:", error);
    });
}
function loginqq() {
  const url =
    "https://gateway.qqlive.online/center-client/sys/auth/new/phone/login";

  fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-timestamp": 1723520610607,
      "x-udid": "05991a20be781bc01fd54e34a16021ed",
      "x-sign": "61efc8af4c507a4859784791fa5a697a",
      "Content-Type": "application/json",
      Referer: "https://qqlive.online/",
      appid: "QQlive",
      "p-ae": "n",
    },
    body: JSON.stringify({
      abc: "1723530093990hgwged2d+ug4nNvGnUmtDGbtIiiLYgsMyGpKzOoVHa0=",
      qwe: "aXVfFytvpvi8LfbsGsnuZbYPj1vTetRJO8rpT65bJDheKN5QfMvyybhwVljZtYUPlrfTZJO4DXwRBPoLxL2yJLctYzLSORPsi3YMnFwFQrjsqchAVUuVlMNWZioun9GRsyJPUgy/rFCH4KnGuikY5VexlluxC3+DkntGG1zlkUoeNUpKBcFAHOcnE/qo49UIKUGyFTZEf+XxNd5Fbk15AhrwCh+a/NqUftLzwOGQfL5Dn2w4kOXcIMV3LKyX3kDRrt9bxbjPLPOEHuXzB+FAxLLzFCAF6ZL3ayjuLXQyjLY=",
    }), // Chuyển dữ liệu thành chuỗi JSON
  })
    .then((response) => response.json())
    .then((data) => {
      const decryptedResult = decryptLast(data);
      set_token("qqlive", decryptedResult.data.token);
      localStorage.setItem(
        "keyqq",
        JSON.stringify({
          randomKey: decryptedResult.data.randomKey,
          randomVector: decryptedResult.data.randomVector,
        })
      );
    })
    .catch((error) => {
      console.error("Error:", error);
    });
}
function addClickEventAfterDelay() {
  setTimeout(function () {
    var elements = document.getElementsByClassName("live");
    for (var i = 0; i < elements.length; i++) {
      elements[i].addEventListener("click", function () {
        var liveId = this.getAttribute("liveId");
        var anchorId = this.getAttribute("anchorId");
        var liveStatus = this.getAttribute("liveStatus");
        var type = this.getAttribute("type");

        getLink(liveId, anchorId, liveStatus, type);
      });
    }
  }, 2000); // 2000ms = 2 giây
  setTimeout(function () {
    var elements = document.getElementsByClassName("liveqq");
    for (var i = 0; i < elements.length; i++) {
      elements[i].addEventListener("click", function () {
        var liveId = this.getAttribute("liveId");
        var anchorId = this.getAttribute("anchorId");
        var liveStatus = this.getAttribute("liveStatus");
        var type = this.getAttribute("type");

        getLinkqq(liveId, anchorId, liveStatus, type);
      });
    }
  }, 2000); // 2000ms = 2 giây
  setTimeout(function () {
    var elements = document.getElementsByClassName("liveyy");
    for (var i = 0; i < elements.length; i++) {
      elements[i].addEventListener("click", function () {
        var liveId = this.getAttribute("liveId");
        var anchorId = this.getAttribute("anchorId");
        var liveStatus = this.getAttribute("liveStatus");
        var type = this.getAttribute("type");

        getLinkyy(liveId, anchorId, liveStatus, type);
      });
    }
  }, 2000); // 2000ms = 2 giây
  setTimeout(function () {
    var elements = document.getElementsByClassName("live789");
    for (var i = 0; i < elements.length; i++) {
      elements[i].addEventListener("click", function () {
        var liveId = this.getAttribute("liveId");
        var anchorId = this.getAttribute("anchorId");
        var liveStatus = this.getAttribute("liveStatus");
        var type = this.getAttribute("type");

        getLink789(liveId, anchorId, liveStatus, type);
      });
    }
  }, 2000); // 2000ms = 2 giây
}
function getLink(liveId, anchorId, liveStatus, type) {
  const url = "https://gateway.mmlive.online/live-client/live/inter/room/220";
  var token = localStorage.getItem("mmlive");
  token = token.replace(/"/g, "");

  fetch(url, {
    method: "POST",
    headers: {
      Authorization: `HSBox ${token}`,
      "x-timestamp": 1722326222690,
      "x-udid": "4f20d7258366d7c7d1090af96474e260",
      "x-sign": "0d315027f868dd33df0f8640b3724437",
      Referer: "https://mm-live.online",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      anchorId: Number(anchorId),
      liveId: Number(liveId),
      uid: 2026328074,
      adJumpUrl: "",
      liveStatus: Number(liveStatus),
      isRoomPreview: 0,
      type: type,
    }), // Chuyển dữ liệu thành chuỗi JSON
  })
    .then((response) => response.json())
    .then((data) => {
      var link = data.data.pullStreamUrl.replaceAll("rtmp", "webrtc");
      location.href = `/video.html?link=${link}`;
    })
    .catch((error) => {
      alert(error);
    });
}
function getLinkqq(liveId, anchorId, liveStatus, type) {
  const url = "https://gateway.qqlive.online/live-client/live/inter/room/220";
  var token = localStorage.getItem("qqlive");
  token = token.replace(/"/g, "");

  fetch(url, {
    method: "POST",
    headers: {
      Authorization: `HSBox ${token}`,
      "x-timestamp": 1723520610607,
      "x-udid": "05991a20be781bc01fd54e34a16021ed",
      "x-sign": "61efc8af4c507a4859784791fa5a697a",
      Referer: "https://qqlive.online/",
      "Content-Type": "application/json",
      "p-ae": "n",
    },
    body: JSON.stringify(
      encryptLast({
        anchorId: Number(anchorId),
        liveId: Number(liveId),
        uid: 2026328074,
        adJumpUrl: "",
        liveStatus: Number(liveStatus),
        isRoomPreview: 0,
        type: type,
      })
    ),
  })
    .then((response) => response.json())
    .then((data) => {
      const decryptedResult = decryptLast(data);
      const url = decryptL(decryptedResult.data.pullStreamUrl);
      console.log("url", url);

      var link = url.replaceAll("rtmp", "webrtc");
      location.href = `/video.html?link=${link}`;
    })
    .catch((error) => {
      alert(error);
    });
}
function getLinkyy(liveId, anchorId, liveStatus, type) {
  const url =
    "https://api.t3cdn.com/511/api/live-service/h5/v3/public/live/room-info";

  fetch(url, {
    method: "POST",
    headers: {
      Authorization: `Basic d2ViLXBsYXllcjp3ZWJQbGF5ZXIyMDIyKjk2My4hQCM=`,
      "x-frame-options": "DENY",
      "x-content-type-option": "nosniff",
      "locale-language": "VIT",
      merchantid: "511",
      "dev-type": "H5",
      area: "VN",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      anchorId: anchorId,
    }),
  })
    .then((response) => response.json())
    .then((data) => {
      let link = decryptString(data.pullAddress);
      console.log(link);
      location.href = `/video.html?link=${link}`;
    })
    .catch((error) => {
      alert(error);
    });
}
function getLink789(liveId, anchorId, liveStatus, type) {
  const url =
    "https://api.t3cdn.com/560/api/live-service/v4/public/live/room-info";

  fetch(url, {
    method: "POST",
    headers: {
      Authorization: `Basic d2ViLXBsYXllcjp3ZWJQbGF5ZXIyMDIyKjk2My4hQCM=`,
      "x-frame-options": "DENY",
      "x-content-type-option": "nosniff",
      "locale-language": "VIT",
      merchantid: "560",
      "dev-type": "H5",
      area: "VN",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      anchorId: anchorId,
    }),
  })
    .then((response) => response.json())
    .then((data) => {
      let link = decryptString(data.unlDefPa);
      console.log(link);
      location.href = `/video.html?link=${link}`;
    })
    .catch((error) => {
      alert(error);
    });
}
function get_token() {
  const url = "https://be-mmlive.vercel.app/users";
  fetch(url, {
    method: "GET",
  })
    .then((response) => response.json())
    .then((data) => {
      data?.map((item) => {
        localStorage.setItem(item.key, JSON.stringify(item.token));
      });
    });
}
document.addEventListener("DOMContentLoaded", function () {
  get_token();
  getlist();
  getlistqq();
  getlistyy();
  getlist789();
  addClickEventAfterDelay();
});
