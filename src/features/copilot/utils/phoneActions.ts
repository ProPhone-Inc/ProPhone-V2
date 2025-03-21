import { Chat, Message } from '../types';

interface PhoneAction {
  type: 'CREATE_MESSAGE' | 'MAKE_CALL' | 'UPDATE_STATUS' | 'ANALYZE_CHAT';
  parameters: Record<string, string>;
}

export async function handlePhoneAction(action: PhoneAction, chats: Chat[]): Promise<string> {
  switch (action.type) {
    case 'CREATE_MESSAGE':
      return createMessage(action.parameters);
    case 'MAKE_CALL':
      return initiateCall(action.parameters);
    case 'UPDATE_STATUS':
      return updateChatStatus(action.parameters, chats);
    case 'ANALYZE_CHAT':
      return analyzeChatHistory(action.parameters, chats);
    default:
      throw new Error(`Unknown action type: ${action.type}`);
  }
}

async function createMessage(params: Record<string, string>): Promise<string> {
  const { number, content } = params;
  if (!number || !content) {
    throw new Error('Missing required parameters: number and content');
  }

  // In a real app, this would integrate with your messaging system
  await new Promise(resolve => setTimeout(resolve, 500));
  return `Message sent to ${number}: "${content}"`;
}

async function initiateCall(params: Record<string, string>): Promise<string> {
  const { number } = params;
  if (!number) {
    throw new Error('Missing required parameter: number');
  }

  // In a real app, this would integrate with your phone system
  await new Promise(resolve => setTimeout(resolve, 500));
  return `Initiating call to ${number}...`;
}

async function updateChatStatus(params: Record<string, string>, chats: Chat[]): Promise<string> {
  const { chatId, status } = params;
  if (!chatId || !status) {
    throw new Error('Missing required parameters: chatId and status');
  }

  const chat = chats.find(c => c.id === chatId);
  if (!chat) {
    throw new Error(`Chat not found: ${chatId}`);
  }

  // In a real app, this would update the database
  await new Promise(resolve => setTimeout(resolve, 300));
  return `Updated status for chat with ${chat.name} to ${status}`;
}

async function analyzeChatHistory(params: Record<string, string>, chats: Chat[]): Promise<string> {
  const { chatId } = params;
  if (!chatId) {
    throw new Error('Missing required parameter: chatId');
  }

  const chat = chats.find(c => c.id === chatId);
  if (!chat) {
    throw new Error(`Chat not found: ${chatId}`);
  }

  // Analyze messages for insights
  const messageCount = chat.messages.length;
  const sentMessages = chat.messages.filter(m => m.type === 'sent').length;
  const receivedMessages = messageCount - sentMessages;
  const averageResponseTime = calculateAverageResponseTime(chat.messages);
  const commonTopics = identifyCommonTopics(chat.messages);

  return `Chat Analysis for ${chat.name}:
- Total Messages: ${messageCount}
- Sent: ${sentMessages}
- Received: ${receivedMessages}
- Average Response Time: ${averageResponseTime}
- Common Topics: ${commonTopics.join(', ')}`;
}

function calculateAverageResponseTime(messages: Message[]): string {
  // Calculate average time between messages
  let totalTime = 0;
  let count = 0;

  for (let i = 1; i < messages.length; i++) {
    const timeDiff = new Date(messages[i].time).getTime() - new Date(messages[i-1].time).getTime();
    totalTime += timeDiff;
    count++;
  }

  const avgMinutes = Math.round(totalTime / (count * 60000));
  return avgMinutes > 60 
    ? `${Math.round(avgMinutes / 60)} hours`
    : `${avgMinutes} minutes`;
}

function identifyCommonTopics(messages: Message[]): string[] {
  // Simple keyword analysis
  const keywords = {
    'pricing': 0,
    'schedule': 0,
    'meeting': 0,
    'property': 0,
    'viewing': 0,
    'offer': 0,
    'availability': 0
  };

  messages.forEach(msg => {
    const content = msg.content.toLowerCase();
    Object.keys(keywords).forEach(keyword => {
      if (content.includes(keyword)) {
        keywords[keyword as keyof typeof keywords]++;
      }
    });
  });

  // Return top 3 topics
  return Object.entries(keywords)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 3)
    .map(([topic]) => topic);
}