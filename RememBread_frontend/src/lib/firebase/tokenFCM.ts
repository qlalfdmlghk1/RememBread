import { getToken } from "firebase/messaging";
import { messaging } from "@/lib/firebase/settingFCM";

// 서비스 워커 실행 함수
function registerServiceWorker() {
  navigator.serviceWorker
    .register("/firebase-messaging-sw.js")
    .then(function (registration) {
      // console.log("Service Worker 등록 성공:", registration);
    })
    .catch(function (error) {
      // console.log("Service Worker 등록 실패:", error);
    });
}

export async function handleAllowNotification() {
  try {
    const permission = await Notification.requestPermission();
    registerServiceWorker(); // 서비스워커 실행
    if (permission === "granted") {
      return await getDeviceToken();
    } else {
      // console.log("알림 권한이 거부되었습니다.");
      return null;
    }
  } catch (error) {
    // console.error("알림 권한 요청 중 오류 발생:", error);
    return null;
  }
}

export async function getDeviceToken() {
  try {
    const currentToken = await getToken(messaging, {
      vapidKey:
        "BPa9B3BfO6w2afJpy2AdEOiT9K4O5TlcrZIJArRH8clBCbs7PE_eDuL5r6oRPU077a2blIKXs1xrh2s6rvUe_OU",
    });

    if (currentToken) {
      return currentToken;
    } else {
      // console.log("토큰을 가져오지 못했습니다. 권한을 다시 요청하세요.");
      return null;
    }
  } catch (err) {
    // console.error("토큰을 가져오는 중 에러 발생: ", err);
    throw err;
  }
}
