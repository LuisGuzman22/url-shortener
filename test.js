import http from "k6/http";
import { check, sleep } from "k6";

export let options = {
  stages: [
    { duration: "60s", target: 100 }, // Ramp-up to 5000 users in 5 seconds
    { duration: "10s", target: 100 }, // Stay at 5000 users for 10 seconds
    { duration: "5s", target: 0 }, // Ramp-down to 0 users in 5 seconds
  ],
};

export default function () {
  const url = "http://localhost:3001/url"; // Cambia a tu endpoint
  const payload = JSON.stringify({
    urlList: [
      "https://translate.google.com/?sl=es&tl=en&text=procesador&op=translate",
    ],
  });

  const params = {
    headers: {
      "Content-Type": "application/json",
    },
  };

  let res = http.post(url, payload, params);
  check(res, {
    "status was 200": (r) => r.status == 200,
  });

  sleep(1);
}
