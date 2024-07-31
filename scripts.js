document.getElementById("get_token").addEventListener("click", function () {
  get_token();
});
document.getElementById("relogin").addEventListener("click", function () {
  login();
});
function getlist() {
  const url =
    "https://gateway.mm-live.online/live-client/live/new/4231/1529/list";

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
      console.log("Success:", data);
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
function get_token() {
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
      localStorage.setItem("token", JSON.stringify(data[0].token));
    })
    .catch((error) => {
      console.error("Error:", error);
    });
}
function set_token(token) {
  const url = "https://be-mmlive.vercel.app/users";

  fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ id: 6, type: 1, token: token }), // Chuyển dữ liệu thành chuỗi JSON
  })
    .then((response) => response.json())
    .then((data) => {
      localStorage.setItem("token", JSON.stringify(data.token));
    })
    .catch((error) => {
      console.error("Error:", error);
    });
}
function login() {
  const url =
    "https://gateway.mm-live.online/center-client/sys/auth/new/phone/login";

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
      password: "123456",
      version: "1.0.2",
      softVersion: "1.0.0",
      mobile: "0708893821",
    }), // Chuyển dữ liệu thành chuỗi JSON
  })
    .then((response) => response.json())
    .then((data) => {
      set_token(data.data.token);
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
}
function getLink(liveId, anchorId, liveStatus, type) {
  const url = "https://gateway.mm-live.online/live-client/live/inter/room/220";
  var token = localStorage.getItem("token");
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
document.addEventListener("DOMContentLoaded", function () {
  getlist();
  addClickEventAfterDelay();
});
