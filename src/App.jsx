import { useEffect, useMemo, useState } from 'react';
import { isSupabaseConfigured, supabase } from './lib/supabase';
import spriteSheet from '../watermarked_img_14248841167161989406.png.png';

function normalizeEmail(email = '') {
  return email.trim().toLowerCase();
}

const ALLOWED_EMAIL = normalizeEmail(import.meta.env.VITE_ALLOWED_EMAIL || 'jrbrimble@aol.com');
const STEP_GOAL = 20000;
const CALORIE_LIMIT = 2000;
const STRIDE_METERS = 0.78;
const TIME_ZONE = 'Europe/London';
const QUEST_START_DATE = '2026-05-10';
const DEADLINE_DATE = '2026-06-20';

function getHalesowenDateValue(date = new Date()) {
  const parts = new Intl.DateTimeFormat('en-GB', {
    timeZone: TIME_ZONE,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).formatToParts(date);

  const dateParts = Object.fromEntries(parts.map((part) => [part.type, part.value]));
  return `${dateParts.year}-${dateParts.month}-${dateParts.day}`;
}

function dateValueToUtc(dateValue) {
  const [year, month, day] = dateValue.split('-').map(Number);
  return Date.UTC(year, month - 1, day);
}

function getDateValueDifference(startDateValue, endDateValue) {
  const msPerDay = 1000 * 60 * 60 * 24;
  return Math.round((dateValueToUtc(endDateValue) - dateValueToUtc(startDateValue)) / msPerDay);
}

function formatQuestDate(dateValue) {
  return new Intl.DateTimeFormat('en-GB', {
    timeZone: 'UTC',
    weekday: 'short',
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).format(new Date(`${dateValue}T12:00:00Z`));
}

function formatHalesowenTime(date = new Date()) {
  return new Intl.DateTimeFormat('en-GB', {
    timeZone: TIME_ZONE,
    weekday: 'short',
    day: '2-digit',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date);
}

function clamp(value, min = 0, max = 100) {
  return Math.min(Math.max(value, min), max);
}

function formatNumber(value) {
  return new Intl.NumberFormat('en-GB').format(value || 0);
}

function getDistanceKm(steps) {
  return (steps * STRIDE_METERS) / 1000;
}

function getEntryStatus(entry) {
  if (!entry) return 'Awaiting log';
  if (entry.steps >= STEP_GOAL && entry.calories < CALORIE_LIMIT) return 'Victory';
  if (entry.calories > CALORIE_LIMIT) return 'Damage';
  return 'Walking';
}

function AuthScreen({ error, onLogin, loading }) {
  const [email, setEmail] = useState(ALLOWED_EMAIL);
  const [password, setPassword] = useState('');

  return (
    <main className="min-h-screen bg-void px-4 py-6 text-white sm:px-6 lg:px-8">
      <div className="crt-shell mx-auto flex min-h-[calc(100vh-3rem)] max-w-5xl items-center justify-center overflow-hidden rounded-[2rem] border border-sonic/80 bg-night p-4 shadow-neon">
        <div className="crt-content w-full max-w-2xl rounded-lg border border-magenta/80 bg-black/80 p-6 text-center shadow-[0_0_34px_rgba(255,56,209,0.22)]">
          <p className="mb-6 text-xs uppercase leading-6 text-sonic">Mega Drive Calorie Quest</p>
          <h1 className="text-xl leading-10 text-white sm:text-3xl">Press Start</h1>
          <p className="mx-auto mt-5 max-w-xl text-[10px] leading-6 text-cyan-100">
            Supabase Auth gate active. This quest cartridge only accepts the approved player email.
          </p>

          {!isSupabaseConfigured && (
            <div className="mt-6 border border-ember bg-ember/10 p-4 text-left text-[10px] leading-5 text-amber-100">
              Supabase is not configured yet. Create a local .env file from .env.example, then restart the dev server.
            </div>
          )}

          <form className="mt-8 space-y-4 text-left" onSubmit={(event) => onLogin(event, email, password)}>
            <label className="block text-[10px] uppercase tracking-wide text-sonic">
              Player Email
              <input
                className="console-input mt-2"
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                autoComplete="email"
              />
            </label>
            <label className="block text-[10px] uppercase tracking-wide text-sonic">
              Password
              <input
                className="console-input mt-2"
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                autoComplete="current-password"
              />
            </label>
            {error && (
              <p className="border border-magenta bg-magenta/10 p-3 text-[10px] leading-5 text-pink-100">{error}</p>
            )}
            <button className="console-button w-full px-5 py-4 text-xs" type="submit" disabled={loading || !isSupabaseConfigured}>
              {loading ? 'Loading...' : 'Start Quest'}
            </button>
          </form>
        </div>
      </div>
    </main>
  );
}

function SpriteHero({ state }) {
  return (
    <div className="sprite-stage" aria-label={`Player sprite in ${state} state`}>
      <div className={`sprite-sheet-player sprite-${state}`} style={{ backgroundImage: `url(${spriteSheet})` }} />
      <div className="sprite-shadow" />
    </div>
  );
}

function ProgressBar({ label, value, target, dangerOver = false, kind, caption }) {
  const percent = clamp((value / target) * 100);
  const overLimit = dangerOver && value > target;

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between gap-3 text-[10px] uppercase leading-5 text-cyan-100">
        <span>{label}</span>
        <span>
          {formatNumber(value)} / {formatNumber(target)}
        </span>
      </div>
      <div className="h-8 border border-white/70 bg-black/90 p-1 shadow-[inset_0_0_12px_rgba(0,0,0,0.9)]">
        <div
          className={`h-full transition-all duration-500 ${
            overLimit
              ? 'bg-[linear-gradient(90deg,#ff38d1,#ff8a00)]'
              : kind === 'xp'
                ? 'bg-[linear-gradient(90deg,#0ff4ff,#6c2dff)]'
                : 'bg-[linear-gradient(90deg,#36ff8f,#ff8a00)]'
          }`}
          style={{ width: `${percent}%` }}
        />
      </div>
      {caption && <p className="text-[9px] leading-5 text-cyan-100/80">{caption}</p>}
    </div>
  );
}

function MetricCard({ label, value, tone = 'cyan', detail }) {
  const toneClass = tone === 'danger' ? 'text-magenta' : tone === 'warm' ? 'text-ember' : 'text-sonic';

  return (
    <div className="console-card p-4">
      <p className="text-[9px] uppercase leading-5 text-cyan-100/80">{label}</p>
      <p className={`mt-3 text-xl leading-8 ${toneClass}`}>{value}</p>
      {detail && <p className="mt-2 text-[9px] leading-5 text-cyan-100/70">{detail}</p>}
    </div>
  );
}

function QuestMap({ entries, totalDays }) {
  const loggedDates = new Set(entries.map((entry) => entry.activity_date));
  const currentNode = clamp(entries.length, 0, totalDays - 1);
  const nodes = Array.from({ length: totalDays }, (_, index) => {
    const nodeTime = dateValueToUtc(QUEST_START_DATE) + index * 24 * 60 * 60 * 1000;
    return new Date(nodeTime).toISOString().slice(0, 10);
  });

  return (
    <section className="console-panel p-4">
      <div className="mb-4 flex items-center justify-between gap-4">
        <h2 className="text-xs uppercase text-sonic">Holiday Quest Map</h2>
        <span className="text-[10px] text-cyan-100">{entries.length} days logged</span>
      </div>
      <div className="quest-road">
        {nodes.map((dateValue, index) => {
          const logged = loggedDates.has(dateValue);
          const current = index === currentNode;

          return (
            <div
              className={`quest-node ${logged ? 'quest-node-complete' : ''} ${current ? 'quest-node-current' : ''}`}
              key={dateValue}
              title={`${formatQuestDate(dateValue)}${logged ? ' logged' : ''}`}
            >
              <span>{index + 1}</span>
            </div>
          );
        })}
      </div>
    </section>
  );
}

function ActivityForm({ currentEntry, onSave, saving, todayDate }) {
  const [steps, setSteps] = useState(currentEntry?.steps || 0);
  const [calories, setCalories] = useState(currentEntry?.calories || 0);

  useEffect(() => {
    setSteps(currentEntry?.steps || 0);
    setCalories(currentEntry?.calories || 0);
  }, [currentEntry, todayDate]);

  return (
    <form
      className="console-panel grid gap-4 p-4 md:grid-cols-[1.15fr_1fr_1fr_auto] md:items-end"
      onSubmit={(event) => onSave(event, { activity_date: todayDate, steps, calories })}
    >
      <div className="console-readout min-h-[72px] p-3">
        <p className="text-[9px] uppercase leading-5 text-magenta">Today&apos;s Quest</p>
        <p className="mt-2 text-[11px] leading-6 text-white">{formatQuestDate(todayDate)}</p>
      </div>
      <label className="text-[10px] uppercase leading-5 text-sonic">
        Steps
        <input
          className="console-input mt-2"
          type="number"
          min="0"
          value={steps}
          onChange={(event) => setSteps(Number(event.target.value))}
        />
      </label>
      <label className="text-[10px] uppercase leading-5 text-sonic">
        Calories
        <input
          className="console-input mt-2"
          type="number"
          min="0"
          value={calories}
          onChange={(event) => setCalories(Number(event.target.value))}
        />
      </label>
      <button className="console-button h-[54px] px-5 text-xs" type="submit" disabled={saving}>
        {saving ? 'Saving' : currentEntry ? 'Update' : 'Log Today'}
      </button>
    </form>
  );
}

function DayReview({ entries, selectedDate, onSelectDate }) {
  const selectedEntry = entries.find((entry) => entry.activity_date === selectedDate);
  const status = getEntryStatus(selectedEntry);
  const steps = selectedEntry?.steps || 0;
  const calories = selectedEntry?.calories || 0;

  return (
    <section className="console-panel p-4">
      <div className="mb-4 grid gap-3 md:grid-cols-[1fr_220px] md:items-end">
        <div>
          <h2 className="text-xs uppercase text-sonic">Review Day</h2>
          <p className="mt-2 text-[9px] leading-5 text-cyan-100/75">Check previous quest saves without changing today&apos;s log.</p>
        </div>
        <label className="text-[9px] uppercase leading-5 text-magenta">
          Save File
          <select className="console-select mt-2" value={selectedDate} onChange={(event) => onSelectDate(event.target.value)}>
            {entries.map((entry) => (
              <option key={entry.activity_date} value={entry.activity_date}>
                {formatQuestDate(entry.activity_date)}
              </option>
            ))}
          </select>
        </label>
      </div>

      {selectedEntry ? (
        <div className="grid gap-4 md:grid-cols-4">
          <MetricCard label="Date" value={formatQuestDate(selectedDate).replace(',', '')} />
          <MetricCard label="Steps" value={formatNumber(steps)} detail={`${Math.max(0, STEP_GOAL - steps).toLocaleString('en-GB')} to target`} />
          <MetricCard label="KM" value={getDistanceKm(steps).toFixed(2)} detail="Distance walked" />
          <MetricCard label="Calories" value={formatNumber(calories)} tone={calories > CALORIE_LIMIT ? 'danger' : 'cyan'} detail={status} />
        </div>
      ) : (
        <div className="console-readout p-4 text-[10px] leading-5 text-cyan-100">No previous days have been logged yet.</div>
      )}
    </section>
  );
}

function ActivityLog({ entries, onSelectDate }) {
  const recentEntries = [...entries].reverse();

  return (
    <section className="console-panel p-4">
      <h2 className="mb-4 text-xs uppercase text-sonic">Save Files</h2>
      <div className="max-h-72 overflow-auto">
        <table className="w-full min-w-[620px] border-collapse text-left text-[10px] leading-5">
          <thead className="sticky top-0 bg-void text-sonic">
            <tr>
              <th className="border-b border-genesis p-3">Date</th>
              <th className="border-b border-genesis p-3">Steps</th>
              <th className="border-b border-genesis p-3">KM</th>
              <th className="border-b border-genesis p-3">Calories</th>
              <th className="border-b border-genesis p-3">Result</th>
            </tr>
          </thead>
          <tbody>
            {recentEntries.map((entry) => {
              const distance = getDistanceKm(entry.steps).toFixed(2);
              const status = getEntryStatus(entry);

              return (
                <tr
                  className="cursor-pointer text-cyan-100 transition hover:bg-sonic/10"
                  key={entry.id || entry.activity_date}
                  onClick={() => onSelectDate(entry.activity_date)}
                >
                  <td className="border-b border-genesis/50 p-3">{formatQuestDate(entry.activity_date)}</td>
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
  const [selectedDate, setSelectedDate] = useState('');
  const [loadingEntries, setLoadingEntries] = useState(true);
  const [saving, setSaving] = useState(false);
  const [notice, setNotice] = useState('');
  const [now, setNow] = useState(() => new Date());

  async function loadEntries() {
    setLoadingEntries(true);
    const { data, error } = await supabase
      .from('daily_activity')
      .select('*')
      .order('activity_date', { ascending: true });

    if (error) {
      setNotice(error.message);
    } else {
      const nextEntries = data || [];
      setEntries(nextEntries);
      setSelectedDate((currentDate) => currentDate || nextEntries.at(-1)?.activity_date || '');
    }
    setLoadingEntries(false);
  }

  useEffect(() => {
    loadEntries();
  }, []);

  useEffect(() => {
    const timer = window.setInterval(() => setNow(new Date()), 60000);
    return () => window.clearInterval(timer);
  }, []);

  const todayDate = getHalesowenDateValue(now);
  const todayEntry = entries.find((entry) => entry.activity_date === todayDate);
  const activeSteps = todayEntry?.steps || 0;
  const activeCalories = todayEntry?.calories || 0;
  const distanceKm = getDistanceKm(activeSteps).toFixed(2);
  const stepPercent = Math.round((activeSteps / STEP_GOAL) * 100);
  const daysRemaining = Math.max(0, getDateValueDifference(todayDate, DEADLINE_DATE) + 1);
  const totalQuestDays = getDateValueDifference(QUEST_START_DATE, DEADLINE_DATE) + 1;
  const status = getEntryStatus(todayEntry);
  const spriteState = status === 'Victory' ? 'victory' : status === 'Damage' ? 'damage' : 'walking';
  const calorieTone = activeCalories > CALORIE_LIMIT ? 'danger' : activeCalories > CALORIE_LIMIT * 0.8 ? 'warm' : 'cyan';
  const totalSteps = entries.reduce((sum, entry) => sum + entry.steps, 0);
  const totalCalories = entries.reduce((sum, entry) => sum + entry.calories, 0);
  const totalKm = getDistanceKm(totalSteps);
  const victoryDays = entries.filter((entry) => getEntryStatus(entry) === 'Victory').length;

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
      setNotice('Today saved. Quest progress updated.');
      setSelectedDate(payload.activity_date);
      await loadEntries();
    }
    setSaving(false);
  }

  return (
    <main className="min-h-screen bg-void px-3 py-4 text-white sm:px-6 lg:px-8">
      <div className="crt-shell mx-auto max-w-7xl overflow-hidden rounded-[2rem] border border-sonic/80 bg-night p-3 shadow-neon sm:p-5">
        <div className="crt-content space-y-5">
          <header className="console-panel grid gap-4 p-5 lg:grid-cols-[1fr_auto] lg:items-center">
            <div>
              <p className="text-[10px] uppercase leading-5 text-magenta">Mega Drive Calorie Quest</p>
              <h1 className="mt-2 text-xl leading-9 text-white sm:text-3xl">June 20th Holiday Countdown</h1>
              <p className="mt-3 text-[10px] leading-5 text-cyan-100/80">
                Halesowen Clock: {formatHalesowenTime(now)}. Today is logged automatically.
              </p>
            </div>
            <div className="grid gap-3 text-[10px] leading-5 text-cyan-100 sm:grid-cols-[auto_auto_auto]">
              <span className="console-readout px-3 py-2">{daysRemaining} days remaining</span>
              <span className="console-readout px-3 py-2">{session.user.email}</span>
              <button className="console-button px-3 py-2 text-[10px]" onClick={onSignOut} type="button">
                Quit
              </button>
            </div>
          </header>

          <section className="grid gap-5 xl:grid-cols-[420px_1fr]">
            <div className="space-y-5">
              <div className="character-stage p-5 text-center">
                <SpriteHero state={spriteState} />
                <div className="mx-auto mt-5 grid max-w-xs grid-cols-2 gap-3 text-left">
                  <div className="console-readout p-3">
                    <p className="text-[9px] uppercase text-cyan-100/70">Status</p>
                    <p className="mt-2 text-[11px] leading-6 text-sonic">{status}</p>
                  </div>
                  <div className="console-readout p-3">
                    <p className="text-[9px] uppercase text-cyan-100/70">Today</p>
                    <p className="mt-2 text-[11px] leading-6 text-sonic">{todayEntry ? 'Saved' : 'Open'}</p>
                  </div>
                </div>
              </div>

              <section className="console-panel space-y-4 p-4">
                <h2 className="text-xs uppercase text-sonic">Campaign Totals</h2>
                <div className="grid grid-cols-2 gap-3">
                  <MetricCard label="Total Steps" value={formatNumber(totalSteps)} />
                  <MetricCard label="Total KM" value={totalKm.toFixed(2)} />
                  <MetricCard label="Logged Days" value={formatNumber(entries.length)} />
                  <MetricCard label="Victory Days" value={formatNumber(victoryDays)} detail={`${formatNumber(totalCalories)} calories logged`} />
                </div>
              </section>
            </div>

            <div className="space-y-5">
              <ActivityForm currentEntry={todayEntry} onSave={handleSave} saving={saving} todayDate={todayDate} />
              {notice && <p className="console-panel border-ember/80 bg-ember/10 p-3 text-[10px] leading-5 text-amber-100">{notice}</p>}

              <section className="grid gap-4 md:grid-cols-3">
                <MetricCard label="Today KM" value={distanceKm} detail="0.78m stride estimate" />
                <MetricCard label="Step Goal" value={`${stepPercent}%`} detail={`${formatNumber(STEP_GOAL - Math.min(activeSteps, STEP_GOAL))} left`} />
                <MetricCard
                  label="Calorie Limit"
                  value={activeCalories > CALORIE_LIMIT ? 'Over' : 'OK'}
                  tone={calorieTone}
                  detail={`${formatNumber(Math.max(0, CALORIE_LIMIT - activeCalories))} remaining`}
                />
              </section>

              <section className="console-panel space-y-6 p-4">
                <ProgressBar
                  kind="xp"
                  label="Daily Steps XP"
                  target={STEP_GOAL}
                  value={activeSteps}
                  caption="Hit 20,000 steps to clear today's stage."
                />
                <ProgressBar
                  dangerOver
                  label="Calories Health"
                  target={CALORIE_LIMIT}
                  value={activeCalories}
                  caption="Stay under 2,000 calories to protect your health bar."
                />
              </section>

              <QuestMap entries={entries} totalDays={totalQuestDays} />
            </div>
          </section>

          {loadingEntries ? (
            <div className="console-panel p-4 text-[10px] text-cyan-100">Loading Supabase save files...</div>
          ) : (
            <>
              <DayReview entries={entries} selectedDate={selectedDate} onSelectDate={setSelectedDate} />
              <ActivityLog entries={entries} onSelectDate={setSelectedDate} />
            </>
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
    () => normalizeEmail(session?.user?.email) === ALLOWED_EMAIL,
    [session],
  );

  useEffect(() => {
    if (!isSupabaseConfigured) {
      setAuthLoading(false);
      return undefined;
    }

    supabase.auth.getSession().then(({ data }) => {
      const nextSession = data.session;
      if (nextSession && normalizeEmail(nextSession.user.email) !== ALLOWED_EMAIL) {
        supabase.auth.signOut();
        setSession(null);
        setAuthError('Access denied. This cartridge is locked to jrbrimble@aol.com.');
      } else {
        setSession(nextSession);
      }
      setAuthLoading(false);
    });

    const { data: subscription } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      if (!nextSession) {
        setSession(null);
        return;
      }

      if (normalizeEmail(nextSession.user.email) !== ALLOWED_EMAIL) {
        supabase.auth.signOut();
        setSession(null);
        setAuthError('Access denied. This cartridge is locked to jrbrimble@aol.com.');
        return;
      }

      setAuthError('');
      setSession(nextSession);
    });

    return () => subscription.subscription.unsubscribe();
  }, []);

  async function handleLogin(event, email, password) {
    event.preventDefault();
    setAuthError('');

    if (normalizeEmail(email) !== ALLOWED_EMAIL) {
      setAuthError('Access denied. Use the approved quest email.');
      return;
    }

    setAuthLoading(true);
    const { data, error } = await supabase.auth.signInWithPassword({ email: normalizeEmail(email), password });

    if (error) {
      setAuthError(error.message);
    } else {
      setSession(data.session);
    }

    setAuthLoading(false);
  }

  async function handleSignOut() {
    await supabase.auth.signOut();
    setAuthError('');
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
