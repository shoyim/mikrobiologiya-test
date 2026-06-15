'use client';

import { useState, useCallback, useEffect } from 'react';
import {
  CheckCircle2,
  XCircle,
  ChevronLeft,
  ChevronRight,
  Shuffle,
  RotateCcw,
  BookOpen,
  Brain,
  Trophy,
  ListChecks,
  Microscope,
  Layers,
} from 'lucide-react';
import { Question } from '@/lib/parseQuestions';

type Mode = 'quiz' | 'flashcard';
type Screen = 'start' | 'quiz' | 'result';

interface ModuleData {
  id: string;
  name: string;
  questions: Question[];
}

interface Props {
  modules: ModuleData[];
}

function shuffleArray<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

const MODULE_COLORS: Record<string, { ring: string; bg: string; text: string; badge: string; bar: string }> = {
  modul1: {
    ring: 'ring-blue-500',
    bg: 'bg-blue-500/10',
    text: 'text-blue-400',
    badge: 'bg-blue-500/20 text-blue-400',
    bar: 'from-blue-500 to-blue-400',
  },
  modul2: {
    ring: 'ring-purple-500',
    bg: 'bg-purple-500/10',
    text: 'text-purple-400',
    badge: 'bg-purple-500/20 text-purple-400',
    bar: 'from-purple-500 to-purple-400',
  },
  toliq: {
    ring: 'ring-emerald-500',
    bg: 'bg-emerald-500/10',
    text: 'text-emerald-400',
    badge: 'bg-emerald-500/20 text-emerald-400',
    bar: 'from-emerald-500 to-emerald-400',
  },
  patfiz: {
    ring: 'ring-orange-500',
    bg: 'bg-orange-500/10',
    text: 'text-orange-400',
    badge: 'bg-orange-500/20 text-orange-400',
    bar: 'from-orange-500 to-orange-400',
  },
};

export default function QuizApp({ modules }: Props) {
  const [screen, setScreen] = useState<Screen>('start');
  const [mode, setMode] = useState<Mode>('quiz');
  const [selectedModule, setSelectedModule] = useState<ModuleData>(modules[0]);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [wrongIds, setWrongIds] = useState<number[]>([]);
  const [answeredCount, setAnsweredCount] = useState(0);
  const [shuffleEnabled, setShuffleEnabled] = useState(false);
  const [wrongOnly, setWrongOnly] = useState(false);

  const colors = MODULE_COLORS[selectedModule.id] ?? MODULE_COLORS.modul1;

  const startQuiz = useCallback(
    (shuffled: boolean, onlyWrong = false) => {
      let qs = onlyWrong
        ? selectedModule.questions.filter((q) => wrongIds.includes(q.id))
        : [...selectedModule.questions];
      if (shuffled) qs = shuffleArray(qs);
      setQuestions(qs);
      setCurrent(0);
      setSelected(null);
      setScore(0);
      setWrongIds([]);
      setAnsweredCount(0);
      setWrongOnly(onlyWrong);
      setScreen('quiz');
    },
    [selectedModule, wrongIds]
  );

  const handleAnswer = (index: number) => {
    if (selected !== null) return;
    setSelected(index);
    if (questions[current].answers[index].isCorrect) {
      setScore((s) => s + 1);
    } else {
      setWrongIds((ids) => [...ids, questions[current].id]);
    }
    setAnsweredCount((c) => c + 1);
  };

  const goNext = useCallback(() => {
    if (current + 1 >= questions.length) {
      setScreen('result');
      return;
    }
    setCurrent((c) => c + 1);
    setSelected(null);
  }, [current, questions.length]);

  const goPrev = useCallback(() => {
    if (current === 0) return;
    setCurrent((c) => c - 1);
    setSelected(null);
  }, [current]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (screen !== 'quiz') return;
      if (e.key === 'ArrowRight') goNext();
      if (e.key === 'ArrowLeft') goPrev();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [screen, goNext, goPrev]);

  const q = questions[current];
  const progress = questions.length > 0 ? ((current + 1) / questions.length) * 100 : 0;

  /* ─── START SCREEN ─── */
  if (screen === 'start') {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center p-4">
        <div className="bg-gray-900 border border-gray-800 rounded-3xl shadow-2xl p-7 max-w-md w-full">
          {/* Logo */}
          <div className="flex justify-center mb-5">
            <div className="bg-gray-800 rounded-2xl p-4">
              <Microscope className="w-10 h-10 text-gray-300" />
            </div>
          </div>
          <h1 className="text-2xl font-bold text-white text-center mb-1">Tibbiy Testlar</h1>
          <p className="text-gray-500 text-center text-sm mb-6">Imtihonga tayyorgarlik</p>

          {/* Module selection */}
          <p className="text-gray-400 text-xs font-semibold uppercase tracking-wider mb-2 flex items-center gap-1">
            <Layers className="w-3.5 h-3.5" /> Modul tanlang
          </p>
          <div className="grid grid-cols-2 gap-2 mb-5">
            {modules.map((m) => {
              const c = MODULE_COLORS[m.id] ?? MODULE_COLORS.modul1;
              const active = selectedModule.id === m.id;
              return (
                <button
                  key={m.id}
                  onClick={() => setSelectedModule(m)}
                  className={`flex flex-col items-center gap-1.5 py-3 px-2 rounded-2xl border transition-all text-sm font-semibold ${
                    active
                      ? `ring-2 ${c.ring} ${c.bg} ${c.text} border-transparent`
                      : 'border-gray-700 text-gray-500 hover:border-gray-600'
                  }`}
                >
                  <span className="text-lg font-bold">
                    {m.id === 'modul1' ? '①' : m.id === 'modul2' ? '②' : m.id === 'toliq' ? '📚' : '🔬'}
                  </span>
                  <span>{m.name}</span>
                  <span className="text-xs opacity-60">{m.questions.length} ta</span>
                </button>
              );
            })}
          </div>

          {/* Mode selection */}
          <p className="text-gray-400 text-xs font-semibold uppercase tracking-wider mb-2 flex items-center gap-1">
            <Brain className="w-3.5 h-3.5" /> Rejim
          </p>
          <div className="flex gap-2 mb-5">
            <button
              onClick={() => setMode('quiz')}
              className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-2xl border transition-all text-sm font-semibold ${
                mode === 'quiz'
                  ? `ring-2 ${colors.ring} ${colors.bg} ${colors.text} border-transparent`
                  : 'border-gray-700 text-gray-500 hover:border-gray-600'
              }`}
            >
              <Brain className="w-4 h-4" />
              Test
            </button>
            <button
              onClick={() => setMode('flashcard')}
              className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-2xl border transition-all text-sm font-semibold ${
                mode === 'flashcard'
                  ? `ring-2 ${colors.ring} ${colors.bg} ${colors.text} border-transparent`
                  : 'border-gray-700 text-gray-500 hover:border-gray-600'
              }`}
            >
              <BookOpen className="w-4 h-4" />
              Fleshkart
            </button>
          </div>

          {/* Shuffle toggle */}
          <div
            onClick={() => setShuffleEnabled((s) => !s)}
            className={`flex items-center justify-between p-3.5 rounded-2xl border cursor-pointer mb-5 transition-all ${
              shuffleEnabled ? `${colors.bg} border-transparent ring-1 ${colors.ring}` : 'border-gray-700 bg-gray-800/50'
            }`}
          >
            <div className="flex items-center gap-2">
              <Shuffle className={`w-4 h-4 ${shuffleEnabled ? colors.text : 'text-gray-500'}`} />
              <span className={`text-sm font-medium ${shuffleEnabled ? colors.text : 'text-gray-400'}`}>
                Tartibsiz aralash
              </span>
            </div>
            <div className={`relative w-10 h-6 rounded-full transition-all ${shuffleEnabled ? 'bg-blue-500' : 'bg-gray-700'}`}>
              <div
                className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-all duration-200 ${
                  shuffleEnabled ? 'left-[18px]' : 'left-[2px]'
                }`}
              />
            </div>
          </div>

          <button
            onClick={() => startQuiz(shuffleEnabled)}
            className={`w-full text-white font-bold py-4 rounded-2xl transition-all text-base bg-gradient-to-r ${colors.bar} hover:opacity-90 shadow-lg`}
          >
            Boshlash
          </button>

          {wrongIds.length > 0 && (
            <button
              onClick={() => startQuiz(shuffleEnabled, true)}
              className="mt-3 w-full bg-red-500/10 hover:bg-red-500/20 text-red-400 font-semibold py-3 rounded-2xl transition-all border border-red-500/30 text-sm"
            >
              Xatolarni qayta ishlash ({wrongIds.length} ta)
            </button>
          )}
        </div>
      </div>
    );
  }

  /* ─── RESULT SCREEN ─── */
  if (screen === 'result') {
    const pct = mode === 'quiz' ? Math.round((score / questions.length) * 100) : 100;
    const isPassing = pct >= 55;
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center p-4">
        <div className="bg-gray-900 border border-gray-800 rounded-3xl shadow-2xl p-7 max-w-md w-full text-center">
          <div className={`inline-flex rounded-full p-4 mb-4 ${isPassing ? 'bg-emerald-500/10' : 'bg-red-500/10'}`}>
            <Trophy className={`w-10 h-10 ${isPassing ? 'text-emerald-400' : 'text-red-400'}`} />
          </div>

          {mode === 'quiz' ? (
            <>
              <div className={`text-5xl font-black mb-1 ${isPassing ? 'text-emerald-400' : 'text-red-400'}`}>{pct}%</div>
              <p className="text-gray-400 mb-6 text-sm">{isPassing ? "Tabriklaymiz, siz o'tdingiz!" : "Ko'proq mashq kerak"}</p>
              <div className="grid grid-cols-3 gap-3 mb-7">
                <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-2xl p-4">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400 mx-auto mb-1" />
                  <div className="text-2xl font-bold text-emerald-400">{score}</div>
                  <div className="text-xs text-gray-500">To&apos;g&apos;ri</div>
                </div>
                <div className="bg-red-500/10 border border-red-500/20 rounded-2xl p-4">
                  <XCircle className="w-5 h-5 text-red-400 mx-auto mb-1" />
                  <div className="text-2xl font-bold text-red-400">{questions.length - score}</div>
                  <div className="text-xs text-gray-500">Xato</div>
                </div>
                <div className="bg-gray-800 border border-gray-700 rounded-2xl p-4">
                  <ListChecks className="w-5 h-5 text-gray-400 mx-auto mb-1" />
                  <div className="text-2xl font-bold text-gray-300">{questions.length}</div>
                  <div className="text-xs text-gray-500">Jami</div>
                </div>
              </div>
            </>
          ) : (
            <>
              <div className="text-3xl font-bold text-white mb-1">Barakalla!</div>
              <p className="text-gray-400 mb-7 text-sm">{questions.length} ta kartochkani ko&apos;rib chiqdingiz</p>
            </>
          )}

          <div className="flex flex-col gap-3">
            <button
              onClick={() => startQuiz(shuffleEnabled, wrongOnly)}
              className={`w-full text-white font-bold py-4 rounded-2xl bg-gradient-to-r ${colors.bar} hover:opacity-90 transition-all flex items-center justify-center gap-2`}
            >
              <RotateCcw className="w-4 h-4" />
              Qayta boshlash
            </button>
            {wrongIds.length > 0 && mode === 'quiz' && (
              <button
                onClick={() => startQuiz(true, true)}
                className="w-full bg-red-500/10 hover:bg-red-500/20 text-red-400 font-semibold py-3 rounded-2xl border border-red-500/30 text-sm"
              >
                Xatolarni qayta ishlash ({wrongIds.length} ta)
              </button>
            )}
            <button
              onClick={() => setScreen('start')}
              className="w-full bg-gray-800 hover:bg-gray-700 text-gray-300 font-semibold py-3 rounded-2xl transition-all"
            >
              Bosh menu
            </button>
          </div>
        </div>
      </div>
    );
  }

  /* ─── QUIZ SCREEN ─── */
  if (!q) return null;

  const isFlashcard = mode === 'flashcard';

  return (
    <div className="min-h-screen bg-gray-950 flex flex-col">
      {/* Header */}
      <div className="bg-gray-900 border-b border-gray-800 px-4 py-3">
        <div className="max-w-2xl mx-auto">
          <div className="flex items-center justify-between mb-2.5">
            <div className="flex items-center gap-2">
              <button
                onClick={() => setScreen('start')}
                className="text-gray-600 hover:text-gray-400 transition-colors"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <span className={`font-bold text-sm ${colors.text}`}>
                {selectedModule.name}
                {wrongOnly && <span className="ml-1 text-red-400">(Xatolar)</span>}
              </span>
              <span className="text-gray-700 text-sm">·</span>
              <span className="text-gray-500 text-sm">{isFlashcard ? 'Fleshkart' : 'Test'}</span>
            </div>
            <div className="flex items-center gap-3">
              {!isFlashcard && (
                <>
                  <div className="flex items-center gap-1">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                    <span className="font-bold text-emerald-400 text-sm">{score}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <XCircle className="w-4 h-4 text-red-500" />
                    <span className="font-bold text-red-400 text-sm">{answeredCount - score}</span>
                  </div>
                </>
              )}
              <span className="text-gray-500 text-sm font-medium">
                {current + 1}<span className="text-gray-700">/</span>{questions.length}
              </span>
            </div>
          </div>
          <div className="h-1.5 bg-gray-800 rounded-full overflow-hidden">
            <div
              className={`h-full bg-gradient-to-r ${colors.bar} rounded-full transition-all duration-300`}
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 flex flex-col max-w-2xl w-full mx-auto p-4 gap-4 overflow-y-auto">
        {/* Question card */}
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
          <div className="flex items-start gap-3">
            <span className={`text-xs font-bold px-2 py-1 rounded-lg flex-shrink-0 ${colors.badge}`}>
              #{q.id}
            </span>
            <p className="text-white font-semibold leading-relaxed text-xl">{q.question}</p>
          </div>
        </div>

        {/* Answers */}
        <div className="flex flex-col gap-3">
          {q.answers.map((ans, idx) => {
            let cls = 'w-full text-left p-4 rounded-2xl border-2 transition-all duration-150 font-medium text-base leading-relaxed ';

            if (isFlashcard) {
              if (ans.isCorrect) {
                cls += 'border-emerald-500/50 bg-emerald-500/10 text-emerald-300';
              } else {
                cls += 'border-gray-800 bg-gray-900/50 text-gray-600';
              }
            } else {
              if (selected === null) {
                cls += 'border-gray-700 bg-gray-900 text-gray-200 hover:border-gray-500 hover:bg-gray-800 cursor-pointer';
              } else if (ans.isCorrect) {
                cls += 'border-emerald-500/50 bg-emerald-500/10 text-emerald-300';
              } else if (idx === selected && !ans.isCorrect) {
                cls += 'border-red-500/50 bg-red-500/10 text-red-300';
              } else {
                cls += 'border-gray-800 bg-gray-900/30 text-gray-700';
              }
            }

            return (
              <button key={idx} className={cls} onClick={() => handleAnswer(idx)}>
                <div className="flex items-start gap-3">
                  <span className="flex-shrink-0 mt-0.5">
                    {!isFlashcard && selected === null && (
                      <span className="inline-flex w-6 h-6 rounded-full border-2 border-current items-center justify-center text-xs font-bold">
                        {String.fromCharCode(65 + idx)}
                      </span>
                    )}
                    {!isFlashcard && selected !== null && ans.isCorrect && (
                      <CheckCircle2 className="w-6 h-6 text-emerald-400" />
                    )}
                    {!isFlashcard && selected === idx && !ans.isCorrect && (
                      <XCircle className="w-6 h-6 text-red-400" />
                    )}
                    {!isFlashcard && selected !== null && !ans.isCorrect && idx !== selected && (
                      <span className="inline-flex w-6 h-6 rounded-full border-2 border-current items-center justify-center text-xs font-bold opacity-30">
                        {String.fromCharCode(65 + idx)}
                      </span>
                    )}
                    {isFlashcard && ans.isCorrect && <CheckCircle2 className="w-6 h-6 text-emerald-400" />}
                    {isFlashcard && !ans.isCorrect && (
                      <span className="inline-flex w-6 h-6 rounded-full border-2 border-current items-center justify-center text-xs font-bold opacity-30">
                        {String.fromCharCode(65 + idx)}
                      </span>
                    )}
                  </span>
                  <span>{ans.text}</span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Navigation */}
      <div className="bg-gray-900 border-t border-gray-800 px-4 py-3">
        <div className="max-w-2xl mx-auto flex gap-3">
          <button
            onClick={goPrev}
            disabled={current === 0}
            className="flex-1 flex items-center justify-center gap-2 py-3.5 rounded-2xl border-2 border-gray-700 text-gray-400 font-semibold disabled:opacity-20 disabled:cursor-not-allowed hover:border-gray-600 hover:text-gray-300 transition-all"
          >
            <ChevronLeft className="w-5 h-5" />
            Oldingi
          </button>
          <button
            onClick={goNext}
            disabled={!isFlashcard && selected === null}
            className={`flex-1 flex items-center justify-center gap-2 py-3.5 rounded-2xl text-white font-bold bg-gradient-to-r ${colors.bar} disabled:opacity-30 disabled:cursor-not-allowed hover:opacity-90 transition-all shadow-lg`}
          >
            {current + 1 >= questions.length ? 'Tugatish' : 'Keyingi'}
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
