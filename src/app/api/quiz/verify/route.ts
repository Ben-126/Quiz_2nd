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

function verifierLocalReponse(reponseUser: string, reponseCorrecte: string): "correct" | "incorrect" {
  const u = normaliserSimple(reponseUser);
  const c = normaliserSimple(reponseCorrecte);
  return u === c || u.includes(c) || c.includes(u) ? "correct" : "incorrect";
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
    const niveau = verifierLocalReponse(reponseUser, reponseCorrecte);
    return NextResponse.json({
      correcte: niveau === "correct",
      niveauCorrection: niveau,
      feedback: niveau === "correct"
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

Évalue si la réponse de l'élève est correcte en utilisant 3 niveaux :
- "correct" : réponse juste (synonymes acceptés, fautes mineures tolérées, reformulation équivalente)
- "partiel" : idée juste mais formulation incomplète, concept clé présent mais imprécis, réponse partielle
- "incorrect" : réponse fausse, hors sujet, ou concept clé absent

Sois tolérant sur : les fautes d'orthographe mineures, les synonymes exacts.
Sois strict sur : le sens général, les concepts clés, les valeurs numériques.

Réponds UNIQUEMENT avec du JSON valide :
{
  "niveauCorrection": "correct",
  "feedback": "Très bien, tu as identifié le bon concept."
}
ou
{
  "niveauCorrection": "partiel",
  "feedback": "L'idée est juste mais il manque la précision sur Y."
}
ou
{
  "niveauCorrection": "incorrect",
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
    const niveauCorrection = ["correct", "partiel", "incorrect"].includes(result.niveauCorrection)
      ? (result.niveauCorrection as "correct" | "partiel" | "incorrect")
      : (result.correcte ? "correct" : "incorrect");
    return NextResponse.json({
      correcte: niveauCorrection === "correct",
      niveauCorrection,
      feedback: String(result.feedback ?? ""),
    });
  } catch {
    const niveau = verifierLocalReponse(reponseUser, reponseCorrecte);
    return NextResponse.json({
      correcte: niveau === "correct",
      niveauCorrection: niveau,
      feedback: niveau === "correct"
        ? "Bonne réponse !"
        : `La réponse attendue était : « ${reponseCorrecte} »`,
    });
  }
}
