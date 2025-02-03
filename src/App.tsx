import React, { useEffect, useState } from "react";
import {
  Sparkles,
  Moon,
  RotateCcw,
  Download,
  ArrowLeft,
  ExternalLink,
} from "lucide-react";
import { Question, Answer, TestProgress } from "./types";
import { calculateResults, getEnneagramType, getProgress } from "./utils";
import { questions as questionList } from "./questions";
import { introText, typeDescriptions } from "./descriptions";

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
  const [showIntro, setShowIntro] = useState(true);

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

  const handlePreviousQuestion = () => {
    if (testProgress.currentQuestion > 0) {
      setTestProgress((prev) => ({
        answers: prev.answers.slice(0, -1),
        currentQuestion: prev.currentQuestion - 1,
      }));
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
      setShowIntro(true);
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

  if (showIntro) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-4 sm:p-8 flex items-center justify-center">
        <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-lg p-8 sm:p-12">
          <div className="flex flex-col items-center justify-center mb-8">
            <Moon className="w-12 h-12 text-purple-500 my-5" />
            <h1 className="text-3xl sm:text-4xl font-semibold text-gray-800">
              {introText.title}
            </h1>
          </div>

          <p className="text-lg text-gray-600 mb-8 leading-relaxed text-center">
            El <strong>Eneagrama</strong> es una poderosa herramienta de
            autoconocimiento que revela <strong>9 tipos de personalidad</strong>
            , sus fortalezas, desafíos y formas de ver el mundo. Te ayuda a
            entender tus patrones emocionales y de comportamiento para crecer y
            mejorar. Pero ojo: para que funcione, debes responder con total
            honestidad. <strong>¡Sin sinceridad, no sirve!</strong>
          </p>

          <div className="flex justify-center">
            <button
              onClick={() => setShowIntro(false)}
              className="bg-purple-500 hover:bg-purple-600 text-white font-medium py-4 px-8 rounded-lg transition-colors text-lg"
            >
              {introText.startButton}
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (showResults) {
    const results = calculateResults(testProgress.answers);
    const dominantType = getEnneagramType(results);
    const dominantTypeInfo =
      typeDescriptions[dominantType as keyof typeof typeDescriptions];

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
                Tu tipo dominante es: {dominantType} - {dominantTypeInfo.title}
              </h2>
              <p className="text-purple-600 mb-4">
                {dominantTypeInfo.description}
              </p>
              <a
                href={
                  "https://www.psicologo-barcelona.cat/curso-eneagrama/eneagrama-eneatipo-" +
                  dominantType
                }
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center text-purple-700 hover:text-purple-800 font-medium"
              >
                Aprende más sobre el Tipo {dominantType}
                <ExternalLink className="w-4 h-4 ml-1" />
              </a>
            </div>

            <div className="grid gap-4">
              {results.map((count, index) => {
                const typeInfo =
                  typeDescriptions[
                    (index + 1) as keyof typeof typeDescriptions
                  ];
                return (
                  <div key={index} className="space-y-2">
                    <div className="flex items-center">
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
                  </div>
                );
              })}
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

  const currentQuestion = questions[testProgress.currentQuestion];
  const progress = getProgress(testProgress.currentQuestion);

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

              <div className="space-y-4">
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

                {testProgress.currentQuestion > 0 && (
                  <button
                    onClick={handlePreviousQuestion}
                    className="flex items-center justify-center gap-2 w-full text-gray-500 hover:text-gray-700 font-medium py-2 transition-colors text-sm"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    Pregunta anterior
                  </button>
                )}
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
