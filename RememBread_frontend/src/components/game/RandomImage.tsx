import { useState, useEffect } from 'react';
import styles from '@/styles/gameStyle.module.css';

// PNG 이미지 import
import muffin from '@/components/pngs/detect/머핀.png';
import pretzel from '@/components/pngs/detect/프레첼.png';
import saltBread from '@/components/pngs/detect/소금빵.png';
import creamBread from '@/components/pngs/detect/크림빵.png';
import redBeanBread from '@/components/pngs/detect/단팥빵.png';
import whiteBread from '@/components/pngs/detect/식빵.png';
import bagel from '@/components/pngs/detect/베이글.png';
import ciabatta from '@/components/pngs/detect/치아바타.png';
import croissant from '@/components/pngs/detect/크루아상.png';
import baguette from '@/components/pngs/detect/바게트.png';

interface RandomImageProps {
  onImageSelect?: (imageName: string) => void;
}

// 이 페이지는 랜덤 이미지를 반환하는 페이지
const RandomImage = ({ onImageSelect }: RandomImageProps) => {
  const [randomNumber, setRandomNumber] = useState<number>(1);
  const [randomImage, setRandomImage] = useState<string>(muffin);
  const [blurValue, setBlurValue] = useState<number>(40);
  const [scaleValue, setScaleValue] = useState<number>(10000);
  const [timeLeft, setTimeLeft] = useState<number>(10);

  // 초기 설정을 위한 useEffect
  useEffect(() => {
    // 1-2 사이 랜덤 숫자 생성
    const RandomNumber = Math.floor(Math.random() * 2) + 1;
    setRandomNumber(RandomNumber);
    
    const images = [
      { src: muffin, name: '머핀' },
      { src: pretzel, name: '프레첼' },
      { src: saltBread, name: '소금빵' },
      { src: creamBread, name: '크림빵' },
      { src: redBeanBread, name: '단팥빵' },
      { src: whiteBread, name: '식빵' },
      { src: bagel, name: '베이글' },
      { src: ciabatta, name: '치아바타' },
      { src: croissant, name: '크루아상' },
      { src: baguette, name: '바게트' }
    ];
    
    // 랜덤 이미지 선택
    const RandomImageNumber = Math.floor(Math.random() * images.length);
    const selectedImage = images[RandomImageNumber];
    setRandomImage(selectedImage.src);
    if (onImageSelect) {
      onImageSelect(selectedImage.name);
    }
    
    setBlurValue(40); // blur 값 초기화
    setScaleValue(10000); // scale 값 초기화
    setTimeLeft(10); // 타이머 초기화
  }, [onImageSelect]);

  // 타이머와 blur 효과를 위한 useEffect
  useEffect(() => {
    let timer: NodeJS.Timeout;
    
    if (timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft(prev => prev - 1);
        
        if (randomNumber === 1) {
          setBlurValue(prev => Math.max(0, prev - 5));
        } else if (randomNumber === 2) {
          setScaleValue(prev => Math.max(1000, prev - 1000)); // 1초당 10배씩 감소
        }
      }, 1000);
    }

    return () => {
      if (timer) {
        clearInterval(timer);
      }
    };
  }, [randomNumber, timeLeft]);

  return (
    <div className="w-full h-full flex items-center justify-center overflow-hidden">
      <div 
        className={`w-full h-full flex items-center justify-center ${randomNumber === 1 ? styles.mosaic : ''}`}
        style={randomNumber === 1 
          ? { filter: `blur(${blurValue}px)` }
          : { 
              transform: `scale(${scaleValue / 1000})`,
              transformOrigin: 'center center',
              position: 'relative'
            }
        }
      >
        <div className="w-full h-full" style={{ position: 'relative' }}>
          <img src={randomImage} alt="랜덤 빵 이미지" className="w-full h-full object-contain" />
        </div>
      </div>
    </div>
  );
};

export default RandomImage;