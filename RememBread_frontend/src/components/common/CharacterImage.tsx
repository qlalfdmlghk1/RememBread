import DefaultBread from "@/components/svgs/breads/DefaultBread";
import DefaultBreadBlack from "@/components/svgs/breads/DefaultBread";
import { CharacterImageProps } from "@/types/profile";


const CharacterImage = ({ characterImageUrl, className = "w-56 h-56", isGrayscale = false }: CharacterImageProps) => {
  if (characterImageUrl) {
    return (
      <img 
        src={characterImageUrl} 
        alt="character" 
        className={`${className} ${isGrayscale ? 'grayscale' : ''}`}
      />
    );
  }

  return isGrayscale ? (
    <DefaultBreadBlack className={className} />
  ) : (
    <DefaultBread className={className} />
  );
};

export default CharacterImage; 