import React from "react";
import "./App.css";
import WORDS from 'an-array-of-french-words'; // our array of all french words, allegedly
// bonjouRalEncore
class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {word: "", highscore: 0};
  }

  isUpperCase(char) {
    return char === char.toUpperCase();
  }

  analyse(str) {
    // returns info on the str entered (size, number of words, ...)
    const wordsArr = this.splitWordInWords(str);
    console.log("wordsArr", wordsArr);
    return {taille: str.length, wordCount: str == "" ? 0 : wordsArr.length};
  }
  displayWordInfos(){
    // returns infos on the word formatted for display
    let data = this.analyse(this.state.word);
    return "Taille du mot: " + data.taille + ", nombre de mots: " + data.wordCount;
  }
  capitalizeFirstLetter(string) {
      return string.charAt(0).toUpperCase() + string.slice(1);
  }

  checkIfDoublons(str){
    // check if any of the capital letters are there twice
    // returns an array of capital letters in doublon, or false
    let uppercaseChars = [];
    let doublons = [];
    for (let i = 0; i < str.length; i++) {
      if (this.isUpperCase(str[i])){
        if (uppercaseChars.includes(str[i])) {
          doublons.push(str[i]);
        } else {
          uppercaseChars.push(str[i]);
        }
      }
    }
    console.log(doublons);
    return doublons;
  }

  checkStringValidity() {
    // check for input validity and returns errors if any
    const word = this.state.word;
    const doublons = this.checkIfDoublons(word);
    const unknownWords = this.checkIfWordsExist(this.splitWordInWords(word));
    if (!this.onlyLetters(word)) {
      return "Votre mot n'est pas valide. Veuillez entrer un mot valide."
    }
    if (doublons.length > 0) {
      return "Certaines lettres sont en double: " + doublons.join(', ');
    }
    if (unknownWords.length > 0) {
      return "Certains mots n'existent pas : " + unknownWords.join(', ');
    }
    return "valid";
  }

  onlyLetters(inputtxt) {
    let letters = /^[A-Za-zÀ-ÖØ-öø-ÿ\u00C0-\u00DC]+$/;
    if(inputtxt.length === 0 || inputtxt.match(letters)) {
      return true;
    } else {
      return false;
    }
  }

  getScore() {
    // letters = 0.1, words = 1; set highscore too if higher
    const word = this.state.word;
    if (word == "") {
      return 0;
    }
    let score = word.length * 0.1;
    const words = this.splitWordInWords(word);
    score += words.length;
    if (score > this.state.highscore) {
      this.setState({highscore: score})
    }
    return score;
  }

  checkIfWordsExist(words) {
    // returns an array of words that don't exist
    console.log("words hoho",words);
    let unknownWords = [];
    if (words[0] === "") {
      console.log("no input");
      return [];
    }
    for (let word of words) {
      console.log("WOOOOOORRd", word);
      if (!WORDS.includes(word.toLowerCase())){
        unknownWords.push(word);
      }
    }
    return unknownWords;
  }

  splitWordInWords(str) {
    //takes a str of words like: BonjouRéalitÉlégant
    // returns ["Bonjour", "Réalité", "Élégant"];
    // first approach without the accents
    if (str.length === 0) {
      return [""];
    }
    return str.split(/(?=[A-Z\u00C0-\u00DC])/).map((word, index, array) => {
      if (array.length === 1) {
        return word;
      }
      if (index === 0) {
        //first word
        let nextWord = array[index + 1];
        return this.capitalizeFirstLetter(word + nextWord[0].toLowerCase());
      } else if (index === array.length -1) {
        // last word
        return word;
      } else {
        let nextWord = array[index + 1];
        return word + nextWord[0].toLowerCase();
      }
    })
  }

  render() {
    return (
      <div className="App">
        <header className="App-header">
        <h1 className="title">Le mot le plus long</h1>
          <h2>Vous voici dans le challenge du mot le plus long</h2>
          <p>
            Votre mission: concaténer des mots afin de créer le plus long mot
            possible.
          </p>
          <p>Règles: </p>
          <p>Vos mots doivent être concaténés à la suite, chaque nouveau mot doit reprendre la dernière lettre du mot précédent, et doit être en majuscule.</p>
          <p>Exemples: <span className="text-success">bonjouRalEncore</span><br />
          <span className="text-danger">Je n'ai pas compris</span>,
          <span className="text-danger">motpasfacile</span>,
          <span className="text-danger">bonjouralencore</span>
          </p>
          <input onChange={e => this.setState({word: e.target.value})} className="form-control" />
          {this.checkStringValidity() === "valid" ?
          <><p className="text-primary">{this.displayWordInfos()}</p> <h3>SCORE: {this.getScore()}</h3>
          <p>Highscore: {this.state.highscore}</p></>:
        <p className="text-warning">{this.checkStringValidity()}</p>}

        </header>
      </div>
    );
  }
}

export default App;
