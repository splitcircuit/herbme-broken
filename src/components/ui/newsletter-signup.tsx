import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useNewsletter } from '@/hooks/useNewsletter';

interface NewsletterSignupProps {
  placeholder?: string;
  buttonText?: string;
  source?: string;
  tags?: string[];
  className?: string;
  variant?: 'default' | 'minimal';
}

export const NewsletterSignup = ({ 
  placeholder = "Enter your email", 
  buttonText = "Subscribe",
  source = "HerbMe Site",
  tags = ['herbme', 'website'],
  className = "",
  variant = 'default'
}: NewsletterSignupProps) => {
  const [email, setEmail] = useState('');
  const { subscribe, isLoading } = useNewsletter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    const result = await subscribe({
      email,
      source,
      tags
    });

    if (result.success) {
      setEmail('');
    }
  };

  if (variant === 'minimal') {
    return (
      <form onSubmit={handleSubmit} className={`flex gap-2 ${className}`}>
        <Input
          type="email"
          placeholder={placeholder}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="flex-1"
          disabled={isLoading}
        />
        <Button 
          type="submit" 
          disabled={isLoading || !email}
          size="sm"
        >
          {isLoading ? 'Subscribing...' : buttonText}
        </Button>
      </form>
    );
  }

  return (
    <form onSubmit={handleSubmit} className={`space-y-4 ${className}`}>
      <div className="flex flex-col sm:flex-row gap-3">
        <Input
          type="email"
          placeholder={placeholder}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="flex-1"
          disabled={isLoading}
        />
        <Button 
          type="submit" 
          disabled={isLoading || !email}
          className="whitespace-nowrap"
        >
          {isLoading ? 'Subscribing...' : buttonText}
        </Button>
      </div>
      <p className="text-sm text-muted-foreground">
        Join our natural skincare community and get exclusive tips, product updates, and special offers.
      </p>
    </form>
  );
};