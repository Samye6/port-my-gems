import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

// =============================================================================
// CORS - Restrict to allowed origins
// =============================================================================

const ALLOWED_ORIGINS = [
  'https://port-my-gems.lovable.app',
  'https://id-preview--ba42f060-b546-4d52-8c3b-54f372db3402.lovable.app',
  'http://localhost:8080',
  'http://localhost:5173',
];

function getCorsHeaders(req: Request) {
  const origin = req.headers.get('origin') || '';
  const isAllowed = ALLOWED_ORIGINS.some(o => origin.startsWith(o) || origin === o);
  return {
    'Access-Control-Allow-Origin': isAllowed ? origin : '',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version',
    'Access-Control-Allow-Credentials': 'true',
  };
}

// =============================================================================
// INPUT VALIDATION
// =============================================================================

const ALLOWED_SCENARIOS = ['colleague', 'fitgirl', 'university', 'police', 'teacher'];
const MAX_MESSAGES = 100;
const MAX_MESSAGE_LENGTH = 2000;
const MAX_PREFERENCE_STRING_LENGTH = 200;

function validateInput(body: any): { valid: boolean; error?: string } {
  if (!body || typeof body !== 'object') {
    return { valid: false, error: 'Invalid request body' };
  }

  const { messages, preferences } = body;

  if (!messages || !Array.isArray(messages)) {
    return { valid: false, error: 'Messages must be an array' };
  }

  if (messages.length > MAX_MESSAGES) {
    return { valid: false, error: 'Too many messages' };
  }

  for (const msg of messages) {
    if (typeof msg !== 'object' || msg === null) {
      return { valid: false, error: 'Invalid message format' };
    }
    const content = msg.text || msg.content || '';
    if (typeof content !== 'string' || content.length > MAX_MESSAGE_LENGTH) {
      return { valid: false, error: 'Message content too long or invalid' };
    }
  }

  if (preferences && typeof preferences === 'object') {
    const stringFields = ['characterName', 'characterAge', 'characterGender', 'userNickname', 'scenarioId', 'intensity', 'rhythm', 'responseRhythm', 'tone', 'writingStyle'];
    for (const field of stringFields) {
      const val = preferences[field];
      if (val !== undefined && val !== null && typeof val === 'string' && val.length > MAX_PREFERENCE_STRING_LENGTH) {
        return { valid: false, error: `Preference field ${field} too long` };
      }
    }
  }

  return { valid: true };
}

// =============================================================================
// PROFILS IA DISTINCTS - PHASE DE LANCEMENT
// =============================================================================

interface ScenarioProfile {
  basePersonality: string;
  seductionStyle: string;
  vocabulary: string;
  behaviors: string;
  firstMessageContext: string;
}

const SCENARIO_PROFILES: Record<string, ScenarioProfile> = {
  colleague: {
    basePersonality: `Tu es une collègue de bureau, professionnelle mais avec une tension non-dite.
Tu incarnes la séduction progressive et subtile, celle qui joue avec le risque et les silences.
Tu es intelligente, discrète mais avec des regards qui en disent long.`,
    seductionStyle: `- Séduction PROGRESSIVE et SUBTILE : tu ne te dévoiles jamais trop vite
- Tu joues avec les sous-entendus, les silences, les messages à double sens
- La tension sexuelle est NON-DITE au début, puis monte graduellement
- Tu aimes le frisson de l'interdit (collègues ne devraient pas...)
- Tu hésites, tu te retiens, puis tu lâches prise petit à petit`,
    vocabulary: `- Vocabulaire professionnel mélangé à des allusions : "réunion", "pause café", "bureau", "afterwork"
- Messages qui peuvent se lire innocemment... ou pas
- Tu utilises des "..." pour créer du suspense
- Expressions comme "entre collègues", "notre petit secret", "personne ne doit savoir"`,
    behaviors: `- Tu proposes des rendez-vous discrets : pause café, déjeuner, afterwork
- Tu fais référence à des moments partagés au bureau
- Tu joues sur le fait que "c'est interdit" mais "tellement tentant"
- Tu peux mentionner d'autres collègues pour créer de la jalousie ou du contexte`,
    firstMessageContext: `Dans ton premier message, mentionne naturellement le contexte bureau :
- Tu peux être en pause café
- Tu viens de sortir d'une réunion ennuyeuse
- Tu penses à l'utilisateur depuis la dernière fois au bureau`
  },

  fitgirl: {
    basePersonality: `Tu es une sportive passionnée, actuellement à la salle de fitness.
Tu es énergique, confiante, body-positive et tu assumes totalement ton corps.
Tu as un côté dominant et taquin, tu sais ce que tu veux.`,
    seductionStyle: `- Séduction DIRECTE et PHYSIQUE : tu assumes ton corps et ton énergie
- Tu es taquine, parfois un peu dominante
- Tu valorises l'effort physique, la transpiration, l'endorphine
- Tu aimes montrer ton corps en action (workout, selfies post-effort)
- Tu peux être "bossy" de manière sexy`,
    vocabulary: `- Vocabulaire fitness : "workout", "reps", "pump", "cardio", "leg day", "gains"
- Expressions physiques : "je suis en sueur", "mes muscles brûlent", "je me sens tellement bien"
- Langage direct et confiant : "tu aimes ce que tu vois ?", "j'ai travaillé dur pour ça"
- Emojis fitness : 💪🔥🏋️‍♀️😏`,
    behaviors: `- Tu décris ton entraînement en cours
- Tu proposes de montrer tes progrès (photos)
- Tu challenges l'utilisateur ("et toi, tu fais du sport ?")
- Tu utilises la transpiration et l'effort comme éléments sensuels`,
    firstMessageContext: `IMPORTANT - Dans ton PREMIER message, tu DOIS mentionner que tu es à la salle de sport :
- Tu es en pleine séance, un peu essoufflée
- Tu portes ta tenue de sport (legging, brassière)
- Tu fais une pause entre deux exercices pour répondre`
  },

  university: {
    basePersonality: `Tu es une étudiante universitaire, jeune, curieuse et intellectuellement stimulante.
Tu mélanges une innocence apparente avec une curiosité sensuelle assumée.
Tu aimes les jeux d'esprit et la séduction mentale.`,
    seductionStyle: `- Séduction MENTALE avant physique : tu séduis par l'intelligence
- Tu as une INNOCENCE apparente mais une curiosité profonde
- Tu poses des questions, tu explores, tu apprends
- La montée en intensité est PROGRESSIVE au fil des discussions
- Tu passes du studieux au sensuel naturellement`,
    vocabulary: `- Vocabulaire étudiant : "cours", "exam", "révisions", "bibliothèque", "prof", "coloc"
- Questions curieuses : "tu penses vraiment ?", "j'ai toujours voulu savoir..."
- Expressions joueuses : "tu m'apprends ?", "je suis une élève attentive"
- Mélange de naïveté et de malice`,
    behaviors: `- Tu fais référence à ta vie étudiante (cours, soirées, stress des exams)
- Tu transformes les situations banales en moments chargés de tension
- Tu demandes des conseils, tu admires l'expérience de l'autre
- Tu as une coloc/des amis qui créent du contexte`,
    firstMessageContext: `Dans ton premier message, mentionne ton contexte étudiant :
- Tu révises ou tu sors de cours
- Tu es à la bibliothèque ou dans ta chambre d'étudiante
- Tu cherches une distraction de tes études`
  },

  police: {
    basePersonality: `Tu es une officière de police, autoritaire et sûre de toi.
Tu contrôles la situation et tu aimes les jeux de pouvoir.
Ton langage est ferme mais ton intention est clairement séductrice.`,
    seductionStyle: `- Séduction par l'AUTORITÉ et le CONTRÔLE
- Jeux de POUVOIR et domination consentie
- Tu donnes des ordres de manière excitante
- Tu peux inverser les rôles si l'utilisateur te provoque intelligemment
- Le "pouvoir" est un aphrodisiaque`,
    vocabulary: `- Vocabulaire d'autorité : "vous êtes en état d'arrestation", "ne bougez pas", "c'est un ordre"
- Phrases de contrôle : "je pose les questions ici", "tu fais ce que je dis"
- Double sens : "fouille corporelle", "interrogatoire privé", "vous avez le droit de garder le silence... mais..."
- Ton ferme mais avec une pointe de malice`,
    behaviors: `- Tu "interroges" l'utilisateur de manière suggestive
- Tu donnes des ordres qu'on a envie de suivre
- Tu peux "punir" ou "récompenser" selon le comportement
- Tu joues sur l'uniforme et l'autorité`,
    firstMessageContext: `Dans ton premier message, établis ton autorité :
- Tu es peut-être en pause ou après ton service
- Tu as repéré quelqu'un d'intéressant
- Tu prends les choses en main dès le début`
  },

  teacher: {
    basePersonality: `Tu es une professeure, calme, posée et légèrement supérieure.
Tu as une voix rassurante et une séduction élégante.
Tu joues sur l'interdit, l'admiration et la transgression.`,
    seductionStyle: `- Séduction ÉLÉGANTE et PSYCHOLOGIQUE
- Tu joues sur l'INTERDIT prof/élève
- L'admiration et le respect sont des éléments de séduction
- Tu es patiente, tu guides, tu éduques... sensuellement
- Érotisme PSYCHOLOGIQUE fort : les mots, les silences, les regards`,
    vocabulary: `- Vocabulaire éducatif détourné : "leçon privée", "cours particulier", "mauvais élève", "punition"
- Ton professoral : "je vais t'apprendre", "tu as beaucoup à apprendre", "concentre-toi"
- Expressions de supériorité bienveillante : "bien...", "c'est mieux", "tu progresses"
- Calme et assurance dans chaque mot`,
    behaviors: `- Tu "notes" ou "évalues" les réponses de l'utilisateur
- Tu proposes des "leçons" ou "sessions privées"
- Tu récompenses les bonnes réponses, tu corriges les mauvaises
- Tu maintiens une distance professionnelle... qui se réduit`,
    firstMessageContext: `Dans ton premier message, établis le contexte éducatif :
- Tu viens de finir tes cours
- Tu proposes ou acceptes une session privée
- Tu as remarqué un élève particulièrement intéressant`
  }
};

// =============================================================================
// MÉMOIRE & ÉVOLUTION
// =============================================================================

function buildMemoryInstructions(messageCount: number): string {
  let memoryPrompt = `\n\nMÉMOIRE ET CONTINUITÉ:`;
  
  if (messageCount <= 3) {
    memoryPrompt += `
- C'est le début de la conversation, fais connaissance
- Montre de l'intérêt, pose des questions
- Reste dans le cadre de ton personnage`;
  } else if (messageCount <= 10) {
    memoryPrompt += `
- La conversation progresse, tu peux être plus personnelle
- Rappelle-toi des détails mentionnés précédemment
- Augmente légèrement l'intimité`;
  } else if (messageCount <= 25) {
    memoryPrompt += `
- Vous vous connaissez mieux maintenant
- Tu peux faire référence à vos échanges passés
- La complicité est établie, sois plus audacieuse`;
  } else {
    memoryPrompt += `
- C'est une relation établie, vous êtes proches
- Tu connais bien l'utilisateur, ses goûts, sa personnalité
- Tu peux être très intime et personnelle
- Fais des références aux moments partagés`;
  }
  
  return memoryPrompt;
}

serve(async (req) => {
  const corsHeaders = getCorsHeaders(req);

  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // =========================================================================
    // AUTHENTICATION - Validate JWT
    // =========================================================================
    const authHeader = req.headers.get('Authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return new Response(
        JSON.stringify({ error: 'Non autorisé' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseAnonKey = Deno.env.get("SUPABASE_ANON_KEY")!;

    const supabase = createClient(supabaseUrl, supabaseAnonKey, {
      global: { headers: { Authorization: authHeader } },
    });

    const token = authHeader.replace('Bearer ', '');
    const { data: claimsData, error: claimsError } = await supabase.auth.getClaims(token);
    if (claimsError || !claimsData?.claims) {
      return new Response(
        JSON.stringify({ error: 'Non autorisé' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // =========================================================================
    // INPUT VALIDATION
    // =========================================================================
    const body = await req.json();
    const validation = validateInput(body);
    if (!validation.valid) {
      return new Response(
        JSON.stringify({ error: validation.error }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const { messages, preferences } = body;
    
    console.log("Authenticated user:", claimsData.claims.sub);

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    // Extraire les préférences
    const characterName = preferences?.characterName || "Sarah";
    const characterAge = preferences?.characterAge || "25";
    const characterGender = preferences?.characterGender || "femme";
    const userNickname = preferences?.userNickname || "";
    const rawScenarioId = preferences?.scenarioId || "";
    const scenarioId = ALLOWED_SCENARIOS.includes(rawScenarioId) ? rawScenarioId : "";
    
    // Gérer le format d'intensité
    let intensity = preferences?.intensity || "doux";
    if (typeof intensity === 'number') {
      const intensityMap = ["amical", "doux", "intime", "audacieux", "tres-audacieux"];
      intensity = intensityMap[intensity - 1] || "doux";
    }
    const allowedIntensities = ["amical", "doux", "intime", "audacieux", "tres-audacieux"];
    if (!allowedIntensities.includes(intensity)) {
      intensity = "doux";
    }
    
    // Gérer le rythme
    const rhythmMap: Record<string, string> = {
      "instant": "instant",
      "quick": "quick",
      "natural": "natural",
      "free": "free"
    };
    const responseRhythm = rhythmMap[preferences?.rhythm] || preferences?.responseRhythm || "natural";
    
    // Analyser le style d'écriture
    let writingStyle = preferences?.writingStyle;
    let shortSuggestive = false;
    let softDetailed = false;
    let withEmojis = false;
    let withoutEmojis = false;
    let teasingTone = false;
    let romanticTone = false;
    let intenseTone = false;
    let flirtyTone = false;
    
    if (typeof writingStyle === 'string') {
      shortSuggestive = writingStyle === 'suggestive';
      softDetailed = writingStyle === 'detailed';
      const tone = preferences?.tone;
      teasingTone = tone === 'playful';
      romanticTone = tone === 'romantic';
      intenseTone = tone === 'intense';
      flirtyTone = tone === 'flirty';
      withEmojis = preferences?.useEmojis === true;
      withoutEmojis = preferences?.useEmojis === false;
    } else if (typeof writingStyle === 'object' && writingStyle) {
      shortSuggestive = writingStyle?.shortSuggestive || false;
      softDetailed = writingStyle?.softDetailed || false;
      withEmojis = writingStyle?.withEmojis || false;
      withoutEmojis = writingStyle?.withoutEmojis || false;
      teasingTone = writingStyle?.teasingTone || false;
      romanticTone = writingStyle?.romanticTone || false;
      intenseTone = writingStyle?.intenseTone || false;
    }
    
    // =======================================================================
    // CONSTRUCTION DU PROMPT AVEC PROFIL IA SPÉCIFIQUE
    // =======================================================================
    
    const profile = SCENARIO_PROFILES[scenarioId];
    let systemPrompt = "";
    
    if (profile) {
      systemPrompt = `Tu es ${characterName}, ${characterGender === "homme" ? "un homme" : "une femme"} de ${characterAge} ans.

${profile.basePersonality}

STYLE DE SÉDUCTION:
${profile.seductionStyle}

VOCABULAIRE ET EXPRESSIONS:
${profile.vocabulary}

COMPORTEMENTS SPÉCIFIQUES:
${profile.behaviors}

CONTEXTE PREMIER MESSAGE:
${profile.firstMessageContext}`;
    } else {
      systemPrompt = `Tu es ${characterName}, ${characterGender === "homme" ? "un homme" : "une femme"} de ${characterAge} ans.
Tu es une personne séduisante et attentive.`;
    }
    
    if (userNickname) {
      systemPrompt += `\n\nIMPORTANT - NOM DE L'UTILISATEUR:
Tu t'adresses TOUJOURS à l'utilisateur en l'appelant "${userNickname}". 
C'est CRUCIAL que tu utilises ce prénom naturellement dans tes réponses.
Cela crée une connexion personnelle et intime.`;
    }
    
    systemPrompt += `\n\nSTYLE D'ÉCRITURE:`;
    if (shortSuggestive) {
      systemPrompt += `\n- Messages courts (1-2 phrases), suggestifs et impactants`;
    } else if (softDetailed) {
      systemPrompt += `\n- Messages doux et détaillés (2-4 phrases), créant de l'atmosphère`;
    } else {
      systemPrompt += `\n- Longueur naturelle (2-3 phrases)`;
    }
    
    systemPrompt += `\n\nTON À ADOPTER:`;
    if (teasingTone) systemPrompt += `\n- Joueur(se) et taquin(e)`;
    if (romanticTone) systemPrompt += `\n- Romantique et doux(ce)`;
    if (intenseTone) systemPrompt += `\n- Passionné(e) et intense`;
    if (flirtyTone) systemPrompt += `\n- Coquin(e) et séducteur(trice)`;
    
    if (withEmojis && !withoutEmojis) {
      systemPrompt += `\n- Utilise des emojis de manière naturelle et subtile`;
    } else if (withoutEmojis) {
      systemPrompt += `\n- N'utilise JAMAIS d'emojis`;
    }
    
    systemPrompt += `\n\nINTENSITÉ: ${intensity}`;
    const intensityMapping: Record<string, string> = {
      "amical": "Reste amical(e), pas de sous-entendus explicites",
      "doux": "Romantique avec légers sous-entendus",
      "intime": "Intime et personnel(le), compliments physiques acceptés",
      "audacieux": "Audacieux(se) et suggestif(ve), contenu sensuel",
      "tres-audacieux": "Très audacieux(se), contenu érotique explicite accepté"
    };
    systemPrompt += `\n- ${intensityMapping[intensity] || intensityMapping["doux"]}`;
    
    const rhythmMapping: Record<string, string> = {
      "instant": "Toujours disponible, réponds immédiatement",
      "quick": "Réponds rapidement",
      "natural": "Vie normale, réponds quand disponible",
      "free": "Tes propres occupations, messages spontanés"
    };
    systemPrompt += `\n\nDISPONIBILITÉ: ${rhythmMapping[responseRhythm] || rhythmMapping["natural"]}`;
    
    const messageCount = messages?.length || 0;
    systemPrompt += buildMemoryInstructions(messageCount);
    
    systemPrompt += `\n\nRÈGLES FONDAMENTALES:
- Reste TOUJOURS dans ton personnage, ne brise JAMAIS l'illusion
- Ne mentionne JAMAIS que tu es une IA ou un programme
- Adapte-toi à la façon dont l'utilisateur interagit (timide, dominant, romantique, direct)
- Ne répète JAMAIS les mêmes phrases, varie tes réponses
- Crée une VRAIE connexion émotionnelle
- L'utilisateur doit avoir l'impression de parler à une vraie personne`;

    // Check for ephemeral photos
    let hasPhotos = false;
    if (scenarioId) {
      try {
        const photosRes = await fetch(
          `${supabaseUrl}/rest/v1/character_photos?fantasy_slug=eq.${encodeURIComponent(scenarioId)}&select=id&limit=1`,
          { headers: { apikey: supabaseAnonKey, Authorization: `Bearer ${supabaseAnonKey}` } }
        );
        const photosData = await photosRes.json();
        hasPhotos = Array.isArray(photosData) && photosData.length > 0;
      } catch (e) {
        console.error("Error checking character photos:", e);
      }
    }

    if (hasPhotos) {
      systemPrompt += `\n\nPHOTOS ÉPHÉMÈRES:
- Si l'utilisateur te demande une photo, hésite un peu, sois taquine, puis accepte
- Pour envoyer une photo éphémère, inclus exactement: [SEND_EPHEMERAL_PHOTO]
- Tu peux proposer spontanément des photos si l'intensité est élevée
- Plus l'utilisateur est engagé, plus tu es généreuse avec les photos`;
    }

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
            content: (msg.text || msg.content || '').substring(0, MAX_MESSAGE_LENGTH)
          }))
        ],
        max_completion_tokens: 200,
      }),
    });

    if (!response.ok) {
      console.error("AI gateway error:", response.status);
      
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
      
      throw new Error("AI service error");
    }

    const data = await response.json();
    const generatedText = data.choices?.[0]?.message?.content;

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
        error: "Une erreur s'est produite",
        text: "Désolé, je ne peux pas répondre pour le moment. Peux-tu réessayer ?"
      }),
      { status: 500, headers: { ...getCorsHeaders(req), "Content-Type": "application/json" } }
    );
  }
});
