import useTermsStore from "@/stores/termsStore";

interface TermItemProps {
  id: string;
  label: string;
  termId: number;
  onDetailClick: (termId: number) => void;
}

const TermItem = ({ id, label, termId, onDetailClick }: TermItemProps) => {
  const { checkboxes, handleSingleCheck } = useTermsStore();

  return (
    <label className="flex items-center justify-between">
      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          className="relative w-5 h-5 rounded appearance-none bg-neutral-100 checked:bg-primary-500 checked:border-primary-500 after:content-['✓'] after:absolute after:text-white checked:after:text-white after:opacity-100 after:top-1/2 after:left-1/2 after:-translate-x-1/2 after:-translate-y-1/2"
          checked={checkboxes[id as keyof typeof checkboxes]}
          onChange={(e) => handleSingleCheck(id as "term1" | "term2" | "term3", e.target.checked)}
        />
        <span>{label}</span>
      </div>
      <button className="text-neutral-400 p-2" onClick={() => onDetailClick(termId)}>
        &gt;
      </button>
    </label>
  );
};

export default TermItem;
