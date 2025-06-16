"use client";

import React, { useState, useRef, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { materialDark } from "react-syntax-highlighter/dist/esm/styles/prism";
import {
  Loader2,
  Sparkles,
  Send,
  X,
  Copy,
  Check,
  PauseCircle,
} from "lucide-react";

interface ExtraProps {
  inline?: boolean;
  className?: string;
  children: React.ReactNode;
}

const CodeBlock = ({ inline, className, children, ...props }: ExtraProps) => {
  const [isCopied, setIsCopied] = useState(false);
  const match = /language-(\w+)/.exec(className || "");
  const language = match ? match[1] : "plaintext";

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(String(children));
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  return !inline && match ? (
    <div className="relative group">
      <div className="absolute top-2 right-2 flex space-x-2 z-10">
        <div className="bg-gray-900 text-gray-200 text-xs font-bold px-2 py-1 rounded-md">
          {language.toUpperCase()}
        </div>
        <button
          onClick={copyToClipboard}
          className="p-2 text-gray-200 bg-gray-800 rounded-md hover:bg-gray-700 transition-all"
          aria-label="Copy code"
        >
          {isCopied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
        </button>
      </div>

      <SyntaxHighlighter
        style={materialDark}
        language={language}
        PreTag="div"
        {...props}
      >
        {String(children).replace(/\n$/, "")}
      </SyntaxHighlighter>
    </div>
  ) : (
    <code className={className} {...props}>
      {children}
    </code>
  );
};

export default function GenieModal({ onClose, code = "" }: any) {
  const [query, setQuery] = useState("");
  const [includeCode, setIncludeCode] = useState(false);
  const [response, setResponse] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const responseRef = useRef<HTMLDivElement>(null);
  const stopSignalRef = useRef(false);

  const typewriterEffect = async (text: string) => {
    const chunkSize = 10;
    for (let i = 0; i < text.length; i += chunkSize) {
      if (stopSignalRef.current) break;
      await new Promise((resolve) => setTimeout(resolve, 1));
      setResponse((prev) => prev + text.slice(i, i + chunkSize));
    }
  };

  const handleQuerySubmit = async () => {
    setLoading(true);
    setError("");
    setResponse("");
    stopSignalRef.current = false;

    const formattedQuery =
      includeCode && code ? `Code: ${code}\nQuestion: ${query}` : query;

    try {
      const AUTH_SECRET = process.env.NEXT_PUBLIC_AUTH_SECRET;
      const GENIE_API_URL = process.env.NEXT_PUBLIC_GENIE_API_URL;

      const response = await fetch(GENIE_API_URL!, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: AUTH_SECRET!,
        },
        body: JSON.stringify({ query: formattedQuery }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        setError(errorData.error || "An unknown error occurred.");
        setLoading(false);
        return;
      }

      const reader = response.body?.getReader();
      const decoder = new TextDecoder("utf-8");

      while (true) {
        if (stopSignalRef.current) break;
        const { value, done } = await reader!.read();
        if (done) break;

        const chunk = decoder.decode(value);
        await typewriterEffect(chunk);
      }

      setLoading(false);
    } catch (err) {
      setError("Failed to fetch the response. Please try again.");
      setLoading(false);
    }
  };

  const handleStopGeneration = () => {
    stopSignalRef.current = true;
    setLoading(false);
  };

  useEffect(() => {
    if (responseRef.current) {
      responseRef.current.scrollTop = responseRef.current.scrollHeight;
    }
  }, [response]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/80" onClick={onClose} />

      <div className="relative w-full max-w-6xl h-[90vh] mx-2 sm:mx-4 bg-zinc-900 rounded-2xl shadow-2xl border border-zinc-700 overflow-hidden flex flex-col">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full bg-zinc-800 hover:bg-zinc-700 z-10"
        >
          <X className="w-5 h-5 text-zinc-400" />
        </button>

        {/* Responsive Layout: column on mobile, row on desktop */}
        <div className="flex flex-col md:flex-row flex-1 overflow-hidden">
          {/* LEFT PANEL: Genie Chat Input */}
          <div className="w-full md:w-[40%] border-b md:border-b-0 md:border-r border-zinc-700 p-4 sm:p-6 flex flex-col gap-4 bg-zinc-800 overflow-auto">
            <div className="flex items-center gap-2">
              <Sparkles className="text-orange-400 w-5 h-5" />
              <h2 className="text-lg font-semibold text-white">CodeSync AI Assistant</h2>
            </div>

            <textarea
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Describe your issue or question..."
              className="flex-1 min-h-[180px] sm:min-h-[200px] p-4 rounded-lg bg-zinc-700 text-white border border-zinc-600 resize-none focus:ring-2 focus:ring-orange-500 outline-none"
            />

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <label className="flex items-center gap-2 text-sm text-zinc-300">
                <input
                  type="checkbox"
                  checked={includeCode}
                  onChange={(e) => setIncludeCode(e.target.checked)}
                  className="accent-orange-500"
                />
                Include code
              </label>

              <div className="flex gap-2">
                {loading && (
                  <button
                    onClick={handleStopGeneration}
                    className="flex-1 sm:flex-none flex items-center gap-1 px-4 py-2 bg-red-600 text-white rounded-md hover:opacity-90"
                  >
                    <PauseCircle className="w-4 h-4" />
                    Stop
                  </button>
                )}

                <button
                  onClick={handleQuerySubmit}
                  disabled={loading || !query.trim()}
                  className="flex-1 sm:flex-none flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-orange-500 to-red-600 text-white font-medium rounded-md hover:opacity-90 disabled:opacity-50"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Thinking...
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      Ask AI
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* RIGHT PANEL: Output Viewer */}
          <div className="flex-1 p-4 sm:p-6 overflow-y-auto bg-zinc-900 text-white">
            <div className="bg-zinc-800 border border-zinc-700 rounded-lg p-4 sm:p-6 min-h-[200px]">
              {response ? (
                <ReactMarkdown
                  components={{
                    code: CodeBlock,
                  }}
                  className="prose prose-invert max-w-full"
                >
                  {response}
                </ReactMarkdown>
              ) : (
                <p className="text-zinc-400 text-sm">Genie’s answer will appear here...</p>
              )}
            </div>

            {error && (
              <div className="mt-4 p-3 bg-red-800 text-red-200 text-sm border border-red-600 rounded-md">
                {error}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>

  );
}