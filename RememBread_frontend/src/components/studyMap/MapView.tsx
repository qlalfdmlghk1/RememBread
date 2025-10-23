import { useEffect, useRef, useState } from "react";
import ReactDOMServer from "react-dom/server";
import { Bell, LocateFixed, MapPin } from "lucide-react";
import { useLocationStore } from "@/stores/useLocationStore";
import { indexCardSet } from "@/types/indexCard";
import { alertLocationIcon } from "@/utils/alertLocationIcon";
import { currentLocationIcon } from "@/utils/currentLocationIcon";
import { searchMyCardSet, SearchMyCardSetParams } from "@/services/cardSet";
import { getLocationAlertPosition, getRoutes, patchNotificationLocation } from "@/services/map";
import { toast } from "@/hooks/use-toast";
import useGeocode from "@/hooks/useGeocode";
import { Switch } from "@/components/ui/switch";
import CurrentLocationBtn from "@/components/studyMap/CurrentLocationBtn";
import AlertLocationDrawer from "@/components/studyMap/AlertLocationDrawer";
import MarkerStudyBread from "@/components/svgs/breads/MarkerStudyBread";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

const MapView = () => {
  const { latitude, longitude } = useLocationStore();
  const [isMapLoaded, setIsMapLoaded] = useState<boolean>(false);
  const [isAutoCentering, setIsAutoCentering] = useState<boolean>(true);

  const [totalCount, setTotalCount] = useState<number>(0);
  const [myCardSets, setMyCardSets] = useState<indexCardSet[]>([]);
  const [routesByCardSet, setRoutesByCardSet] = useState<any[]>([]);
  const [selectedCardSet, setSelectedCardSet] = useState<number>(0);
  const [selectedDateTime, setSelectedDateTime] = useState<string>("");
  const [isAlarmEnabled, setIsAlarmEnabled] = useState<boolean>(true);
  const [isAlertDrawerOpen, setIsAlertDrawerOpen] = useState<boolean>(false);
  const [isPinMode, setIsPinMode] = useState<boolean>(false);
  const [isAlertOptionsOpen, setIsAlertOptionsOpen] = useState<boolean>(false);
  const [isManualMode, setIsManualMode] = useState<boolean>(false);
  const [manualAddress, setManualAddress] = useState<string>("");
  const [addressMarker, setAddressMarker] = useState<naver.maps.Marker | null>(null);

  const mapRef = useRef<naver.maps.Map | null>(null);
  const markersRef = useRef<naver.maps.Marker[]>([]);
  const polylineRef = useRef<naver.maps.Polyline | null>(null);
  const currentLocationMarkerRef = useRef<naver.maps.Marker | null>(null);
  const watchIdRef = useRef<number | null>(null);

  const { geocodeAddress } = useGeocode();

  const lineColors = [
    "#3B82F6",
    "#10B981",
    "#F59E0B",
    "#EF4444",
    "#6366F1",
    "#EC4899",
    "#0EA5E9",
    "#8B5CF6",
    "#14B8A6",
    "#F43F5E",
  ];

  // 카드셋 목록 조회
  const fetchMyCardSets = async () => {
    try {
      const params: SearchMyCardSetParams = {
        query: "",
        page: 0,
        size: 100,
        cardSetSortType: "최신순",
      };
      const { result } = await searchMyCardSet(params);
      setMyCardSets(result.cardSets);
    } catch (err) {
      // console.error("내 카드셋 조회 실패:", err);
    }
  };

  useEffect(() => {
    const mapElement = document.getElementById("map");
    if (!mapElement) return;
    if (!mapRef.current) {
      mapRef.current = new naver.maps.Map(mapElement, {
        center: new naver.maps.LatLng(latitude ?? 37.501274, longitude ?? 127.039585),
        zoom: 15,
        zoomControl: false,
      });
      setIsMapLoaded(true);
    }
    fetchMyCardSets();
  }, []);

  // 시작 시 현재 위치로 가기
  useEffect(() => {
    if (!mapRef.current || !isMapLoaded || !isAutoCentering) return;
    if (latitude == null || longitude == null) return;

    // 방어: 0,0일 경우 무시하거나 기본 위치 사용
    const isInvalid = latitude === 0 && longitude === 0;
    const position = new naver.maps.LatLng(
      isInvalid ? 37.501274 : latitude,
      isInvalid ? 127.039585 : longitude,
    );

    mapRef.current.setCenter(position);

    if (!currentLocationMarkerRef.current) {
      currentLocationMarkerRef.current = new naver.maps.Marker({
        position,
        map: mapRef.current,
        title: "현재 위치",
        icon: currentLocationIcon(20),
      });
    } else {
      currentLocationMarkerRef.current.setPosition(position);
    }
  }, [isMapLoaded, latitude, longitude, isAutoCentering]);

  useEffect(() => {
    if (!mapRef.current) return;

    const listener = naver.maps.Event.addListener(mapRef.current, "dragstart", () => {
      setIsAutoCentering(false);
    });

    return () => {
      naver.maps.Event.removeListener(listener);
    };
  }, [isMapLoaded]);

  useEffect(() => {
    if (!selectedCardSet) return;
    const fetchRoutes = async () => {
      try {
        setRoutesByCardSet([]);
        setTotalCount(0);
        markersRef.current.forEach((m) => m.setMap(null));
        markersRef.current = [];
        if (polylineRef.current) {
          polylineRef.current.setMap(null);
          polylineRef.current = null;
        }
        setSelectedDateTime("");
        const { result } = await getRoutes(selectedCardSet, 0, 10);
        setRoutesByCardSet(result.routes);
        setTotalCount(result.total);
      } catch (err) {
        // console.error("학습 이력 조회 실패:", err);
      }
    };
    fetchRoutes();
  }, [selectedCardSet]);

  useEffect(() => {
    if (!mapRef.current || !selectedDateTime) return;

    const matched = routesByCardSet.find((r) => r.studiedAt === selectedDateTime);
    if (!matched || !matched.route.length) return;

    // 초기화
    markersRef.current.forEach((m) => m.setMap(null));
    markersRef.current = [];
    if (polylineRef.current) {
      polylineRef.current.setMap(null);
      polylineRef.current = null;
    }

    const breadSvg = ReactDOMServer.renderToStaticMarkup(<MarkerStudyBread />);
    const allLatLngs: naver.maps.LatLng[] = matched.route.map(
      ([lng, lat]: [number, number]) => new naver.maps.LatLng(lat, lng),
    );

    // 마커 먼저 전부 생성
    allLatLngs.forEach((latlng) => {
      const marker = new naver.maps.Marker({
        position: latlng,
        icon: {
          content: breadSvg,
          size: new naver.maps.Size(32, 32),
          anchor: new naver.maps.Point(16, 16),
        },
        map: mapRef.current!,
      });
      markersRef.current.push(marker);
    });

    const stroke = lineColors[new Date(selectedDateTime).getSeconds() % 10];

    polylineRef.current = new naver.maps.Polyline({
      map: mapRef.current!,
      path: [],
      strokeColor: stroke,
      strokeWeight: 10,
      strokeOpacity: 0.7,
      strokeStyle: "solid",
      strokeLineCap: "round",
      strokeLineJoin: "round",
    });

    let i = 0;
    const pathSoFar: naver.maps.LatLng[] = [];
    const delay = 100; // 밀리초, 숫자를 늘릴수록 더 느려짐

    const drawPath = () => {
      if (i >= allLatLngs.length) return;

      pathSoFar.push(allLatLngs[i]);
      polylineRef.current?.setPath([...pathSoFar]);
      i++;

      setTimeout(() => {
        requestAnimationFrame(drawPath);
      }, delay);
    };

    requestAnimationFrame(drawPath);
  }, [selectedDateTime]);

  useEffect(() => {
    if (routesByCardSet.length > 0) {
      setSelectedDateTime(routesByCardSet[0].studiedAt);
    }
  }, [routesByCardSet]);

  useEffect(() => {
    if (!mapRef.current || !selectedCardSet || !selectedDateTime) return;
    const matched = routesByCardSet.find((r) => r.studiedAt === selectedDateTime);
    if (!matched || !matched.route.length) return;
    const [lng, lat] = matched.route[0];
    mapRef.current.setCenter(new naver.maps.LatLng(lat, lng));
  }, [selectedCardSet, selectedDateTime]);

  useEffect(() => {
    if (!isManualMode || !mapRef.current) return;

    const listener = naver.maps.Event.addListener(
      mapRef.current,
      "click",
      async (e: { coord: naver.maps.LatLng }) => {
        const lat = e.coord.lat();
        const lng = e.coord.lng();

        await patchNotificationLocation(lat, lng, isAlarmEnabled);

        setIsManualMode(false);
      },
    );

    return () => {
      naver.maps.Event.removeListener(listener);
    };
  }, [isManualMode, isAlarmEnabled]);

  // 현재 위치를 지도 중앙에 표시하고 마커를 갱신
  const handleSetCurrentLocation = () => {
    if (latitude != null && longitude != null && (latitude !== 0 || longitude !== 0)) {
      const position = new naver.maps.LatLng(latitude, longitude);
      mapRef.current?.setCenter(position);

      if (currentLocationMarkerRef.current) {
        currentLocationMarkerRef.current.setPosition(position);
      } else {
        const marker = new naver.maps.Marker({
          position,
          map: mapRef.current!,
          title: "현재 위치",
          icon: currentLocationIcon(20),
        });
        currentLocationMarkerRef.current = marker;
      }

      return;
    }

    // fallback: 위치 정보 없거나 0,0인 경우
    let isAlerted = false;
    watchIdRef.current = navigator.geolocation.watchPosition(
      (pos) => {
        const lat = Number(pos.coords.latitude.toFixed(6));
        const lng = Number(pos.coords.longitude.toFixed(6));

        if (lat === 0 && lng === 0) {
          return;
        }

        const position = new naver.maps.LatLng(lat, lng);
        mapRef.current?.setCenter(position);

        if (currentLocationMarkerRef.current) {
          currentLocationMarkerRef.current.setPosition(position);
        } else {
          currentLocationMarkerRef.current = new naver.maps.Marker({
            position,
            map: mapRef.current!,
            title: "현재 위치",
            icon: currentLocationIcon(20),
          });
        }

        navigator.geolocation.clearWatch(watchIdRef.current!);
        watchIdRef.current = null;
      },
      () => {
        if (!isAlerted) {
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
        timeout: 3000,
        maximumAge: 10000,
      },
    );
  };

  // 위치 입력으로 위치 알람 설정
  const handleSetAddressLocation = async () => {
    if (!manualAddress) return;

    try {
      const result = await geocodeAddress(manualAddress);
      if (!result) {
        toast({
          variant: "destructive",
          title: "주소 검색 실패",
          description: "입력한 주소로 위치를 찾을 수 없습니다.",
        });
        return;
      }

      // 소수점 6자리까지 반올림 후 문자열 → 숫자 변환
      const lat = Number(result.lat.toFixed(6));
      const lng = Number(result.lng.toFixed(6));

      // 숫자 정수부 3자리 초과 방지 체크 (한국 범위 안에서는 거의 문제가 없음)
      if (
        Math.floor(Math.abs(lat)).toString().length > 3 ||
        Math.floor(Math.abs(lng)).toString().length > 3
      ) {
        toast({
          variant: "destructive",
          title: "좌표 범위 오류",
          description: "위도/경도가 허용된 범위를 초과합니다.",
        });
        return;
      }

      await patchNotificationLocation(lat, lng, isAlarmEnabled);

      const position = new naver.maps.LatLng(lat, lng);
      mapRef.current?.setCenter(position);

      if (addressMarker) {
        addressMarker.setMap(null);
        setAddressMarker(null);
      }

      const marker = new naver.maps.Marker({
        position,
        map: mapRef.current!,
        title: "알림 위치",
        icon: alertLocationIcon(40, "#ffaa64", !isAlarmEnabled),
      });
      setAddressMarker(marker);
      setIsAlertDrawerOpen(false);

      toast({
        variant: "success",
        title: "알림 위치 설정 완료",
        description: "입력한 주소로 위치 알림이 설정되었습니다.",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "알림 설정 실패",
        description: "위치 알림 설정 중 문제가 발생했습니다.",
      });
      // console.error(error);
    }
  };

  // 핀 위치 기반으로 알람 설정
  const handleSetPinLocation = async () => {
    if (!mapRef.current) return;

    const center = mapRef.current.getCenter() as naver.maps.LatLng;
    const lat = Number(center.lat().toFixed(6));
    const lng = Number(center.lng().toFixed(6));

    try {
      await patchNotificationLocation(lat, lng, isAlarmEnabled);
      setIsAlertDrawerOpen(false);
      setIsPinMode(false);

      // 기존 마커 제거
      if (addressMarker) {
        addressMarker.setMap(null);
        setAddressMarker(null);
      }

      // 새로운 마커 생성 및 표시
      const marker = new naver.maps.Marker({
        position: new naver.maps.LatLng(lat, lng),
        map: mapRef.current,
        title: "알림 위치",
        icon: alertLocationIcon(40, "#ffaa64", !isAlarmEnabled),
      });
      setAddressMarker(marker);

      toast({
        variant: "success",
        title: "알림 위치 설정 완료",
        description: "알림이 설정되었습니다.",
      });
    } catch (err) {
      toast({
        variant: "destructive",
        title: "알림 설정 실패",
        description: "알람 설정에 실패하였습니다. 잠시 후 다시 시도해주세요!",
      });
    }
  };

  // 알림 위치 가져오기
  useEffect(() => {
    if (!mapRef.current || !isMapLoaded) return;

    const fetchAlertLocation = async () => {
      try {
        const { result } = await getLocationAlertPosition();

        if (!result.notificationLocationLatitude || !result.notificationLocationLongitude) return;

        const position = new naver.maps.LatLng(
          result.notificationLocationLatitude,
          result.notificationLocationLongitude,
        );

        // 기존 마커 제거
        if (addressMarker) {
          addressMarker.setMap(null);
          setAddressMarker(null);
        }

        const marker = new naver.maps.Marker({
          position,
          map: mapRef.current!,
          title: "알림 위치",
          icon: alertLocationIcon(40, "#ffaa64", !result.notificationLocationEnable),
        });

        setAddressMarker(marker);
        setIsAlarmEnabled(result.notificationLocationEnable);
      } catch (e) {
        // console.error("알림 위치 불러오기 실패", e);
      }
    };

    fetchAlertLocation();
  }, [isMapLoaded]);

  if (latitude == null || longitude == null) {
    return (
      <div className="flex justify-center items-center h-full text-muted-foreground">
        위치 정보를 불러오는 중입니다...
      </div>
    );
  }

  return (
    <div className="relative w-full" style={{ height: "calc(100vh - 126px)" }}>
      {/* <Toaster /> */}
      <div className="absolute top-4 left-4 right-4 z-10 flex gap-2">
        <div className="w-3/5 bg-white opacity-100 rounded-md">
          <Select
            value={selectedCardSet ? String(selectedCardSet) : ""}
            onValueChange={(v) => setSelectedCardSet(Number(v))}
          >
            <SelectTrigger className="w-full">
              {selectedCardSet !== 0 ? (
                <span>
                  {myCardSets.find((set) => set.cardSetId === selectedCardSet)?.name}
                  <span className="text-sm text-muted-foreground"> ({totalCount}건)</span>
                </span>
              ) : (
                <SelectValue placeholder="조회하실 카드셋을 선택해주세요" />
              )}
            </SelectTrigger>
            <SelectContent>
              {myCardSets.map((cardSet) => (
                <SelectItem key={cardSet.cardSetId} value={String(cardSet.cardSetId)}>
                  {cardSet.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="w-2/5 bg-white opacity-100 rounded-md">
          <Select
            value={selectedDateTime}
            onValueChange={setSelectedDateTime}
            disabled={routesByCardSet.length === 0}
          >
            <SelectTrigger className="w-full pc:text-sm text-xs text-center">
              <SelectValue placeholder="조회하실 날짜를 선택해주세요" />
            </SelectTrigger>
            <SelectContent>
              {routesByCardSet.map((route) => {
                const date = new Date(route.studiedAt);
                const formatted = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(
                  2,
                  "0",
                )}-${String(date.getDate()).padStart(2, "0")} ${String(date.getHours()).padStart(
                  2,
                  "0",
                )}:${String(date.getMinutes()).padStart(2, "0")}:${String(
                  date.getSeconds(),
                ).padStart(2, "0")}`;
                return (
                  <SelectItem key={route.studiedAt} value={route.studiedAt}>
                    {formatted}
                  </SelectItem>
                );
              })}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div id="map" className="absolute top-0 left-0 w-full h-full z-0" />
      <div className="absolute top-16 right-4 z-15 flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur-sm rounded-md shadow-md">
        <span className="text-md text-muted-foreground font-bold">알림</span>
        <Switch
          className=""
          checked={isAlarmEnabled}
          onCheckedChange={async (checked) => {
            setIsAlarmEnabled(checked);

            try {
              const { result } = await getLocationAlertPosition();

              if (
                result.notificationLocationLatitude == null ||
                result.notificationLocationLongitude == null ||
                (result.notificationLocationLatitude === 0 &&
                  result.notificationLocationLongitude === 0)
              ) {
                toast({
                  title: "알림 위치 정보 없음",
                  description: "먼저 알림 위치를 설정해주세요.",
                  variant: "destructive",
                });
                return;
              }

              await patchNotificationLocation(
                result.notificationLocationLatitude,
                result.notificationLocationLongitude,
                checked,
              );

              if (addressMarker) {
                addressMarker.setIcon(alertLocationIcon(40, "#ffaa64", !checked)!);
              }

              toast({
                title: "알림 설정 변경됨",
                description: checked
                  ? "위치 알림이 활성화되었습니다."
                  : "위치 알림이 비활성화되었습니다.",
                variant: "default",
              });
            } catch (err) {
              setIsAlarmEnabled((prev) => !prev);

              toast({
                title: "알림 설정 실패",
                description: "서버와 통신 중 문제가 발생했습니다.",
                variant: "destructive",
              });
            }
          }}
        />
      </div>

      {isMapLoaded && mapRef.current && (
        <>
          <div className="flex flex-col items-center space-y-1 absolute bottom-28 left-5 z-20">
            <CurrentLocationBtn onClick={handleSetCurrentLocation} />
            <span className="text-xs text-white bg-primary-600/90 px-2 py-1 rounded-md shadow">
              현재 위치
            </span>
          </div>

          <div className="absolute bottom-6 left-5 z-20 flex items-end gap-2">
            <div className="flex flex-col items-center space-y-1">
              <button
                className="bg-white text-primary-500 border border-primary-500 shadow-xl w-12 h-12 rounded-full flex items-center justify-center hover:bg-primary-100 transition"
                onClick={() => {
                  setIsAlertOptionsOpen((prev) => {
                    const next = !prev;
                    if (!next) {
                      setIsPinMode(false); // 옵션 닫을 때 핀 모드도 종료
                    }
                    return next;
                  });
                }}
              >
                <Bell className="w-8 h-8" />
              </button>

              <span className="text-xs text-white bg-primary-600/90 px-2 py-1 rounded-md shadow">
                알림 설정
              </span>
            </div>

            {isAlertOptionsOpen && (
              <>
                <div className="flex flex-col items-center space-y-1">
                  <button
                    className="bg-white text-primary-500 border border-primary-500 shadow-xl w-12 h-12 rounded-full flex items-center justify-center hover:bg-primary-100 transition"
                    onClick={() => {
                      setIsPinMode(true);
                      setIsAlertOptionsOpen(false);
                    }}
                  >
                    <MapPin className="w-6 h-6" />
                  </button>
                  <span className="text-xs text-white bg-gray-600/80 px-2 py-1 rounded-md shadow">
                    직접 설정
                  </span>
                </div>

                <div className="flex flex-col items-center space-y-1">
                  <button
                    className="bg-white text-primary-500 border border-primary-500 shadow-xl w-12 h-12 rounded-full flex items-center justify-center hover:bg-primary-100 transition"
                    onClick={() => {
                      setIsAlertDrawerOpen(true);
                      setIsAlertOptionsOpen(false);
                    }}
                  >
                    <LocateFixed className="w-6 h-6" />
                  </button>
                  <span className="text-xs text-white bg-gray-600/80 px-2 py-1 rounded-md shadow">
                    주소 입력
                  </span>
                </div>
              </>
            )}
          </div>
        </>
      )}
      {isPinMode && (
        <>
          {/* 중앙 핀 아이콘 */}
          <div className="absolute z-20 top-1/2 left-1/2 -translate-x-1/2 -translate-y-full">
            <MapPin className="w-10 h-16 text-negative-600 drop-shadow-md" />
          </div>

          {/* 하단 저장/취소 버튼 */}
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-30 flex gap-4">
            <button
              className="px-5 py-2.5 bg-gray-200 text-gray-800 font-semibold text-sm rounded-lg shadow-md hover:bg-gray-300 transition"
              onClick={() => setIsPinMode(false)}
            >
              취소
            </button>
            <button
              className="px-5 py-2.5 bg-primary-500 text-white font-semibold text-sm rounded-lg shadow-md hover:bg-primary-600 transition"
              onClick={handleSetPinLocation}
            >
              알림 설정
            </button>
          </div>
        </>
      )}

      <AlertLocationDrawer
        open={isAlertDrawerOpen}
        onOpenChange={setIsAlertDrawerOpen}
        onSetAddressLocation={handleSetAddressLocation}
        manualAddress={manualAddress}
        setManualAddress={setManualAddress}
      />
    </div>
  );
};

export default MapView;
