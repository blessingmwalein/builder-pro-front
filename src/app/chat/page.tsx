'use client';

import React, { useEffect, useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAppDispatch, useAppSelector } from '@/lib/hooks';
import { fetchChatMessages, addMessage } from '@/lib/features/chat/chatSlice';
import { formatDistanceToNow } from 'date-fns';
import {
  PaperAirplaneIcon,
  PaperClipIcon,
  UserCircleIcon,
} from '@heroicons/react/24/outline';

export default function ChatPage() {
  const dispatch = useAppDispatch();
  const { messages, isLoading } = useAppSelector((state) => state.chat);
  const { currentCompany } = useAppSelector((state) => state.company);
  const { currentProject } = useAppSelector((state) => state.project);
  const { user } = useAppSelector((state) => state.auth);
  
  const [newMessage, setNewMessage] = useState('');

  useEffect(() => {
    if (currentCompany && currentProject) {
      dispatch(fetchChatMessages({ companyId: currentCompany.id, projectId: currentProject.id }));
    }
  }, [dispatch, currentCompany, currentProject]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !user || !currentProject) return;

    const message = {
      id: Date.now(),
      message: newMessage,
      user_id: user.id,
      user,
      project_id: currentProject.id,
      created_at: new Date().toISOString(),
    };

    dispatch(addMessage(message));
    setNewMessage('');
  };

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
            <div className="h-96 bg-gray-200 rounded-lg"></div>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  if (!currentProject) {
    return (
      <DashboardLayout>
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="text-center py-12">
            <h3 className="text-lg font-medium text-gray-900">No project selected</h3>
            <p className="mt-2 text-gray-500">Please select a project to view team chat.</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="px-4 sm:px-6 lg:px-8 h-full flex flex-col">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Team Chat</h1>
          <p className="mt-2 text-gray-600">
            {currentProject.name} - Collaborate with your team
          </p>
        </div>

        {/* Chat Container */}
        <div className="flex-1 flex flex-col bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {messages.map((message) => (
              <div key={message.id} className="flex items-start space-x-3">
                <div className="flex-shrink-0">
                  <UserCircleIcon className="h-8 w-8 text-gray-400" />
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-2 mb-1">
                    <h4 className="text-sm font-medium text-gray-900">
                      {message.user?.name}
                    </h4>
                    <span className="text-xs text-gray-500">
                      {formatDistanceToNow(new Date(message.created_at), { addSuffix: true })}
                    </span>
                  </div>
                  
                  <p className="text-sm text-gray-700">
                    {message.message}
                  </p>
                  
                  {message.attachment_url && (
                    <div className="mt-2">
                      <a
                        href={message.attachment_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center text-sm text-blue-600 hover:text-blue-500"
                      >
                        <PaperClipIcon className="h-4 w-4 mr-1" />
                        View attachment
                      </a>
                    </div>
                  )}
                </div>
              </div>
            ))}

            {messages.length === 0 && (
              <div className="text-center py-12">
                <div className="mx-auto h-24 w-24 text-gray-400 mb-4">
                  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1}
                      d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                    />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">No messages yet</h3>
                <p className="text-gray-500">Start the conversation with your team.</p>
              </div>
            )}
          </div>

          {/* Message Input */}
          <div className="border-t border-gray-200 p-4">
            <form onSubmit={handleSendMessage} className="flex space-x-3">
              <div className="flex-1">
                <Input
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Type your message..."
                  className="border-0 focus:ring-0 focus:border-0"
                />
              </div>
              
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="text-gray-400 hover:text-gray-600"
              >
                <PaperClipIcon className="h-5 w-5" />
              </Button>
              
              <Button
                type="submit"
                disabled={!newMessage.trim()}
                size="sm"
              >
                <PaperAirplaneIcon className="h-5 w-5" />
              </Button>
            </form>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}




