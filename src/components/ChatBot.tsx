'use client';

import { useState, useEffect, useRef, FormEvent, ChangeEvent } from 'react';
import { MessageCircle, X, Send, Sparkles } from 'lucide-react';

interface Message {
    id: string;
    role: 'user' | 'assistant';
    content: string;
}

export default function ChatBot() {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const scrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages, isLoading]);

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const userInput = input.trim();
        if (!userInput || isLoading) return;

        const userMessage: Message = {
            id: Date.now().toString(),
            role: 'user',
            content: userInput,
        };

        setMessages(prev => [...prev, userMessage]);
        setInput('');
        setIsLoading(true);

        const assistantId = (Date.now() + 1).toString();
        setMessages(prev => [...prev, {
            id: assistantId,
            role: 'assistant',
            content: '',
        }]);

        try {
            const response = await fetch('/api/chat', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    messages: [...messages, userMessage].map(m => ({
                        role: m.role,
                        content: m.content,
                    })),
                }),
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const reader = response.body?.getReader();
            const decoder = new TextDecoder();
            let assistantContent = '';

            if (reader) {
                while (true) {
                    const { done, value } = await reader.read();
                    if (done) break;

                    const chunk = decoder.decode(value, { stream: true });
                    const lines = chunk.split('\n');

                    for (const line of lines) {
                        if (line.trim() && line.startsWith('0:')) {
                            try {
                                const jsonStr = line.substring(2);
                                const text = JSON.parse(jsonStr);
                                assistantContent += text;

                                setMessages(prev =>
                                    prev.map(m =>
                                        m.id === assistantId
                                            ? { ...m, content: assistantContent }
                                            : m
                                    )
                                );
                            } catch (parseError) {
                                console.error('Parse error:', parseError);
                            }
                        }
                    }
                }
            }

            if (assistantContent === '') {
                setMessages(prev =>
                    prev.map(m =>
                        m.id === assistantId
                            ? { ...m, content: 'Ursäkta, jag kunde inte generera ett svar.' }
                            : m
                    )
                );
            }

        } catch (error) {
            console.error('Error:', error);
            setMessages(prev =>
                prev.map(m =>
                    m.id === assistantId
                        ? { ...m, content: 'Ursäkta, något gick fel. Försök igen.' }
                        : m
                )
            );
        } finally {
            setIsLoading(false);
        }
    };

    const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
        setInput(e.target.value);
    };

    return (
        <div className="fixed bottom-6 right-6 z-[9999] flex flex-col items-end font-sans">
            {isOpen && (
                <div className="mb-4 w-[350px] sm:w-[420px] h-[540px] bg-[#0b1220] rounded-2xl shadow-2xl flex flex-col border border-gray-800 overflow-hidden text-white animate-in fade-in zoom-in-95 duration-200">
                    <div className="p-4 flex items-center justify-between border-b border-gray-800 bg-[#071024]">
                        <div className="flex items-center gap-3">
                            <div className="bg-gradient-to-r from-orange-500 to-red-500 p-2 rounded-lg">
                                <Sparkles className="text-white" size={16} />
                            </div>
                            <div>
                                <h3 className="font-bold text-sm leading-none">Bachata Assistent</h3>
                                <p className="text-[10px] text-gray-400 mt-1">Fuego Dance School</p>
                            </div>
                        </div>
                        <button
                            onClick={() => setIsOpen(false)}
                            className="text-gray-400 hover:text-white transition-colors"
                        >
                            <X size={20} />
                        </button>
                    </div>

                    <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4 bg-[#0b1220]">
                        {messages.length === 0 && (
                            <div className="text-center py-12 px-6">
                                <MessageCircle className="mx-auto text-gray-700 mb-4" size={40} />
                                <p className="text-gray-400 text-sm">
                                    Hej! Undrar du något om våra kurser eller priser? Fråga mig!
                                </p>
                            </div>
                        )}

                        {messages.map((m) => (
                            <div key={m.id} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                                <div className={`p-3 rounded-2xl text-[13px] max-w-[85%] leading-relaxed shadow-sm ${
                                    m.role === 'user'
                                        ? 'bg-gradient-to-br from-orange-500 to-red-600 text-white rounded-tr-none'
                                        : 'bg-gray-800 text-gray-100 rounded-tl-none border border-gray-700'
                                }`}>
                                    {m.content || '...'}
                                </div>
                            </div>
                        ))}

                        {isLoading && (
                            <div className="flex justify-start">
                                <div className="bg-gray-800 p-3 rounded-2xl rounded-tl-none border border-gray-700">
                                    <div className="flex gap-1">
                                        <div className="w-1.5 h-1.5 bg-gray-500 rounded-full animate-bounce"></div>
                                        <div className="w-1.5 h-1.5 bg-gray-500 rounded-full animate-bounce [animation-delay:0.2s]"></div>
                                        <div className="w-1.5 h-1.5 bg-gray-500 rounded-full animate-bounce [animation-delay:0.4s]"></div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    <form onSubmit={handleSubmit} className="p-4 border-t border-gray-800 bg-[#071024] flex gap-2">
                        <input
                            className="flex-1 px-4 py-2 bg-gray-900 border border-gray-700 rounded-full outline-none text-sm focus:ring-2 focus:ring-orange-500 text-white placeholder:text-gray-500"
                            value={input}
                            onChange={handleInputChange}
                            placeholder="Skriv din fråga..."
                            disabled={isLoading}
                        />
                        <button
                            type="submit"
                            disabled={isLoading || !input.trim()}
                            className="bg-orange-500 hover:bg-orange-600 text-white p-2 rounded-full disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg"
                        >
                            <Send size={18} />
                        </button>
                    </form>
                </div>
            )}

            <button
                onClick={() => setIsOpen(!isOpen)}
                className="bg-orange-500 hover:bg-orange-600 text-white w-14 h-14 rounded-full shadow-2xl flex items-center justify-center transition-all hover:scale-110 active:scale-95"
            >
                {isOpen ? <X size={28} /> : <MessageCircle size={28} />}
            </button>
        </div>
    );
}
