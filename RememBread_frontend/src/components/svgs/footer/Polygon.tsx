import { SVGProps } from "@/types/svg";

const CardSet = ({ className }: SVGProps) => {
  return (
<svg className={className} width="68" height="76" viewBox="0 0 68 76" fill="none" xmlns="http://www.w3.org/2000/svg">
<g filter="url(#filter0_d_374_7813)">
<path d="M30.0122 1.79297C32.4812 0.3733 35.5188 0.373301 37.9878 1.79297L59.9878 14.443C62.4699 15.8702 64 18.515 64 21.3782V46.6218C64 49.4849 62.4699 52.1298 59.9878 53.557L37.9878 66.207C35.5188 67.6267 32.4812 67.6267 30.0122 66.207L8.01223 53.557C5.53013 52.1298 4 49.4849 4 46.6218V21.3782C4 18.515 5.53013 15.8702 8.01223 14.443L30.0122 1.79297Z" fill="#B3915C"/>
<path d="M30.5107 2.66016C32.6711 1.41795 35.3289 1.41795 37.4893 2.66016L59.4893 15.3096C61.661 16.5583 62.9999 18.8728 63 21.3779V46.6221C62.9999 49.1272 61.661 51.4417 59.4893 52.6904L37.4893 65.3398C35.3289 66.5821 32.6711 66.5821 30.5107 65.3398L8.51074 52.6904C6.33899 51.4417 5.0001 49.1272 5 46.6221V21.3779C5.0001 18.8728 6.33899 16.5583 8.51074 15.3096L30.5107 2.66016Z" stroke="white" stroke-width="2"/>
</g>
<defs>
<filter id="filter0_d_374_7813" x="0" y="0.728027" width="68" height="74.5439" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
<feFlood flood-opacity="0" result="BackgroundImageFix"/>
<feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
<feOffset dy="4"/>
<feGaussianBlur stdDeviation="2"/>
<feComposite in2="hardAlpha" operator="out"/>
<feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0"/>
<feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_374_7813"/>
<feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_374_7813" result="shape"/>
</filter>
</defs>
</svg>

  );
};

export default CardSet;
