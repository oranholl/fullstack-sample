interface TypeBadgeProps {
  type: string;
  onClick?: () => void;
  isSelected?: boolean;
}

export default function TypeBadge({ type, onClick, isSelected = true }: TypeBadgeProps) {
  const getTypeClass = (type: string) => {
    return `type-${type.toLowerCase()}`;
  };

  const baseClasses = `type-badge ${getTypeClass(type)}`;
  
  const style = onClick ? {
    opacity: isSelected ? 1 : 0.4,
    cursor: "pointer",
    border: isSelected ? "2px solid white" : "2px solid transparent",
  } : undefined;

  if (onClick) {
    return (
      <button
        type="button"
        onClick={onClick}
        className={baseClasses}
        style={style}
      >
        {type}
      </button>
    );
  }

  return (
    <span className={baseClasses}>
      {type}
    </span>
  );
}
