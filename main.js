



const readline = require('readline');
const crypto = require('crypto');

const moves = process.argv.slice(2);
const key = crypto.randomBytes(32).toString('hex');

// Check if the number of moves is odd and greater than 1
if (moves.length % 2 === 0 || moves.length < 3) {
  console.error('Invalid number of moves! Please enter an odd number of moves greater than 1.');
  console.error(`Example: node index.js rock paper scissors lizard spock`);
  process.exit(1);
}

// Generate a table of possible move outcomes
const table = generateTable(moves);

console.log(`HMAC key: ${key}`);
console.log(`Available moves: ${moves.map((move, index) => `${index + 1} - ${move}`).join(', ')}\n0 - exit\n? - help`);

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});


rl.question('Enter your move: ', (answer) => {
    const index = parseInt(answer, 10);
    if (answer === '?') {
        console.log(tableToString(table));
      rl.close();
      return;
    }
    if (index === 0) {
      console.log('Exiting...');
      rl.close();
      return;
    }
    if (isNaN(index) || index < 1 || index > moves.length) {
      console.error(`Invalid move! Please enter a number between 1 and ${moves.length} or 0 to exit.`);
      rl.close();
      return;
    }
  
    const computerMove = Math.floor(Math.random() * moves.length);
    const hmac = crypto.createHmac('sha256', key)
      .update(moves[computerMove])
      .digest('hex');
  
    console.log(`Your move: ${moves[index - 1]}`);
    console.log(`Computer move: ${moves[computerMove]}`);
    console.log(table[index - 1][computerMove]);
  
    console.log(`HMAC: ${hmac}`);
  
    rl.close();
  });
  

function generateTable(moves) {
    const table = [];
    for (let i = 0; i < moves.length; i++) {
      table.push([]);
      for (let j = 0; j < moves.length; j++) {
        if (i === j) {
          table[i].push('Draw');
        } else if (j === (i + 1) % moves.length || j === (i + 3) % moves.length) {
          table[i].push('Win');
        } else {
          table[i].push('Lose');
        }
      }
    }
    return table;
  }
  

function tableToString(table) {
  const rows = [];
  for (let i = 0; i < table.length; i++) {
    const row = table[i].map((outcome) => outcome.padEnd(5)).join('|');
    rows.push(`${i + 1} | ${row}`);
  }
  const header = `   | ${moves.map((move) => move.padEnd(5)).join('|')}`;
  const separator = '-'.repeat(header.length);
  return `${header}\n${separator}\n${rows.join('\n')}`;
}
