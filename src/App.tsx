import React, { useEffect, useState } from "react";
import { Sparkles, Moon, RotateCcw, Download } from "lucide-react";
import { Question, Answer, TestProgress } from "./types";
import { calculateResults, getEnneagramType, getProgress } from "./utils";
import { questions as questionList } from "./questions";

function App() {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [testProgress, setTestProgress] = useState<TestProgress>(() => {
    const saved = localStorage.getItem("enneagramTest");
    return saved
      ? JSON.parse(saved)
      : {
          answers: [],
          currentQuestion: 0,
        };
  });
  const [showResults, setShowResults] = useState(false);

  useEffect(() => {
    // In a real app, this would be fetched from an API
    setQuestions(questionList);
  }, []);

  useEffect(() => {
    localStorage.setItem("enneagramTest", JSON.stringify(testProgress));
  }, [testProgress]);

  const handleAnswer = (answer: boolean) => {
    const newAnswer: Answer = {
      questionNumber: questions[testProgress.currentQuestion].number,
      answer,
    };

    setTestProgress((prev) => ({
      answers: [...prev.answers, newAnswer],
      currentQuestion: prev.currentQuestion + 1,
    }));

    if (testProgress.currentQuestion === questions.length - 1) {
      setShowResults(true);
    }
  };

  const handleReset = () => {
    if (
      window.confirm(
        "¿Estás seguro que querés empezar de nuevo? Se perderá todo tu progreso."
      )
    ) {
      localStorage.removeItem("enneagramTest");
      setTestProgress({
        answers: [],
        currentQuestion: 0,
      });
      setShowResults(false);
    }
  };

  const handleDownloadResults = () => {
    const results = testProgress.answers.map((answer) => ({
      number: answer.questionNumber,
      answer: answer.answer ? "yes" : "no",
    }));

    const blob = new Blob([JSON.stringify(results, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "enneagram-results.json";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const currentQuestion = questions[testProgress.currentQuestion];
  const progress = getProgress(testProgress.currentQuestion);

  if (showResults) {
    const results = calculateResults(testProgress.answers);
    const dominantType = getEnneagramType(results);

    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-4 sm:p-8">
        <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-lg p-6 sm:p-8">
          <div className="flex items-center justify-center mb-8">
            <Sparkles className="w-8 h-8 text-purple-500 mr-2" />
            <h1 className="text-2xl sm:text-3xl font-semibold text-gray-800">
              Tu resultado de Eneagrama
            </h1>
          </div>

          <div className="space-y-6">
            <div className="p-6 bg-purple-50 rounded-xl">
              <h2 className="text-xl font-semibold text-purple-800 mb-4">
                Tu tipo dominante es: {dominantType}
              </h2>
              <p className="text-purple-600">
                Este es tu Tipo de Eneagrama primario segun tus respuestas.
              </p>
            </div>

            <div className="grid gap-4">
              {results.map((count, index) => (
                <div key={index} className="flex items-center">
                  <div className="w-24 text-sm font-medium text-gray-700">
                    Tipo {index + 1}
                  </div>
                  <div className="flex-1 bg-gray-100 rounded-full h-4">
                    <div
                      className="bg-purple-500 h-4 rounded-full transition-all duration-500"
                      style={{ width: `${(count / 20) * 100}%` }}
                    ></div>
                  </div>
                  <div className="w-12 text-right text-sm font-medium text-gray-700">
                    {count}
                  </div>
                </div>
              ))}
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={handleReset}
                className="flex-1 flex items-center justify-center gap-2 bg-purple-500 hover:bg-purple-600 text-white font-medium py-3 px-6 rounded-lg transition-colors"
              >
                <RotateCcw className="w-5 h-5" />
                Empezar de nuevo
              </button>
              <button
                onClick={handleDownloadResults}
                className="flex items-center justify-center gap-2 bg-white hover:bg-gray-50 text-gray-700 font-medium py-3 px-6 rounded-lg border border-gray-200 transition-colors"
              >
                <Download className="w-5 h-5" />
                Descargar respuestas
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-4">
      <div className="max-w-xl mx-auto">
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center">
              <Moon className="w-6 h-6 text-purple-500 mr-2" />
              <h1 className="text-xl font-semibold text-gray-800">
                Test de Eneagrama
              </h1>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-sm font-medium text-gray-500">
                {testProgress.currentQuestion + 1} / {questions.length}
              </div>
              <button
                onClick={handleReset}
                className="text-gray-400 hover:text-gray-600 transition-colors"
                title="Empezar de nuevo"
              >
                <RotateCcw className="w-5 h-5" />
              </button>
            </div>
          </div>

          <div className="w-full bg-gray-100 rounded-full h-2 mb-8">
            <div
              className="bg-purple-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            ></div>
          </div>

          {currentQuestion && (
            <div className="space-y-8">
              <p className="text-lg text-gray-700 text-center px-4">
                {currentQuestion.question}
              </p>

              <div className="flex gap-4">
                <button
                  onClick={() => handleAnswer(true)}
                  className="flex-1 bg-purple-500 hover:bg-purple-600 text-white font-medium py-3 px-6 rounded-lg transition-colors"
                >
                  Si
                </button>
                <button
                  onClick={() => handleAnswer(false)}
                  className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-3 px-6 rounded-lg transition-colors"
                >
                  No
                </button>
              </div>
            </div>
          )}
        </div>

        <p className="text-center text-sm text-gray-500">
          Tu progreso se guarda automaticamente, podes continuar luego.
        </p>
      </div>
    </div>
  );
}

export default App;
