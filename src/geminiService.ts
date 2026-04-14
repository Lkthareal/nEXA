import { GoogleGenAI } from "@google/genai";
import { Candidate } from "./data";

let aiInstance: GoogleGenAI | null = null;

function getAI() {
  if (!aiInstance) {
    const apiKey = process.env.GEMINI_API_KEY;
    aiInstance = new GoogleGenAI({ apiKey: apiKey || "" });
  }
  return aiInstance;
}

export async function getCandidateInsights(candidates: Candidate[], userQuestion: string) {
  const ai = getAI();
  const candidatesContext = candidates.map(c => 
    `Nome: ${c.name}, Formação: ${c.education}, Função: ${c.position}, Nota: ${c.score}, Status Sugerido: ${c.suggestedStatus}`
  ).join('\n');

  const systemInstruction = `
    Você é um assistente de recrutamento especializado da NEXA RH DO FUTURO. 
    Sua tarefa é analisar os dados dos candidatos e fornecer insights objetivos e didáticos.
    
    Contexto da Empresa: NEXA RH DO FUTURO é uma consultoria estratégica de RH focada em tecnologia e IA.
    
    Critérios de Seleção (Siga Rigorosamente):
    1. Designer Gráfico: Requer graduação em Design Gráfico e nota mínima 3.0.
    2. Desenvolvedor Web: Requer graduação em TI, ADS, SI ou Ciência da Computação e nota mínima 2.0.
    3. Analista Contábil: Requer Bacharelado em Ciências Contábeis e CRC Ativo.
    
    Diretrizes de Resposta:
    - Seja extremamente OBJETIVO e DIDÁTICO.
    - NÃO utilize negrito excessivo ou muitos asteriscos (**). Prefira listas limpas ou texto direto.
    - Identifique os melhores talentos comparando a formação e a nota com os critérios acima.
    - Aponte riscos claros (ex: nota abaixo do mínimo ou formação incompatível).
    - Use emojis de forma moderada e profissional (🤖, 📊, ✅, ⚠️).
    - Limite sua resposta a no máximo 3-4 pontos estratégicos.
    
    Dados dos Candidatos:
    ${candidatesContext}
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: userQuestion,
      config: {
        systemInstruction,
      },
    });

    return response.text;
  } catch (error) {
    console.error("Erro ao chamar Gemini API:", error);
    return "Desculpe, tive um problema ao analisar os dados. Tente novamente em instantes. 🤖";
  }
}
