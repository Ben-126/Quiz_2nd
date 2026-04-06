import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const VerifySchema = z.object({
  question: z.string().min(1).max(500),
  reponseCorrecte: z.string().min(1).max(500),
  reponseUser: z.string().min(1).max(500),
  explication: z.string().max(1000),
});

function normaliserSimple(s: string): string {
  return s
    .toLowerCase()
    .trim()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[.,;:!?'"()\-]/g, "")
    .replace(/\s+/g, " ");
}

function verifierLocalReponse(reponseUser: string, reponseCorrecte: string): boolean {
  const u = normaliserSimple(reponseUser);
  const c = normaliserSimple(reponseCorrecte);
  return u === c || u.includes(c) || c.includes(u);
}

export async function POST(req: NextRequest) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Corps de requête invalide." }, { status: 400 });
  }

  const parsed = VerifySchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Paramètres invalides." }, { status: 400 });
  }

  const { question, reponseCorrecte, reponseUser, explication } = parsed.data;

  const apiKey = process.env.OPENAI_API_KEY;

  if (!apiKey) {
    const correcte = verifierLocalReponse(reponseUser, reponseCorrecte);
    return NextResponse.json({
      correcte,
      feedback: correcte
        ? "Bonne réponse !"
        : `La réponse attendue était : « ${reponseCorrecte} »`,
    });
  }

  try {
    const { default: OpenAI } = await import("openai");
    const client = new OpenAI({ apiKey });

    const prompt = `Tu es un professeur de Seconde qui corrige une réponse courte.

Question posée : ${question}
Réponse correcte de référence : ${reponseCorrecte}
Explication : ${explication}
Réponse de l'élève : ${reponseUser}

Évalue si la réponse de l'élève est correcte.
Sois tolérant sur : les fautes d'orthographe mineures, les synonymes exacts, les reformulations équivalentes.
Sois strict sur : le sens, les concepts clés, les valeurs numériques.

Réponds UNIQUEMENT avec du JSON valide :
{
  "correcte": true,
  "feedback": "Très bien, tu as identifié le bon concept."
}
ou
{
  "correcte": false,
  "feedback": "Ta réponse évoque X mais il manque Y. La réponse attendue est : ${reponseCorrecte}."
}`;

    const completion = await client.chat.completions.create({
      model: "gpt-4o-mini",
      max_tokens: 150,
      messages: [{ role: "user", content: prompt }],
    });

    const text = completion.choices[0]?.message?.content ?? "";
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) throw new Error("Format JSON introuvable");

    const result = JSON.parse(jsonMatch[0]);
    return NextResponse.json({
      correcte: Boolean(result.correcte),
      feedback: String(result.feedback ?? ""),
    });
  } catch {
    const correcte = verifierLocalReponse(reponseUser, reponseCorrecte);
    return NextResponse.json({
      correcte,
      feedback: correcte
        ? "Bonne réponse !"
        : `La réponse attendue était : « ${reponseCorrecte} »`,
    });
  }
}
