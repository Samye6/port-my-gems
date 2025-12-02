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
    <div className="w-full max-w-2xl mx-auto space-y-3">
      {/* Search Input */}
      <div className="relative group">
        {/* Glow Effect */}
        <div className="absolute -inset-1 bg-gradient-to-r from-primary/30 via-pink-500/30 to-purple-500/30 rounded-full blur-lg opacity-0 group-focus-within:opacity-100 transition-opacity duration-300" />
        
        <div className="relative flex items-center">
          <Search className="absolute left-5 w-5 h-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
          <Input
            type="text"
            placeholder="De quoi as-tu envie aujourd'hui ? Collègue, inconnue, dominante…"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="pl-14 pr-14 py-6 text-base bg-card/80 backdrop-blur-sm border-2 border-border/50 rounded-full focus:border-primary/50 focus:ring-2 focus:ring-primary/20 transition-all placeholder:text-muted-foreground/70"
          />
          {value ? (
            <button
              onClick={() => onChange("")}
              className="absolute right-5 p-1.5 rounded-full bg-muted/50 hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          ) : (
            <Sparkles className="absolute right-5 w-5 h-5 text-primary/50 animate-pulse" />
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
              className="px-4 py-1.5 rounded-full bg-card/50 border border-border/50 text-sm text-muted-foreground hover:text-foreground hover:border-primary/50 hover:bg-primary/10 transition-all duration-200"
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
