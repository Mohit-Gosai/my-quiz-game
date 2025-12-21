export default function OptionsList({
  options,
  correct,
  selected,
  answered,
  onSelect
}) {
  return (
    <ul className="options">
      {options.map((opt, i) => (
        <li
          key={i}
          className={`option ${selected === i
              ? i === correct
                ? "correct"
                : "incorrect"
              : ""
            } ${answered && i === correct ? "correct" : ""}`}
          onClick={() => onSelect(i)}
        >
          {opt}
        </li>
      ))}
    </ul>
  );
}
