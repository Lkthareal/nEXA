export interface Candidate {
  id: number;
  name: string;
  education: string;
  position: string;
  score: number;
  suggestedStatus: string;
}

export const CANDIDATES: Candidate[] = [
  { id: 1, name: "Ana Silva", education: "Ciências Contábeis (com CRC)", position: "Analista Contábil", score: 5, suggestedStatus: "Admitida" },
  { id: 2, name: "Bruno Souza", education: "Análise e Dev. de Sistemas", position: "Desenvolvedor Web", score: 5, suggestedStatus: "Admitido" },
  { id: 3, name: "Carla Dias", education: "Design Gráfico", position: "Designer Gráfico", score: 5, suggestedStatus: "Admitida" },
  { id: 4, name: "Diego Ramos", education: "Design Gráfico", position: "Designer Gráfico", score: 4, suggestedStatus: "Reserva" },
  { id: 5, name: "Elena Pires", education: "Sistemas de Informação", position: "Desenvolvedor Web", score: 4, suggestedStatus: "Reserva" },
  { id: 6, name: "Fabio Junior", education: "Ciências Contábeis (com CRC)", position: "Analista Contábil", score: 4, suggestedStatus: "Reserva" },
  { id: 7, name: "Gisele Omura", education: "Design Gráfico", position: "Designer Gráfico", score: 3, suggestedStatus: "Qualificado" },
  { id: 8, name: "Hugo Castro", education: "Ciência da Computação", position: "Desenvolvedor Web", score: 3, suggestedStatus: "Qualificado" },
  { id: 9, name: "Igor Guimarães", education: "Ciências Contábeis (Sem CRC)", position: "Analista Contábil", score: 5, suggestedStatus: "Desclassificado (Falta CRC)" },
  { id: 10, name: "Julia Costa", education: "Design de Interiores", position: "Designer Gráfico", score: 4, suggestedStatus: "Desclassificado (Formação)" },
  { id: 11, name: "Kevin Lopes", education: "TI", position: "Desenvolvedor Web", score: 2, suggestedStatus: "Qualificado" },
  { id: 12, name: "Laura Monte", education: "Ciências Contábeis (com CRC)", position: "Analista Contábil", score: 3, suggestedStatus: "Qualificado" },
  { id: 13, name: "Mario Neto", education: "Design Gráfico", position: "Designer Gráfico", score: 2, suggestedStatus: "Desclassificado (Nota < 3)" },
  { id: 14, name: "Nina Rosa", education: "Letras", position: "Desenvolvedor Web", score: 4, suggestedStatus: "Desclassificado (Formação)" },
  { id: 15, name: "Otávio Luiz", education: "Ciências Contábeis (com CRC)", position: "Analista Contábil", score: 2, suggestedStatus: "Qualificado" },
  { id: 16, name: "Paula Abreu", education: "Design Gráfico", position: "Designer Gráfico", score: 4, suggestedStatus: "Reserva" },
  { id: 17, name: "Queiroz Vaz", education: "Ciência da Computação", position: "Desenvolvedor Web", score: 5, suggestedStatus: "Reserva" },
  { id: 18, name: "Rita Reis", education: "Ciências Contábeis (com CRC)", position: "Analista Contábil", score: 4, suggestedStatus: "Reserva" },
  { id: 19, name: "Samuel Noel", education: "Sistemas de Informação", position: "Desenvolvedor Web", score: 1, suggestedStatus: "Desclassificado (Nota < 2)" },
  { id: 20, name: "Tiago Azul", education: "Design Gráfico", position: "Designer Gráfico", score: 3, suggestedStatus: "Qualificado" },
  { id: 21, name: "Ursula Lima", education: "Publicidade", position: "Designer Gráfico", score: 5, suggestedStatus: "Desclassificado (Formação)" },
  { id: 22, name: "Vitor Hugo", education: "TI", position: "Desenvolvedor Web", score: 4, suggestedStatus: "Reserva" },
  { id: 23, name: "Wendy Luz", education: "Ciências Contábeis (Sem CRC)", position: "Analista Contábil", score: 3, suggestedStatus: "Desclassificado (Falta CRC)" },
  { id: 24, name: "Xande Fogo", education: "Análise e Dev. de Sistemas", position: "Desenvolvedor Web", score: 3, suggestedStatus: "Qualificado" },
  { id: 25, name: "Yuri Sampaio", education: "Design Gráfico", position: "Designer Gráfico", score: 5, suggestedStatus: "Reserva" },
  { id: 26, name: "Zeca Porto", education: "Ciência da Computação", position: "Desenvolvedor Web", score: 2, suggestedStatus: "Qualificado" },
  { id: 27, name: "Alice Meire", education: "Ciências Contábeis (com CRC)", position: "Analista Contábil", score: 5, suggestedStatus: "Reserva" },
  { id: 28, name: "Beto Falcão", education: "Gestão de TI", position: "Desenvolvedor Web", score: 4, suggestedStatus: "Desclassificado (Formação)" },
  { id: 29, name: "Caio Temer", education: "Design Gráfico", position: "Designer Gráfico", score: 1, suggestedStatus: "Desclassificado (Nota < 3)" },
  { id: 30, name: "Dora Viana", education: "Ciência da Computação", position: "Desenvolvedor Web", score: 5, suggestedStatus: "Reserva" },
];
