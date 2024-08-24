import { useEffect, useState } from "react";
import "./App.css";
import { WordList } from "./wordlist";

function App() {
    const [guesses, setGuesses] = useState<string[]>([]); //"width", "star", "apple", "thus"]);
    const [guess, setGuess] = useState("");
    const [message, setMessage] = useState("");
    const [submittedGuess, setSubmittedGuess] = useState("");
    const [solution, _setSolution] = useState(WordList[randomIntFromInterval(0, WordList.length - 1)]);

    const [preGuesses, setPreGuesses] = useState<string[]>([]);
    const [postGuesses, setPostGuesses] = useState<string[]>([]);

    useEffect(() => {
        setPreGuesses(guesses.filter((x) => x < submittedGuess).sort((a, b) => a < b ? -1 : a > b ? 1 : 0));
        setPostGuesses(guesses.filter((x) => x > submittedGuess).sort((a, b) => a < b ? -1 : a > b ? 1 : 0));
    }, [guesses]);

    // https://stackoverflow.com/a/7228322
    function randomIntFromInterval(min: number, max: number) {
        // min and max included
        return Math.floor(Math.random() * (max - min + 1) + min);
    }

    const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === "Enter") {
            setMessage("");
            if (guesses.includes(guess)) {
                setGuess("");
                return;
            }
            if (WordList.includes(guess)) {
                setSubmittedGuess(guess);

                setGuesses([guess, ...guesses]);
                setGuess("");

                if (submittedGuess === solution) {
                    setMessage(`You win! You took ${guesses.length} guesses.`)
                }
            } else {
                setMessage("Word not in list");
            }
        }
    };

    return (
        <>
            <h1>{solution}</h1>
            <div className="card">
                {preGuesses.map((x) => {
                    return <p key={`word-${x}`}>{x}</p>;
                })}
                <p>
                    <input
                        type="text"
                        placeholder="Guess a word"
                        value={guess}
                        onChange={(evt) => setGuess(evt.currentTarget.value)}
                        onKeyDown={handleKeyPress}
                    />
                </p>
                <p>{message}</p>
                {postGuesses.map((x) => {
                    return <p key={`word-${x}`}>{x}</p>;
                })}
                <p>Guess count: {guesses.length}</p>
            </div>
        </>
    );
}

export default App;
