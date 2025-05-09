import { Columns as Column } from 'lucide-react';

interface LogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

const Logo = ({ className = '', size = 'md' }: LogoProps) => {
  const sizeClasses = {
    sm: 'h-6 w-6',
    md: 'h-8 w-8',
    lg: 'h-10 w-10'
  };

  return (
    <div className={`flex items-center ${className}`}>
      <Column className={`text-blue-600 ${sizeClasses[size]}`} />
      <span className={`ml-2 font-bold text-blue-800 ${
        size === 'sm' ? 'text-lg' : size === 'md' ? 'text-xl' : 'text-2xl'
      }`}>
        Império Concursos
      </span>
    </div>
  );
};

export default Logo;