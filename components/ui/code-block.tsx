"use client";

import React from "react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";
import { Copy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useState } from "react";

interface CodeBlockProps {
  code: string;
  language?: string;
  showLineNumbers?: boolean;
  className?: string;
  wrapLongLines?: boolean;
}

export function CodeBlock({
  code,
  language = "javascript",
  showLineNumbers = false,
  className,
  wrapLongLines = true,
}: CodeBlockProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Remove HTML entities - convert them back to actual characters
  const cleanCode = code
    .replace(/&apos;/g, "'")
    .replace(/&quot;/g, '"')
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">");

  return (
    <div className={cn("relative group rounded-md overflow-hidden", className)}>
      <div className="flex justify-between items-center px-4 py-2 bg-slate-900 text-white text-xs">
        <span>{language}</span>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 text-slate-300 hover:text-white hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-700"
          onClick={handleCopy}
        >
          <Copy className="h-4 w-4" />
          <span className="sr-only">Copy code</span>
        </Button>
      </div>

      <SyntaxHighlighter
        language={language}
        style={oneDark}
        customStyle={{
          margin: 0,
          borderRadius: 0,
          fontSize: "0.875rem",
        }}
        showLineNumbers={showLineNumbers}
        wrapLongLines={wrapLongLines}
      >
        {cleanCode}
      </SyntaxHighlighter>

      {copied && (
        <div className="absolute top-2 right-12 px-2 py-1 text-xs bg-green-600 text-white rounded-md animate-in fade-in">
          Copied!
        </div>
      )}
    </div>
  );
} 