import React from 'react';
import { X, Phone, Mic, MicOff, Volume2, VolumeX, Users, History, Star } from 'lucide-react';
import { useCallState } from '../../../hooks/useCallState';
import { useCallLogs } from '../../../hooks/useCallLogs';

interface PhoneCallModalProps {
  onClose: () => void;
  contactName?: string | undefined;
  contactNumber?: string | undefined;
  isFloating?: boolean;
  isIncoming?: boolean;
  onRetry?: (messageId: string) => void;
}

export function PhoneCallModal({ onClose, contactName, contactNumber, isFloating = false, isIncoming = false, onRetry }: PhoneCallModalProps) {
  const [number, setNumber] = React.useState(contactNumber || '');
  const [isMuted, setIsMuted] = React.useState(false);
  const [isSpeaker, setIsSpeaker] = React.useState(false);
  const [isDialing, setIsDialing] = React.useState(false);
  const { setActiveCall } = useCallState();
  const [error, setError] = React.useState('');
  const [isCallActive, setIsCallActive] = React.useState(false);
  const [callDuration, setCallDuration] = React.useState(0);
  const inputRef = React.useRef<HTMLInputElement>(null); 
  const startCallSound = React.useRef<HTMLAudioElement | null>(null);
  const { addLog, updateLog } = useCallLogs();
  const dialToneSound = React.useRef<HTMLAudioElement | null>(null);
  const hangUpSound = React.useRef<HTMLAudioElement | null>(null);
  const durationInterval = React.useRef<number | null>(null);
  const ringtoneRef = React.useRef<HTMLAudioElement | null>(null);

  React.useEffect(() => {
    if (isIncoming && !isCallActive) {
      // Create audio element for ringtone
      ringtoneRef.current = new Audio('https://dallasreynoldstn.com/wp-content/uploads/2025/03/ringtone.mp3');
      ringtoneRef.current.loop = true;
      ringtoneRef.current.play().catch(() => console.log('Ringtone playback prevented'));

      return () => {
        if (ringtoneRef.current) {
          ringtoneRef.current.pause();
          ringtoneRef.current = null;
        }
      };
    }
  }, [isIncoming, isCallActive]);

  React.useEffect(() => {
    if (!contactNumber) {
      inputRef.current?.focus();
      setIsCallActive(false);
      setNumber('');
    } else {
      // Format contact number before starting call
      const formattedNumber = formatPhoneNumber(contactNumber);
      setNumber(formattedNumber);
      handleStartCall();
    }
  }, [contactNumber]);

  React.useEffect(() => {
    return () => {
      if (durationInterval.current) {
        clearInterval(durationInterval.current);
      }
    };
  }, []);

  const formatPhoneNumber = (value: string) => {
    // Strip all non-digits
    const numbers = value.replace(/\D/g, '');
    
    // Remove leading 1 if present
    const cleanNumbers = numbers.startsWith('1') ? numbers.slice(1) : numbers;
    
    // Format remaining digits
    if (cleanNumbers.length <= 3) {
      return `(${cleanNumbers}`;
    } else if (cleanNumbers.length <= 6) {
      return `(${cleanNumbers.slice(0, 3)}) ${cleanNumbers.slice(3)}`;
    } else {
      return `(${cleanNumbers.slice(0, 3)}) ${cleanNumbers.slice(3, 6)}-${cleanNumbers.slice(6, 10)}`;
    }
  };

  const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const input = e.target.value;
    const isBackspace = input.length < number.length;
    
    setError('');
    
    if (input === '') {
      setNumber('');
      return;
    }
    
    if (isBackspace) {
      const strippedNumber = input.replace(/\D/g, '');
      const formattedNumber = strippedNumber ? formatPhoneNumber(strippedNumber) : '';
      setNumber(formattedNumber);
      return;
    }
    
    const formattedNumber = formatPhoneNumber(input);
    setNumber(formattedNumber);
  };

  const handleStartCall = () => {
    if (!/^\(\d{3}\) \d{3}-\d{4}$/.test(number)) {
      setError('Please enter a valid phone number');
      return;
    }
    
    // Add outgoing call log
    const callId = Math.random().toString(36).substr(2, 9);
    addLog({
      type: 'outgoing',
      number,
      name: contactName,
      status: 'completed'
    });
    
    // Initialize start call sound
    startCallSound.current = new Audio('https://dallasreynoldstn.com/wp-content/uploads/2025/03/startcall.mp3');

    // Play start call sound
    startCallSound.current?.play()
      .then(() => {
        // Wait for start call sound to finish
        return new Promise(resolve => {
          startCallSound.current!.onended = resolve;
        });
      })
      .then(() => {
        // Add 1 second delay after start call sound finishes
        return new Promise(resolve => setTimeout(resolve, 1000));
      })
      .then(() => {
        // Play dial tone
        dialToneSound.current = new Audio('https://dallasreynoldstn.com/wp-content/uploads/2025/03/DialTone.mp3');
        dialToneSound.current.loop = true;
        return dialToneSound.current.play();
      })
      .catch(() => console.log('Sound playback prevented'));

    setIsDialing(true);
    setError('');

    // Simulate call connection
    setTimeout(() => {
      setIsDialing(false);
      setIsCallActive(true);
      // Start call duration timer
      durationInterval.current = window.setInterval(() => {
        setCallDuration(prev => prev + 1);
      }, 1000);
      
      // Dispatch call active event
      window.dispatchEvent(new CustomEvent('phoneCallStateChange', { 
        detail: { active: true }
      }));
      
      // In a real app, this would initiate the actual call
    }, 2000);
  };

  const handleHangup = () => {
    // Play hang up sound
    hangUpSound.current = new Audio('https://dallasreynoldstn.com/wp-content/uploads/2025/03/HangUp.mp3');
    hangUpSound.current.play().catch(() => console.log('Hang up sound playback prevented'));

    // Stop start call sound if playing
    if (startCallSound.current) {
      startCallSound.current.pause();
      startCallSound.current = null;
    }

    // Stop dial tone if playing
    if (dialToneSound.current) {
      dialToneSound.current.pause();
      dialToneSound.current = null;
    }

    // Clear call duration timer
    if (durationInterval.current) {
      clearInterval(durationInterval.current);
      durationInterval.current = null;
    }
    
    setIsCallActive(false);
    setCallDuration(0);
    
    // Dispatch call ended event
    window.dispatchEvent(new CustomEvent('phoneCallStateChange', { 
      detail: { active: false }
    }));
    
    // Store call in history
    const callHistory = JSON.parse(localStorage.getItem('callHistory') || '[]');
    callHistory.unshift({
      id: Math.random().toString(36).substr(2, 9),
      number: contactNumber,
      name: contactName,
      duration: callDuration,
      timestamp: new Date().toISOString()
    });
    localStorage.setItem('callHistory', JSON.stringify(callHistory.slice(0, 50)));
    
    setActiveCall(null);
    
    onClose();
  };

  const handleAnswer = () => {
    // Stop ringtone
    if (ringtoneRef.current) {
      ringtoneRef.current.pause();
      ringtoneRef.current = null;
    }
    
    // Add incoming call log
    addLog({
      type: 'incoming',
      number: contactNumber || '',
      name: contactName,
      status: 'completed'
    });

    // Stop dial tone if playing
    if (dialToneSound.current) {
      dialToneSound.current.pause();
      dialToneSound.current = null;
    }

    setIsCallActive(true);
    // Start call duration timer
    durationInterval.current = window.setInterval(() => {
      setCallDuration(prev => prev + 1);
    }, 1000);
    
    // Dispatch call active event
    window.dispatchEvent(new CustomEvent('phoneCallStateChange', { 
      detail: { active: true }
    }));
  };

  const handleDecline = () => {
    // Play hang up sound
    hangUpSound.current = new Audio('https://dallasreynoldstn.com/wp-content/uploads/2025/03/HangUp.mp3');
    hangUpSound.current.play().catch(() => console.log('Hang up sound playback prevented'));
    
    // Add denied call log
    addLog({
      type: 'denied',
      number: contactNumber || '',
      name: contactName,
      status: 'denied'
    });

    // Stop ringtone
    if (ringtoneRef.current) {
      ringtoneRef.current.pause();
      ringtoneRef.current = null;
    }

    // Stop dial tone if playing
    if (dialToneSound.current) {
      dialToneSound.current.pause();
      dialToneSound.current = null;
    }

    setActiveCall(null);
    onClose();
  };

  const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className={`fixed z-[999] transition-all duration-300 ${
      isCallActive
        ? `bottom-6 ${isFloating ? 'right-[380px]' : 'right-6'} w-[320px]`
        : 'inset-0 flex items-center justify-center px-4'
    }`}>
      {!isCallActive && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose} />
      )}
      <div className={`relative bg-gradient-to-br from-zinc-900/95 to-black/95 border border-[#B38B3F]/30 rounded-xl shadow-2xl transform ${
        isCallActive
          ? 'w-full animate-slide-up'
          : 'w-full max-w-sm animate-fade-in'
      }`}>
        <div className="absolute inset-0 bg-gradient-to-r from-[#B38B3F]/0 via-[#FFD700]/5 to-[#B38B3F]/0 rounded-xl animate-pulse" />
        
        <div className={`${isCallActive ? 'p-4' : 'p-6'}`}>
          <button
            onClick={isCallActive ? handleHangup : onClose}
            className="absolute right-4 top-4 text-white/70 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex flex-col items-center">
            {contactName && (
              <div className="text-xl font-bold text-white mb-2">{contactName}</div>
            )}
            {isCallActive && (
              <div className="text-sm text-white/60 mb-4">
                {formatDuration(callDuration)}
              </div>
            )}
            
            <div className={`relative w-full ${isCallActive ? 'hidden' : ''}`}>
              <input
                ref={inputRef}
                type="text"
                value={number}
                onChange={handleNumberChange}
                placeholder="Enter phone number"
                className={`w-full text-center text-2xl py-3 bg-transparent border-b-2 text-white placeholder-white/40 focus:outline-none transition-colors ${
                  error ? 'border-red-500' : 'border-[#B38B3F]/20 focus:border-[#FFD700]'
                }`}
                readOnly={!!contactNumber && isCallActive}
              />
              {error && (
                <div className="absolute -bottom-6 left-0 right-0 text-center text-red-500 text-sm">
                  {error}
                </div>
              )}
            </div>

            <div className={`grid grid-cols-3 gap-6 ${isCallActive ? 'mt-4' : 'mt-12'}`}>
              <button className="flex flex-col items-center space-y-2 text-white/70 hover:text-[#FFD700] transition-colors group">
                <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center group-hover:bg-[#FFD700]/20 transition-colors">
                  <Star className="w-6 h-6" />
                </div>
                <span className="text-xs">Favorite</span>
              </button>
              <button className="flex flex-col items-center space-y-2 text-white/70 hover:text-[#FFD700] transition-colors group">
                <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center group-hover:bg-[#FFD700]/20 transition-colors">
                  <History className="w-6 h-6" />
                </div>
                <span className="text-xs">Recent</span>
              </button>
              <button className="flex flex-col items-center space-y-2 text-white/70 hover:text-[#FFD700] transition-colors group">
                <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center group-hover:bg-[#FFD700]/20 transition-colors">
                  <Users className="w-6 h-6" />
                </div>
                <span className="text-xs">Contacts</span>
              </button>
            </div>

            <div className={`flex items-center justify-center space-x-6 ${isCallActive ? 'mt-4' : 'mt-8'}`}>
              {isIncoming && !isCallActive ? (
                <>
                  <button
                    onClick={handleDecline}
                    className="w-16 h-16 rounded-full bg-red-500 hover:bg-red-600 flex items-center justify-center transition-all duration-300 transform hover:scale-105 hover:shadow-lg hover:shadow-red-500/20"
                  >
                    <Phone className="w-8 h-8 text-white rotate-135" />
                  </button>
                  <button
                    onClick={handleAnswer}
                    className="w-16 h-16 rounded-full bg-[#4CAF50] hover:bg-[#43A047] flex items-center justify-center transition-all duration-300 transform hover:scale-105 hover:shadow-lg hover:shadow-[#4CAF50]/20"
                  >
                    <Phone className="w-8 h-8 text-black" />
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={() => setIsMuted(!isMuted)}
                    className={`flex flex-col items-center space-y-2 transition-colors ${
                      isMuted ? 'text-red-400' : 'text-white/70 hover:text-[#FFD700]'
                    }`}
                  >
                    {isMuted ? <MicOff className="w-6 h-6" /> : <Mic className="w-6 h-6" />}
                    <span className="text-xs">{isMuted ? 'Unmute' : 'Mute'}</span>
                  </button>
                  <button
                    onClick={isCallActive ? handleHangup : handleStartCall}
                    disabled={isDialing}
                    className={`w-16 h-16 rounded-full flex items-center justify-center transition-all duration-300 transform hover:scale-105 ${
                      isDialing
                        ? 'bg-red-500 animate-pulse'
                        : isCallActive
                        ? 'bg-red-500 hover:bg-red-600 hover:shadow-lg hover:shadow-red-500/20 hover:scale-105'
                        : 'bg-[#4CAF50] hover:bg-[#43A047] hover:shadow-lg hover:shadow-[#4CAF50]/20 hover:scale-105' 
                    }`}
                  >
                    <Phone className={`w-8 h-8 ${isCallActive || isDialing ? 'text-white' : 'text-black'} ${
                      isCallActive ? 'rotate-135' : ''
                    }`} />
                  </button>
                  <button
                    onClick={() => setIsSpeaker(!isSpeaker)}
                    className={`flex flex-col items-center space-y-2 transition-colors ${
                      isSpeaker ? 'text-[#FFD700]' : 'text-white/70 hover:text-[#FFD700]'
                    }`}
                  >
                    {isSpeaker ? <Volume2 className="w-6 h-6" /> : <VolumeX className="w-6 h-6" />}
                    <span className="text-xs">{isSpeaker ? 'Speaker On' : 'Speaker Off'}</span>
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}