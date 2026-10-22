export default function Card({ children, className = '', onClick }) {
  return (
    <div
      onClick={onClick}
      className={`
        bg-tg-secondaryBg rounded-2xl p-4
        ${onClick ? 'cursor-pointer hover:opacity-90 active:scale-[0.98] transition-all' : ''}
        ${className}
      `}
    >
      {children}
    </div>
  );
}
