import { useCallback } from "react";

const useGeocode = () => {
  const geocodeAddress = useCallback(
    (address: string): Promise<{ lat: number; lng: number } | null> => {
      return new Promise((resolve) => {
        if (!window.naver || !window.naver.maps) {
          // console.error("Naver Maps API가 로드되지 않았습니다.");
          return resolve(null);
        }

        window.naver.maps.Service.geocode(
          { query: address },
          (status: naver.maps.Service.Status, response: any) => {
            if (status !== window.naver.maps.Service.Status.OK || !response.v2.addresses.length) {
              // console.error("주소 변환 실패:", status);
              return resolve(null);
            }

            const result = response.v2.addresses[0];
            resolve({ lat: parseFloat(result.y), lng: parseFloat(result.x) });
          },
        );
      });
    },
    [],
  );

  return { geocodeAddress };
};

export default useGeocode;
