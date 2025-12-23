import type { VercelRequest, VercelResponse } from "@vercel/node";

export default async function handler(
  req: VercelRequest,
  res: VercelResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const body = JSON.parse(req.body || "{}");
    const userMessage = body.message;

    if (!userMessage) {
      return res.status(400).json({ error: "No message provided" });
    }

    // Pour l’instant, on renvoie juste le message reçu
    return res.status(200).json({
      reply: `Tu as dit : ${userMessage}`,
    });
  } catch (error) {
    return res.status(500).json({ error: "Server error" });
  }
}
