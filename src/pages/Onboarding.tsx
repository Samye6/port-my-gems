import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { MessageCircle, Shield, Heart } from "lucide-react";

const Onboarding = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [style, setStyle] = useState<string | null>(null);
  const [ageConfirmed, setAgeConfirmed] = useState(false);
  const [privacyAccepted, setPrivacyAccepted] = useState(false);

  const handleNext = () => {
    if (step < 3) {
      setStep(step + 1);
    } else if (step === 3) {
      navigate("/home");
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-between p-6">
      <div className="flex-1 flex flex-col items-center justify-center max-w-md w-full">
        {step === 1 && (
          <div className="text-center space-y-6 animate-in fade-in duration-500">
            <div className="relative mx-auto w-20 h-20">
              <div className="absolute inset-0 bg-primary/20 blur-2xl rounded-full" />
              <div className="relative bg-primary/10 p-4 rounded-2xl border border-primary/20">
                <MessageCircle className="w-12 h-12 text-primary" />
              </div>
            </div>
            <h1 className="text-4xl font-bold text-foreground">Bienvenue sur Lydia</h1>
            <p className="text-lg text-muted-foreground">
              Des conversations immersives et sensuelles.
              Vivez une expérience unique et personnalisée.
            </p>
          </div>
        )}

        {step === 2 && (
          <div className="w-full space-y-6 animate-in fade-in duration-500">
            <div className="text-center space-y-4">
              <Heart className="w-16 h-16 text-primary" />
              <h2 className="text-3xl font-bold text-foreground">Choisissez votre style</h2>
              <p className="text-muted-foreground">
                Personnalisez l'intensité de vos conversations
              </p>
            </div>
            <div className="space-y-3">
              {[
                { value: "coquine", label: "Conversation coquine", desc: "" },
                { value: "amoureuse", label: "Conversation amoureuse", desc: "" },
                { value: "secrete", label: "Conversation secrète", desc: "" },
                { value: "autre", label: "Conversation autre", desc: "" },
              ].map((option) => (
                <button
                  key={option.value}
                  onClick={() => setStyle(option.value)}
                  className={`w-full p-4 rounded-xl border-2 transition-all ${
                    style === option.value
                      ? "border-primary bg-primary/10"
                      : "border-border bg-card hover:border-primary/50"
                  }`}
                >
                  <div className="text-left">
                    <p className="font-semibold text-foreground">{option.label}</p>
                    <p className="text-sm text-muted-foreground">{option.desc}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="text-center space-y-6 animate-in fade-in duration-500">
            <Shield className="w-16 h-16 text-primary mx-auto" />
            <h2 className="text-3xl font-bold text-foreground">Confidentialité</h2>
            <div className="space-y-4 text-left bg-card p-6 rounded-xl border border-border">
              <p className="text-foreground">✓ Vos conversations sont privées</p>
              <p className="text-foreground">✓ Aucune donnée partagée</p>
              <p className="text-foreground">✓ Contenu réservé aux adultes (+18)</p>
            </div>
            <div className="text-sm text-muted-foreground">
              En continuant, vous confirmez avoir plus de 18 ans et acceptez nos conditions d'utilisation.
            </div>
          </div>
        )}
      </div>

      <div className="w-full max-w-md space-y-4">
        {step === 3 && (
          <div className="space-y-5 bg-card/30 p-5 rounded-xl border border-border/50">
            <div className="flex items-start space-x-4">
              <Checkbox
                id="age-confirm"
                checked={ageConfirmed}
                onCheckedChange={(checked) => setAgeConfirmed(checked === true)}
                className="mt-1 h-5 w-5 border-2 border-primary"
              />
              <label
                htmlFor="age-confirm"
                className="text-base text-foreground leading-tight cursor-pointer flex-1"
              >
                Je confirme avoir 18+ ans
              </label>
            </div>
            <div className="flex items-start space-x-4">
              <Checkbox
                id="privacy-accept"
                checked={privacyAccepted}
                onCheckedChange={(checked) => setPrivacyAccepted(checked === true)}
                className="mt-1 h-5 w-5 border-2 border-primary"
              />
              <label
                htmlFor="privacy-accept"
                className="text-base text-foreground leading-tight cursor-pointer flex-1"
              >
                J'accepte la politique de confidentialité
              </label>
            </div>
          </div>
        )}
        <Button
          onClick={handleNext}
          disabled={step === 2 ? !style : step === 3 ? !ageConfirmed || !privacyAccepted : false}
          className="w-full py-6 text-lg bg-primary hover:bg-primary/90"
        >
          {step === 3 ? "Commencer" : "Continuer"}
        </Button>
        <div className="flex justify-center gap-2">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className={`h-2 rounded-full transition-all ${
                i === step ? "w-8 bg-primary" : "w-2 bg-muted"
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Onboarding;
