export const alertLocationIcon = (
  size: number = 40,
  color: string = "#ffaa64",
  dimmed: boolean = false,
): naver.maps.MarkerOptions["icon"] => {
  const half = size / 2;

  return {
    content: `
      <div style="
        width: ${size}px;
        height: ${size}px;
        background-color: white;
        border: 2px solid ${color};
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        box-shadow: 0 0 10px rgba(0, 0, 0, 0.3);
        animation: pulse-ring 2s infinite;
        opacity: ${dimmed ? 0.4 : 1}; 
        transition: opacity 0.3s;
      ">
        <svg xmlns="http://www.w3.org/2000/svg" width="${size / 2}" height="${
      size / 2
    }" fill="${color}" viewBox="0 0 24 24">
          <path d="M15 17h5l-1.4-1.4a2 2 0 0 1-.6-1.4v-3a6 6 0 0 0-4-5.7V5a2 2 0 1 0-4 0v.5A6 6 0 0 0 6 11v3a2 2 0 0 1-.6 1.4L4 17h5m6 0v1a3 3 0 1 1-6 0v-1" />
        </svg>
      </div>
      <style>
        @keyframes pulse-ring {
          0% {
            box-shadow: 0 0 0 0 rgba(255,170,100, 0.6);
          }
          70% {
            box-shadow: 0 0 0 10px rgba(255,170,100, 0);
          }
          100% {
            box-shadow: 0 0 0 0 rgba(255,170,100, 0);
          }
        }
      </style>
    `,
    size: new naver.maps.Size(size, size),
    anchor: new naver.maps.Point(half, half),
  };
};
