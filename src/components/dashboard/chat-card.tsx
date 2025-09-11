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
import { Avatar, AvatarFallback } from "../ui/avatar";

type Message = {
  role: "user" | "model";
  content: string;
};

interface ChatCardProps {
  onTaskAdded: (subjectKey: string, task: string) => void;
}

export function ChatCard({ onTaskAdded }: ChatCardProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const { toast } = useToast();
  const [isPending, startTransition] = useTransition();
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    if (scrollAreaRef.current) {
      const viewport = scrollAreaRef.current.querySelector("div[data-radix-scroll-area-viewport]");
      if (viewport) {
        viewport.scrollTop = viewport.scrollHeight;
      }
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isPending]);

  const handleSendMessage = async () => {
    if (input.trim() === "") return;

    const currentInput = input;
    setMessages((prev) => [...prev, { role: "user", content: currentInput }]);
    setInput("");

    startTransition(async () => {
      const result = await chatWithBotAction(currentInput);

      if (result.success && result.response) {
        setMessages((prev) => [
          ...prev,
          { role: "model", content: result.response! },
        ]);
        
        // This is a temporary solution to update the UI.
        // A more robust solution would involve the tool returning structured data.
        const lowerCaseResponse = result.response.toLowerCase();
        if (lowerCaseResponse.includes("added") && lowerCaseResponse.includes("to-do")) {
            const subjectMatch = lowerCaseResponse.match(/(chemistry|physics|pure maths|applied maths)/);
            const taskMatch = currentInput.match(/add(?:s)?\s*(?:'|")?(.*?)(?:'|")?\s*to/i);
            
            if (subjectMatch && taskMatch && taskMatch[1]) {
                const subjectKey = subjectMatch[1].replace(' ', '').toLowerCase();
                const task = taskMatch[1].trim();
                onTaskAdded(subjectKey, task);
            }
        }

      } else {
        toast({
          variant: "destructive",
          title: "AI Chat Error",
          description: result.message,
        });
        // On error, remove the user's last message to allow them to try again
        setMessages((prev) => prev.slice(0, -1));
      }
    });
  };

  return (
    <Card className="flex flex-col h-[60vh] max-h-[700px] shadow-none border-none">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Bot className="text-primary" />
          Chat with your AI Assistant
        </CardTitle>
        <CardDescription>
          Try saying: "Add 'review kinematics' to my physics to-do list."
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col gap-4 overflow-hidden">
        <ScrollArea
          className="flex-1 -m-4"
          ref={scrollAreaRef}
        >
        <div className="p-4 space-y-4">
          {messages.length > 0 ? (
            <>
              {messages.map((message, index) => (
                <div
                  key={index}
                  className={cn(
                    "flex items-start gap-3",
                    message.role === "user" && "justify-end"
                  )}
                >
                  {message.role === "model" && (
                    <Avatar className="h-8 w-8">
                      <AvatarFallback className="bg-primary text-primary-foreground">
                        <Bot className="h-5 w-5" />
                      </AvatarFallback>
                    </Avatar>
                  )}
                  <div
                    className={cn(
                      "max-w-[75%] rounded-lg px-3 py-2 text-sm",
                      message.role === "user"
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted"
                    )}
                  >
                    {message.content}
                  </div>
                </div>
              ))}
              {isPending && (
                <div className="flex items-center gap-3">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback className="bg-primary text-primary-foreground">
                      <Bot className="h-5 w-5" />
                    </AvatarFallback>
                  </Avatar>
                  <div className="bg-muted px-3 py-2 rounded-lg text-sm flex items-center gap-2">
                    <span
                      className="h-2 w-2 rounded-full bg-primary animate-pulse"
                      style={{ animationDelay: "0s" }}
                    />
                    <span
                      className="h-2 w-2 rounded-full bg-primary animate-pulse"
                      style={{ animationDelay: "0.2s" }}
                    />
                    <span
                      className="h-2 w-2 rounded-full bg-primary animate-pulse"
                      style={{ animationDelay: "0.4s" }}
                    />
                  </div>
                </div>
              )}
            </>
          ) : (
            <div className="flex items-center justify-center h-full text-muted-foreground text-sm">
              No messages yet. Start the conversation!
            </div>
          )}
          </div>
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
