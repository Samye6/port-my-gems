import { Search, X, Sparkles } from "lucide-react";
import { Input } from "@/components/ui/input";

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  suggestions?: string[];
}

const SearchBar = ({ value, onChange, suggestions = [] }: SearchBarProps) => {
  const defaultSuggestions = [
    "Collègue",
    "Inconnue",
    "Dominante",
    "Ex",
    "Docteure",
    "Fit Girl",
  ];

  const activeSuggestions = suggestions.length > 0 ? suggestions : defaultSuggestions;

  return (
    <div className="w-full max-w-2xl mx-auto space-y-4">
      {/* Search Input */}
      <div className="relative group">
        {/* Glow Effect */}
        <div className="absolute -inset-1 bg-gradient-to-r from-violet/40 via-primary/40 to-peach/30 rounded-full blur-xl opacity-0 group-focus-within:opacity-100 transition-opacity duration-500" />
        
        <div className="relative flex items-center">
          {/* Spotlight Effect on Icon */}
          <div className="absolute left-4 w-8 h-8 rounded-full bg-gradient-to-br from-violet/20 to-primary/10 flex items-center justify-center group-focus-within:from-violet/30 group-focus-within:to-primary/20 transition-all duration-300">
            <Search className="w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
          </div>
          <Input
            type="text"
            placeholder="De quoi as-tu envie aujourd'hui ? Collègue, inconnue, dominante…"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="pl-14 pr-14 py-6 text-base glass rounded-full border-2 border-border/30 focus:border-primary/40 focus:ring-2 focus:ring-primary/20 transition-all placeholder:text-muted-foreground/60"
            style={{
              background: 'linear-gradient(135deg, hsl(270 60% 50% / 0.05) 0%, hsl(20 100% 75% / 0.03) 100%)',
            }}
          />
          {value ? (
            <button
              onClick={() => onChange("")}
              className="absolute right-4 p-2 rounded-full glass hover:bg-card/80 text-muted-foreground hover:text-foreground transition-all"
            >
              <X className="w-4 h-4" />
            </button>
          ) : (
            <div className="absolute right-4">
              <Search 
                className="w-5 h-5 text-primary/60" 
                style={{ filter: 'drop-shadow(0 0 6px rgba(255, 77, 141, 0.5))' }}
              />
            </div>
          )}
        </div>
      </div>

      {/* Quick Suggestions */}
      {!value && (
        <div className="flex flex-wrap justify-center gap-2">
          {activeSuggestions.map((suggestion) => (
            <button
              key={suggestion}
              onClick={() => onChange(suggestion)}
              className="px-4 py-1.5 rounded-full glass text-sm text-muted-foreground hover:text-foreground border border-border/30 hover:border-primary/40 hover:bg-primary/10 transition-all duration-300 hover:shadow-[0_0_15px_rgba(255,77,141,0.2)]"
            >
              {suggestion}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default SearchBar;
