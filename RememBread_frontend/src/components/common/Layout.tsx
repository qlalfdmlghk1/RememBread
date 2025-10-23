import { useEffect } from "react";
import { Outlet, useMatches } from "react-router-dom";
import { sendNotificationByLocation } from "@/services/map";
import { useLocationStore } from "@/stores/useLocationStore";
import Header from "@/components/common/Header";
import Footer from "@/components/common/Footer";
import { Toaster } from "@/components/ui/toaster";

interface RouteHandle {
  header?: boolean;
  footer?: boolean;
}

const Layout = () => {
  const routeMatch = useMatches().find((match) => match.handle);
  const layoutConfig: RouteHandle = routeMatch?.handle || {};
  const headerComponent = layoutConfig.header ?? true ? <Header /> : null;
  const footerComponent = layoutConfig.footer ?? true ? <Footer /> : null;
  const setLocation = useLocationStore((state) => state.setLocation);
  const { latitude, longitude } = useLocationStore();

  // 위치 정보를 서버에 전송하는 함수로 추출
  const sendLocationData = async (lat: number, lng: number) => {
    try {
      await sendNotificationByLocation(lat, lng);
    } catch (err) {
      // console.warn("알림 전송 실패", err);
    }
  };

  // 위치 추적 설정
  useEffect(() => {
    const watchId = navigator.geolocation.watchPosition(
      (position) => {
        const lat = Number(position.coords.latitude.toFixed(6));
        const lng = Number(position.coords.longitude.toFixed(6));
        setLocation(lat, lng);
      },
      () => {
        // console.error("위치 추적 실패", err);
      },
      {
        enableHighAccuracy: false,
        timeout: 5000,
        maximumAge: 10000,
      },
    );

    return () => navigator.geolocation.clearWatch(watchId);
  }, [setLocation]);

  // 15초마다 위치 전송
  useEffect(() => {
    const intervalId = setInterval(() => {
      if (latitude != null && longitude != null) {
        sendLocationData(latitude, longitude);
      } else {
        // console.warn("위치 정보가 없어 전송 생략");
      }
    }, 15000);

    return () => clearInterval(intervalId);
  }, [latitude, longitude]);

  return (
    <>
      <Toaster />
      <div className="flex flex-col min-w-[300px] w-full max-w-[600px] h-full min-h-screen mx-auto bg-white pc:border-x border-neutral-200">
        {headerComponent}
        <main
          className={`flex flex-col flex-1 ${
            headerComponent ? "pt-[calc(env(safe-area-inset-top)+56px)]" : ""
          } ${footerComponent ? "pb-[calc(env(safe-area-inset-bottom)+70px)]" : ""}`}
        >
          <Outlet />
        </main>
        {footerComponent}
      </div>
    </>
  );
};

export default Layout;
