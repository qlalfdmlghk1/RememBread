import { useState, useEffect } from "react";
import { getCharacters } from "@/services/userService";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import CharacterImage from "@/components/common/CharacterImage";
import { Character } from "@/types/profile";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

export interface ImageEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (characterId: number, characterImageUrl: string) => void;
  currentCharacterId: number;
}

const ImageEditModal = ({ isOpen, onClose, onSelect, currentCharacterId }: ImageEditModalProps) => {
  const [characters, setCharacters] = useState<Character[]>([]);

  useEffect(() => {
    const fetchCharacters = async () => {
      try {
        const response = await getCharacters();
        setCharacters(response.result);
      } catch (error) {
        // console.error("캐릭터 목록을 불러오는 중 오류가 발생했습니다:", error);
      }
    };

    if (isOpen) {
      fetchCharacters();
    }
  }, [isOpen]);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-80 rounded-lg" aria-describedby={undefined}>
        <DialogHeader>
          <DialogTitle className="text-center">캐릭터 선택</DialogTitle>
        </DialogHeader>
        <div className="grid grid-cols-2 gap-4">
          {characters.map((character) => (
            <div key={character.id}>
              {character.isLocked ? (
                <Popover>
                  <PopoverTrigger asChild>
                    <div
                      tabIndex={0}
                      className="relative cursor-pointer p-2 aspect-square opacity-50"
                    >
                      <CharacterImage
                        characterId={character.id}
                        characterImageUrl={character.imageUrl}
                        className="w-full h-full"
                        isGrayscale={true}
                      />
                      <div className="text-center mt-2 text-sm">{character.name}</div>
                    </div>
                  </PopoverTrigger>
                  <PopoverContent className="w-60">
                    <div className="space-y-2">
                      <h4 className="font-medium">{character.name}</h4>
                      <p className="text-sm text-gray-500">
                        {character.description.split(/[()]/).map((part, index) => {
                          if (index % 2 === 1) {
                            return (
                              <span key={index} className="text-positive-500">
                                ({part})
                              </span>
                            );
                          }
                          return part;
                        })}
                      </p>
                    </div>
                  </PopoverContent>
                </Popover>
              ) : (
                <div
                  className="relative cursor-pointer p-2 aspect-square hover:bg-neutral-100"
                  onClick={() => onSelect(character.id, character.imageUrl)}
                >
                  <CharacterImage
                    characterId={character.id}
                    characterImageUrl={character.imageUrl}
                    className="w-full h-full"
                    isGrayscale={false}
                  />
                  <div className="text-center mt-2 text-sm">{character.name}</div>
                  {character.id === currentCharacterId && (
                    <div className="absolute top-0 right-0 bg-positive-300 text-white px-2 py-1 rounded text-xs">
                      선택됨
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ImageEditModal;
