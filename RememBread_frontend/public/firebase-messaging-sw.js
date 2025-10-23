// 서비스 워커 파일
self.addEventListener("install", function (event) {
    self.skipWaiting();
});

self.addEventListener('activate', function(event) {
    console.log('서비스 워커 활성화됨');
    event.waitUntil(
        clients.claim()
    );
});

self.addEventListener("push", function (e) {
    let data;
    try {
      data = e.data.json();
    } catch (err) {
      console.error("푸시 데이터 JSON 파싱 실패:", err);
      return;
    }
  
    // notification 객체가 없을 때 대비
    const notification = data.notification || data;
    const notificationTitle = notification.title || "알림";
    const notificationOptions = {
      body: notification.body || "",
      data: notification.data || data.data || {}, // data.data로도 받을 수 있게 처리
    };
  
    console.log(notificationTitle, notificationOptions);
  
    e.waitUntil(
      self.registration.showNotification(notificationTitle, notificationOptions)
    );
  });
  
  self.addEventListener('notificationclick', function(event) {
    event.notification.close();

    console.log(event.notification.data)
  
    const path = event.notification.data?.path || '/';
    const fullUrl = new URL(path, location.origin).href;
  
    event.waitUntil(
      clients.claim().then(() => {
        return clients.matchAll({ 
          type: 'window', 
          includeUncontrolled: true 
        })
        .then(clientList => {
          // 이미 열려 있는 탭이 있다면 거기로 포커스
          for (const client of clientList) {
            if (client.url.startsWith(location.origin)) {
              return client.focus().then(function(focusedClient) {
                return focusedClient.navigate(fullUrl)
                  .then(() => focusedClient)
                  .catch(err => {
                    console.error('Navigation failed:', err);
                    return focusedClient;
                  });
              });
            }
          }
          // 아니면 새 창으로 열기
          return clients.openWindow(fullUrl);
        })
      })
    );
  });
