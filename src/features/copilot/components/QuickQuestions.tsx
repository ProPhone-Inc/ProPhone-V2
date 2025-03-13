import React from 'react';

interface QuickQuestionsProps {
  onQuestionSelect: (question: string) => void;
}

export function QuickQuestions({ onQuestionSelect }: QuickQuestionsProps) {
  return (
    <div className="px-4 pb-4">
      <p className="text-white/70 text-sm mb-3">Quick questions:</p>
      <div className="space-y-2">
        <button
          onClick={() => onQuestionSelect("How do I create a new campaign?")}
          className="w-full px-3 py-2 text-left text-sm text-white/70 hover:text-[#FFD700] hover:bg-[#B38B3F]/10 rounded-lg transition-colors group"
        >💡 Show me how to create a campaign</button>
        <button
          onClick={() => onQuestionSelect("Can you analyze my metrics?")}
          className="w-full px-3 py-2 text-left text-sm text-white/70 hover:text-[#FFD700] hover:bg-[#B38B3F]/10 rounded-lg transition-colors group"
        >📊 Help me analyze my metrics</button>
        <button
          onClick={() => onQuestionSelect("How can I optimize my automation workflow?")}
          className="w-full px-3 py-2 text-left text-sm text-white/70 hover:text-[#FFD700] hover:bg-[#B38B3F]/10 rounded-lg transition-colors group"
        >⚡️ Optimize my automation workflow</button>
      </div>
    </div>
  );
}