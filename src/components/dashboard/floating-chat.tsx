
"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Bot, X } from "lucide-react";
import { ChatCard } from "./chat-card";
import type { Subjects, Message } from "@/app/page";

interface FloatingChatProps {
  subjects: Subjects;
  messages: Message[];
  setMessages: React.Dispatch<React.SetStateAction<Message[]>>;
  onTaskAdded: (subjectKey: string, task: string) => void;
  onDeleteAllTodos: () => void;
  onDeleteSubjectTodos: (subjectKey: string) => void;
}

export function FloatingChat({ subjects, messages, setMessages, onTaskAdded, onDeleteAllTodos, onDeleteSubjectTodos }: FloatingChatProps) {
  const [isOpen, setIsOpen] = React.useState(false);

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="default"
          size="icon"
          className="fixed bottom-6 right-6 h-14 w-14 rounded-full shadow-lg"
        >
          {isOpen ? <X className="h-6 w-6" /> : <Bot className="h-6 w-6" />}
          <span className="sr-only">Toggle Chat</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent
        side="top"
        align="end"
        className="w-[90vw] max-w-[420px] p-0 mr-2 mb-2 border-none rounded-xl shadow-2xl"
        // Prevent content from stealing focus and closing popover
        onOpenAutoFocus={(e) => e.preventDefault()}
      >
        <ChatCard 
          subjects={subjects} 
          messages={messages}
          setMessages={setMessages}
          onTaskAdded={onTaskAdded}
          onDeleteAllTodos={onDeleteAllTodos}
          onDeleteSubjectTodos={onDeleteSubjectTodos}
        />
      </PopoverContent>
    </Popover>
  );
}
