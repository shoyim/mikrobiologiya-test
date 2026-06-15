import fs from 'fs';
import path from 'path';
import { parseQuestions } from '@/lib/parseQuestions';
import QuizApp from '@/components/QuizApp';

export default function Home() {
  const cwd = process.cwd();
  const read = (file: string) =>
    fs.readFileSync(path.join(cwd, 'src', 'data', file), 'utf-8');

  const modules = [
    { id: 'patfiz', name: 'Patfiz', questions: parseQuestions(read('patfiz.txt')) },
  ];

  return <QuizApp modules={modules} />;
}
