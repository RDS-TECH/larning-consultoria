'use client'
import React, { useState, useEffect, useRef } from 'react';
import { Plus, X, Link as LinkIcon } from 'lucide-react';
import Picker from '@emoji-mart/react';
import data from '@emoji-mart/data';
import { Input } from '@components/ui/input';
import { useTranslations } from 'next-intl';

interface LearningItem {
  id: string;
  text: string;
  emoji: string;
  link?: string;
}

interface LearningItemsListProps {
  initialValue: string;
  onChange: (value: string) => void;
  error?: string;
  resetKey?: string; // Add a key to force reset when course changes
}

const LearningItemsList = ({ initialValue, onChange, error, resetKey }: LearningItemsListProps) => {
  const t = useTranslations('courses.edit.learningItems');
  const [items, setItems] = useState<LearningItem[]>(() => {
    // Initialize state only once on mount
    try {
      if (initialValue) {
        const parsed = JSON.parse(initialValue);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch (e) {
      console.error('Error parsing initial learning items:', e);
    }
    // Default: one empty item
    return [{
      id: Date.now().toString(),
      text: '',
      emoji: '📝',
    }];
  });

  const [showEmojiPicker, setShowEmojiPicker] = useState<string | null>(null);
  const [showLinkInput, setShowLinkInput] = useState<string | null>(null);
  const [focusedItemId, setFocusedItemId] = useState<string | null>(null);
  const pickerRef = useRef<HTMLDivElement>(null);
  const linkInputRef = useRef<HTMLDivElement>(null);
  const inputRefs = useRef<Record<string, HTMLInputElement | null>>({});
  const linkInputFieldRefs = useRef<Record<string, HTMLInputElement | null>>({});
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const previousResetKey = useRef(resetKey);

  // ONLY reset when resetKey changes (different course loaded)
  useEffect(() => {
    if (resetKey && resetKey !== previousResetKey.current) {
      previousResetKey.current = resetKey;

      try {
        if (initialValue) {
          const parsed = JSON.parse(initialValue);
          if (Array.isArray(parsed) && parsed.length > 0) {
            setItems(parsed);
            return;
          }
        }
      } catch (e) {
        console.error('Error parsing learning items on reset:', e);
      }

      // Default: one empty item
      setItems([{
        id: Date.now().toString(),
        text: '',
        emoji: '📝',
      }]);
    }
  }, [resetKey, initialValue]);

  // Notify parent of changes - but never accept updates back!
  const notifyChange = (newItems: LearningItem[]) => {
    setItems(newItems);
    onChange(JSON.stringify(newItems));
  };

  // Add a new empty item
  const addItem = () => {
    const newItem: LearningItem = {
      id: Date.now().toString(),
      text: '',
      emoji: '📝',
    };
    const newItems = [...items, newItem];
    notifyChange(newItems);

    // Focus the newly added item after render
    setTimeout(() => {
      if (inputRefs.current[newItem.id]) {
        inputRefs.current[newItem.id]?.focus();
        setFocusedItemId(newItem.id);
      }

      // Scroll to the bottom when a new item is added
      if (scrollContainerRef.current && newItems.length > 5) {
        scrollContainerRef.current.scrollTop = scrollContainerRef.current.scrollHeight;
      }
    }, 0);
  };

  // Remove an item
  const removeItem = (id: string) => {
    if (focusedItemId === id) {
      setFocusedItemId(null);
    }
    notifyChange(items.filter(item => item.id !== id));
  };

  // Update item text
  const updateItemText = (id: string, text: string) => {
    notifyChange(
      items.map(item => (item.id === id ? { ...item, text } : item))
    );
  };

  // Update item emoji
  const updateItemEmoji = (id: string, emoji: string) => {
    const newItems = items.map(item => (item.id === id ? { ...item, emoji } : item));
    notifyChange(newItems);
    setShowEmojiPicker(null);

    // Restore focus to the text input after emoji selection
    setTimeout(() => {
      if (inputRefs.current[id]) {
        inputRefs.current[id]?.focus();
        setFocusedItemId(id);
      }
    }, 0);
  };

  // Update item link
  const updateItemLink = (id: string, link: string) => {
    notifyChange(
      items.map(item => (item.id === id ? { ...item, link } : item))
    );
  };

  // Handle emoji selection
  const handleEmojiSelect = (id: string, emojiData: any) => {
    updateItemEmoji(id, emojiData.native);
  };

  // Handle focus on input
  const handleInputFocus = (id: string) => {
    setFocusedItemId(id);
  };

  // Handle blur on input
  const handleInputBlur = () => {
    setTimeout(() => {
      if (!document.activeElement ||
          !document.activeElement.classList.contains('learning-item-input')) {
        setFocusedItemId(null);
      }
    }, 100);
  };

  // Restore focus after re-render if an item was focused
  useEffect(() => {
    if (focusedItemId) {
      if (showLinkInput === focusedItemId) {
        if (linkInputFieldRefs.current[focusedItemId]) {
          linkInputFieldRefs.current[focusedItemId]?.focus();
        }
      } else {
        if (inputRefs.current[focusedItemId]) {
          inputRefs.current[focusedItemId]?.focus();
        }
      }

      // Scroll the focused item into view if needed
      if (items.length > 5 && scrollContainerRef.current) {
        const focusedElement = document.getElementById(`learning-item-${focusedItemId}`);
        if (focusedElement) {
          const containerRect = scrollContainerRef.current.getBoundingClientRect();
          const elementRect = focusedElement.getBoundingClientRect();

          if (elementRect.top < containerRect.top || elementRect.bottom > containerRect.bottom) {
            focusedElement.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
          }
        }
      }
    }
  }, [items, focusedItemId, showLinkInput]);

  // Handle clicks outside of emoji picker and link input
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (pickerRef.current && !pickerRef.current.contains(event.target as Node)) {
        setShowEmojiPicker(null);
      }
      if (linkInputRef.current && !linkInputRef.current.contains(event.target as Node)) {
        setShowLinkInput(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Ref callback for text inputs
  const setInputRef = (id: string) => (el: HTMLInputElement | null) => {
    inputRefs.current[id] = el;
  };

  // Ref callback for link inputs
  const setLinkInputRef = (id: string) => (el: HTMLInputElement | null) => {
    linkInputFieldRefs.current[id] = el;
  };

  // Determine if we need to make the list scrollable
  const isScrollable = items.length > 5;

  return (
    <div className="space-y-2">
      {items.length === 0 && (
        <div className="text-center py-3 text-gray-500 bg-gray-50/50 rounded-lg text-sm">
          {t('emptyState')}
        </div>
      )}

      <div
        ref={scrollContainerRef}
        className={`space-y-2 ${isScrollable ? 'max-h-[350px] overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-gray-200 scrollbar-track-transparent' : ''}`}
      >
        {items.map((item) => (
          <div key={item.id} id={`learning-item-${item.id}`} className="group relative">
            <div className="flex items-center gap-2 py-2 px-3 bg-gray-50/70 hover:bg-gray-50 border border-gray-100 rounded-lg transition-colors">
              <button
                type="button"
                onClick={() => {
                  setShowEmojiPicker(showEmojiPicker === item.id ? null : item.id);
                  setShowLinkInput(null);
                }}
                className="text-lg shrink-0"
              >
                <span>{item.emoji}</span>
              </button>

              <Input
                ref={setInputRef(item.id)}
                value={item.text}
                onChange={(e) => updateItemText(item.id, e.target.value)}
                onFocus={() => handleInputFocus(item.id)}
                onBlur={handleInputBlur}
                placeholder={t('placeholder')}
                className="grow border-0 bg-transparent focus-visible:ring-0 px-0 h-8 text-sm learning-item-input"
              />

              {item.link && (
                <div className="text-xs text-blue-500 flex items-center gap-1 bg-blue-50 px-2 py-0.5 rounded">
                  <LinkIcon size={12} />
                  <span className="truncate max-w-[100px]">{item.link}</span>
                </div>
              )}

              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => {
                    setShowLinkInput(showLinkInput === item.id ? null : item.id);
                    setShowEmojiPicker(null);
                    setFocusedItemId(item.id);
                    setTimeout(() => {
                      if (linkInputFieldRefs.current[item.id]) {
                        linkInputFieldRefs.current[item.id]?.focus();
                      }
                    }, 0);
                  }}
                  className="text-gray-400 hover:text-blue-500 transition-colors"
                  title={item.link ? t('editLink') : t('addLink')}
                >
                  <LinkIcon size={15} />
                </button>

                <button
                  type="button"
                  onClick={() => removeItem(item.id)}
                  className="text-gray-300 hover:text-gray-500 transition-colors"
                  aria-label={t('removeItem')}
                  title={t('removeItem')}
                >
                  <X size={15} />
                </button>
              </div>
            </div>

            {showEmojiPicker === item.id && (
              <div ref={pickerRef} className="absolute z-10 mt-1 left-0">
                <Picker
                  data={data}
                  onEmojiSelect={(emoji: any) => handleEmojiSelect(item.id, emoji)}
                  theme="light"
                  previewPosition="none"
                  searchPosition="top"
                  maxFrequentRows={0}
                  autoFocus={false}
                />
              </div>
            )}

            {showLinkInput === item.id && (
              <div ref={linkInputRef} className="mt-1 p-2 bg-white border border-gray-200 rounded-lg shadow-xs">
                <Input
                  ref={setLinkInputRef(item.id)}
                  value={items.find(i => i.id === item.id)?.link || ''}
                  onChange={(e) => updateItemLink(item.id, e.target.value)}
                  onFocus={() => handleInputFocus(item.id)}
                  onBlur={handleInputBlur}
                  placeholder={t('urlPlaceholder')}
                  className="w-full text-sm learning-item-input"
                  autoFocus
                />
              </div>
            )}
          </div>
        ))}
      </div>

      <button
        type="button"
        onClick={addItem}
        className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-700 transition-colors mt-2"
      >
        <Plus size={16} className="text-blue-500" />
        <span>{t('addItem')}</span>
      </button>
    </div>
  );
};

export default LearningItemsList;
