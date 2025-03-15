const MessageSkeleton = () => {
  const skeletonMessages = Array(6).fill(null);

  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-4 ">
      {skeletonMessages.map((_, idx) => (
        <div
          key={idx}
          className={`flex gap-5 mb-4 ${idx % 2 === 0 ? "ml-auto flex-row-reverse" : ""}`}
        >
          {/* Skeleton Profile Image */}
          <div className="w-8 h-8 rounded-full border overflow-hidden bg-gray-700 animate-pulse" />

          {/* Skeleton Message Bubble */}
          <div className={`flex flex-col gap-2 ${idx % 2 === 0 ? "items-end" : "items-start"}`}>
            <div className="p-2 rounded-lg bg-gray-700 w-[200px] h-10 animate-pulse" />
            <span className="text-xs text-gray-500 bg-gray-700 w-10 h-3 animate-pulse rounded" />
          </div>
        </div>
      ))}
    </div>
  );
};

export default MessageSkeleton;
