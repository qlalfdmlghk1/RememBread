import { useState, ChangeEvent, Dispatch, KeyboardEvent, SetStateAction } from "react";
import { X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";

interface HashtagInputProps {
  hashtags: string[];
  hashtagInput: string;
  setHashTags: (hashTags: string[]) => void;
  setHashtagInput: Dispatch<SetStateAction<string>>;
}

const HashtagInput = ({
  hashtags,
  hashtagInput,
  setHashTags,
  setHashtagInput,
}: HashtagInputProps) => {
  const maxHashtags = 5;
  const [isInputShaking, setIsInputShaking] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>("");

  const handleHashtagInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    setHashtagInput(event.target.value);
  };

  const handleAddHashtag = () => {
    if (hashtagInput.trim() !== "" && !hashtags.includes(hashtagInput.trim())) {
      setHashTags([...hashtags, hashtagInput.trim()]);
      setHashtagInput("");
    }
  };

  const handleRemoveHashtag = (hashtag: string) => {
    setHashTags(hashtags.filter((tag) => tag !== hashtag));
  };

  const handleHashtagInputKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      event.preventDefault();
      handleAddHashtag();
    }
  };

  const handleAddHashtagWithLimit = () => {
    if (hashtagInput.trim() !== "" && hashtags.length < maxHashtags) {
      handleAddHashtag();
      setIsInputShaking(false);
      setErrorMessage("");
    } else if (hashtags.length >= maxHashtags) {
      setIsInputShaking(true);
      setErrorMessage("최대 5개까지 입력 가능합니다.");
    }
  };

  const handleRemoveHashtagWithReset = (hashtag: string) => {
    handleRemoveHashtag(hashtag);
    setIsInputShaking(false);
    setErrorMessage("");
  };

  return (
    <div className="flex flex-col gap-2 text-start mb-5">
      <span className="flex justify-between">
        해시태그 설정
        {errorMessage && (
          <span className="text-red-500 text-xs mt-1">{errorMessage}</span> // 오류 메시지 표시
        )}
      </span>

      <Input
        type="text"
        value={hashtagInput}
        onChange={handleHashtagInputChange}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            e.preventDefault();
            handleAddHashtagWithLimit();
          } else {
            handleHashtagInputKeyDown(e);
          }
        }}
        placeholder="해시태그를 입력하세요"
        className={isInputShaking ? "animate-shake focus-visible:ring-negative-500" : ""}
      />
      <div className="flex flex-wrap gap-2 mt-2">
        {hashtags.map((hashtag, index) => (
          <Badge
            key={index}
            variant="primary"
            className="rounded-full cursor-pointer flex items-center gap-1"
            onClick={() => handleRemoveHashtagWithReset(hashtag)}
          >
            <span className="text-white">#{hashtag}</span>
            <X className="w-3 h-3 text-white stroke-1" />
          </Badge>
        ))}
      </div>
    </div>
  );
};

export default HashtagInput;
