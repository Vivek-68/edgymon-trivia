#!/usr/bin/env node

import chalk from "chalk";
import inquirer from "inquirer";
import gradient from "gradient-string";
import chalkAnimation from "chalk-animation";
import figlet from "figlet";
import {createSpinner} from "nanospinner";


let playerName;

const sleep = (ms = 2000) => new Promise((res) => setTimeout(res,ms))
const welcome = async() =>{
   const greeting = chalkAnimation.rainbow(`Welcome ${playerName} to the greatest trivia game ever!\n`);
   await sleep();
   greeting.stop();

   console.log(chalk.blue(`How to play:\nYou will be asked ${chalk.white('10')} questions. Answer all of them to ${chalk.green('win')}, else you ${chalk.red('lose.')}`));
   await sleep(2000);
   
}
const askName = async()=>{
const name = await inquirer.prompt({
    type:"input",
    name:"player-name",
    message:"What is your name?",
    default(){
        return "Player1";
    },
});
playerName = name["player-name"];
}


const handleAns = async(isCorrect,ans)=>{
    const spinner = createSpinner(`Checking your answer...`).start();
   
    await sleep();
if(isCorrect){
    spinner.success({text:`Congratulations your answer was ${chalk.green(`correct!`)}!`});
    await sleep(1000);
}
else{
    spinner.error({text:`Sorry, but your answer was ${chalk.red(`wrong`)}, the correct answer was ${chalk.green(ans)}!`});
    process.exit(1);
}
}

const winner = async() =>{
    console.clear();
    const message = `You Win`;
    figlet(message,(err,res) =>{
        console.log(gradient.pastel.multiline(res));
    })
}

const gen = async()=>{
    const val = await fetch(`https://the-trivia-api.com/v2/questions`);
    const data = await val.json();
    for(let i = 0;i<10;i++){
        let options = data[i].incorrectAnswers
        options.push(data[i].correctAnswer);
        
        const ans = await inquirer.prompt({
            type:"list",
            name:"answer",
            message:data[i].question.text,
            choices:options,
            
        })
        await handleAns(ans.answer === data[i].correctAnswer,data[i].correctAnswer);
        console.log("\n\n");
    }

}


await askName(); 
await welcome();
await gen();
await winner();


