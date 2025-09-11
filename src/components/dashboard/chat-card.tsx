"use client";

import React, { useState, useTransition } from "react";
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
import type { Subject, Todo } from "@/app/page";
import { useToast } from "@/hooks/use-toast";
import { chatWithBotAction } from "@/app/actions";
import { ScrollArea } from "../ui/scroll-area";
import { cn } from "@/lib/utils";

interface ChatCardProps {
  onUpdate: (key: string, updatedData: Partial<Subject>) => void;
}

type Message = {
  role: "user" | "bot";
  content: string;
};

export function ChatCard({ onUpdate }: ChatCardProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const { toast } = useToast();
  const [isPending, startTransition] = useTransition();

  const handleSendMessage = async () => {
    if (input.trim() === "") return;

    const newMessages: Message[] = [...messages, { role: "user", content: input }];
    setMessages(newMessages);
    setInput("");

    startTransition(async () => {
      const result = await chatWithBotAction(input);

      if (result.success && result.response) {
        setMessages([...newMessages, { role: "bot", content: result.response }]);
        
        if (result.toolRan && result.updatedTodos) {
            const { subjectKey, task } = result.updatedTodos;
            // This is a temporary client-side update. In a real app,
            // you'd likely refetch data or use a more robust state management.
            onUpdate(subjectKey, { 
                todos: (prevTodos: Todo[]) => [...prevTodos, { id: Date.now(), text: task, completed: false }]
             });

            toast({
                title: "AI Task Added",
                description: `"${task}" was added to ${subjectKey}.`,
            });
        }
      } else {
        toast({
          variant: "destructive",
          title: "AI Chat Error",
          description: result.message,
        });
        setMessages(messages); // Revert messages on error
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
          Ask me to add tasks, like "add 'Revise Thermodynamics' to my Physics to-do list".
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-48 w-full rounded-md border p-4 mb-4">
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
                    {isPending && <div className="text-sm text-muted-foreground">Bot is thinking...</div>}
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
