import React, { useState, useEffect } from "react";
import axios from "axios";

const App = () => {
    const [tags, setTags] = useState(null);
    const [questions, setQuestions] = useState(null);
    const [selectedQuestions, setSelectedQuestions] = useState([]);

    const [selectionMap, setSelectionMap] = useState([]);
    const [selectedTags, setSelectedTags] = useState();
    const [submitted, setSubmitted] = useState(false);

    useEffect(() => {
        axios.get("/tags.json")
            .then(resp => {
                setTags(resp.data);
                setSelectionMap(Array.from({ length: resp.data.length }, () => false));
            });
        
        axios.get("/questions.json")
            .then(resp => setQuestions(resp.data));
    }, []);

    if (tags === null || questions == null)
        return (
            <section className="bg-slate-700 p-6 w-screen min-h-screen flex justify-center items-center text-white">
                <p>loading...</p>
            </section>
        );
    if (submitted)
        return (
            <section className="w-screen h-screen bg-slate-700 flex flex-col justify-center items-center text-white">
                <h2 className="text-xl">The selected tags are:</h2>
                <ul className="flex flex-col gap-3 max-w-xl mb-3 p-3">
                    {selectedTags.map((tag, index) => (
                        <li key={index}><p>{tag}</p></li>
                    ))}
                </ul>

                <h2 className="text-xl">The generated questions are:</h2>
                <ul className="flex flex-col gap-3 max-w-xl mb-3 p-3">
                    {selectedQuestions.map((question, index) => (
                        <li key={index}><p>{question}</p></li>
                    ))}
                </ul>

                <button 
                    type="button"
                    className="block mx-auto p-6 bg-slate-900 text-white rounded-md hover:bg-slate-800 shadow-md hover:shadow-lg"
                    onClick={() => {
                        setSelectionMap(Array.from({ length: selectionMap.length }, () => false));
                        setSelectedTags([]);
                        setSelectedQuestions([]);
                        setSubmitted(false);
                    }}
                >
                    Restart
                </button>
            </section>
        )
    return (
        <section className="bg-slate-700 p-6 w-screen min-h-screen flex justify-center items-center">
            <form onSubmit={(e) => {
                e.preventDefault();
                setSelectedTags(tags.filter((tag, index) => selectionMap[index]));
                setSelectedQuestions(questions
                    .map(value => ({ value, sort: Math.random() }))
                    .sort((a, b) => a.sort - b.sort)
                    .map(({ value }) => value)
                    .slice(0, 3)
                );
                setSubmitted(true);
            }}>
                <div className="flex max-w-xl justify-center flex-wrap mb-5 gap-3">
                    {tags.map((tag, index) => (
                        <button 
                            type="button"
                            onClick={() => {
                                const newSelectedTags = [...selectionMap];
                                newSelectedTags[index] = !newSelectedTags[index];
                                setSelectionMap(newSelectedTags);
                            }}
                            className={`text-white w-28 h-28 rounded-md shadow-md bg-slate-${selectionMap[index] ? "800" : "900"}`}
                            key={index}
                        >
                            {tag}
                        </button>
                    ))}
                </div>
                <button 
                    type="submit" 
                    className="block mx-auto p-6 bg-slate-900 text-white rounded-md hover:bg-slate-800 shadow-md hover:shadow-lg"
                >
                    Submit
                </button>
            </form>
        </section>
    );
}

export default App;