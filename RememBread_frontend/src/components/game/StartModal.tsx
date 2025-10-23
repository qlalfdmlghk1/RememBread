import { useState, useEffect } from 'react';

interface StartModalProps {
  onCountdownEnd: () => void;
}

const StartModal = ({ onCountdownEnd }: StartModalProps) => {
  const [count, setCount] = useState<number>(3);

  useEffect(() => {
    if (count === 0) {
      onCountdownEnd();
      return;
    }

    const timer = setTimeout(() => {
      setCount(prev => prev - 1);
    }, 1000);

    return () => clearTimeout(timer);
  }, [count, onCountdownEnd]);

  return (
    <div className="fixed inset-0 bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-8 flex flex-col items-center">
        <h2 className="text-4xl font-bold mb-4">준비!</h2>
        <div className="text-8xl font-bold text-primary animate-bounce">
          {count}
        </div>
      </div>
    </div>
  );
};

export default StartModal; 