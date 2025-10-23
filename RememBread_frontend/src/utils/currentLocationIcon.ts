export const currentLocationIcon = (
  size: number = 20,
  color: string = "#3B82F6",
): naver.maps.MarkerOptions["icon"] => {
  const half = size / 2;

  return {
    content: `
      <div style="position: relative; width: ${size}px; height: ${size}px;">
        <div style="
          position: absolute;
          width: ${size}px;
          height: ${size}px;
          background-color: ${color};
          border: 2px solid white;
          border-radius: 50%;
          z-index: 2;
          box-shadow: 0 0 6px rgba(59, 130, 246, 0.8);
        "></div>
        <div style="
          position: absolute;
          width: ${size}px;
          height: ${size}px;
          background-color: rgba(59, 130, 246, 0.4);
          border-radius: 50%;
          animation: pulseRing 1.5s infinite ease-out;
          z-index: 1;
        "></div>
      </div>
      <style>
        @keyframes pulseRing {
          0% {
            transform: scale(1);
            opacity: 0.6;
          }
          100% {
            transform: scale(2.5);
            opacity: 0;
          }
        }
      </style>
    `,
    size: new naver.maps.Size(size, size),
    anchor: new naver.maps.Point(half, half),
  };
};
