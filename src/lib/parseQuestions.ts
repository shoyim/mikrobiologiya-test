export interface Answer {
  text: string;
  isCorrect: boolean;
}

export interface Question {
  id: number;
  question: string;
  answers: Answer[];
}

export function parseQuestions(text: string): Question[] {
  const questions: Question[] = [];
  const lines = text.split('\n');
  let id = 0;

  let i = 0;
  while (i < lines.length) {
    const line = lines[i].trim();

    if (line.startsWith('?')) {
      const question = line.slice(1).trim();
      const answers: Answer[] = [];
      i++;

      while (i < lines.length) {
        const aLine = lines[i].trim();
        if (aLine.startsWith('+ ')) {
          answers.push({ text: aLine.slice(2).trim(), isCorrect: true });
        } else if (aLine.startsWith('- ')) {
          answers.push({ text: aLine.slice(2).trim(), isCorrect: false });
        } else if (aLine === '') {
          break;
        }
        i++;
      }

      if (question && answers.length >= 2) {
        questions.push({ id: ++id, question, answers });
      }
    } else {
      i++;
    }
  }

  return questions;
}
