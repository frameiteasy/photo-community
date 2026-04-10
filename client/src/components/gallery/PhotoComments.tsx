import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface Comment {
  id: string;
  author: string;
  avatar: string;
  content: string;
  createdAt: string;
}

// Mock data — replace with API calls when backend is ready
const MOCK_COMMENTS: Comment[] = [
  {
    id: '1',
    author: 'Anna K.',
    avatar: 'AK',
    content: 'Niesamowite ujęcie! To światło jest absolutnie magiczne ✨',
    createdAt: '2026-03-10T09:14:00Z',
  },
  {
    id: '2',
    author: 'Marek W.',
    avatar: 'MW',
    content: 'Gdzie to jest? Chcę tam pojechać 😍',
    createdAt: '2026-03-11T14:32:00Z',
  },
  {
    id: '3',
    author: 'Zofia R.',
    avatar: 'ZR',
    content: 'Kompozycja jest idealna 🔥 Jak długo czekałeś na to światło?',
    createdAt: '2026-03-12T08:55:00Z',
  },
  {
    id: '4',
    author: 'Piotr N.',
    avatar: 'PN',
    content: 'Jedna z moich ulubionych z tej serii 💯',
    createdAt: '2026-03-13T17:20:00Z',
  },
  {
    id: '5',
    author: 'Ela S.',
    avatar: 'ES',
    content: 'Piękne! Wydrukujesz kiedyś? 🙏',
    createdAt: '2026-03-14T11:03:00Z',
  },
];

const EMOJI_LIST = [
  '❤️', '😍', '🔥', '👏', '😮', '😂', '🥹', '💯',
  '✨', '🌟', '📷', '🙏', '😊', '🤩', '💫', '👌',
  '🎨', '🌄', '🌿', '🌊', '🏔️', '🌸', '🦋', '⭐',
];

const VISIBLE_BY_DEFAULT = 3;

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const days = Math.floor(diff / 86_400_000);
  if (days === 0) return 'today';
  if (days === 1) return 'yesterday';
  if (days < 7) return `${days}d ago`;
  if (days < 30) return `${Math.floor(days / 7)}w ago`;
  return `${Math.floor(days / 30)}mo ago`;
}

interface PhotoCommentsProps {
  photoId: string;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const PhotoComments = ({ photoId: _photoId }: PhotoCommentsProps) => {
  const [comments, setComments] = useState<Comment[]>(MOCK_COMMENTS);
  const [expanded, setExpanded] = useState(false);
  const [input, setInput] = useState('');
  const [showEmoji, setShowEmoji] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const emojiRef = useRef<HTMLDivElement>(null);

  const hidden = comments.length - VISIBLE_BY_DEFAULT;
  const visible = expanded ? comments : comments.slice(-VISIBLE_BY_DEFAULT);

  // Close emoji picker on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (emojiRef.current && !emojiRef.current.contains(e.target as Node)) {
        setShowEmoji(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const text = input.trim();
    if (!text) return;
    setComments((prev) => [
      ...prev,
      {
        id: Date.now().toString(),
        author: 'You',
        avatar: 'YO',
        content: text,
        createdAt: new Date().toISOString(),
      },
    ]);
    setInput('');
    setExpanded(true);
  };

  const insertEmoji = (emoji: string) => {
    setInput((prev) => prev + emoji);
    setShowEmoji(false);
    inputRef.current?.focus();
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="px-4 py-3 border-b border-white/10 flex-shrink-0">
        <span className="text-white/70 text-sm font-medium">
          {comments.length} comment{comments.length !== 1 ? 's' : ''}
        </span>
      </div>

      {/* Comments list */}
      <div className="flex-1 overflow-y-auto px-4 py-3 space-y-4">
        {/* Expand older comments */}
        {!expanded && hidden > 0 && (
          <button
            onClick={() => setExpanded(true)}
            className="text-xs text-primary-400 hover:text-primary-300 font-medium transition-colors"
          >
            View {hidden} older comment{hidden !== 1 ? 's' : ''}
          </button>
        )}

        <AnimatePresence initial={false}>
          {visible.map((comment) => (
            <motion.div
              key={comment.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2 }}
              className="flex gap-3"
            >
              {/* Avatar */}
              <div className="flex-shrink-0 h-8 w-8 rounded-full bg-primary-700 flex items-center justify-center">
                <span className="text-xs font-semibold text-white">{comment.avatar}</span>
              </div>

              {/* Bubble */}
              <div className="flex-1 min-w-0">
                <div className="bg-white/10 rounded-2xl rounded-tl-sm px-3 py-2">
                  <p className="text-white text-xs font-semibold mb-0.5">{comment.author}</p>
                  <p className="text-white/90 text-sm leading-snug break-words">{comment.content}</p>
                </div>
                <p className="text-white/40 text-xs mt-1 pl-1">{timeAgo(comment.createdAt)}</p>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {expanded && (
          <button
            onClick={() => setExpanded(false)}
            className="text-xs text-white/40 hover:text-white/60 transition-colors"
          >
            Show less
          </button>
        )}
      </div>

      {/* Input area */}
      <div className="flex-shrink-0 px-4 py-3 border-t border-white/10">
        <form onSubmit={handleSubmit} className="flex items-center gap-2">
          {/* Emoji picker trigger */}
          <div className="relative" ref={emojiRef}>
            <button
              type="button"
              onClick={() => setShowEmoji((v) => !v)}
              className="text-white/50 hover:text-white/80 transition-colors text-lg leading-none"
              aria-label="Add emoji"
            >
              🙂
            </button>

            <AnimatePresence>
              {showEmoji && (
                <motion.div
                  initial={{ opacity: 0, y: 8, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 8, scale: 0.95 }}
                  transition={{ duration: 0.15 }}
                  className="absolute bottom-10 left-0 bg-gray-800 border border-white/10 rounded-xl p-2 grid grid-cols-8 gap-1 shadow-xl z-10 w-56"
                >
                  {EMOJI_LIST.map((emoji) => (
                    <button
                      key={emoji}
                      type="button"
                      onClick={() => insertEmoji(emoji)}
                      className="text-lg leading-none p-1 rounded hover:bg-white/10 transition-colors"
                    >
                      {emoji}
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Add a comment…"
            className="flex-1 bg-white/10 text-white placeholder-white/40 text-sm rounded-full px-4 py-2 outline-none focus:bg-white/15 transition-colors"
            onClick={(e) => e.stopPropagation()}
            onKeyDown={(e) => e.stopPropagation()}
          />

          <button
            type="submit"
            disabled={!input.trim()}
            className="text-primary-400 hover:text-primary-300 disabled:text-white/20 disabled:cursor-not-allowed transition-colors"
            aria-label="Post comment"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
              <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
            </svg>
          </button>
        </form>
      </div>
    </div>
  );
};
