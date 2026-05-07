import {useEffect, useState} from 'react';
import {Check, MessageSquareText, MousePointer2, Send, X} from 'lucide-react';
import {addFeedbackItem} from './feedbackStorage';

type SelectedElement = {
  tag: string;
  label: string;
  selector: string;
  text: string;
  rect: DOMRect;
};

const selectableSelector = [
  'button',
  'a',
  'h1',
  'h2',
  'h3',
  'p',
  'li',
  'img',
  'article',
  'section',
  'header',
  'footer',
  'nav',
  '[data-reviewable]',
].join(',');

function createId() {
  if ('randomUUID' in crypto) {
    return crypto.randomUUID();
  }

  return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function normalizeText(value: string | null | undefined, length = 220) {
  return (value ?? '').replace(/\s+/g, ' ').trim().slice(0, length);
}

function getElementLabel(element: HTMLElement) {
  const aria = normalizeText(element.getAttribute('aria-label'), 120);
  const alt = element instanceof HTMLImageElement ? normalizeText(element.alt, 120) : '';
  const heading = normalizeText(element.querySelector('h1,h2,h3')?.textContent, 120);
  const ownText = normalizeText(element.textContent, 120);

  return aria || alt || heading || ownText || element.tagName.toLowerCase();
}

function cssEscape(value: string) {
  return value.replace(/[^a-zA-Z0-9_-]/g, (match) => `\\${match}`);
}

function getElementSelector(element: HTMLElement) {
  if (element.id) {
    return `#${cssEscape(element.id)}`;
  }

  const parts: string[] = [];
  let current: HTMLElement | null = element;

  while (current && current !== document.body && parts.length < 5) {
    let part = current.tagName.toLowerCase();

    if (current.id) {
      part += `#${cssEscape(current.id)}`;
      parts.unshift(part);
      break;
    }

    const parent = current.parentElement;

    if (parent) {
      const siblings = Array.from(parent.children).filter(
        (child) => child.tagName === current?.tagName,
      );

      if (siblings.length > 1) {
        part += `:nth-of-type(${siblings.indexOf(current) + 1})`;
      }
    }

    parts.unshift(part);
    current = current.parentElement;
  }

  return parts.join(' > ');
}

function findSelectableElement(element: Element | null) {
  if (!(element instanceof HTMLElement)) return null;
  if (element.closest('[data-review-ui]')) return null;

  const target = element.closest(selectableSelector);

  if (!(target instanceof HTMLElement)) return null;
  if (target.closest('[data-review-ui]')) return null;
  if (target === document.body || target === document.documentElement) return null;

  return target;
}

function describeElement(element: HTMLElement): SelectedElement {
  return {
    tag: element.tagName.toLowerCase(),
    label: getElementLabel(element),
    selector: getElementSelector(element),
    text: normalizeText(element.textContent || element.getAttribute('alt'), 420),
    rect: element.getBoundingClientRect(),
  };
}

function rectToStyle(rect: DOMRect | null) {
  if (!rect) return {};

  return {
    left: `${rect.left}px`,
    top: `${rect.top}px`,
    width: `${rect.width}px`,
    height: `${rect.height}px`,
  };
}

export function ReviewWidget() {
  const [selecting, setSelecting] = useState(false);
  const [hovered, setHovered] = useState<SelectedElement | null>(null);
  const [selected, setSelected] = useState<SelectedElement | null>(null);
  const [comment, setComment] = useState('');
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!selecting) return;

    const handleMove = (event: MouseEvent) => {
      const element = findSelectableElement(document.elementFromPoint(event.clientX, event.clientY));
      setHovered(element ? describeElement(element) : null);
    };

    const handleClick = (event: MouseEvent) => {
      const element = findSelectableElement(document.elementFromPoint(event.clientX, event.clientY));

      if (!element) return;

      event.preventDefault();
      event.stopPropagation();
      setSelected(describeElement(element));
      setSelecting(false);
      setSaved(false);
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setSelecting(false);
        setHovered(null);
      }
    };

    document.addEventListener('mousemove', handleMove, true);
    document.addEventListener('click', handleClick, true);
    document.addEventListener('keydown', handleKeyDown, true);
    document.body.classList.add('review-selecting');

    return () => {
      document.removeEventListener('mousemove', handleMove, true);
      document.removeEventListener('click', handleClick, true);
      document.removeEventListener('keydown', handleKeyDown, true);
      document.body.classList.remove('review-selecting');
    };
  }, [selecting]);

  const closeModal = () => {
    setSelected(null);
    setComment('');
    setSaving(false);
  };

  const saveFeedback = async () => {
    if (!selected || !comment.trim()) return;

    setSaving(true);

    await addFeedbackItem({
      id: createId(),
      createdAt: new Date().toISOString(),
      pagePath: `${window.location.pathname}${window.location.hash}`,
      comment: comment.trim(),
      status: 'new',
      elementTag: selected.tag,
      elementLabel: selected.label,
      elementSelector: selected.selector,
      elementText: selected.text,
      rect: {
        x: Math.round(selected.rect.left + window.scrollX),
        y: Math.round(selected.rect.top + window.scrollY),
        width: Math.round(selected.rect.width),
        height: Math.round(selected.rect.height),
      },
      viewport: {
        width: window.innerWidth,
        height: window.innerHeight,
      },
    });

    setSaving(false);
    setSaved(true);
    window.setTimeout(closeModal, 900);
  };

  return (
    <div data-review-ui>
      {selecting ? (
        <>
          <div
            className="pointer-events-none fixed z-[80] rounded-lg border-2 border-aina-yellow bg-aina-yellow/15"
            style={rectToStyle(hovered?.rect ?? null)}
          />
          <div className="fixed bottom-5 right-5 z-[90] flex items-center gap-3 rounded-lg border border-aina-green/15 bg-white px-4 py-3 text-sm font-bold text-aina-green shadow-sm">
            <MousePointer2 size={17} />
            Select an element
            <button
              type="button"
              onClick={() => setSelecting(false)}
              className="ml-1 flex h-8 w-8 items-center justify-center rounded-lg border border-aina-green/15"
              aria-label="Cancel element selection"
            >
              <X size={16} />
            </button>
          </div>
        </>
      ) : (
        <button
          type="button"
          onClick={() => {
            setSaved(false);
            setSelecting(true);
          }}
          className="fixed bottom-5 right-5 z-[70] inline-flex items-center gap-2 rounded-lg bg-aina-green px-4 py-3 text-sm font-extrabold text-white shadow-sm transition-colors hover:bg-aina-green/90"
        >
          <MessageSquareText size={18} />
          Leave feedback
        </button>
      )}

      {selected ? (
        <div className="fixed inset-0 z-[100] grid place-items-center bg-aina-green/35 px-4 py-6">
          <div className="w-full max-w-lg rounded-lg border border-aina-green/10 bg-white p-5 text-aina-green shadow-sm">
            <div className="flex items-start justify-between gap-5 border-b border-aina-green/10 pb-4">
              <div>
                <h2 className="text-xl font-extrabold">Feedback for selected element</h2>
                <p className="mt-1 text-sm leading-6 text-aina-green/65">
                  {selected.label}
                </p>
              </div>
              <button
                type="button"
                onClick={closeModal}
                className="flex h-9 w-9 items-center justify-center rounded-lg border border-aina-green/15"
                aria-label="Close feedback form"
              >
                <X size={18} />
              </button>
            </div>

            <div className="mt-4 rounded-lg border border-aina-green/10 bg-aina-light p-3 text-xs leading-5 text-aina-green/65">
              <p className="font-bold text-aina-green">{selected.tag}</p>
              <p className="mt-1 break-words">{selected.selector}</p>
            </div>

            <label className="mt-5 block text-sm font-extrabold" htmlFor="feedback-comment">
              What needs to change?
            </label>
            <textarea
              id="feedback-comment"
              value={comment}
              onChange={(event) => setComment(event.target.value)}
              rows={5}
              className="mt-2 w-full resize-none rounded-lg border border-aina-green/20 bg-white px-3 py-3 text-sm leading-6 outline-none transition-colors focus:border-aina-green"
              placeholder="Write the change, replacement, or note for this selected area..."
            />

            <div className="mt-5 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={closeModal}
                className="rounded-lg border border-aina-green/20 px-4 py-2.5 text-sm font-bold text-aina-green"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={saveFeedback}
                disabled={!comment.trim() || saving || saved}
                className="inline-flex items-center justify-center gap-2 rounded-lg bg-aina-green px-4 py-2.5 text-sm font-extrabold text-white disabled:cursor-not-allowed disabled:opacity-55"
              >
                {saved ? <Check size={17} /> : <Send size={17} />}
                {saved ? 'Saved' : saving ? 'Saving...' : 'Save feedback'}
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}

