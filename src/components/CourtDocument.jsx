import React, { useState, useEffect, useRef, useCallback } from 'react';
import ReactMarkdown from 'react-markdown';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { COURT_DOCUMENT_MASTER_PROMPT } from '../constants/courtDocumentPrompt';
import { backend_URL } from './HomePage';
import '../styles/CourtDocument.css';

const QUICK_NUMBERS = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10'];

const CourtDocument = () => {
  const navigate = useNavigate();
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [sessionStarted, setSessionStarted] = useState(false);
  const [copyToast, setCopyToast] = useState('');

  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  const conversationRef = useRef([]);

  const getTimestamp = () =>
    new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  const scrollToBottom = useCallback(() => {
    setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 60);
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  useEffect(() => {
    if (sessionStarted && !isLoading) {
      inputRef.current?.focus();
    }
  }, [sessionStarted, isLoading]);

  const callChatAPI = async (history) => {
    const response = await axios.post(
      `${backend_URL}/api/chat`,
      { messages: history },
      { timeout: 180000 }
    );
    return response.data.text;
  };

  const startNewSession = useCallback(async () => {
    setMessages([]);
    conversationRef.current = [];
    setSessionStarted(true);
    setIsLoading(true);

    const initMessage = {
      role: 'user',
      content: COURT_DOCUMENT_MASTER_PROMPT +
        '\n\nBegin now. Ask Q.1 only. No greeting. No explanation. No summary of this prompt. Go directly to Q.1.'
    };

    conversationRef.current = [initMessage];

    setMessages([
      {
        id: Date.now(),
        role: 'assistant',
        content: '',
        timestamp: getTimestamp(),
        loading: true
      }
    ]);

    try {
      const aiText = await callChatAPI(conversationRef.current);
      conversationRef.current.push({ role: 'model', content: aiText });

      setMessages([
        {
          id: Date.now(),
          role: 'assistant',
          content: aiText,
          timestamp: getTimestamp()
        }
      ]);
    } catch (err) {
      console.error('Session init error:', err);
      setMessages([
        {
          id: Date.now(),
          role: 'assistant',
          content:
            'Failed to connect to the drafting assistant. Please check your connection and try starting a new session.',
          timestamp: getTimestamp(),
          isError: true
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const sendMessage = async (text) => {
    const content = text.trim();
    if (!content || isLoading) return;

    setInputValue('');

    const userMsg = {
      id: Date.now(),
      role: 'user',
      content,
      timestamp: getTimestamp()
    };

    setMessages((prev) => [...prev, userMsg]);
    conversationRef.current.push({ role: 'user', content });

    setIsLoading(true);

    const loadingId = Date.now() + 1;
    setMessages((prev) => [
      ...prev,
      { id: loadingId, role: 'assistant', content: '', timestamp: getTimestamp(), loading: true }
    ]);

    try {
      const aiText = await callChatAPI(conversationRef.current);
      conversationRef.current.push({ role: 'model', content: aiText });

      setMessages((prev) =>
        prev
          .filter((m) => m.id !== loadingId)
          .concat({
            id: Date.now(),
            role: 'assistant',
            content: aiText,
            timestamp: getTimestamp()
          })
      );
    } catch (err) {
      console.error('Send error:', err);
      conversationRef.current.pop();
      setMessages((prev) =>
        prev
          .filter((m) => m.id !== loadingId)
          .concat({
            id: Date.now(),
            role: 'assistant',
            content: 'Error receiving response. Please try again.',
            timestamp: getTimestamp(),
            isError: true
          })
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    sendMessage(inputValue);
  };

  const handleQuickAction = (text) => {
    sendMessage(text);
  };

  const handleCopy = async (content) => {
    try {
      await navigator.clipboard.writeText(content);
      setCopyToast('Copied to clipboard!');
    } catch {
      setCopyToast('Copy failed — please copy manually.');
    }
    setTimeout(() => setCopyToast(''), 2500);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage(inputValue);
    }
  };

  if (!sessionStarted) {
    return (
      <div className="court-document-page">
        <div className="cd-header">
          <div className="cd-header-left">
            <button className="cd-back-btn" onClick={() => navigate(-1)} title="Go back">
              ←
            </button>
            <div className="cd-header-icon">⚖</div>
            <div className="cd-header-text">
              <h1 className="cd-title">Senior Drafting Assistant</h1>
              <p className="cd-subtitle">
                Court Document Generator | v4.1 | Anti-Hallucination Mode
              </p>
            </div>
          </div>
          <div className="cd-header-right">
            <span className="cd-badge cd-badge-green">🛡 Zero-Tolerance Citation</span>
          </div>
        </div>

        <div className="cd-welcome">
          <div className="cd-welcome-icon">⚖</div>
          <h2 className="cd-welcome-title">Senior Drafting &amp; Research Assistant</h2>
          <p className="cd-welcome-subtitle">
            AI-powered court document generator for Advocates practicing in India. Covers Supreme
            Court, High Court, District Court, NCLT, Consumer Forum, Family Court, Arbitration
            and Pre-Litigation notices — with Three-Tier Citation Protocol and Zero-Tolerance
            Anti-Hallucination mode.
          </p>
          <div className="cd-welcome-features">
            <span className="cd-feature-chip">⚖ All Indian Courts</span>
          
          </div>
          <button className="cd-start-btn" onClick={startNewSession}>
            ▶ Start Drafting Session
          </button>
          <p style={{ fontSize: '0.72rem', color: 'var(--muted-color)', margin: 0 }}>
            The assistant will ask questions one-by-one and generate a complete court-ready document.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="court-document-page">
      {/* ── Header ─────────────────────────────────────── */}
      <div className="cd-header">
        <div className="cd-header-left">
          <button className="cd-back-btn" onClick={() => navigate(-1)} title="Go back">
            ←
          </button>
          <div className="cd-header-icon">⚖</div>
          <div className="cd-header-text">
            <h1 className="cd-title">Senior Drafting Assistant</h1>
            <p className="cd-subtitle">
              Court Document Generator | v4.1 | Anti-Hallucination Mode
            </p>
          </div>
        </div>
        <div className="cd-header-right">
          <span className="cd-badge cd-badge-green">🛡 Zero-Tolerance Citation</span>
          <button
            className="cd-btn-secondary"
            onClick={startNewSession}
            disabled={isLoading}
            title="Start a new drafting session"
          >
            🔄 New Session
          </button>
        </div>
      </div>

      {/* ── Messages ───────────────────────────────────── */}
      <div className="cd-messages-container">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`cd-message ${msg.role === 'user' ? 'cd-message-user' : 'cd-message-ai'} ${
              msg.isError ? 'cd-message-error' : ''
            }`}
          >
            {msg.role === 'assistant' && (
              <div className="cd-avatar cd-avatar-ai">⚖</div>
            )}

            <div className="cd-message-body">
              <div className="cd-message-bubble">
                {msg.loading ? (
                  <div className="cd-typing">
                    <span />
                    <span />
                    <span />
                  </div>
                ) : msg.role === 'assistant' ? (
                  <div className="cd-markdown">
                    <ReactMarkdown>{msg.content}</ReactMarkdown>
                  </div>
                ) : (
                  <div style={{ fontSize: '0.875rem', lineHeight: '1.5' }}>
                    {msg.content}
                  </div>
                )}
              </div>

              {!msg.loading && (
                <div className="cd-message-footer">
                  <span className="cd-timestamp">{msg.timestamp}</span>
                  {msg.role === 'assistant' && (
                    <button
                      className="cd-btn-copy"
                      onClick={() => handleCopy(msg.content)}
                      title="Copy this response"
                    >
                      📋 Copy
                    </button>
                  )}
                </div>
              )}
            </div>

            {msg.role === 'user' && (
              <div className="cd-avatar cd-avatar-user">👤</div>
            )}
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* ── Quick Actions ──────────────────────────────── */}
      <div className="cd-quick-actions">
        <span className="cd-quick-label">Quick:</span>
        {QUICK_NUMBERS.map((n) => (
          <button
            key={n}
            className="cd-quick-btn"
            onClick={() => handleQuickAction(n)}
            disabled={isLoading}
            title={`Send "${n}"`}
          >
            {n}
          </button>
        ))}
        <span className="cd-quick-separator">|</span>
        <button
          className="cd-quick-btn cd-quick-confirm"
          onClick={() => handleQuickAction('CONFIRM')}
          disabled={isLoading}
          title="Confirm and begin drafting"
        >
          ✓ CONFIRM
        </button>
        <button
          className="cd-quick-btn cd-quick-skip"
          onClick={() => handleQuickAction('SKIP')}
          disabled={isLoading}
          title="Skip this question"
        >
          ⏭ SKIP
        </button>
      </div>

      {/* ── Input Area ─────────────────────────────────── */}
      <div className="cd-input-area">
        <form className="cd-input-form" onSubmit={handleSubmit}>
          <input
            ref={inputRef}
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder='Type your answer… (e.g. "2" for High Court, CONFIRM to draft, SKIP to proceed, CORRECT [field] to revise)'
            className="cd-input"
            disabled={isLoading}
            autoComplete="off"
          />
          <button
            type="submit"
            className="cd-send-btn"
            disabled={isLoading || !inputValue.trim()}
            title="Send"
          >
            {isLoading ? (
              <span style={{ fontSize: '0.75rem' }}>…</span>
            ) : (
              <span>➤</span>
            )}
          </button>
        </form>
        <div className="cd-input-hint">
          Type a number to select, CONFIRM to draft, SKIP to skip, CORRECT [field name] to revise a
          detail, REGENERATE to regenerate the last document.
        </div>
      </div>

      {/* ── Copy Toast ─────────────────────────────────── */}
      {copyToast && <div className="cd-copy-toast">{copyToast}</div>}
    </div>
  );
};

export default CourtDocument;
