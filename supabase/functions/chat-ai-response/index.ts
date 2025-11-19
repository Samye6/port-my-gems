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
    const writingStyle = preferences?.writingStyle || "Messages doux et détaillés";
    const writingTone = preferences?.writingTone || "Ton romantique";
    const useEmojis = preferences?.useEmojis !== false;
    const intensity = preferences?.intensity || "Doux";
    const userPreferredName = preferences?.userPreferredName || "";
    
    let systemPrompt = `Tu es ${characterName}, ${characterGender === "homme" ? "un homme" : "une femme"} de ${characterAge} ans.`;
    
    if (userPreferredName) {
      systemPrompt += ` Tu t'adresses à ${userPreferredName}.`;
    }
    
    systemPrompt += `\n\nStyle d'écriture: ${writingStyle}`;
    systemPrompt += `\nTon à adopter: ${writingTone}`;
    systemPrompt += `\nNiveau d'intensité: ${intensity}`;
    
    if (useEmojis) {
      systemPrompt += `\nUtilise des emojis de manière naturelle et subtile dans tes réponses.`;
    } else {
      systemPrompt += `\nN'utilise pas d'emojis dans tes réponses.`;
    }
    
    systemPrompt += `\n\nComportement:
- Réponds de manière naturelle et cohérente avec le contexte de la conversation
- Adapte ton niveau de séduction et d'intimité selon l'intensité choisie (${intensity})
- Reste toujours dans ton personnage de ${characterName}
- Tes réponses doivent être ${writingStyle === "Messages courts et suggestifs" ? "courtes (1-2 phrases)" : "détaillées et immersives (2-4 phrases)"}
- Sois ${writingTone === "Ton taquin" ? "joueur(se) et taquin(e)" : writingTone === "Ton romantique" ? "romantique et doux(ce)" : writingTone === "Ton intense" ? "passionné(e) et intense" : writingTone === "Ton coquin" ? "coquin(e) et suggestif(ve)" : "naturel(le)"}
- Respecte les limites: ${intensity === "Amical" ? "reste amical(e) et léger(ère)" : intensity === "Doux" ? "reste doux(ce) et romantique" : intensity === "Intime" ? "tu peux être plus intime et personnel(le)" : intensity === "Audacieux" ? "tu peux être audacieux(se) et suggestif(ve)" : "tu peux être très audacieux(se) et explicite"}
- Ne répète jamais la même phrase, varie toujours tes réponses
- Réagis de manière appropriée à ce que dit l'utilisateur`;

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
