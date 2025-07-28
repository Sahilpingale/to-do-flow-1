import { SquareIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import { ArrowUpIcon } from "lucide-react"
import { Textarea } from "@/components/ui/textarea"

export interface SideBarProps {
  queryInput: string
  setQueryInput: (queryInput: string) => void
  isProcessing: boolean
  handleAIQuery: () => void
}

interface Message {
  id: string
  content: string
  sender: "user" | "ai"
  timestamp: Date
}

// Mock conversation data
const mockMessages: Message[] = [
  {
    id: "1",
    content:
      "Create tasks for setting up a new project. Make sure to include all the details. Do not include any other text.",
    sender: "user",
    timestamp: new Date(Date.now() - 10 * 60 * 1000), // 10 minutes ago
  },
  {
    id: "2",
    content:
      "I've created several tasks for project setup:\n\n• Set up development environment\n• Initialize Git repository\n• Create project structure\n• Configure build tools\n• Set up CI/CD pipeline",
    sender: "ai",
    timestamp: new Date(Date.now() - 9 * 60 * 1000), // 9 minutes ago
  },
  {
    id: "3",
    content: "Add testing tasks as well",
    sender: "user",
    timestamp: new Date(Date.now() - 5 * 60 * 1000), // 5 minutes ago
  },
  {
    id: "4",
    content:
      "I've added testing-related tasks:\n\n• Write unit tests\n• Set up testing framework\n• Create integration tests\n• Configure test coverage\n• Set up automated testing",
    sender: "ai",
    timestamp: new Date(Date.now() - 4 * 60 * 1000), // 4 minutes ago
  },
]

const MessageBubble = ({ message }: { message: Message }) => {
  const isUser = message.sender === "user"

  return (
    <div className={`flex mb-3 ${isUser ? "justify-end" : "justify-start"}`}>
      <div
        className={`rounded-lg px-3 py-2 text-sm max-w-[85%] ${
          isUser
            ? "bg-violet-500 dark:bg-violet-600 text-white"
            : "bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100 border border-gray-200 dark:border-gray-700"
        }`}
      >
        <div className="whitespace-pre-wrap">{message.content}</div>
        <div
          className={`text-xs mt-1 opacity-70 ${
            isUser
              ? "text-violet-100 dark:text-violet-200"
              : "text-gray-500 dark:text-gray-400"
          }`}
        >
          {message.timestamp.toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </div>
      </div>
    </div>
  )
}

export const SideBar = ({
  queryInput,
  setQueryInput,
  isProcessing,
}: // handleAIQuery,
SideBarProps) => {
  return (
    <div className="bg-white dark:bg-gray-900 border-l border-gray-200 dark:border-gray-700 w-full h-full flex flex-col">
      {/* Header */}
      <div className="p-3 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
        <h3 className="text-sm font-medium text-gray-900 dark:text-gray-100">
          AI Assistant
        </h3>
        <p className="text-xs text-gray-500 dark:text-gray-400">
          Generate tasks from your descriptions
        </p>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-auto p-3 bg-gray-50 dark:bg-gray-900">
        {mockMessages.map((message) => (
          <MessageBubble key={message.id} message={message} />
        ))}

        {/* Typing indicator when processing */}
        {isProcessing && (
          <div className="flex justify-start mb-3">
            <div className="bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg px-3 py-2 text-sm max-w-[85%]">
              <div className="flex items-center space-x-1">
                <div className="flex space-x-1">
                  <div
                    className="w-2 h-2 bg-gray-400 dark:bg-gray-500 rounded-full animate-bounce"
                    style={{ animationDelay: "0ms" }}
                  ></div>
                  <div
                    className="w-2 h-2 bg-gray-400 dark:bg-gray-500 rounded-full animate-bounce"
                    style={{ animationDelay: "150ms" }}
                  ></div>
                  <div
                    className="w-2 h-2 bg-gray-400 dark:bg-gray-500 rounded-full animate-bounce"
                    style={{ animationDelay: "300ms" }}
                  ></div>
                </div>
                <span className="text-xs text-gray-500 dark:text-gray-400 ml-2">
                  AI is thinking...
                </span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Input Area */}
      <div className="p-3 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900">
        <div className="relative">
          <Textarea
            placeholder="Describe tasks you want to generate..."
            value={queryInput}
            autosize
            minRows={1}
            maxRows={4}
            onChange={(e) => setQueryInput(e.target.value)}
            className="w-full pr-12 rounded-lg border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:border-violet-400 dark:focus:border-violet-500 focus:ring-0 transition-all duration-200"
            onKeyDown={(e) => {
              if (e.key === "Enter" && e.shiftKey) {
                // Allow Shift+Enter for new lines
                return
              }
              if (e.key === "Enter" && !isProcessing && queryInput.trim()) {
                e.preventDefault()
                // handleAIQuery()
              }
            }}
          />
          <Button
            size="sm"
            // onClick={handleAIQuery}
            disabled={!queryInput.trim() || isProcessing}
            className="absolute right-2 top-2 w-8 h-8 rounded-full p-0 bg-violet-500 hover:bg-violet-600 dark:bg-violet-600 dark:hover:bg-violet-700 disabled:bg-gray-400 dark:disabled:bg-gray-600 transition-all duration-200 shadow-sm"
          >
            {isProcessing ? (
              <SquareIcon className="w-4 h-4 text-white" />
            ) : (
              <ArrowUpIcon className="w-4 h-4 text-white" />
            )}
          </Button>
        </div>
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-2 text-center">
          Press Enter to send • Shift+Enter for new line
        </p>
      </div>
    </div>
  )
}
