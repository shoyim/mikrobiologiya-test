import fs from 'fs';
import path from 'path';
import { parseQuestions } from '@/lib/parseQuestions';
import QuizApp from '@/components/QuizApp';

export default function Home() {
  const cwd = process.cwd();
  const read = (file: string) =>
    fs.readFileSync(path.join(cwd, 'src', 'data', file), 'utf-8');
  const readDav = (file: string) =>
    fs.readFileSync(path.join(cwd, 'src', 'data', 'davolash', file), 'utf-8');

  const davolashMavzular = Array.from({ length: 30 }, (_, i) => ({
    id: `davolash_${i + 1}`,
    name: `Mavzu ${i + 1}`,
    questions: parseQuestions(readDav(`mavzu${i + 1}.txt`)),
    group: 'davolash' as const,
  }));

  const modules = [
    { id: 'modul1', name: 'Mikrob I', questions: parseQuestions(read('modul1.txt')) },
    { id: 'modul2', name: 'Mikrob II', questions: parseQuestions(read('modul2.txt')) },
    { id: 'toliq', name: "To'liq", questions: parseQuestions(read('questions.txt')) },
    { id: 'patfiz', name: 'Patfiz', questions: parseQuestions(read('patfiz.txt')) },
    { id: 'davolash', name: 'Davolash (Barchasi)', questions: parseQuestions(read('davolash.txt')), group: 'davolash' as const },
    ...davolashMavzular,
  ];

  return <QuizApp modules={modules} />;
}
