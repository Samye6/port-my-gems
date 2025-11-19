import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { messages, preferences } = await req.json();
    
    console.log("Received request with preferences:", preferences);
    
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    // Construire le prompt système basé sur les préférences
    const characterName = preferences?.characterName || "Sarah";
    const characterAge = preferences?.characterAge || "25";
    const characterGender = preferences?.characterGender || "femme";
    const userNickname = preferences?.userNickname || "";
    const intensity = preferences?.intensity || "doux";
    const responseRhythm = preferences?.responseRhythm || "natural";
    
    // Analyser le style d'écriture (objet)
    const writingStyle = preferences?.writingStyle || {};
    const shortSuggestive = writingStyle.shortSuggestive || false;
    const softDetailed = writingStyle.softDetailed || false;
    const withEmojis = writingStyle.withEmojis || false;
    const withoutEmojis = writingStyle.withoutEmojis || false;
    const teasingTone = writingStyle.teasingTone || false;
    const romanticTone = writingStyle.romanticTone || false;
    const intenseTone = writingStyle.intenseTone || false;
    
    let systemPrompt = `Tu es ${characterName}, ${characterGender === "homme" ? "un homme" : "une femme"} de ${characterAge} ans.`;
    
    if (userNickname) {
      systemPrompt += ` Tu t'adresses toujours à l'utilisateur en l'appelant "${userNickname}". C'est TRÈS IMPORTANT que tu utilises ce nom dans tes réponses.`;
    }
    
    // Style d'écriture
    systemPrompt += `\n\nStyle d'écriture:`;
    if (shortSuggestive) {
      systemPrompt += `\n- Tes messages doivent être courts (1-2 phrases) et suggestifs`;
    }
    if (softDetailed) {
      systemPrompt += `\n- Tes messages doivent être doux et détaillés (2-4 phrases)`;
    }
    if (!shortSuggestive && !softDetailed) {
      systemPrompt += `\n- Longueur moyenne (2-3 phrases)`;
    }
    
    // Ton
    systemPrompt += `\n\nTon à adopter:`;
    if (teasingTone) {
      systemPrompt += `\n- Sois joueur(se) et taquin(e)`;
    }
    if (romanticTone) {
      systemPrompt += `\n- Sois romantique et doux(ce)`;
    }
    if (intenseTone) {
      systemPrompt += `\n- Sois passionné(e) et intense`;
    }
    
    // Emojis
    if (withEmojis && !withoutEmojis) {
      systemPrompt += `\n- Utilise des emojis de manière naturelle et subtile dans tes réponses`;
    } else if (withoutEmojis) {
      systemPrompt += `\n- N'utilise JAMAIS d'emojis dans tes réponses`;
    }
    
    // Intensité de l'échange
    systemPrompt += `\n\nNiveau d'intensité: ${intensity}`;
    const intensityMapping: Record<string, string> = {
      "amical": "reste amical(e) et léger(ère), pas de sous-entendus",
      "doux": "reste doux(ce) et romantique, légers sous-entendus acceptés",
      "intime": "tu peux être plus intime et personnel(le), sous-entendus et compliments physiques acceptés",
      "audacieux": "tu peux être audacieux(se) et suggestif(ve), contenu sensuel accepté",
      "tres-audacieux": "tu peux être très audacieux(se) et explicite, contenu érotique accepté"
    };
    const intensityInstruction = intensityMapping[intensity] || intensityMapping["doux"];
    systemPrompt += `\n- Respecte ce niveau: ${intensityInstruction}`;
    
    // Rythme de réponse (pour information contextuelle)
    const rhythmMapping: Record<string, string> = {
      "instant": "tu es toujours disponible et réponds immédiatement",
      "quick": "tu réponds rapidement",
      "natural": "tu as une vie normale et réponds quand tu es disponible",
      "free": "tu as tes propres occupations et peux envoyer des messages spontanés"
    };
    const rhythmContext = rhythmMapping[responseRhythm] || rhythmMapping["natural"];
    systemPrompt += `\n- Contexte de disponibilité: ${rhythmContext}`;
    
    systemPrompt += `\n\nComportement:
- Réponds de manière naturelle et cohérente avec le contexte de la conversation
- Adapte ton niveau de séduction et d'intimité selon l'intensité choisie
- Reste toujours dans ton personnage de ${characterName}
- Ne répète jamais la même phrase, varie toujours tes réponses
- Réagis de manière appropriée à ce que dit l'utilisateur
- Si tu dois appeler l'utilisateur par son nom, utilise TOUJOURS "${userNickname}"`;

    console.log("System prompt:", systemPrompt);

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: systemPrompt },
          ...messages.map((msg: any) => ({
            role: msg.sender === "user" ? "user" : "assistant",
            content: msg.text || msg.content
          }))
        ],
        max_completion_tokens: 200,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Trop de requêtes. Veuillez réessayer dans quelques instants." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: "Service temporairement indisponible. Veuillez réessayer." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      
      throw new Error(`AI gateway error: ${response.status}`);
    }

    const data = await response.json();
    const generatedText = data.choices?.[0]?.message?.content;
    
    console.log("Generated response:", generatedText);

    if (!generatedText) {
      throw new Error("No response generated");
    }

    return new Response(
      JSON.stringify({ text: generatedText }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error in chat-ai-response function:", error);
    return new Response(
      JSON.stringify({ 
        error: error instanceof Error ? error.message : "Une erreur s'est produite",
        text: "Désolé, je ne peux pas répondre pour le moment. Peux-tu réessayer ?"
      }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
