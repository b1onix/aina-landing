import {useEffect, useMemo, useState} from 'react';
import {ArrowLeft, Check, Download, Trash2} from 'lucide-react';
import {
  clearFeedbackItems,
  deleteFeedbackItem,
  FeedbackItem,
  FeedbackStatus,
  getFeedbackItems,
  updateFeedbackStatus,
} from './feedbackStorage';

function formatDate(value: string) {
  return new Intl.DateTimeFormat(undefined, {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(new Date(value));
}

function statusClass(status: FeedbackStatus) {
  if (status === 'resolved') return 'bg-aina-green text-white';
  if (status === 'reviewed') return 'bg-aina-yellow text-aina-green';
  return 'bg-white text-aina-green';
}

export function AdminPanel() {
  const [items, setItems] = useState<FeedbackItem[]>([]);
  const [loading, setLoading] = useState(true);

  const counts = useMemo(
    () => ({
      total: items.length,
      new: items.filter((item) => item.status === 'new').length,
      reviewed: items.filter((item) => item.status === 'reviewed').length,
      resolved: items.filter((item) => item.status === 'resolved').length,
    }),
    [items],
  );

  const refresh = async () => {
    setLoading(true);
    setItems(await getFeedbackItems());
    setLoading(false);
  };

  useEffect(() => {
    void refresh();
  }, []);

  const setStatus = async (id: string, status: FeedbackStatus) => {
    await updateFeedbackStatus(id, status);
    await refresh();
  };

  const removeItem = async (id: string) => {
    await deleteFeedbackItem(id);
    await refresh();
  };

  const clearAll = async () => {
    if (!window.confirm('Delete all locally stored feedback?')) return;

    await clearFeedbackItems();
    await refresh();
  };

  const exportJson = () => {
    const blob = new Blob([JSON.stringify(items, null, 2)], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');

    link.href = url;
    link.download = `aina-feedback-${new Date().toISOString().slice(0, 10)}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-aina-light text-aina-green">
      <header className="border-b border-aina-green/10 bg-white">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-5 py-5 md:flex-row md:items-center md:justify-between md:px-8">
          <div>
            <a href="/" className="inline-flex items-center gap-2 text-sm font-extrabold text-aina-green">
              <ArrowLeft size={17} />
              Back to landing page
            </a>
            <h1 className="mt-4 text-3xl font-extrabold md:text-4xl">Feedback admin</h1>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-aina-green/65">
              Feedback is stored in local SQLite when the AINA server is running, with a browser
              offline database fallback for static previews. No login is required.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              onClick={exportJson}
              disabled={!items.length}
              className="inline-flex items-center gap-2 rounded-lg border border-aina-green/20 bg-white px-4 py-2.5 text-sm font-bold disabled:cursor-not-allowed disabled:opacity-50"
            >
              <Download size={16} />
              Export JSON
            </button>
            <button
              type="button"
              onClick={clearAll}
              disabled={!items.length}
              className="inline-flex items-center gap-2 rounded-lg bg-aina-green px-4 py-2.5 text-sm font-bold text-white disabled:cursor-not-allowed disabled:opacity-50"
            >
              <Trash2 size={16} />
              Clear all
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-5 py-8 md:px-8">
        <div className="grid gap-4 sm:grid-cols-4">
          {[
            ['Total', counts.total],
            ['New', counts.new],
            ['Reviewed', counts.reviewed],
            ['Resolved', counts.resolved],
          ].map(([label, value]) => (
            <div key={label} className="rounded-lg border border-aina-green/10 bg-white p-5">
              <p className="text-sm font-bold text-aina-green/62">{label}</p>
              <p className="mt-1 text-3xl font-extrabold">{value}</p>
            </div>
          ))}
        </div>

        <section className="mt-6 rounded-lg border border-aina-green/10 bg-white">
          <div className="border-b border-aina-green/10 p-5">
            <h2 className="text-xl font-extrabold">Submissions</h2>
          </div>

          {loading ? (
            <p className="p-5 text-sm text-aina-green/65">Loading feedback...</p>
          ) : items.length ? (
            <div className="divide-y divide-aina-green/10">
              {items.map((item) => (
                <article key={item.id} className="grid gap-5 p-5 lg:grid-cols-[1fr_260px]">
                  <div>
                    <div className="flex flex-wrap items-center gap-3">
                      <span className={`rounded-lg border border-aina-green/10 px-2.5 py-1 text-xs font-extrabold ${statusClass(item.status)}`}>
                        {item.status}
                      </span>
                      <p className="text-sm text-aina-green/60">{formatDate(item.createdAt)}</p>
                    </div>
                    <p className="mt-4 whitespace-pre-wrap text-base leading-7">{item.comment}</p>
                    <div className="mt-5 grid gap-3 rounded-lg border border-aina-green/10 bg-aina-light p-4 text-sm leading-6 text-aina-green/68 md:grid-cols-2">
                      <div>
                        <p className="font-extrabold text-aina-green">Selected element</p>
                        <p className="mt-1">{item.elementLabel}</p>
                        <p className="mt-1 text-xs">{item.elementTag}</p>
                      </div>
                      <div>
                        <p className="font-extrabold text-aina-green">Location</p>
                        <p className="mt-1 break-words">{item.pagePath}</p>
                        <p className="mt-1 break-words text-xs">{item.elementSelector}</p>
                      </div>
                      {item.elementText ? (
                        <div className="md:col-span-2">
                          <p className="font-extrabold text-aina-green">Text snapshot</p>
                          <p className="mt-1">{item.elementText}</p>
                        </div>
                      ) : null}
                    </div>
                  </div>

                  <div className="flex flex-col gap-3">
                    <button
                      type="button"
                      onClick={() => setStatus(item.id, 'new')}
                      className="rounded-lg border border-aina-green/20 px-4 py-2.5 text-sm font-bold"
                    >
                      Mark new
                    </button>
                    <button
                      type="button"
                      onClick={() => setStatus(item.id, 'reviewed')}
                      className="rounded-lg border border-aina-green/20 px-4 py-2.5 text-sm font-bold"
                    >
                      Mark reviewed
                    </button>
                    <button
                      type="button"
                      onClick={() => setStatus(item.id, 'resolved')}
                      className="inline-flex items-center justify-center gap-2 rounded-lg bg-aina-green px-4 py-2.5 text-sm font-bold text-white"
                    >
                      <Check size={16} />
                      Mark resolved
                    </button>
                    <button
                      type="button"
                      onClick={() => removeItem(item.id)}
                      className="inline-flex items-center justify-center gap-2 rounded-lg border border-aina-green/20 px-4 py-2.5 text-sm font-bold"
                    >
                      <Trash2 size={16} />
                      Delete
                    </button>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <div className="p-8">
              <p className="text-lg font-extrabold">No feedback yet.</p>
              <p className="mt-2 max-w-xl text-sm leading-6 text-aina-green/65">
                Go back to the landing page, click the bottom-right feedback button, select an element,
                and submit a note. It will appear here automatically.
              </p>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
