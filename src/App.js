import React, { useEffect, useState } from "react";
import "./App.css";

function App() {
  const [categories, setCategories] = useState(null);
  const [numQ, setNumQ] = useState("");
  const [selectedCategory, setCategory] = useState("");
  const [difficulty, setDifficulty] = useState("easy");
  const [questions, setQuestions] = useState(null);

  useEffect(() => {
    fetch("https://opentdb.com/api_category.php")
      .then(res => res.json())
      .then(data => {
        setCategories(data.trivia_categories);
      });
  }, []);

  function handleSelect(e) {
    setCategory(e.target.value);
  }

  function handleNumber(e) {
    setNumQ(e.target.value);
  }

  function handleDifficulty(e) {
    setDifficulty(e.target.value);
  }

  function getQuestions() {
    fetch(
      `https://opentdb.com/api.php?amount=${numQ}&category=${selectedCategory}&difficulty=${difficulty}&type=multiple&encode=base64`
    )
      .then(res => res.json())
      .then(data => {
        setQuestions(JSON.stringify(data, null, 4));
      });
  }

  return (
    <div className="App">
      <label>Select category: </label>
      <select
        placeholder={"Category"}
        onChange={handleSelect}
        value={selectedCategory}
      >
        <option value="" disabled selected>
          - - - - - -
        </option>
        {categories
          ? categories.map(category => {
              return (
                <option key={category.name} value={category.id}>
                  {category.name}
                </option>
              );
            })
          : null}
      </select>
      <label>Number of Questions: </label>
      <input onChange={handleNumber} value={numQ} type="number"></input>
      <label>Difficulty: </label>
      <select onChange={handleDifficulty}>
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
      <button onClick={getQuestions}>-- GO! --</button>
      {questions}
    </div>
  );
}

export default App;
