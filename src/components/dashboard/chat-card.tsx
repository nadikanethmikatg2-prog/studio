"use client";

import React, { useState, useTransition, useRef, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Bot, Send } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { chatWithBotAction } from "@/app/actions";
import { ScrollArea } from "../ui/scroll-area";
import { cn } from "@/lib/utils";

type Message = {
  role: "user" | "model";
  content: string;
};

export function ChatCard() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const { toast } = useToast();
  const [isPending, startTransition] = useTransition();
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Scroll to the bottom when new messages are added
    if (scrollAreaRef.current) {
        const viewport = scrollAreaRef.current.querySelector('div');
        if (viewport) {
            viewport.scrollTop = viewport.scrollHeight;
        }
    }
  }, [messages]);

  const handleSendMessage = async () => {
    if (input.trim() === "") return;

    const currentInput = input;
    const newMessages: Message[] = [
      ...messages,
      { role: "user", content: currentInput },
    ];
    setMessages(newMessages);
    setInput("");

    startTransition(async () => {
      const result = await chatWithBotAction(currentInput);

      if (result.success && result.response) {
        setMessages([
          ...newMessages,
          { role: "model", content: result.response },
        ]);
      } else {
        toast({
          variant: "destructive",
          title: "AI Chat Error",
          description: result.message,
        });
        // Revert to user message only on error
        setMessages(newMessages);
      }
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Bot className="text-primary" />
          Chat with your AI Assistant
        </CardTitle>
        <CardDescription>
          Ask me questions about your study plan or for some motivation!
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-48 w-full rounded-md border p-4 mb-4" ref={scrollAreaRef}>
          {messages.length > 0 ? (
            <div className="space-y-4">
              {messages.map((message, index) => (
                <div
                  key={index}
                  className={cn(
                    "flex w-max max-w-[75%] flex-col gap-2 rounded-lg px-3 py-2 text-sm",
                    message.role === "user"
                      ? "ml-auto bg-primary text-primary-foreground"
                      : "bg-muted"
                  )}
                >
                  {message.content}
                </div>
              ))}
              {isPending && (
                <div className="text-sm text-muted-foreground">
                  Bot is thinking...
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center justify-center h-full text-muted-foreground text-sm">
              No messages yet. Start the conversation!
            </div>
          )}
        </ScrollArea>
        <div className="flex gap-2">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your message..."
            onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
            disabled={isPending}
          />
          <Button onClick={handleSendMessage} disabled={isPending || !input}>
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
