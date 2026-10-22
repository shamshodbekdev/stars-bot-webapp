export default function Page({ children, className = '' }) {
  return (
    <div className={`min-h-screen bg-tg-bg pb-20 ${className}`}>
      {children}
    </div>
  );
}
