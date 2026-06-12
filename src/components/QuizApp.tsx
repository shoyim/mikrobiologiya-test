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
} from 'lucide-react';
import { Question } from '@/lib/parseQuestions';

type Mode = 'quiz' | 'flashcard';
type Screen = 'start' | 'quiz' | 'result' | 'review';

function shuffleArray<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

interface Props {
  allQuestions: Question[];
}

export default function QuizApp({ allQuestions }: Props) {
  const [screen, setScreen] = useState<Screen>('start');
  const [mode, setMode] = useState<Mode>('quiz');
  const [questions, setQuestions] = useState<Question[]>([]);
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [revealed, setRevealed] = useState(false);
  const [score, setScore] = useState(0);
  const [wrongIds, setWrongIds] = useState<number[]>([]);
  const [answeredCount, setAnsweredCount] = useState(0);
  const [shuffleEnabled, setShuffleEnabled] = useState(false);
  const [reviewMode, setReviewMode] = useState(false);

  const startQuiz = useCallback(
    (shuffled: boolean, wrongOnly = false) => {
      let qs = wrongOnly ? allQuestions.filter((q) => wrongIds.includes(q.id)) : [...allQuestions];
      if (shuffled) qs = shuffleArray(qs);
      setQuestions(qs);
      setCurrent(0);
      setSelected(null);
      setRevealed(false);
      setScore(0);
      setWrongIds([]);
      setAnsweredCount(0);
      setReviewMode(wrongOnly);
      setScreen('quiz');
    },
    [allQuestions, wrongIds]
  );

  const handleAnswer = (index: number) => {
    if (selected !== null || (mode === 'flashcard' && revealed)) return;
    if (mode === 'flashcard') return;

    setSelected(index);
    const isCorrect = questions[current].answers[index].isCorrect;
    if (isCorrect) {
      setScore((s) => s + 1);
    } else {
      setWrongIds((ids) => [...ids, questions[current].id]);
    }
    setAnsweredCount((c) => c + 1);
  };

  const handleReveal = () => {
    if (revealed) return;
    setRevealed(true);
    setAnsweredCount((c) => c + 1);
  };

  const goNext = () => {
    if (current + 1 >= questions.length) {
      setScreen('result');
      return;
    }
    setCurrent((c) => c + 1);
    setSelected(null);
    setRevealed(false);
  };

  const goPrev = () => {
    if (current === 0) return;
    setCurrent((c) => c - 1);
    setSelected(null);
    setRevealed(false);
  };

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (screen !== 'quiz') return;
      if (e.key === 'ArrowRight' || e.key === ' ') goNext();
      if (e.key === 'ArrowLeft') goPrev();
      if (e.key === 'Enter' && mode === 'flashcard' && !revealed) handleReveal();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  });

  const q = questions[current];
  const progress = questions.length > 0 ? ((current + 1) / questions.length) * 100 : 0;

  // START SCREEN
  if (screen === 'start') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl shadow-2xl p-8 max-w-md w-full text-center">
          <div className="flex justify-center mb-4">
            <div className="bg-blue-100 rounded-full p-4">
              <Microscope className="w-12 h-12 text-blue-600" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Mikrobiologiya</h1>
          <p className="text-gray-500 mb-1">Imtihonga tayyorgarlik</p>
          <p className="text-blue-600 font-semibold mb-8">{allQuestions.length} ta savol</p>

          <div className="flex gap-3 mb-6">
            <button
              onClick={() => setMode('quiz')}
              className={`flex-1 flex flex-col items-center gap-2 p-4 rounded-2xl border-2 transition-all ${
                mode === 'quiz'
                  ? 'border-blue-500 bg-blue-50 text-blue-700'
                  : 'border-gray-200 text-gray-500 hover:border-gray-300'
              }`}
            >
              <Brain className="w-6 h-6" />
              <span className="font-semibold text-sm">Test rejimi</span>
              <span className="text-xs opacity-70">Javob tanlang</span>
            </button>
            <button
              onClick={() => setMode('flashcard')}
              className={`flex-1 flex flex-col items-center gap-2 p-4 rounded-2xl border-2 transition-all ${
                mode === 'flashcard'
                  ? 'border-indigo-500 bg-indigo-50 text-indigo-700'
                  : 'border-gray-200 text-gray-500 hover:border-gray-300'
              }`}
            >
              <BookOpen className="w-6 h-6" />
              <span className="font-semibold text-sm">Fleshkart</span>
              <span className="text-xs opacity-70">To&apos;g&apos;ri javob ko&apos;rinadi</span>
            </button>
          </div>

          <div
            onClick={() => setShuffleEnabled((s) => !s)}
            className={`flex items-center justify-between p-3 rounded-xl border-2 cursor-pointer mb-6 transition-all ${
              shuffleEnabled ? 'border-purple-400 bg-purple-50' : 'border-gray-200 bg-gray-50'
            }`}
          >
            <div className="flex items-center gap-2">
              <Shuffle className={`w-5 h-5 ${shuffleEnabled ? 'text-purple-600' : 'text-gray-400'}`} />
              <span className={`font-medium text-sm ${shuffleEnabled ? 'text-purple-700' : 'text-gray-600'}`}>
                Tartibsiz aralash
              </span>
            </div>
            <div
              className={`relative w-10 h-6 rounded-full transition-all ${shuffleEnabled ? 'bg-purple-500' : 'bg-gray-300'}`}
            >
              <div
                className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-all duration-200 ${
                  shuffleEnabled ? 'left-[18px]' : 'left-[2px]'
                }`}
              />
            </div>
          </div>

          <button
            onClick={() => startQuiz(shuffleEnabled)}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-2xl transition-all shadow-lg shadow-blue-200 text-lg"
          >
            Boshlash
          </button>

          {wrongIds.length > 0 && (
            <button
              onClick={() => startQuiz(shuffleEnabled, true)}
              className="mt-3 w-full bg-red-50 hover:bg-red-100 text-red-600 font-semibold py-3 rounded-2xl transition-all border border-red-200 text-sm"
            >
              Xato javoblarni qayta ishlash ({wrongIds.length} ta)
            </button>
          )}
        </div>
      </div>
    );
  }

  // RESULT SCREEN
  if (screen === 'result') {
    const pct = Math.round((score / questions.length) * 100);
    const isPassing = pct >= 55;
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl shadow-2xl p-8 max-w-md w-full text-center">
          <div className="flex justify-center mb-4">
            <div className={`rounded-full p-4 ${isPassing ? 'bg-green-100' : 'bg-red-100'}`}>
              <Trophy className={`w-12 h-12 ${isPassing ? 'text-green-600' : 'text-red-600'}`} />
            </div>
          </div>
          {mode === 'quiz' ? (
            <>
              <h2 className="text-3xl font-bold text-gray-800 mb-1">{pct}%</h2>
              <p className={`text-lg font-semibold mb-6 ${isPassing ? 'text-green-600' : 'text-red-500'}`}>
                {isPassing ? "A'lo! Siz o'tdingiz!" : "Ko'proq mashq kerak"}
              </p>
              <div className="flex gap-4 mb-8">
                <div className="flex-1 bg-green-50 rounded-2xl p-4">
                  <CheckCircle2 className="w-6 h-6 text-green-500 mx-auto mb-1" />
                  <div className="text-2xl font-bold text-green-700">{score}</div>
                  <div className="text-xs text-green-600">To&apos;g&apos;ri</div>
                </div>
                <div className="flex-1 bg-red-50 rounded-2xl p-4">
                  <XCircle className="w-6 h-6 text-red-500 mx-auto mb-1" />
                  <div className="text-2xl font-bold text-red-700">{questions.length - score}</div>
                  <div className="text-xs text-red-600">Noto&apos;g&apos;ri</div>
                </div>
                <div className="flex-1 bg-blue-50 rounded-2xl p-4">
                  <ListChecks className="w-6 h-6 text-blue-500 mx-auto mb-1" />
                  <div className="text-2xl font-bold text-blue-700">{questions.length}</div>
                  <div className="text-xs text-blue-600">Jami</div>
                </div>
              </div>
            </>
          ) : (
            <>
              <h2 className="text-3xl font-bold text-gray-800 mb-1">Barakalla!</h2>
              <p className="text-gray-500 mb-8">{questions.length} ta kartochkani ko&apos;rib chiqdingiz</p>
            </>
          )}

          <div className="flex flex-col gap-3">
            <button
              onClick={() => startQuiz(shuffleEnabled)}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-2xl transition-all shadow-lg shadow-blue-200"
            >
              <RotateCcw className="w-4 h-4 inline mr-2" />
              Qayta boshlash
            </button>
            {wrongIds.length > 0 && mode === 'quiz' && (
              <button
                onClick={() => startQuiz(true, true)}
                className="w-full bg-red-50 hover:bg-red-100 text-red-600 font-semibold py-3 rounded-2xl transition-all border border-red-200"
              >
                Xatolarni qayta ishlash ({wrongIds.length} ta)
              </button>
            )}
            <button
              onClick={() => setScreen('start')}
              className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-3 rounded-2xl transition-all"
            >
              Bosh menu
            </button>
          </div>
        </div>
      </div>
    );
  }

  // QUIZ SCREEN
  if (!q) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex flex-col">
      {/* Header */}
      <div className="bg-white shadow-sm px-4 py-3">
        <div className="max-w-2xl mx-auto">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <button
                onClick={() => setScreen('start')}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <span className="font-bold text-gray-800 text-sm">
                {mode === 'quiz' ? 'Test rejimi' : 'Fleshkart'}
                {reviewMode && <span className="ml-1 text-red-500">(Xatolar)</span>}
              </span>
            </div>
            <div className="flex items-center gap-3">
              {mode === 'quiz' && (
                <>
                  <div className="flex items-center gap-1 text-sm">
                    <CheckCircle2 className="w-4 h-4 text-green-500" />
                    <span className="font-semibold text-green-600">{score}</span>
                  </div>
                  <div className="flex items-center gap-1 text-sm">
                    <XCircle className="w-4 h-4 text-red-400" />
                    <span className="font-semibold text-red-500">{answeredCount - score}</span>
                  </div>
                </>
              )}
              <span className="text-gray-400 text-sm font-medium">
                {current + 1}/{questions.length}
              </span>
            </div>
          </div>
          {/* Progress bar */}
          <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </div>

      {/* Question */}
      <div className="flex-1 flex flex-col max-w-2xl w-full mx-auto p-4 gap-4">
        <div className="bg-white rounded-2xl shadow-sm p-6 flex-shrink-0">
          <div className="flex items-start gap-3">
            <span className="bg-blue-100 text-blue-600 font-bold text-sm px-2 py-1 rounded-lg flex-shrink-0">
              #{q.id}
            </span>
            <p className="text-gray-800 font-semibold leading-relaxed text-xl">{q.question}</p>
          </div>
        </div>

        {/* Answers */}
        <div className="flex flex-col gap-3">
            {q.answers.map((ans, idx) => {
              let cls =
                'w-full text-left p-4 rounded-2xl border-2 transition-all duration-200 font-medium text-base leading-relaxed ';
              if (mode === 'quiz') {
                if (selected === null) {
                  cls += 'border-gray-200 bg-white text-gray-700 hover:border-blue-300 hover:bg-blue-50 cursor-pointer';
                } else if (ans.isCorrect) {
                  cls += 'border-green-400 bg-green-50 text-green-800';
                } else if (idx === selected && !ans.isCorrect) {
                  cls += 'border-red-400 bg-red-50 text-red-800';
                } else {
                  cls += 'border-gray-100 bg-gray-50 text-gray-400';
                }
              } else {
                // flashcard
                if (ans.isCorrect) {
                  cls += 'border-green-400 bg-green-50 text-green-800';
                } else {
                  cls += 'border-gray-100 bg-gray-50 text-gray-400';
                }
              }

              return (
                <button key={idx} className={cls} onClick={() => handleAnswer(idx)}>
                  <div className="flex items-start gap-3">
                    <span className="flex-shrink-0 flex items-center justify-center">
                      {mode === 'quiz' && selected !== null && ans.isCorrect && (
                        <CheckCircle2 className="w-5 h-5 text-green-500" />
                      )}
                      {mode === 'quiz' && selected === idx && !ans.isCorrect && (
                        <XCircle className="w-5 h-5 text-red-500" />
                      )}
                      {mode === 'quiz' && selected === null && (
                        <span className="w-5 h-5 rounded-full border-2 border-current flex items-center justify-center text-xs font-bold">
                          {String.fromCharCode(65 + idx)}
                        </span>
                      )}
                      {mode === 'flashcard' && ans.isCorrect && (
                        <CheckCircle2 className="w-5 h-5 text-green-500" />
                      )}
                      {mode === 'flashcard' && !ans.isCorrect && (
                        <span className="w-5 h-5 rounded-full border-2 border-current flex items-center justify-center text-xs font-bold opacity-40">
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
      <div className="bg-white border-t border-gray-100 px-4 py-3">
        <div className="max-w-2xl mx-auto flex gap-3">
          <button
            onClick={goPrev}
            disabled={current === 0}
            className="flex-1 flex items-center justify-center gap-2 py-3 rounded-2xl border-2 border-gray-200 text-gray-500 font-semibold disabled:opacity-30 disabled:cursor-not-allowed hover:border-gray-300 hover:bg-gray-50 transition-all"
          >
            <ChevronLeft className="w-5 h-5" />
            Oldingi
          </button>
          <button
            onClick={goNext}
            disabled={mode === 'quiz' && selected === null && !revealed}
            className="flex-1 flex items-center justify-center gap-2 py-3 rounded-2xl bg-blue-600 text-white font-semibold disabled:opacity-40 disabled:cursor-not-allowed hover:bg-blue-700 transition-all shadow-sm"
          >
            {current + 1 >= questions.length ? 'Tugatish' : 'Keyingi'}
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
