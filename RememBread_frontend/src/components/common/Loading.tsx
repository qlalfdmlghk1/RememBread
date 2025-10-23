interface LoadingProps {
  message?: string;
}

const Loading = ({ message = '로딩 중...' }: LoadingProps) => {
  return (
    <div className="flex items-center justify-center min-h-screen">
    <div className="flex flex-col items-center justify-center py-10">
      <div className="w-8 h-8 border-4 border-primary-200 border-t-primary-500 rounded-full animate-spin"></div>
      <p className="text-sm text-neutral-400 mt-4">{message}</p>
    </div>
    </div>
  );
};

export default Loading; 