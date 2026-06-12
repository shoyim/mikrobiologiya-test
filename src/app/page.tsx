import fs from 'fs';
import path from 'path';
import { parseQuestions } from '@/lib/parseQuestions';
import QuizApp from '@/components/QuizApp';

export default function Home() {
  const filePath = path.join(process.cwd(), 'src', 'data', 'questions.txt');
  const content = fs.readFileSync(filePath, 'utf-8');
  const questions = parseQuestions(content);

  return <QuizApp allQuestions={questions} />;
}
