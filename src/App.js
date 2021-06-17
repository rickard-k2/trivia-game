import React, { useEffect, useState } from "react";
import "./App.scss";

function TriviaGame() {
  const [categories, setCategories] = useState(null);
  const [numberOfQuestions, setNumberOfQuestions] = useState(2);
  const [selectedCategory, setCategory] = useState("");
  const [difficulty, setDifficulty] = useState("easy");
  const [questions, setQuestions] = useState(null);
  const [errorState, setErrorState] = useState(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [userAnswers, setUserAnswers] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetch("https://opentdb.com/api_category.php")
      .then((res) => res.json())
      .then((data) => {
        setCategories(data.trivia_categories);
      });
  }, []);

  function handleSelectCategory(e) {
    setCategory(e.target.value);
  }

  function handleNumberOfQuestions(e) {
    setNumberOfQuestions(e.target.value);
  }

  function handleDifficulty(e) {
    setDifficulty(e.target.value);
  }

  function reset() {
    setErrorState(null);
    setQuestions(null);
    setCurrentQuestion(0);
    setUserAnswers([]);
  }

  function getQuestions() {
    fetch(
      `https://opentdb.com/api.php?amount=${numberOfQuestions}&category=${selectedCategory}&difficulty=${difficulty}&type=multiple&encode=base64`
    )
      .then((res) => res.json())
      .then((data) => {
        if (data.response_code === 0) {
          setQuestions(data.results);
          setLoading(false);
        } else if (data.response_code === 1) {
          setErrorState(
            "Sorry, that combination does not have enough questions"
          );
          setLoading(false);
        } else {
          setLoading(false);
        }
      });
    setLoading(true);
  }

  function randomizeAnswerOrder(answers) {
    for (let currentIndex = 0; currentIndex < answers.length; currentIndex++) {
      const randomIndex = Math.floor(Math.random() * answers.length);
      [answers[currentIndex], answers[randomIndex]] = [
        answers[randomIndex],
        answers[currentIndex],
      ];
    }
    return answers;
  }

  function Choice({ choice }) {
    return (
      <div
        className="Choice"
        onClick={() => {
          console.log(choice);
          setUserAnswers((prevState) => [...prevState, choice]);
          setCurrentQuestion((prevState) => prevState + 1);
        }}
      >
        <span>{atob(choice)}</span>
      </div>
    );
  }

  function TriviaBoard() {
    const answersRandomOrder = randomizeAnswerOrder([
      ...questions[currentQuestion].incorrect_answers,
      questions[currentQuestion].correct_answer,
    ]);

    return (
      <div className="TriviaBoard">
        <h2>{atob(questions[currentQuestion].category)}</h2>
        {atob(questions[currentQuestion].question)}
        {answersRandomOrder.map((choice) => {
          return <Choice key={choice} choice={choice} />;
        })}
      </div>
    );
  }

  function Result({ question, userAnswer, correctAnswer }) {
    return (
      <div className="ResultBox">
        <h3>{question}</h3>
        <h4>Correct answer: {correctAnswer}</h4>
        <h4>Your answer: {userAnswer}</h4>
      </div>
    );
  }

  function ResultBoard() {
    const numberOfCorrectAnswers = userAnswers.reduce((acc, value, index) => {
      if (value === questions[index].correct_answer) {
        return acc + 1;
      }
      return acc;
    }, 0);

    return (
      <div>
        You answered {numberOfCorrectAnswers} of {numberOfQuestions} questions
        correctly.
        {questions.map((q, index) => {
          console.log(userAnswers);
          console.log(q.correct_answer);
          return (
            <Result
              key={q.correct_answer}
              question={atob(q.question)}
              userAnswer={atob(userAnswers[index])}
              correctAnswer={atob(q.correct_answer)}
            />
          );
        })}
        <button onClick={reset}>Go again</button>
      </div>
    );
  }

  function StartPage() {
    return (
      <>
        <label>
          Select category:
          <select
            placeholder={"Category"}
            onChange={handleSelectCategory}
            value={selectedCategory}
          >
            <option value="">Random</option>
            {categories
              ? categories.map((category) => {
                  return (
                    <option key={category.name} value={category.id}>
                      {category.name}
                    </option>
                  );
                })
              : null}
          </select>
        </label>
        <label>
          Number of Questions: (max 50)
          <input
            onChange={handleNumberOfQuestions}
            value={numberOfQuestions}
            max={50}
            min={1}
            type="number"
          />
        </label>
        <label>
          Difficulty:
          <select onChange={handleDifficulty} value={difficulty}>
            <option key="easy" value="easy">
              Easy
            </option>
            <option key="medium" value="medium">
              Medium
            </option>
            <option key="hard" value="hard">
              Hard
            </option>
          </select>
        </label>
        <button onClick={getQuestions}>-- GO! --</button>
      </>
    );
  }

  return (
    <>
      <div class="bg"></div>
      <div class="bg bg2"></div>
      <div class="bg bg3"></div>
      <div className="App">
        {!questions && <StartPage />}
        {questions &&
          questions.length &&
          currentQuestion < questions.length && <TriviaBoard />}
        {questions &&
          questions.length &&
          currentQuestion === questions.length && <ResultBoard />}
        {errorState}
        {loading && <Spinner />}
      </div>
    </>
  );
}

function Spinner() {
  return <div class="lds-dual-ring"></div>;
}

export default TriviaGame;
