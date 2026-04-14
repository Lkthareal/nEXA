import { useState, useMemo, useEffect, useRef } from 'react';
import { 
  Users, 
  Search, 
  Filter, 
  CheckCircle2, 
  Clock, 
  XCircle, 
  Award,
  Briefcase,
  GraduationCap,
  ChevronDown,
  ExternalLink,
  Cpu,
  Code,
  Palette,
  Calculator,
  MessageSquare,
  Send,
  Sparkles,
  BrainCircuit,
  UserCheck,
  Zap,
  ArrowRight,
  ArrowUpDown,
  ArrowUp,
  ArrowDown
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { CANDIDATES, Candidate } from './data';
import { getCandidateInsights } from './geminiService';

type SortKey = 'name' | 'education' | 'position' | 'suggestedStatus' | 'none';
type SortOrder = 'asc' | 'desc';

export default function App() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterPosition, setFilterPosition] = useState('Todas');
  const [filterStatus, setFilterStatus] = useState('Todos');
  const [sortKey, setSortKey] = useState<SortKey>('none');
  const [sortOrder, setSortOrder] = useState<SortOrder>('asc');
  
  // Chatbot State
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [chatInput, setChatInput] = useState('');
  const [messages, setMessages] = useState<{role: 'user' | 'ai', content: string}[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [hasUsedAI, setHasUsedAI] = useState(false);
  
  // Decision Flow State
  const [decisionStep, setDecisionStep] = useState<'browsing' | 'deciding' | 'result'>('browsing');
  const [selectedCandidates, setSelectedCandidates] = useState<Record<string, Candidate | null>>({
    'Designer Gráfico': null,
    'Desenvolvedor Web': null,
    'Analista Contábil': null
  });
  const [aiStats, setAiStats] = useState({ used: 142, notUsed: 89 }); // Mock initial stats

  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const positions = ['Todas', 'Designer Gráfico', 'Desenvolvedor Web', 'Analista Contábil'];
  const hiringPositions = ['Designer Gráfico', 'Desenvolvedor Web', 'Analista Contábil'];
  const statuses = ['Todos', 'Admitido', 'Reserva', 'Qualificado', 'Desclassificado'];

  const handleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortKey(key);
      setSortOrder('asc');
    }
  };

  const filteredCandidates = useMemo(() => {
    let result = CANDIDATES.filter(c => {
      const matchesSearch = c.name.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesPosition = filterPosition === 'Todas' || c.position === filterPosition;
      const matchesStatus = filterStatus === 'Todos' || 
        (filterStatus === 'Admitido' && c.suggestedStatus.includes('Admitid')) ||
        (filterStatus === 'Reserva' && c.suggestedStatus === 'Reserva') ||
        (filterStatus === 'Qualificado' && c.suggestedStatus === 'Qualificado') ||
        (filterStatus === 'Desclassificado' && c.suggestedStatus.includes('Desclassificado'));
      
      return matchesSearch && matchesPosition && matchesStatus;
    });

    if (sortKey !== 'none') {
      result.sort((a, b) => {
        const valA = a[sortKey as keyof Candidate].toString().toLowerCase();
        const valB = b[sortKey as keyof Candidate].toString().toLowerCase();
        
        if (sortOrder === 'asc') {
          return valA.localeCompare(valB);
        } else {
          return valB.localeCompare(valA);
        }
      });
    }

    return result;
  }, [searchTerm, filterPosition, filterStatus, sortKey, sortOrder]);

  const stats = useMemo(() => {
    return {
      total: CANDIDATES.length,
      admitted: CANDIDATES.filter(c => c.suggestedStatus.includes('Admitid')).length,
      reserva: CANDIDATES.filter(c => c.suggestedStatus === 'Reserva').length,
      disqualified: CANDIDATES.filter(c => c.suggestedStatus.includes('Desclassificado')).length,
    };
  }, []);

  const handleSendMessage = async () => {
    if (!chatInput.trim()) return;
    
    const userMsg = chatInput;
    setChatInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMsg }]);
    setIsTyping(true);
    setHasUsedAI(true);

    const aiResponse = await getCandidateInsights(CANDIDATES, userMsg);
    
    setIsTyping(false);
    setMessages(prev => [...prev, { role: 'ai', content: aiResponse }]);
  };

  const selectCandidateForPosition = (position: string, candidate: Candidate) => {
    setSelectedCandidates(prev => ({
      ...prev,
      [position]: prev[position]?.id === candidate.id ? null : candidate
    }));
  };

  const handleFinalDecision = () => {
    setDecisionStep('result');
    
    // Update stats
    if (hasUsedAI) {
      setAiStats(prev => ({ ...prev, used: prev.used + 1 }));
    } else {
      setAiStats(prev => ({ ...prev, notUsed: prev.notUsed + 1 }));
    }
  };

  const isDecisionComplete = Object.values(selectedCandidates).every(c => c !== null);

  const getStatusColor = (status: string) => {
    if (status.includes('Admitid')) return 'text-success bg-success/15 border-success/20';
    if (status === 'Reserva') return 'text-warning bg-warning/15 border-warning/20';
    if (status === 'Qualificado') return 'text-info bg-info/15 border-info/20';
    return 'text-danger bg-danger/15 border-danger/20';
  };

  const getStatusIcon = (status: string) => {
    if (status.includes('Admitid')) return <CheckCircle2 className="w-3 h-3" />;
    if (status === 'Reserva') return <Clock className="w-3 h-3" />;
    if (status === 'Qualificado') return <Award className="w-3 h-3" />;
    return <XCircle className="w-3 h-3" />;
  };

  const getPositionIcon = (position: string) => {
    if (position === 'Designer Gráfico') return <Palette className="w-3.5 h-3.5" />;
    if (position === 'Desenvolvedor Web') return <Code className="w-3.5 h-3.5" />;
    if (position === 'Analista Contábil') return <Calculator className="w-3.5 h-3.5" />;
    return <Briefcase className="w-3.5 h-3.5" />;
  };

  const SortIcon = ({ currentKey }: { currentKey: SortKey }) => {
    if (sortKey !== currentKey) return <ArrowUpDown className="w-3 h-3 opacity-30 group-hover:opacity-100 transition-opacity" />;
    return sortOrder === 'asc' ? <ArrowUp className="w-3 h-3 text-brand" /> : <ArrowDown className="w-3 h-3 text-brand" />;
  };

  return (
    <div className="min-h-screen bg-bg text-white font-sans selection:bg-brand selection:text-black p-6 flex flex-col gap-5">
      {/* Header */}
      <header className="flex justify-between items-center border-b border-line pb-4">
        <div className="flex items-center gap-4">
          <img 
            src="https://i.postimg.cc/VN2VBXHV/Whats-App-Image-2026-04-14-at-17-24-23.jpg" 
            alt="NEXA Logo" 
            className="w-12 h-12 rounded-lg object-cover border border-brand/30"
            referrerPolicy="no-referrer"
          />
          <div className="brand">
            <h1 className="text-[28px] font-extrabold tracking-[2px] text-brand uppercase leading-none">NEXA</h1>
            <p className="text-xs text-text-dim mt-1">RH DO FUTURO • Inteligência Artificial • Estratégia</p>
          </div>
        </div>
      </header>

      {/* Hero Section - Updated Branding */}
      <section className="py-8 border-b border-line mb-4">
        <div className="max-w-4xl">
          <h2 className="text-4xl font-display font-bold mb-2 uppercase tracking-tight">
            VOCÊ SABE TRABALHAR COM UMA <span className="text-brand">IA?</span>
          </h2>
          <p className="text-lg text-text-dim mb-6 font-light">
            No futuro, não será humano vs máquina... Será <span className="text-white font-medium">humano + máquina.</span>
          </p>
          <div className="flex flex-wrap gap-4">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-brand">
              <Zap className="w-4 h-4" /> Tome uma decisão
            </div>
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-white/40">
              <ArrowRight className="w-4 h-4" /> Use (ou não) a IA
            </div>
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-white/40">
              <ArrowRight className="w-4 h-4" /> Descubra o impacto disso
            </div>
          </div>
        </div>
      </section>

      {/* Requirements Section */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-surface border border-line p-3 rounded-lg">
          <h3 className="text-[11px] uppercase font-bold text-brand mb-1.5">Designer Gráfico</h3>
          <p className="text-[11px] leading-relaxed text-text-dim">Graduação em Design Gráfico. Mínimo Nota 3.0</p>
        </div>
        <div className="bg-surface border border-line p-3 rounded-lg">
          <h3 className="text-[11px] uppercase font-bold text-brand mb-1.5">Desenvolvedor Web</h3>
          <p className="text-[11px] leading-relaxed text-text-dim">TI, ADS, SI ou Ciência da Comp. Mínimo Nota 2.0</p>
        </div>
        <div className="bg-surface border border-line p-3 rounded-lg">
          <h3 className="text-[11px] uppercase font-bold text-brand mb-1.5">Analista Contábil</h3>
          <p className="text-[11px] leading-relaxed text-text-dim">Bachar. Ciências Contábeis + Registro CRC Ativo</p>
        </div>
      </section>

      {/* Filters & Search */}
      <section className="flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-text-dim" />
          <input 
            type="text" 
            placeholder="Buscar candidato..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-surface border border-line rounded py-2 pl-9 pr-4 text-xs focus:outline-none focus:border-brand transition-colors"
          />
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto">
          <select 
            value={filterPosition}
            onChange={(e) => setFilterPosition(e.target.value)}
            className="bg-surface border border-line rounded text-[11px] px-3 py-2 focus:outline-none cursor-pointer text-text-dim"
          >
            {positions.map(p => <option key={p} value={p} className="bg-surface">{p}</option>)}
          </select>

          <select 
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="bg-surface border border-line rounded text-[11px] px-3 py-2 focus:outline-none cursor-pointer text-text-dim"
          >
            {statuses.map(s => <option key={s} value={s} className="bg-surface">{s}</option>)}
          </select>
          
          <button 
            onClick={() => setDecisionStep('deciding')}
            className="bg-brand text-black px-4 py-2 rounded text-[11px] font-bold uppercase tracking-wider hover:bg-brand-dark transition-colors flex items-center gap-2"
          >
            <UserCheck className="w-3.5 h-3.5" /> Decisão Final
          </button>
        </div>
      </section>

      {/* Table Section */}
      <div className="flex-1 bg-surface border border-line rounded-lg overflow-hidden flex flex-col">
        <div className="grid grid-cols-[2fr_2.5fr_1.5fr_0.8fr_1.5fr] px-4 py-2.5 bg-[#181818] border-b border-line text-[10px] font-bold uppercase text-text-dim tracking-wider">
          <button 
            onClick={() => handleSort('name')}
            className="flex items-center gap-2 hover:text-white transition-colors group text-left"
          >
            Candidato <SortIcon currentKey="name" />
          </button>
          <button 
            onClick={() => handleSort('education')}
            className="flex items-center gap-2 hover:text-white transition-colors group text-left"
          >
            Formação <SortIcon currentKey="education" />
          </button>
          <button 
            onClick={() => handleSort('position')}
            className="flex items-center gap-2 hover:text-white transition-colors group text-left"
          >
            Vaga <SortIcon currentKey="position" />
          </button>
          <div>Nota</div>
          <button 
            onClick={() => handleSort('suggestedStatus')}
            className="flex items-center gap-2 hover:text-white transition-colors group text-left"
          >
            Status <SortIcon currentKey="suggestedStatus" />
          </button>
        </div>
        
        <div className="flex-1 overflow-y-auto">
          <AnimatePresence mode="popLayout">
            {filteredCandidates.map((candidate) => (
              <motion.div 
                key={candidate.id}
                layout
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="grid grid-cols-[2fr_2.5fr_1.5fr_0.8fr_1.5fr] px-4 py-2 border-b border-[#1a1a1a] items-center text-[11px] hover:bg-white/[0.02] transition-colors even:bg-[#0d0d0d]"
              >
                <div className="font-semibold text-white">{candidate.name}</div>
                <div className="text-text-dim truncate pr-4">{candidate.education}</div>
                <div className="text-text-dim flex items-center gap-1.5">
                  {getPositionIcon(candidate.position)}
                  {candidate.position.replace('Designer Gráfico', 'Designer').replace('Desenvolvedor Web', 'Dev Web').replace('Analista Contábil', 'Analista')}
                </div>
                <div className={`font-mono font-bold text-[13px] ${candidate.score >= 4 ? 'text-success' : 'text-white'}`}>
                  {candidate.score.toFixed(1)}
                </div>
                <div>
                  <span className={`status-badge inline-flex items-center gap-1 px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider ${getStatusColor(candidate.suggestedStatus)}`}>
                    {candidate.suggestedStatus}
                  </span>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {filteredCandidates.length === 0 && (
            <div className="py-20 text-center">
              <Search className="w-8 h-8 text-text-dim/20 mx-auto mb-3" />
              <p className="text-text-dim text-xs">Nenhum candidato encontrado</p>
            </div>
          )}
        </div>

        <div className="flex justify-between items-center px-4 py-2.5 text-[10px] text-text-dim bg-[#080808] border-t border-line">
          <span>Mostrando {filteredCandidates.length} de {CANDIDATES.length} candidatos</span>
        </div>
      </div>

      {/* Chatbot Toggle Button */}
      <button 
        onClick={() => setIsChatOpen(!isChatOpen)}
        className={`fixed bottom-6 right-6 w-14 h-14 rounded-full flex items-center justify-center shadow-2xl transition-all z-[100] ${isChatOpen ? 'bg-white text-black rotate-90' : 'bg-brand text-black hover:scale-110'}`}
      >
        {isChatOpen ? <XCircle className="w-6 h-6" /> : <MessageSquare className="w-6 h-6" />}
        {!isChatOpen && (
          <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full border-2 border-bg animate-bounce" />
        )}
      </button>

      {/* Chatbot Window */}
      <AnimatePresence>
        {isChatOpen && (
          <motion.div 
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="fixed bottom-24 right-6 w-96 h-[500px] bg-surface border border-line rounded-2xl shadow-2xl flex flex-col overflow-hidden z-[100]"
          >
            <div className="p-4 border-b border-line bg-white/[0.02] flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full overflow-hidden border border-brand/30">
                  <img 
                    src="https://i.postimg.cc/VN2VBXHV/Whats-App-Image-2026-04-14-at-17-24-23.jpg" 
                    alt="NEXA AI" 
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                </div>
                <div>
                  <h4 className="text-sm font-bold">NEXA AI</h4>
                  <p className="text-[10px] text-brand uppercase tracking-widest font-bold">Online • Analisando Dados</p>
                </div>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.length === 0 && (
                <div className="text-center py-8">
                  <Sparkles className="w-8 h-8 text-brand mx-auto mb-3 opacity-50" />
                  <p className="text-xs text-text-dim px-8">
                    Olá! Sou a IA da NEXA. Posso analisar os candidatos e te dar insights que você talvez não veja.
                    <br/><br/>
                    Pergunte-me algo como:<br/>
                    <span className="text-white">"Quem tem mais potencial?"</span> ou <br/>
                    <span className="text-white">"Quais os riscos do Bruno?"</span>
                  </p>
                </div>
              )}
              {messages.map((msg, i) => (
                <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[85%] p-3 rounded-xl text-xs leading-relaxed ${msg.role === 'user' ? 'bg-brand text-black font-medium' : 'bg-white/5 border border-line text-white/90'}`}>
                    {msg.content}
                  </div>
                </div>
              ))}
              {isTyping && (
                <div className="flex justify-start">
                  <div className="bg-white/5 border border-line p-3 rounded-xl flex gap-1">
                    <div className="w-1 h-1 bg-brand rounded-full animate-bounce" />
                    <div className="w-1 h-1 bg-brand rounded-full animate-bounce [animation-delay:0.2s]" />
                    <div className="w-1 h-1 bg-brand rounded-full animate-bounce [animation-delay:0.4s]" />
                  </div>
                </div>
              )}
              <div ref={chatEndRef} />
            </div>

            <div className="p-4 border-t border-line bg-white/[0.02]">
              <div className="relative">
                <input 
                  type="text" 
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                  placeholder="Pergunte à IA..."
                  className="w-full bg-bg border border-line rounded-lg py-2.5 pl-4 pr-12 text-xs focus:outline-none focus:border-brand"
                />
                <button 
                  onClick={handleSendMessage}
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 text-brand hover:text-white transition-colors"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Decision Modal */}
      <AnimatePresence>
        {decisionStep !== 'browsing' && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/90 backdrop-blur-sm z-[200] flex items-center justify-center p-6"
          >
            <motion.div 
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              className="bg-surface border border-line w-full max-w-2xl rounded-2xl overflow-hidden shadow-2xl"
            >
              {decisionStep === 'deciding' ? (
                <div className="p-8">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-12 h-12 rounded-full bg-brand/20 flex items-center justify-center">
                      <Zap className="w-6 h-6 text-brand" />
                    </div>
                    <div>
                      <h3 className="text-2xl font-display font-bold uppercase tracking-tight">Decisão Final</h3>
                      <p className="text-text-dim text-sm">Selecione o melhor candidato para cada uma das 3 vagas.</p>
                    </div>
                  </div>

                  <div className="space-y-6 max-h-[450px] overflow-y-auto pr-2 custom-scrollbar mb-8">
                    {hiringPositions.map(pos => (
                      <div key={pos} className="space-y-3">
                        <h4 className="text-[10px] uppercase font-bold text-brand tracking-[2px] flex items-center gap-2">
                          {getPositionIcon(pos)} {pos}
                        </h4>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                          {CANDIDATES.filter(c => c.position === pos).map(c => (
                            <button 
                              key={c.id}
                              onClick={() => selectCandidateForPosition(pos, c)}
                              className={`p-3 border rounded-xl text-left transition-all group ${selectedCandidates[pos]?.id === c.id ? 'bg-brand border-brand text-black' : 'bg-white/5 border-line hover:border-brand/50'}`}
                            >
                              <div className={`font-bold text-xs mb-0.5 ${selectedCandidates[pos]?.id === c.id ? 'text-black' : 'text-white group-hover:text-brand'}`}>{c.name}</div>
                              <div className={`text-[9px] uppercase tracking-wider ${selectedCandidates[pos]?.id === c.id ? 'text-black/60' : 'text-text-dim'}`}>Nota: {c.score.toFixed(1)}</div>
                            </button>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="flex justify-between items-center gap-4">
                    <button 
                      onClick={() => setDecisionStep('browsing')}
                      className="text-xs font-bold uppercase tracking-widest text-text-dim hover:text-white"
                    >
                      Cancelar
                    </button>
                    <div className="flex items-center gap-4">
                      <div className="text-[10px] text-brand font-mono uppercase tracking-widest animate-pulse">
                        {hasUsedAI ? "🤖 IA Consultada" : "⚠️ IA Não Consultada"}
                      </div>
                      <button 
                        onClick={handleFinalDecision}
                        disabled={!isDecisionComplete}
                        className={`px-6 py-3 rounded-xl font-bold uppercase tracking-widest text-xs transition-all ${isDecisionComplete ? 'bg-white text-black hover:bg-brand' : 'bg-white/10 text-white/30 cursor-not-allowed'}`}
                      >
                        Confirmar Contratações
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="p-8 text-center">
                  <div className="mb-8">
                    {hasUsedAI ? (
                      <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-success/20 mb-6">
                        <CheckCircle2 className="w-10 h-10 text-success" />
                      </div>
                    ) : (
                      <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-warning/20 mb-6">
                        <XCircle className="w-10 h-10 text-warning" />
                      </div>
                    )}
                    
                    <h3 className="text-3xl font-display font-bold mb-2 uppercase tracking-tight">
                      {hasUsedAI ? "Excelente!" : "Decisão Solitária"}
                    </h3>
                    <p className="text-text-dim text-sm mb-8 max-w-md mx-auto">
                      {hasUsedAI 
                        ? "A combinação entre análise humana e inteligência artificial resultou em uma decisão mais estratégica para a NEXA RH DO FUTURO." 
                        : "Você tomou uma decisão sozinho. A IA poderia ter te ajudado a identificar riscos e oportunidades que passam despercebidos."}
                    </p>

                    <div className="grid grid-cols-1 gap-3 mb-8 text-left">
                      {hiringPositions.map(pos => (
                        <div key={pos} className="bg-white/5 border border-line p-4 rounded-2xl">
                          <div className="text-[9px] text-brand font-mono uppercase tracking-widest mb-1">{pos}</div>
                          <div className="text-base font-bold">{selectedCandidates[pos]?.name}</div>
                        </div>
                      ))}
                    </div>

                    <div className="space-y-4 border-t border-line pt-8">
                      <div className="flex items-center gap-3 justify-center text-brand">
                        <BrainCircuit className="w-5 h-5" />
                        <span className="text-sm font-bold uppercase tracking-widest">Conclusão da IA</span>
                      </div>
                      <p className="text-sm italic text-white/80 leading-relaxed">
                        "A Inteligência Artificial não substitui o ser humano... Ela potencializa suas decisões. No mercado de trabalho do futuro, quem souber usar IA terá vantagem estratégica."
                      </p>
                    </div>
                  </div>

                  <button 
                    onClick={() => {
                      setDecisionStep('browsing');
                      setHasUsedAI(false);
                      setMessages([]);
                      setSelectedCandidates({
                        'Designer Gráfico': null,
                        'Desenvolvedor Web': null,
                        'Analista Contábil': null
                      });
                    }}
                    className="w-full bg-white text-black py-4 rounded-xl font-bold uppercase tracking-widest hover:bg-brand transition-colors"
                  >
                    Reiniciar Simulação
                  </button>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
