import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { addReaction, removeReaction, addComment } from '@/services/postService';
import { getDisplayName, setDisplayName } from '@/utils/guestId';

// ─── Types ────────────────────────────────────────────────────────────────────

export type { ReactionType, PostComment, PostData } from '@/services/postService';
import type { ReactionType, PostComment, PostData } from '@/services/postService';

// ─── Constants ────────────────────────────────────────────────────────────────

const REACTIONS: { type: ReactionType; emoji: string; labelKey: string }[] = [
  { type: 'love', emoji: '❤️', labelKey: 'posts.reactions.love' },
  { type: 'wow',  emoji: '😍', labelKey: 'posts.reactions.wow'  },
  { type: 'fire', emoji: '🔥', labelKey: 'posts.reactions.fire' },
  { type: 'clap', emoji: '👏', labelKey: 'posts.reactions.clap' },
  { type: 'haha', emoji: '😂', labelKey: 'posts.reactions.haha' },
];

const EMOJI_LIST = [
  '❤️', '😍', '🔥', '👏', '😂', '🥹', '💯', '✨',
  '🌟', '📷', '🙏', '😊', '🤩', '💫', '👌', '🎨',
  '🌄', '🌿', '🌊', '🏔️', '🌸', '🦋', '⭐', '😮',
];

const COMMENTS_VISIBLE = 3;

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins  = Math.floor(diff / 60_000);
  const hours = Math.floor(diff / 3_600_000);
  const days  = Math.floor(diff / 86_400_000);
  if (mins  < 60)  return `${mins}m ago`;
  if (hours < 24)  return `${hours}h ago`;
  if (days  < 7)   return `${days}d ago`;
  if (days  < 30)  return `${Math.floor(days / 7)}w ago`;
  return new Date(dateStr).toLocaleDateString();
}

// ─── Sub-components ───────────────────────────────────────────────────────────

/** Full-screen photo zoom overlay */
function PhotoZoom({ url, onClose }: { url: string; onClose: () => void }) {
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onClose]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <button
        className="absolute top-4 right-4 rounded-full bg-white/20 p-2 hover:bg-white/30 transition-colors"
        onClick={onClose}
        aria-label="Close"
      >
        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
      <img
        src={url}
        alt=""
        className="max-w-full max-h-full object-contain rounded-lg"
        onClick={(e) => e.stopPropagation()}
      />
    </motion.div>
  );
}

/** Inline comment thread (light theme) */
function CommentThread({
  comments,
  postId,
}: {
  comments: PostComment[];
  postId: string;
}) {
  const { t } = useTranslation();
  const [list, setList]           = useState(comments);
  const [expanded, setExpanded]   = useState(false);
  const [input, setInput]         = useState('');
  const [name, setName]           = useState(getDisplayName);
  const [showNameInput, setShowNameInput] = useState(false);
  const [showEmoji, setShowEmoji] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const inputRef  = useRef<HTMLInputElement>(null);
  const emojiRef  = useRef<HTMLDivElement>(null);

  const hidden  = list.length - COMMENTS_VISIBLE;
  const visible = expanded ? list : list.slice(-COMMENTS_VISIBLE);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (emojiRef.current && !emojiRef.current.contains(e.target as Node)) {
        setShowEmoji(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const text = input.trim();
    if (!text || submitting) return;

    // Prompt for name on first comment
    if (!name.trim()) {
      setShowNameInput(true);
      return;
    }

    setSubmitting(true);
    try {
      const comment = await addComment(postId, text);
      setList((prev) => [...prev, comment]);
      setInput('');
      setExpanded(true);
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  const saveName = () => {
    const trimmed = name.trim();
    if (!trimmed) return;
    setDisplayName(trimmed);
    setShowNameInput(false);
    inputRef.current?.focus();
  };

  // suppress key events so arrow keys don't bubble to page
  const stopKeys = (e: React.KeyboardEvent) => e.stopPropagation();

  return (
    <div className="px-4 pb-4 space-y-3">
      {/* Expand older */}
      {!expanded && hidden > 0 && (
        <button
          onClick={() => setExpanded(true)}
          className="text-xs font-semibold text-gray-500 hover:text-gray-700 transition-colors"
        >
          {t('posts.viewOlderComments', { count: hidden })}
        </button>
      )}

      <AnimatePresence initial={false}>
        {visible.map((c) => (
          <motion.div
            key={c.id}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
            className="flex gap-2"
          >
            <div className="flex-shrink-0 h-8 w-8 rounded-full bg-primary-100 flex items-center justify-center">
              <span className="text-xs font-semibold text-primary-700">{c.avatar}</span>
            </div>
            <div className="flex-1 min-w-0">
              <div className="bg-gray-100 rounded-2xl rounded-tl-sm px-3 py-2 inline-block max-w-full">
                <p className="text-gray-900 text-xs font-semibold">{c.author}</p>
                <p className="text-gray-800 text-sm leading-snug break-words">{c.content}</p>
              </div>
              <p className="text-gray-400 text-xs mt-0.5 pl-1">{timeAgo(c.createdAt)}</p>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>

      {expanded && (
        <button
          onClick={() => setExpanded(false)}
          className="text-xs text-gray-400 hover:text-gray-600 transition-colors"
        >
          {t('posts.showLess')}
        </button>
      )}

      {/* Name prompt */}
      <AnimatePresence>
        {showNameInput && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="flex items-center gap-2 pt-1"
          >
            <input
              autoFocus
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              onKeyDown={(e) => { e.stopPropagation(); if (e.key === 'Enter') { e.preventDefault(); saveName(); } }}
              placeholder="Your name…"
              className="flex-1 bg-gray-100 text-gray-900 placeholder-gray-400 text-sm rounded-full px-4 py-2 outline-none focus:bg-gray-200 transition-colors"
            />
            <button
              type="button"
              onClick={saveName}
              disabled={!name.trim()}
              className="text-primary-500 hover:text-primary-600 disabled:text-gray-300 text-sm font-semibold transition-colors"
            >
              OK
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Input row */}
      <form onSubmit={submit} className="flex items-center gap-2 pt-1" data-post-id={postId}>
        <div className="relative" ref={emojiRef}>
          <button
            type="button"
            onClick={() => setShowEmoji((v) => !v)}
            className="text-gray-400 hover:text-gray-600 text-lg leading-none transition-colors"
            aria-label="Add emoji"
          >
            🙂
          </button>
          <AnimatePresence>
            {showEmoji && (
              <motion.div
                initial={{ opacity: 0, y: 6, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 6, scale: 0.95 }}
                transition={{ duration: 0.15 }}
                className="absolute bottom-9 left-0 bg-white border border-gray-200 rounded-xl shadow-lg p-2 grid grid-cols-8 gap-0.5 z-10 w-56"
              >
                {EMOJI_LIST.map((emoji) => (
                  <button
                    key={emoji}
                    type="button"
                    onClick={() => { setInput((p) => p + emoji); setShowEmoji(false); inputRef.current?.focus(); }}
                    className="text-lg leading-none p-1 rounded hover:bg-gray-100 transition-colors"
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
          onKeyDown={stopKeys}
          placeholder="Write a comment…"
          className="flex-1 bg-gray-100 text-gray-900 placeholder-gray-400 text-sm rounded-full px-4 py-2 outline-none focus:bg-gray-200 transition-colors"
        />
        <button
          type="submit"
          disabled={!input.trim()}
          className="text-primary-500 hover:text-primary-600 disabled:text-gray-300 disabled:cursor-not-allowed transition-colors"
          aria-label="Post comment"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
            <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
          </svg>
        </button>
      </form>
    </div>
  );
}

// ─── PostCard ─────────────────────────────────────────────────────────────────

export function PostCard({ post }: { post: PostData }) {
  const { t } = useTranslation();

  const [reactions, setReactions]     = useState(post.reactions);
  const [userReaction, setUserReaction] = useState<ReactionType | null>(post.userReaction ?? null);
  const [zoomed, setZoomed]           = useState(false);
  const [descExpanded, setDescExpanded] = useState(false);

  const DESC_LIMIT = 160;
  const longDesc = post.description.length > DESC_LIMIT;
  const displayDesc = descExpanded || !longDesc
    ? post.description
    : post.description.slice(0, DESC_LIMIT) + '…';

  const totalReactions = Object.values(reactions).reduce((a, b) => a + b, 0);

  const handleReaction = (type: ReactionType) => {
    // Optimistic update
    setReactions((prev) => {
      const next = { ...prev };
      if (userReaction === type) {
        next[type] = Math.max(0, next[type] - 1);
      } else {
        if (userReaction) next[userReaction] = Math.max(0, next[userReaction] - 1);
        next[type] = next[type] + 1;
      }
      return next;
    });
    const next = userReaction === type ? null : type;
    setUserReaction(next);

    // Persist to API
    if (next === null) {
      removeReaction(post.id).catch(console.error);
    } else {
      addReaction(post.id, next).catch(console.error);
    }
  };

  return (
    <>
      <article className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">

        {/* Header */}
        <div className="flex items-center gap-3 px-4 pt-4 pb-3">
          <div className="h-10 w-10 rounded-full bg-primary-600 flex items-center justify-center flex-shrink-0">
            <span className="text-sm font-bold text-white">K</span>
          </div>
          <div>
            <p className="text-sm font-semibold text-gray-900">Konrad</p>
            <p className="text-xs text-gray-400">{timeAgo(post.publishedAt)}</p>
          </div>
        </div>

        {/* Photo */}
        <div
          className="relative cursor-zoom-in overflow-hidden bg-gray-100"
          onClick={() => setZoomed(true)}
        >
          <img
            src={post.photoUrl}
            alt=""
            className="w-full object-cover max-h-[520px] hover:scale-[1.02] transition-transform duration-300"
          />
        </div>

        {/* Description */}
        <div className="px-4 pt-3 pb-2">
          <p className="text-gray-800 text-sm leading-relaxed whitespace-pre-line">
            {displayDesc}
          </p>
          {longDesc && (
            <button
              onClick={() => setDescExpanded((v) => !v)}
              className="text-xs font-semibold text-gray-400 hover:text-gray-600 mt-1 transition-colors"
            >
              {descExpanded ? t('posts.showLess') : t('posts.readMore')}
            </button>
          )}
        </div>

        {/* Reaction summary row */}
        {totalReactions > 0 && (
          <div className="px-4 pb-1 flex items-center gap-1">
            <div className="flex -space-x-0.5">
              {REACTIONS.filter((r) => reactions[r.type] > 0).map((r) => (
                <span key={r.type} className="text-sm leading-none">{r.emoji}</span>
              ))}
            </div>
            <span className="text-xs text-gray-400 ml-1">{totalReactions}</span>
          </div>
        )}

        {/* Divider */}
        <div className="mx-4 border-t border-gray-100 my-2" />

        {/* Reaction bar */}
        <div className="flex items-center gap-1 px-3 pb-3">
          {REACTIONS.map((r) => {
            const active = userReaction === r.type;
            return (
              <button
                key={r.type}
                onClick={() => handleReaction(r.type)}
                title={t(r.labelKey as Parameters<typeof t>[0])}
                className={`flex items-center gap-1 px-2.5 py-1.5 rounded-full text-sm transition-all duration-150 ${
                  active
                    ? 'bg-primary-50 text-primary-600 font-semibold scale-110'
                    : 'text-gray-500 hover:bg-gray-100'
                }`}
              >
                <span className="leading-none">{r.emoji}</span>
                {reactions[r.type] > 0 && (
                  <span className="text-xs tabular-nums">{reactions[r.type]}</span>
                )}
              </button>
            );
          })}
        </div>

        {/* Comments */}
        <div className="border-t border-gray-100">
          <CommentThread comments={post.comments} postId={post.id} />
        </div>
      </article>

      {/* Full-screen zoom */}
      <AnimatePresence>
        {zoomed && <PhotoZoom url={post.photoUrl} onClose={() => setZoomed(false)} />}
      </AnimatePresence>
    </>
  );
}
