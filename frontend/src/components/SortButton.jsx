const SortButton = ({ label, field, sortBy, sortOrder, onSortChange }) => {
  const active = sortBy === field;
  const marker = !active ? "" : sortOrder === "asc" ? " ▲" : " ▼";

  const handleClick = () => {
    if (!active) {
      onSortChange(field, "asc");
      return;
    }
    onSortChange(field, sortOrder === "asc" ? "desc" : "asc");
  };

  return (
    <button type="button" className={`sort-button ${active ? "active" : ""}`} onClick={handleClick}>
      {label}
      {marker}
    </button>
  );
};

export default SortButton;
