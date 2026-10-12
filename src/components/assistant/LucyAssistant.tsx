import React, { useState, useRef, useEffect } from 'react';
import {
  MessageSquare,
  X,
  Minimize2,
  Maximize2,
  Send,
  Sparkles,
  Bot,
  User,
  ArrowRight,
  RefreshCw,
  Trash2,
  Check,
  Search,
  ExternalLink,
  ShieldCheck,
  Star,
  Compass,
  FileText,
  Briefcase,
  Grid,
  Settings,
  HelpCircle,
} from 'lucide-react';
import { Creator, AssistantMessage, AssistantAction, NavTab } from '../../types';
import { LucyAssistantService } from '../../services/lucyAssistant';

interface LucyAssistantProps {
  currentTab: NavTab;
  creators: Creator[];
  shortlistIds: string[];
  onNavigate: (tab: NavTab) => void;
  onOpenCreateBrief: () => void;
  onOpenAIBriefBuilder: () => void;
  onOpenNewEngagement: (creatorId?: string) => void;
  onViewCreator: (creator: Creator) => void;
  onToggleShortlist: (creatorId: string) => void;
  onContactCreator?: (creator: Creator) => void;
  onFilterCreatorsSpecialization?: (specialization: string) => void;
}

const INITIAL_WELCOME_MESSAGE: AssistantMessage = {
  id: 'lucy-welcome-1',
  sender: 'assistant',
  text: `👋 **Hi! I'm Lucy**, your AI talent and campaign advisor at CreatorConnect AI.\n\nI can help you discover verified AI creators, craft production-ready briefs, explore generative portfolios, and manage your end-to-end campaigns.\n\nWhat would you like to explore today?`,
  timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
  mode: 'demo_local',
  actions: [
    { id: 'act-w-find', label: 'Find Creators', actionType: 'navigate', targetTab: 'discover' },
    { id: 'act-w-brief', label: 'Build AI Brief', actionType: 'open_ai_brief_builder', targetTab: 'ai-builder' },
    { id: 'act-w-port', label: 'View Portfolio', actionType: 'navigate', targetTab: 'portfolio' },
    { id: 'act-w-camp', label: 'Create Campaign', actionType: 'open_new_engagement' },
  ],
  suggestedPrompts: [
    'Find creators in Video & Animation',
    'How do I build an AI campaign brief?',
    'Who specializes in ComfyUI product photos?',
    'Explain creator verification signals',
  ],
};

export const LucyAssistant: React.FC<LucyAssistantProps> = ({
  currentTab,
  creators,
  shortlistIds,
  onNavigate,
  onOpenCreateBrief,
  onOpenAIBriefBuilder,
  onOpenNewEngagement,
  onViewCreator,
  onToggleShortlist,
  onContactCreator,
  onFilterCreatorsSpecialization,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState<AssistantMessage[]>([INITIAL_WELCOME_MESSAGE]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [activeMode, setActiveMode] = useState<'gemini_api' | 'demo_local'>('demo_local');

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto scroll to bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen && !isMinimized) {
      scrollToBottom();
      inputRef.current?.focus();
    }
  }, [messages, isOpen, isMinimized]);

  // Handle ESC key to close/minimize
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        if (!isMinimized) {
          setIsMinimized(true);
        } else {
          setIsOpen(false);
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, isMinimized]);

  const handleSendMessage = async (customText?: string) => {
    const textToSend = customText || inputValue;
    if (!textToSend.trim() || isLoading) return;

    const userMsg: AssistantMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: textToSend.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!customText) setInputValue('');
    setIsLoading(true);
    setErrorMessage(null);

    try {
      const response = await LucyAssistantService.sendMessage(
        textToSend.trim(),
        [...messages, userMsg],
        currentTab,
        creators
      );

      setActiveMode(response.mode);

      const botMsg: AssistantMessage = {
        id: `assistant-${Date.now()}`,
        sender: 'assistant',
        text: response.text,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        mode: response.mode,
        actions: response.actions,
        suggestedPrompts: response.suggestedPrompts,
        recommendedCreators: response.recommendedCreators,
      };

      setMessages((prev) => [...prev, botMsg]);
    } catch (err: any) {
      console.error('Error in Lucy assistant:', err);
      setErrorMessage('Unable to get response. Switched to local assistant.');
      // Add safe local fallback message
      const fallback = LucyAssistantService.generateLocalResponse(
        textToSend.toLowerCase(),
        textToSend,
        currentTab,
        creators
      );
      const botMsg: AssistantMessage = {
        id: `assistant-${Date.now()}`,
        sender: 'assistant',
        text: fallback.text,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        mode: 'demo_local',
        actions: fallback.actions,
        suggestedPrompts: fallback.suggestedPrompts,
        recommendedCreators: fallback.recommendedCreators,
      };
      setMessages((prev) => [...prev, botMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleActionClick = (action: AssistantAction) => {
    switch (action.actionType) {
      case 'navigate':
        if (action.targetTab) {
          onNavigate(action.targetTab as NavTab);
        }
        break;
      case 'open_ai_brief_builder':
        onNavigate('ai-builder');
        break;
      case 'open_create_brief':
        onOpenCreateBrief();
        break;
      case 'open_new_engagement':
        onOpenNewEngagement(action.creatorId);
        break;
      case 'view_creator':
        if (action.creatorId) {
          const found = creators.find((c) => c.id === action.creatorId);
          if (found) {
            onViewCreator(found);
          } else {
            onNavigate('discover');
          }
        }
        break;
      case 'filter_creators':
        if (action.specialization && onFilterCreatorsSpecialization) {
          onFilterCreatorsSpecialization(action.specialization);
        }
        onNavigate('discover');
        break;
      case 'view_portfolio':
        onNavigate('portfolio');
        break;
      case 'help_guide':
        onNavigate('settings');
        break;
      default:
        if (action.targetTab) onNavigate(action.targetTab as NavTab);
        break;
    }
  };

  const handleClearHistory = () => {
    setMessages([INITIAL_WELCOME_MESSAGE]);
    setErrorMessage(null);
  };

  const renderFormattedText = (rawText: string) => {
    // Process markdown-like bold, headers, and bullet lists safely
    const lines = rawText.split('\n');
    return (
      <div className="space-y-1.5 text-xs text-slate-800 leading-relaxed">
        {lines.map((line, idx) => {
          const trimmed = line.trim();
          if (!trimmed) return <div key={idx} className="h-1" />;

          if (trimmed.startsWith('### ')) {
            return (
              <h4 key={idx} className="text-xs font-bold text-slate-900 mt-2 mb-1 flex items-center gap-1.5">
                <Sparkles className="w-3 h-3 text-indigo-600 shrink-0" />
                <span>{trimmed.replace('### ', '')}</span>
              </h4>
            );
          }

          if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
            const content = trimmed.substring(2);
            return (
              <div key={idx} className="flex items-start gap-1.5 pl-1 my-0.5">
                <span className="text-indigo-500 font-bold mt-0.5 text-[10px]">·</span>
                <span dangerouslySetInnerHTML={{ __html: formatInlineMarkdown(content) }} />
              </div>
            );
          }

          if (/^\d+\.\s/.test(trimmed)) {
            const num = trimmed.match(/^\d+\./)?.[0] || '1.';
            const content = trimmed.replace(/^\d+\.\s*/, '');
            return (
              <div key={idx} className="flex items-start gap-1.5 pl-1 my-0.5">
                <span className="font-semibold text-indigo-600 text-[11px] shrink-0">{num}</span>
                <span dangerouslySetInnerHTML={{ __html: formatInlineMarkdown(content) }} />
              </div>
            );
          }

          if (trimmed.startsWith('*') && trimmed.endsWith('*') && !trimmed.startsWith('**')) {
            return (
              <p key={idx} className="text-[11px] text-slate-500 italic mt-1">
                {trimmed.replace(/^\*|\*$/g, '')}
              </p>
            );
          }

          return (
            <p key={idx} dangerouslySetInnerHTML={{ __html: formatInlineMarkdown(trimmed) }} />
          );
        })}
      </div>
    );
  };

  const formatInlineMarkdown = (text: string) => {
    // Replace **bold** with <strong>
    let res = text.replace(/\*\*(.*?)\*\*/g, '<strong class="font-semibold text-slate-900">$1</strong>');
    // Replace *italic* with <em>
    res = res.replace(/(?<!\*)\*(?!\*)(.*?)(?<!\*)\*(?!\*)/g, '<em class="italic text-slate-600">$1</em>');
    // Replace `code` with styled span
    res = res.replace(/`([^`]+)`/g, '<code class="px-1 py-0.5 bg-slate-100 rounded text-slate-800 font-mono text-[11px]">$1</code>');
    return res;
  };

  return (
    <>
      {/* Floating Action Trigger Button (Bottom-Right) */}
      {!isOpen && (
        <div className="fixed bottom-6 right-6 z-40 group">
          <button
            onClick={() => {
              setIsOpen(true);
              setIsMinimized(false);
            }}
            aria-label="Open Lucy AI Assistant"
            className="flex items-center gap-2.5 px-4 py-3 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 text-white rounded-full shadow-lg hover:shadow-indigo-500/25 transition-all duration-200 transform hover:scale-105 active:scale-95 focus:outline-hidden focus:ring-2 focus:ring-indigo-400 focus:ring-offset-2"
          >
            {/* Lucy Avatar with Online Ping */}
            <div className="relative">
              <div className="w-8 h-8 rounded-full bg-white/20 backdrop-blur-xs flex items-center justify-center font-bold text-xs border border-white/30 text-white shadow-inner">
                <Sparkles className="w-4 h-4 text-amber-300 animate-pulse" />
              </div>
              <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-400 border-2 border-indigo-600 rounded-full" />
            </div>

            <div className="text-left hidden sm:block">
              <span className="block text-xs font-bold leading-tight flex items-center gap-1">
                Ask Lucy <span className="text-[10px] bg-white/20 px-1.5 py-0.2 rounded-full font-mono uppercase tracking-wider">AI</span>
              </span>
              <span className="block text-[10px] text-indigo-100 font-normal">Talent & Campaign Advisor</span>
            </div>
          </button>
        </div>
      )}

      {/* Minimized Dock Bar */}
      {isOpen && isMinimized && (
        <div className="fixed bottom-6 right-6 z-40">
          <div className="bg-slate-900 border border-slate-700 text-white px-4 py-2.5 rounded-full shadow-xl flex items-center gap-3">
            <div className="flex items-center gap-2 cursor-pointer" onClick={() => setIsMinimized(false)}>
              <div className="w-6 h-6 rounded-full bg-indigo-600 flex items-center justify-center text-xs font-bold">
                <Sparkles className="w-3 h-3 text-amber-300" />
              </div>
              <span className="text-xs font-medium">Lucy Assistant (Minimized)</span>
            </div>
            <div className="flex items-center gap-1 border-l border-slate-700 pl-2">
              <button
                onClick={() => setIsMinimized(false)}
                title="Expand Assistant"
                className="p-1 text-slate-400 hover:text-white rounded"
              >
                <Maximize2 className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setIsOpen(false)}
                title="Close Assistant"
                className="p-1 text-slate-400 hover:text-white rounded"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Full Lucy Chat Panel */}
      {isOpen && !isMinimized && (
        <div
          role="dialog"
          aria-label="Lucy AI Assistant Chat"
          className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50 w-[calc(100vw-2rem)] sm:w-[410px] h-[580px] max-h-[85vh] bg-white rounded-2xl shadow-2xl border border-slate-200/90 flex flex-col overflow-hidden transition-all duration-200 animate-in fade-in slide-in-from-bottom-4"
        >
          {/* Header */}
          <div className="px-4 py-3 bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white border-b border-slate-800 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-2.5">
              <div className="relative">
                <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-indigo-500 to-violet-500 flex items-center justify-center font-bold text-xs shadow-inner">
                  <Sparkles className="w-4 h-4 text-amber-300" />
                </div>
                <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-400 border-2 border-slate-900 rounded-full" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-bold text-white tracking-tight">Lucy</span>
                  <span className="text-[10px] px-1.5 py-0.2 rounded bg-indigo-500/30 text-indigo-300 border border-indigo-400/30 font-mono font-medium">
                    AI Advisor
                  </span>
                </div>
                <span className="text-[10px] text-slate-400 block -mt-0.5">
                  {activeMode === 'gemini_api' ? 'Gemini 3.8 Flash' : 'Simulated Assistant'} · Online
                </span>
              </div>
            </div>

            {/* Window Controls */}
            <div className="flex items-center gap-1">
              <button
                onClick={handleClearHistory}
                title="Clear Conversation"
                className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-white/10 transition-colors"
                aria-label="Clear chat history"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setIsMinimized(true)}
                title="Minimize Panel"
                className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-white/10 transition-colors"
                aria-label="Minimize assistant"
              >
                <Minimize2 className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setIsOpen(false)}
                title="Close Assistant"
                className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-white/10 transition-colors"
                aria-label="Close assistant"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Quick Solutions Bar */}
          <div className="bg-slate-50/90 border-b border-slate-200/80 px-3 py-2 flex items-center gap-1.5 overflow-x-auto shrink-0 scrollbar-none">
            <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider shrink-0 pl-1">
              Quick:
            </span>
            <button
              onClick={() => onNavigate('discover')}
              className="px-2 py-1 text-[11px] font-medium text-slate-700 bg-white hover:bg-slate-100 rounded-md border border-slate-200 shadow-2xs whitespace-nowrap flex items-center gap-1"
            >
              <Compass className="w-3 h-3 text-indigo-600" />
              <span>Find Creators</span>
            </button>
            <button
              onClick={() => onOpenNewEngagement()}
              className="px-2 py-1 text-[11px] font-medium text-slate-700 bg-white hover:bg-slate-100 rounded-md border border-slate-200 shadow-2xs whitespace-nowrap flex items-center gap-1"
            >
              <Briefcase className="w-3 h-3 text-emerald-600" />
              <span>Create Campaign</span>
            </button>
            <button
              onClick={() => onNavigate('ai-builder')}
              className="px-2 py-1 text-[11px] font-medium text-slate-700 bg-white hover:bg-slate-100 rounded-md border border-slate-200 shadow-2xs whitespace-nowrap flex items-center gap-1"
            >
              <FileText className="w-3 h-3 text-violet-600" />
              <span>Build AI Brief</span>
            </button>
            <button
              onClick={() => onNavigate('portfolio')}
              className="px-2 py-1 text-[11px] font-medium text-slate-700 bg-white hover:bg-slate-100 rounded-md border border-slate-200 shadow-2xs whitespace-nowrap flex items-center gap-1"
            >
              <Grid className="w-3 h-3 text-blue-600" />
              <span>View Portfolio</span>
            </button>
            <button
              onClick={() => onNavigate('settings')}
              className="px-2 py-1 text-[11px] font-medium text-slate-700 bg-white hover:bg-slate-100 rounded-md border border-slate-200 shadow-2xs whitespace-nowrap flex items-center gap-1"
            >
              <Settings className="w-3 h-3 text-slate-600" />
              <span>Workspace</span>
            </button>
            <button
              onClick={() => handleSendMessage('How does CreatorConnect AI work?')}
              className="px-2 py-1 text-[11px] font-medium text-slate-700 bg-white hover:bg-slate-100 rounded-md border border-slate-200 shadow-2xs whitespace-nowrap flex items-center gap-1"
            >
              <HelpCircle className="w-3 h-3 text-amber-600" />
              <span>Help</span>
            </button>
          </div>

          {/* Conversation Stream */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50/40">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex gap-2.5 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {/* Assistant Avatar */}
                {msg.sender === 'assistant' && (
                  <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-indigo-600 to-violet-600 text-white flex items-center justify-center shrink-0 mt-0.5 shadow-xs">
                    <Sparkles className="w-3.5 h-3.5 text-amber-200" />
                  </div>
                )}

                <div className={`max-w-[85%] space-y-2 ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}>
                  {/* Message Bubble */}
                  <div
                    className={`p-3 rounded-2xl ${
                      msg.sender === 'user'
                        ? 'bg-indigo-600 text-white rounded-tr-xs shadow-xs text-xs'
                        : 'bg-white text-slate-800 rounded-tl-xs border border-slate-200 shadow-xs'
                    }`}
                  >
                    {msg.sender === 'user' ? (
                      <p className="whitespace-pre-wrap">{msg.text}</p>
                    ) : (
                      renderFormattedText(msg.text)
                    )}

                    {/* Timestamp & Mode Footer */}
                    <div
                      className={`text-[9px] mt-1.5 flex items-center justify-between gap-2 ${
                        msg.sender === 'user' ? 'text-indigo-200' : 'text-slate-400'
                      }`}
                    >
                      <span>{msg.timestamp}</span>
                      {msg.sender === 'assistant' && (
                        <span className="font-mono text-[9px]">
                          {msg.mode === 'gemini_api' ? '⚡ Gemini' : '🤖 Knowledge Engine'}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Interactive Action Buttons */}
                  {msg.actions && msg.actions.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {msg.actions.map((action) => (
                        <button
                          key={action.id}
                          onClick={() => handleActionClick(action)}
                          className="px-2.5 py-1.5 text-xs font-medium text-indigo-700 bg-indigo-50 hover:bg-indigo-100 hover:text-indigo-900 border border-indigo-200 rounded-lg flex items-center gap-1 transition-all shadow-2xs"
                        >
                          <span>{action.label}</span>
                          <ArrowRight className="w-3 h-3 text-indigo-500" />
                        </button>
                      ))}
                    </div>
                  )}

                  {/* Recommended Creator Cards */}
                  {msg.recommendedCreators && msg.recommendedCreators.length > 0 && (
                    <div className="space-y-2 pt-1">
                      {msg.recommendedCreators.map((creator) => (
                        <div
                          key={creator.id}
                          className="p-2.5 bg-white border border-slate-200 rounded-xl shadow-2xs flex items-center justify-between gap-3 hover:border-indigo-300 transition-colors"
                        >
                          <div className="flex items-center gap-2.5 min-w-0">
                            {creator.avatarUrl ? (
                              <img
                                src={creator.avatarUrl}
                                alt={creator.name}
                                className="w-9 h-9 rounded-lg object-cover shrink-0 border border-slate-200"
                                onError={(e) => {
                                  (e.currentTarget as HTMLImageElement).style.display = 'none';
                                }}
                              />
                            ) : (
                              <div
                                className={`w-9 h-9 rounded-lg ${creator.avatarBg} flex items-center justify-center font-bold text-xs shrink-0`}
                              >
                                {creator.avatarInitials}
                              </div>
                            )}
                            <div className="min-w-0">
                              <h5 className="text-xs font-bold text-slate-900 truncate">
                                {creator.name}
                              </h5>
                              <p className="text-[11px] text-slate-500 truncate">
                                {creator.specialization} · {creator.rateRange.split('/')[0]}
                              </p>
                            </div>
                          </div>

                          <div className="flex items-center gap-1 shrink-0">
                            <button
                              onClick={() => onViewCreator(creator)}
                              className="px-2 py-1 text-[11px] font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-md"
                            >
                              Profile
                            </button>
                            <button
                              onClick={() => onToggleShortlist(creator.id)}
                              className={`p-1 rounded-md text-xs ${
                                shortlistIds.includes(creator.id)
                                  ? 'bg-amber-100 text-amber-700'
                                  : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
                              }`}
                              title={shortlistIds.includes(creator.id) ? 'Shortlisted' : 'Add to Shortlist'}
                            >
                              <Star
                                className={`w-3.5 h-3.5 ${
                                  shortlistIds.includes(creator.id) ? 'fill-amber-500 text-amber-500' : ''
                                }`}
                              />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Suggested Follow-up Queries */}
                  {msg.suggestedPrompts && msg.suggestedPrompts.length > 0 && (
                    <div className="space-y-1 pt-1">
                      <span className="text-[10px] text-slate-400 font-medium block">
                        Suggestions:
                      </span>
                      <div className="flex flex-wrap gap-1">
                        {msg.suggestedPrompts.map((prompt, pIdx) => (
                          <button
                            key={pIdx}
                            onClick={() => handleSendMessage(prompt)}
                            className="px-2 py-1 text-[11px] text-slate-600 bg-white hover:bg-indigo-50 hover:text-indigo-700 border border-slate-200 rounded-md text-left transition-colors"
                          >
                            {prompt}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* User Avatar */}
                {msg.sender === 'user' && (
                  <div className="w-7 h-7 rounded-full bg-slate-800 text-white flex items-center justify-center shrink-0 mt-0.5 text-xs font-semibold">
                    <User className="w-3.5 h-3.5 text-slate-300" />
                  </div>
                )}
              </div>
            ))}

            {/* Loading Indicator */}
            {isLoading && (
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-indigo-600 to-violet-600 text-white flex items-center justify-center shrink-0">
                  <Sparkles className="w-3.5 h-3.5 text-amber-200" />
                </div>
                <div className="p-3 bg-white border border-slate-200 rounded-2xl rounded-tl-xs shadow-xs flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 bg-indigo-600 rounded-full animate-bounce [animation-delay:-0.3s]" />
                  <span className="w-1.5 h-1.5 bg-indigo-600 rounded-full animate-bounce [animation-delay:-0.15s]" />
                  <span className="w-1.5 h-1.5 bg-indigo-600 rounded-full animate-bounce" />
                  <span className="text-[11px] text-slate-500 font-medium ml-1.5">Lucy is thinking...</span>
                </div>
              </div>
            )}

            {/* Error Message */}
            {errorMessage && (
              <div className="p-2.5 bg-rose-50 border border-rose-200 rounded-xl text-rose-700 text-xs flex items-center justify-between">
                <span>{errorMessage}</span>
                <button
                  onClick={() => handleSendMessage(inputValue)}
                  className="text-xs font-semibold underline hover:text-rose-900"
                >
                  Retry
                </button>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input Footer */}
          <div className="p-3 bg-white border-t border-slate-200 shrink-0">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage();
              }}
              className="flex items-center gap-2"
            >
              <input
                ref={inputRef}
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Ask Lucy anything about creators, briefs, or navigation..."
                disabled={isLoading}
                className="flex-1 px-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-hidden focus:bg-white focus:border-indigo-500 transition-colors disabled:opacity-60"
              />
              <button
                type="submit"
                disabled={!inputValue.trim() || isLoading}
                aria-label="Send message to Lucy"
                className="p-2 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-40 text-white rounded-xl transition-colors shadow-xs shrink-0 flex items-center justify-center"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
            <div className="mt-1.5 flex items-center justify-between text-[10px] text-slate-400 px-1">
              <span>Press Enter to send · Shift+Enter for new line</span>
              <span className="text-slate-400">Esc to minimize</span>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
