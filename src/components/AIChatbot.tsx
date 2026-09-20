import { useEffect, useState } from 'react';
import type { FormEvent } from 'react';
import { useLocation } from 'react-router-dom';

type ChatMessage = {
    content: string;
    role: 'assistant' | 'user';
};

const STARTER_PROMPTS = [
    'Which piece would suit my space?',
    'How does local pickup work?',
    'I have a question about a commission.'
];

export default function AIChatbot() {
    const { pathname } = useLocation();
    const isHomePage = pathname === '/' || pathname === '/home';
    const [isAvailable, setIsAvailable] = useState(!isHomePage);
    const [isOpen, setIsOpen] = useState(false);
    const [draft, setDraft] = useState('');
    const [messages, setMessages] = useState<ChatMessage[]>([]);

    useEffect(() => {
        if (!isHomePage) {
            return;
        }

        const hero = document.getElementById('video-showcase');

        if (!hero) {
            return;
        }

        const observer = new IntersectionObserver(
            ([entry]) => {
                const available = !entry.isIntersecting;
                setIsAvailable(available);

                if (!available) {
                    setIsOpen(false);
                }
            },
            { threshold: 0 }
        );

        observer.observe(hero);

        return () => observer.disconnect();
    }, [isHomePage]);

    const submitMessage = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const content = draft.trim();

        if (!content) {
            return;
        }

        setMessages((currentMessages) => [...currentMessages, { content, role: 'user' }]);
        setDraft('');
    };

    if (isHomePage && !isAvailable) {
        return null;
    }

    return (
        <div className="ai-chatbot">
            {isOpen && (
                <section className="ai-chatbot-panel" aria-label="AI assistant chat">
                    <div className="ai-chatbot-header">
                        <div className="flex items-center gap-3">
                            <span className="ai-chatbot-sparkle" aria-hidden="true">✦</span>
                            <h2 className="display text-base">AI assistant</h2>
                        </div>

                        <button
                            type="button"
                            className="ai-chatbot-close"
                            onClick={() => setIsOpen(false)}
                            aria-label="Close AI assistant"
                        >
                            <span aria-hidden="true">×</span>
                        </button>
                    </div>

                    <div className="ai-chatbot-messages" aria-live="polite">
                        <div className="ai-chatbot-welcome">
                            <p className="display display-md">How can I help?</p>
                            <p className="text-sm leading-relaxed text-stone-600">
                                Ask about a piece, a custom commission, or anything else about WoodWork Creations.
                            </p>
                        </div>

                        {messages.map((message, index) => (
                            <p key={`${message.role}-${index}`} className={`ai-chatbot-message ai-chatbot-message-${message.role}`}>
                                {message.content}
                            </p>
                        ))}

                        {messages.length === 0 && (
                            <div className="ai-chatbot-prompts">
                                {STARTER_PROMPTS.map((prompt) => (
                                    <button
                                        type="button"
                                        key={prompt}
                                        className="ai-chatbot-prompt"
                                        onClick={() => setDraft(prompt)}
                                    >
                                        {prompt}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    <form className="ai-chatbot-form" onSubmit={submitMessage}>
                        <label className="sr-only" htmlFor="ai-chatbot-input">Message the AI assistant</label>
                        <input
                            id="ai-chatbot-input"
                            value={draft}
                            onChange={(event) => setDraft(event.target.value)}
                            className="ai-chatbot-input"
                            placeholder="Send a message"
                            autoComplete="off"
                        />
                        <button type="submit" className="ai-chatbot-send" aria-label="Send message">
                            <svg viewBox="0 0 24 24" aria-hidden="true">
                                <path d="m4 4 16 8-16 8 3-8-3-8Z" />
                                <path d="M7 12h13" />
                            </svg>
                        </button>
                    </form>
                </section>
            )}

            <button
                type="button"
                className={`ai-chatbot-toggle ${isOpen ? 'ai-chatbot-toggle-open' : ''}`}
                onClick={() => setIsOpen((open) => !open)}
                aria-label={isOpen ? 'Close AI assistant' : 'Open AI assistant'}
                aria-expanded={isOpen}
            >
                {isOpen ? '×' : '✦'}
            </button>
        </div>
    );
}
