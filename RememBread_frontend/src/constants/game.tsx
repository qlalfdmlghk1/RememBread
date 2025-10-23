import Baguette from '@/components/svgs/game/Baguette';
import Croissant from '@/components/svgs/game/Croissant';
import Bread from '@/components/svgs/game/Bread';
import Bread2 from '@/components/svgs/game/Bread2';
import Cake from '@/components/svgs/game/Cake';
import Cookie from '@/components/svgs/game/Cookie';
import Cupcake from '@/components/svgs/game/Cupcake';
import Doughnut from '@/components/svgs/game/Doughnut';
import Pizza from '@/components/svgs/game/Pizza';
import Pretzel from '@/components/svgs/game/Pretzel';
// 검정색 SVG 컴포넌트들 import
import BaguetteBlack from '@/components/svgs/game/black/BaguetteBlack';
import BreadBlack from '@/components/svgs/game/black/BreadBlack';
import Bread2Black from '@/components/svgs/game/black/Bread2Black';
import CakeBlack from '@/components/svgs/game/black/CakeBlack';
import CookieBlack from '@/components/svgs/game/black/CookieBlack';
import CroissantBlack from '@/components/svgs/game/black/CroissantBlack';
import CupcakeBlack from '@/components/svgs/game/black/CupcakeBlack';
import DoughnutBlack from '@/components/svgs/game/black/DoughnutBlack';
import PizzaBlack from '@/components/svgs/game/black/PizzaBlack';
import PretzelBlack from '@/components/svgs/game/black/PretzelBlack';

// 검정색 SVG 리스트 생성
export const BREAD_BLACK_SVG_LIST = [
  BaguetteBlack,
  CroissantBlack,
  BreadBlack,
  Bread2Black,
  CakeBlack,
  CookieBlack,
  CupcakeBlack,
  DoughnutBlack,
  PizzaBlack,
  PretzelBlack,
];


export const BREAD_SVG_LIST = [
  Baguette, Croissant, Bread, Bread2,
  Cake, Cookie, Cupcake, Doughnut,
  Pizza, Pretzel
];

export const renderBread = (type: string) => {
  switch (type) {
    case 'bread':
      return <Bread className="w-16 h-16" />;
    case 'baguette':
      return <Baguette className="w-16 h-16" />;
    case 'croissant':
      return <Croissant className="w-16 h-16" />;
    default:
      return null;
  }
};

 