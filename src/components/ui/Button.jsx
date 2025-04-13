export default function Button({ children, variant = 'primary', className = '', ...props }) {
  const baseStyles = "relative px-6 py-2 font-medium transition-all duration-200 ease-in-out";

  const variants = {
    primary: `
      bg-transparent
      text-white
      border-2 border-primary
      before:absolute before:inset-0 before:translate-x-1 before:translate-y-1
      before:border-2 before:border-primary/50 before:-z-10
      hover:before:translate-x-2 hover:before:translate-y-2
      hover:bg-primary/10
    `,
    secondary: `
      bg-transparent
      text-white
      border-2 border-white
      before:absolute before:inset-0 before:translate-x-1 before:translate-y-1
      before:border-2 before:border-white/50 before:-z-10
      hover:before:translate-x-2 hover:before:translate-y-2
      hover:bg-white/10
    `
  };

  return (
    <button
      className={`${baseStyles} ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
