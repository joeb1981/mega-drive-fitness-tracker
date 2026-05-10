import { useEffect, useMemo, useState } from 'react';
import { isSupabaseConfigured, supabase } from './lib/supabase';
import referenceSprite from '../watermarked_img_14248841167161989406.png.png';

const ALLOWED_EMAIL = (import.meta.env.VITE_ALLOWED_EMAIL || 'jrbrimble@aol.com').toLowerCase();
const STEP_GOAL = 20000;
const CALORIE_LIMIT = 2000;
const STRIDE_METERS = 0.78;
const QUEST_START = new Date('2026-05-10T00:00:00');
const DEADLINE = new Date('2026-06-20T23:59:59');

function toDateInputValue(date = new Date()) {
  const localDate = new Date(date.getTime() - date.getTimezoneOffset() * 60000);
  return localDate.toISOString().slice(0, 10);
}

function getDayDifference(start, end) {
  const msPerDay = 1000 * 60 * 60 * 24;
  return Math.ceil((end.getTime() - start.getTime()) / msPerDay);
}

function clamp(value, min = 0, max = 100) {
  return Math.min(Math.max(value, min), max);
}

function formatNumber(value) {
  return new Intl.NumberFormat('en-GB').format(value || 0);
}

function AuthScreen({ error, onLogin, loading }) {
  const [email, setEmail] = useState(ALLOWED_EMAIL);
  const [password, setPassword] = useState('');

  return (
    <main className="min-h-screen bg-void px-4 py-6 text-white sm:px-6 lg:px-8">
      <div className="crt-shell mx-auto flex min-h-[calc(100vh-3rem)] max-w-5xl items-center justify-center overflow-hidden rounded-[2rem] border-4 border-sonic/80 bg-night p-4 shadow-neon">
        <div className="crt-content w-full max-w-2xl rounded-lg border-2 border-magenta/80 bg-black/80 p-6 text-center">
          <p className="mb-6 text-xs uppercase leading-6 text-sonic">16-Bit Fitness Cartridge</p>
          <h1 className="text-xl leading-10 text-white sm:text-3xl">Press Start</h1>
          <p className="mx-auto mt-5 max-w-xl text-[10px] leading-6 text-cyan-100">
            Supabase Auth gate active. This quest cartridge only accepts the approved player email.
          </p>

          {!isSupabaseConfigured && (
            <div className="mt-6 border-2 border-ember bg-ember/10 p-4 text-left text-[10px] leading-5 text-amber-100">
              Supabase is not configured yet. Create a local .env file from .env.example, then restart the dev server.
            </div>
          )}

          <form className="mt-8 space-y-4 text-left" onSubmit={(event) => onLogin(event, email, password)}>
            <label className="block text-[10px] uppercase tracking-wide text-sonic">
              Player Email
              <input
                className="mt-2 w-full border-2 border-sonic bg-void p-3 text-xs text-white outline-none focus:border-magenta"
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                autoComplete="email"
              />
            </label>
            <label className="block text-[10px] uppercase tracking-wide text-sonic">
              Password
              <input
                className="mt-2 w-full border-2 border-sonic bg-void p-3 text-xs text-white outline-none focus:border-magenta"
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                autoComplete="current-password"
              />
            </label>
            {error && (
              <p className="border-2 border-magenta bg-magenta/10 p-3 text-[10px] leading-5 text-pink-100">{error}</p>
            )}
            <button
              className="w-full border-2 border-white bg-genesis px-5 py-4 text-xs uppercase text-white shadow-danger transition hover:bg-magenta disabled:cursor-not-allowed disabled:opacity-50"
              type="submit"
              disabled={loading || !isSupabaseConfigured}
            >
              {loading ? 'Loading...' : 'Start Quest'}
            </button>
          </form>
        </div>
      </div>
    </main>
  );
}

function PixelHero({ state }) {
  return (
    <div className="relative mx-auto h-64 w-52">
      <div className={`pixel-hero ${state}`} aria-label={`Fitness hero sprite in ${state} state`}>
        <span className="sprite-head" />
        <span className="sprite-beard" />
        <span className="sprite-torso" />
        <span className="sprite-belt" />
        <span className="sprite-shorts" />
        <span className="sprite-arm sprite-arm-left" />
        <span className="sprite-arm sprite-arm-right" />
        <span className="sprite-watch" />
        <span className="sprite-lead orange" />
        <span className="sprite-lead brown" />
        <span className="sprite-whistle" />
        <span className="sprite-leg sprite-leg-left" />
        <span className="sprite-leg sprite-leg-right" />
        <span className="sprite-boot sprite-boot-left" />
        <span className="sprite-boot sprite-boot-right" />
      </div>
      {state === 'victory' && <div className="pixel-star">★</div>}
      {state === 'damage' && <div className="damage-sweat">!</div>}
    </div>
  );
}

function ProgressBar({ label, value, target, dangerOver = false, kind }) {
  const percent = clamp((value / target) * 100);
  const overLimit = dangerOver && value > target;
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between gap-3 text-[10px] uppercase leading-5 text-cyan-100">
        <span>{label}</span>
        <span>
          {formatNumber(value)} / {formatNumber(target)}
        </span>
      </div>
      <div className="h-6 border-2 border-white bg-black p-1">
        <div
          className={`h-full transition-all duration-500 ${overLimit ? 'bg-magenta' : kind === 'xp' ? 'bg-sonic' : 'bg-ember'}`}
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  );
}

function QuestMap({ loggedDays, totalDays }) {
  const nodes = Array.from({ length: totalDays }, (_, index) => index);
  const currentNode = clamp(loggedDays, 0, totalDays - 1);

  return (
    <section className="border-2 border-sonic bg-black/65 p-4">
      <div className="mb-4 flex items-center justify-between gap-4">
        <h2 className="text-xs uppercase text-sonic">Quest Map</h2>
        <span className="text-[10px] text-cyan-100">{loggedDays} days logged</span>
      </div>
      <div className="grid grid-cols-7 gap-2 sm:grid-cols-14">
        {nodes.map((node) => (
          <div
            className={`relative aspect-square border-2 text-[8px] ${
              node < loggedDays
                ? 'border-sonic bg-sonic text-void'
                : node === currentNode
                  ? 'border-magenta bg-magenta/30 text-white shadow-danger'
                  : 'border-genesis bg-night text-cyan-100'
            }`}
            key={node}
            title={`Quest day ${node + 1}`}
          >
            <span className="absolute inset-0 flex items-center justify-center">{node + 1}</span>
            {node === currentNode && <span className="absolute -right-1 -top-2 text-xs text-ember">◆</span>}
          </div>
        ))}
      </div>
    </section>
  );
}

function ActivityForm({ currentEntry, onSave, saving }) {
  const [activityDate, setActivityDate] = useState(toDateInputValue());
  const [steps, setSteps] = useState(currentEntry?.steps || 0);
  const [calories, setCalories] = useState(currentEntry?.calories || 0);

  useEffect(() => {
    if (currentEntry) {
      setActivityDate(currentEntry.activity_date);
      setSteps(currentEntry.steps);
      setCalories(currentEntry.calories);
    }
  }, [currentEntry]);

  return (
    <form
      className="grid gap-4 border-2 border-magenta bg-black/65 p-4 md:grid-cols-[1fr_1fr_1fr_auto]"
      onSubmit={(event) => onSave(event, { activity_date: activityDate, steps, calories })}
    >
      <label className="text-[10px] uppercase leading-5 text-sonic">
        Date
        <input
          className="mt-2 w-full border-2 border-sonic bg-void p-3 text-xs text-white outline-none focus:border-magenta"
          type="date"
          max="2026-06-20"
          value={activityDate}
          onChange={(event) => setActivityDate(event.target.value)}
        />
      </label>
      <label className="text-[10px] uppercase leading-5 text-sonic">
        Steps
        <input
          className="mt-2 w-full border-2 border-sonic bg-void p-3 text-xs text-white outline-none focus:border-magenta"
          type="number"
          min="0"
          value={steps}
          onChange={(event) => setSteps(Number(event.target.value))}
        />
      </label>
      <label className="text-[10px] uppercase leading-5 text-sonic">
        Calories
        <input
          className="mt-2 w-full border-2 border-sonic bg-void p-3 text-xs text-white outline-none focus:border-magenta"
          type="number"
          min="0"
          value={calories}
          onChange={(event) => setCalories(Number(event.target.value))}
        />
      </label>
      <button
        className="self-end border-2 border-white bg-genesis px-5 py-4 text-xs uppercase text-white transition hover:bg-magenta disabled:opacity-50"
        type="submit"
        disabled={saving}
      >
        {saving ? 'Saving' : 'Log Day'}
      </button>
    </form>
  );
}

function ActivityLog({ entries }) {
  return (
    <section className="border-2 border-genesis bg-black/65 p-4">
      <h2 className="mb-4 text-xs uppercase text-sonic">Save Files</h2>
      <div className="max-h-72 overflow-auto">
        <table className="w-full min-w-[620px] border-collapse text-left text-[10px] leading-5">
          <thead className="sticky top-0 bg-void text-sonic">
            <tr>
              <th className="border-b-2 border-genesis p-3">Date</th>
              <th className="border-b-2 border-genesis p-3">Steps</th>
              <th className="border-b-2 border-genesis p-3">KM</th>
              <th className="border-b-2 border-genesis p-3">Calories</th>
              <th className="border-b-2 border-genesis p-3">State</th>
            </tr>
          </thead>
          <tbody>
            {entries.map((entry) => {
              const distance = ((entry.steps * STRIDE_METERS) / 1000).toFixed(2);
              const status = entry.steps >= STEP_GOAL && entry.calories < CALORIE_LIMIT
                ? 'Victory'
                : entry.calories > CALORIE_LIMIT
                  ? 'Damage'
                  : 'Walking';
              return (
                <tr className="text-cyan-100" key={entry.id || entry.activity_date}>
                  <td className="border-b border-genesis/50 p-3">{entry.activity_date}</td>
                  <td className="border-b border-genesis/50 p-3">{formatNumber(entry.steps)}</td>
                  <td className="border-b border-genesis/50 p-3">{distance}</td>
                  <td className="border-b border-genesis/50 p-3">{formatNumber(entry.calories)}</td>
                  <td className="border-b border-genesis/50 p-3">{status}</td>
                </tr>
              );
            })}
            {!entries.length && (
              <tr>
                <td className="p-4 text-cyan-100" colSpan="5">
                  No quest days logged yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}

function Dashboard({ session, onSignOut }) {
  const [entries, setEntries] = useState([]);
  const [loadingEntries, setLoadingEntries] = useState(true);
  const [saving, setSaving] = useState(false);
  const [notice, setNotice] = useState('');

  async function loadEntries() {
    setLoadingEntries(true);
    const { data, error } = await supabase
      .from('daily_activity')
      .select('*')
      .order('activity_date', { ascending: true });

    if (error) {
      setNotice(error.message);
    } else {
      setEntries(data || []);
    }
    setLoadingEntries(false);
  }

  useEffect(() => {
    loadEntries();
  }, []);

  const todayEntry = entries.find((entry) => entry.activity_date === toDateInputValue()) || entries.at(-1);
  const activeSteps = todayEntry?.steps || 0;
  const activeCalories = todayEntry?.calories || 0;
  const distanceKm = ((activeSteps * STRIDE_METERS) / 1000).toFixed(2);
  const daysRemaining = Math.max(0, getDayDifference(new Date(), DEADLINE));
  const totalQuestDays = getDayDifference(QUEST_START, DEADLINE) + 1;
  const spriteState = activeSteps >= STEP_GOAL && activeCalories < CALORIE_LIMIT
    ? 'victory'
    : activeCalories > CALORIE_LIMIT
      ? 'damage'
      : 'walking';

  async function handleSave(event, payload) {
    event.preventDefault();
    setSaving(true);
    setNotice('');

    const { error } = await supabase
      .from('daily_activity')
      .upsert(
        {
          ...payload,
          user_id: session.user.id,
          steps: Number(payload.steps),
          calories: Number(payload.calories),
        },
        { onConflict: 'user_id,activity_date' },
      )
      .select()
      .single();

    if (error) {
      setNotice(error.message);
    } else {
      setNotice('Quest day saved to Supabase.');
      await loadEntries();
    }
    setSaving(false);
  }

  return (
    <main className="min-h-screen bg-void px-3 py-4 text-white sm:px-6 lg:px-8">
      <div className="crt-shell mx-auto max-w-7xl overflow-hidden rounded-[2rem] border-4 border-sonic/80 bg-night p-3 shadow-neon sm:p-5">
        <div className="crt-content space-y-5">
          <header className="grid gap-4 border-2 border-sonic bg-black/70 p-4 lg:grid-cols-[1fr_auto] lg:items-center">
            <div>
              <p className="text-[10px] uppercase leading-5 text-magenta">Mega Drive Fitness Quest</p>
              <h1 className="mt-2 text-lg leading-9 text-white sm:text-2xl">June 20 Boss Run</h1>
            </div>
            <div className="flex flex-wrap items-center gap-3 text-[10px] leading-5 text-cyan-100">
              <span className="border-2 border-genesis bg-void px-3 py-2">{daysRemaining} days remaining</span>
              <span className="border-2 border-genesis bg-void px-3 py-2">{session.user.email}</span>
              <button className="border-2 border-white bg-magenta px-3 py-2 text-white" onClick={onSignOut} type="button">
                Quit
              </button>
            </div>
          </header>

          <section className="grid gap-5 lg:grid-cols-[340px_1fr]">
            <div className="space-y-5">
              <div className="border-2 border-sonic bg-black/65 p-4 text-center">
                <PixelHero state={spriteState} />
                <p className="mt-4 text-xs uppercase text-sonic">{spriteState} pose</p>
              </div>
              <div className="border-2 border-genesis bg-black/65 p-4">
                <h2 className="mb-3 text-xs uppercase text-sonic">Sprite Reference</h2>
                <img
                  alt="Reference sprite sheet for the bald bearded walking character"
                  className="aspect-video w-full border-2 border-genesis object-cover [image-rendering:pixelated]"
                  src={referenceSprite}
                />
              </div>
            </div>

            <div className="space-y-5">
              <ActivityForm currentEntry={todayEntry} onSave={handleSave} saving={saving} />
              {notice && <p className="border-2 border-ember bg-ember/10 p-3 text-[10px] leading-5 text-amber-100">{notice}</p>}

              <section className="grid gap-4 md:grid-cols-3">
                <div className="border-2 border-sonic bg-black/65 p-4">
                  <p className="text-[10px] uppercase text-cyan-100">KM Walked</p>
                  <p className="mt-3 text-2xl text-sonic">{distanceKm}</p>
                </div>
                <div className="border-2 border-sonic bg-black/65 p-4">
                  <p className="text-[10px] uppercase text-cyan-100">Step Goal</p>
                  <p className="mt-3 text-2xl text-sonic">{Math.round((activeSteps / STEP_GOAL) * 100)}%</p>
                </div>
                <div className="border-2 border-sonic bg-black/65 p-4">
                  <p className="text-[10px] uppercase text-cyan-100">Calorie Limit</p>
                  <p className={`mt-3 text-2xl ${activeCalories > CALORIE_LIMIT ? 'text-magenta' : 'text-sonic'}`}>
                    {activeCalories > CALORIE_LIMIT ? 'OVER' : 'OK'}
                  </p>
                </div>
              </section>

              <section className="space-y-5 border-2 border-genesis bg-black/65 p-4">
                <ProgressBar kind="xp" label="Steps XP" target={STEP_GOAL} value={activeSteps} />
                <ProgressBar dangerOver label="Calories Health" target={CALORIE_LIMIT} value={activeCalories} />
              </section>

              <QuestMap loggedDays={entries.length} totalDays={totalQuestDays} />
            </div>
          </section>

          {loadingEntries ? (
            <div className="border-2 border-sonic bg-black/65 p-4 text-[10px] text-cyan-100">Loading Supabase save files...</div>
          ) : (
            <ActivityLog entries={entries} />
          )}
        </div>
      </div>
    </main>
  );
}

export default function App() {
  const [session, setSession] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [authError, setAuthError] = useState('');

  const isAllowedSession = useMemo(
    () => session?.user?.email?.toLowerCase() === ALLOWED_EMAIL,
    [session],
  );

  useEffect(() => {
    if (!isSupabaseConfigured) {
      setAuthLoading(false);
      return undefined;
    }

    supabase.auth.getSession().then(({ data }) => {
      const nextSession = data.session;
      if (nextSession?.user?.email?.toLowerCase() !== ALLOWED_EMAIL) {
        supabase.auth.signOut();
        setSession(null);
      } else {
        setSession(nextSession);
      }
      setAuthLoading(false);
    });

    const { data: subscription } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      if (nextSession?.user?.email?.toLowerCase() !== ALLOWED_EMAIL) {
        supabase.auth.signOut();
        setSession(null);
        setAuthError('Access denied. This cartridge is locked to jrbrimble@aol.com.');
      } else {
        setSession(nextSession);
      }
    });

    return () => subscription.subscription.unsubscribe();
  }, []);

  async function handleLogin(event, email, password) {
    event.preventDefault();
    setAuthError('');

    if (email.toLowerCase() !== ALLOWED_EMAIL) {
      setAuthError('Access denied. Use the approved quest email.');
      return;
    }

    setAuthLoading(true);
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      setAuthError(error.message);
    } else {
      setSession(data.session);
    }

    setAuthLoading(false);
  }

  async function handleSignOut() {
    await supabase.auth.signOut();
    setSession(null);
  }

  if (authLoading) {
    return (
      <main className="grid min-h-screen place-items-center bg-void text-center font-pixel text-sonic">
        <p className="animate-pulseGlow text-xs">Loading cartridge...</p>
      </main>
    );
  }

  if (!session || !isAllowedSession) {
    return <AuthScreen error={authError} loading={authLoading} onLogin={handleLogin} />;
  }

  return <Dashboard session={session} onSignOut={handleSignOut} />;
}
