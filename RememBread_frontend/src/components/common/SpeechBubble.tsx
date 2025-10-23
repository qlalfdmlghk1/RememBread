interface SpeechBubbleProps {
  text: string;
  className?: string;
}

const SpeechBubble = ({ text, className }: SpeechBubbleProps) => {
  return (
    <div className={`relative w-fit max-w-[100%] mx-auto mt-8 mb-6 px-8 py-4 bg-primary-300 rounded-xl text-center text-xl font-bold text-neutral-700 shadow-sm ${className || ''}`}>
      {text}
    </div>
  );
};

export default SpeechBubble; 