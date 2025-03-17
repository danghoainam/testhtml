import http from "k6/http";
import { sleep, check } from "k6";

export let options = {
  stages: [
    { duration: "30s", target: 10 }, // Khởi động với 10 users trong 30 giây
    { duration: "1m", target: 200 }, // Tăng lên 50 users trong 1 phút
    { duration: "1m30s", target: 500 }, // Tăng lên 100 users trong 1 phút 30 giây
  ],
};

export default function () {
  let res = http.get("https://cungnhaulamgiau.vn"); // Thay đổi URL với trang web của bạn
  check(res, {
    "status is 200": (r) => r.status === 200,
    "response time < 200ms": (r) => r.timings.duration < 200,
  });
  sleep(1);
}
