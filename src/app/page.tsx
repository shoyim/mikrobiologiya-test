import fs from 'fs';
import path from 'path';
import { parseQuestions } from '@/lib/parseQuestions';
import QuizApp from '@/components/QuizApp';

export default function Home() {
  const cwd = process.cwd();
  const read = (file: string) =>
    fs.readFileSync(path.join(cwd, 'src', 'data', file), 'utf-8');

  const modules = [
    { id: 'modul1', name: 'Mikrob I', questions: parseQuestions(read('modul1.txt')) },
    { id: 'modul2', name: 'Mikrob II', questions: parseQuestions(read('modul2.txt')) },
    { id: 'toliq', name: "To'liq", questions: parseQuestions(read('questions.txt')) },
    { id: 'patfiz', name: 'Patfiz', questions: parseQuestions(read('patfiz.txt')) },
    { id: 'davolash', name: 'Davolash', questions: parseQuestions(read('davolash.txt')) },
  ];

  return <QuizApp modules={modules} />;
}
