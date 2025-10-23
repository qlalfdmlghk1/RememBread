import { useEffect } from "react";
import { toast } from "@/hooks/use-toast";
import { currentLocationIcon } from "@/utils/currentLocationIcon";

interface Props {
  map: naver.maps.Map | null;
  onUpdatePosition?: (lat: number, lng: number) => void;
}

const CurrentLocation = ({ map, onUpdatePosition }: Props) => {
  useEffect(() => {
    if (!map) return;

    let marker: naver.maps.Marker | null = null;
    let watchId: number | null = null;
    let timeoutId: ReturnType<typeof setTimeout> | null = null;
    let received = false;
    let isAlerted = false;

    const updatePosition = (lat: number, lng: number) => {
      const latlng = new naver.maps.LatLng(lat, lng);

      onUpdatePosition?.(lat, lng);

      if (!marker) {
        marker = new naver.maps.Marker({
          position: latlng,
          map,
          title: "현재 위치",
          icon: currentLocationIcon(20),
        });
      } else {
        marker.setPosition(latlng);
      }

      map.setCenter(latlng);
      map.setZoom(15);
      received = true;
    };

    const fallbackWatch = () => {
      watchId = navigator.geolocation.watchPosition(
        (pos) => {
          updatePosition(pos.coords.latitude, pos.coords.longitude);
          if (watchId !== null) navigator.geolocation.clearWatch(watchId);
        },
        (err) => {
          // console.error("📛 watchPosition 실패:", err);
          if (!received && !isAlerted) {
            isAlerted = true;
            toast({
              title: "위치 정보를 가져오지 못했어요.",
              description: "잠시 후 다시 시도해주세요.",
              variant: "destructive",
            });
          }
        },
        {
          enableHighAccuracy: false,
          maximumAge: 0,
          timeout: 10000,
        },
      );
    };

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        updatePosition(pos.coords.latitude, pos.coords.longitude);
      },
      (err) => {
        console.warn("⚠️ getCurrentPosition 실패. fallback 시작:", err);
        fallbackWatch();
      },
      {
        enableHighAccuracy: false,
        timeout: 3000,
        maximumAge: 0,
      },
    );

    // 만약 fallback에서도 위치 못 받으면 알려주기
    timeoutId = setTimeout(() => {
      if (!received && !isAlerted) {
        isAlerted = true;
        toast({
          title: "위치 정보를 가져오지 못했어요.",
          description: "잠시 후 다시 시도해주세요.",
          variant: "destructive",
        });
        if (watchId !== null) navigator.geolocation.clearWatch(watchId);
      }
    }, 10000);

    return () => {
      if (marker) marker.setMap(null);
      if (watchId !== null) navigator.geolocation.clearWatch(watchId);
      if (timeoutId !== null) clearTimeout(timeoutId);
    };
  }, [map, onUpdatePosition]);

  return null;
};

export default CurrentLocation;
