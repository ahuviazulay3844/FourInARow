//מס שורות ומס עמודות למטריצה
const COLS = 7;
const ROWS = 6;
let player1Name =localStorage.getItem("player1DisplayName") || "שחקן 1"; //  ביאאת השם השמור מ-localStorage
let player2Name = localStorage.getItem("player2DisplayName") || "שחקן 2"; //  את השם השמור מ-localStorage
const board = []; // מטריצה לייצוג באיזה מצב נמצא הלוח
let currentPlayer = 1; // 1 = שחקן אדום, 2 = שחקן צהוב
let gameOver = false;
const gameDifficulty = localStorage.getItem("gameDifficulty") || "קל"; 
//מצביעים שיהיה ותר קל לגשת אליהם
const boardElement = document.getElementById('board');
const gameStatusElement = document.getElementById('game-status');
const currentPlayerSpan = document.getElementById('current-player');
const resetButton = document.getElementById('reset-button');
const button_back = document.getElementById('button_back');
const timerDisplayElement = document.getElementById('timer-display');
const timeRemainingSpan = document.getElementById('time-remaining');
let timerInterval;
const timeOfTimer = 60; // מס שניות ומציג בדקות
let timeLeft = timeOfTimer;
     //  זה מטפל בקליטת השמות ובמעבר לדף המשחק
     const startGameButton=document.getElementById("start-game-button");// כי יכול להיות שנטען עכשיו הדף השני ולא מכיר אותו -בודקת אם קיים  
        if(startGameButton)
     {
            startGameButton.addEventListener("click", function() {
            const p1Name = document.getElementById("player1-name").value;//השם שהקיש
            const p2Name = document.getElementById("player2-name").value;          
            const selectedDifficulty = document.getElementById("difficulty-selector").value; //שומר מה בחר לעמוד הבא רמת קושי
            // שמירת השמות ב-localStorage כדי שיהיו נגישים בדף המשחק.
            // אם השדה ריק, ישמש "שחקן 1" או "שחקן 2" כברירת מחדל.
            localStorage.setItem("player1DisplayName", p1Name || "שחקן 1"); // את השמות localStorage ב  שומר 
            localStorage.setItem("player2DisplayName", p2Name || "שחקן 2");
            localStorage.setItem("gameDifficulty", selectedDifficulty); //את רמת הקושי localStorage שומר 
            window.location.href = "homePage.html"; //עובר עמוד
        });
    }
// --- פונקציות טיימר (הוסף את כל בלוק הקוד הזה) ---
function startTimer() {
    timeLeft = timeOfTimer; // איפוס זמן להתחלה מחדש
    updateTimerDisplay(); // עדכן תצוגה מיידית

    timerInterval = setInterval(timer,1000) 
    function timer()
    {
        timeLeft--;
        updateTimerDisplay();

        if (timeLeft <= 0) {
            clearInterval(timerInterval);
            gameOver = true;
            gameStatusElement.innerHTML = "נגמר הזמן! המשחק הסתיים .";
            // כאן אפשר להוסיף לוגיקה נוספת לסיום משחק בגלל זמן
        }
    }
}

function stopTimer() {
    clearInterval(timerInterval);
}

function updateTimerDisplay() {
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
    timeRemainingSpan.innerHTML = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
}
// --- סוף פונקציות טיימר ---
// --- פונקציות עזר ---
//  ליצירת הלוח פונקציה- 
//פעולה שבעצם מאפסת את המטריצה ומסמנת על כל איבר בה איזה מצב נמצא 
//בעצם את כולם באפס

function createBoard() {
    boardElement.innerHTML="";
    board.length = 0; //שלא יהיה אסימונים ממשחק קודם - מאפס את המטריצה
    for (let r = 0; r < ROWS; r++) {
        board.push(Array(COLS).fill(0)); // יוצר שורה חדשה במטריצה וממלא ב- 0 שזה בעצם (ריק)
        for (let c = 0; c < COLS; c++) {
            const cell = document.createElement('div'); //כל דיב כזה מיצג תא במשחק  יצירת DIV
            cell.classList.add('cell'); //שיתנהג כמו העיצוב של הקלאס CELL
            // עידכון שורות ועמודות בהתאם
            cell.dataset.row = r; 
            cell.dataset.col = c;
            cell.addEventListener('click', handleCellClick); 
            boardElement.appendChild(cell); //  ללוח מוסיפה אותו כילד
        }
    }
    updateStatus();
    if (gameDifficulty === 'קשה') {
        timerDisplayElement.style.display = 'block'; // הצג את הטיימר
        startTimer(); // התחל את הטיימר
    } else { // מצב 'קל)')
        timerDisplayElement.style.display = 'none'; // הסתר את הטיימר
        stopTimer(); 
    }
}
// עדכון סטטוס המשחק (איזה שחקן תורו)
function updateStatus() {
    let currentPlayersName = currentPlayer === 1 ? player1Name : player2Name;
    if (gameOver) {
        gameStatusElement.innerHTML = `!שחקן ${currentPlayersName} ניצח`;//השחקן הנוכחי ניצח תרשום בטקסט
      document.body.style.backgroundImage = 'url("images./img.gif")';
      stopTimer();
            }
    else {
        gameStatusElement.innerHTML = `תורו של השחקן <span id="current-player">${currentPlayersName}</span>`;
        currentPlayerSpan.innerHTML = currentPlayersName//יהפוך לשחקן לא הנוכחי
    }
}
// טיפול בלחיצה על תא שזה בעצם השלב של- (הטלת אסימון)
function handleCellClick(event) {
      // נחלץ את העמודה מהאלמנט שעליו לחצנו (event.currentTarget)
      const col = parseInt(event.currentTarget.dataset.col);
    if (gameOver) {
        return;//שלא ימשיך אם נגמר המשחק
    }
    //בעצם כדי למצוא איפה להכניס את השורה אני בעצם לוחצת על עמודה 
    //והתוכנית מחפשת איפה השורה הנמוכה ביותר של עמודה זו
   let row = -1//משהו לא הגיוני
    for (let r = ROWS - 1; r >= 0; r--) { 
        if (board[r][col] === 0)  //מילאנו באפס את כולם ואם לא הוכנס להם כלום הם עדין אפס 
        {
            // שם את האסימון במטריצה במיקום הנכון
            board[r][col] = currentPlayer
            row = r;//זה השורה שנכנס אליה
            break;
        }
    }
    //התיחסות למצב של שורה מלאה-לא יעשה כלום
    if (row == -1) {
        return;
    }
    //יוצרת פה את האסימון
    const disk = document.createElement("div")//יוצרת div
    disk.classList.add('disk', `player${currentPlayer}`);// PLAYER 1 או שתיים מבצע עכשיו את הקלאס של DISK  בעצם 
    const cellIndex = row * COLS + col;//בעצם ממיר את המיקום במטריצה למיקום אחד שומר את השורות הקודמות..
    boardElement.children[cellIndex].appendChild(disk);//שם כילד של הלוח במיקום הנל
    setTimeout(() => {
        disk.classList.add('dropped');
    }, 50); // השהיה קלה כדי לאפשר לדפדפן לרנדר לפני האנימציה
    // בודק אם השחקן ניצח
    //בעצם לכל שחקן סוג של לוח בנפרד לכן שולחת עמודות שורות ושחקן
    if (checkWin(row, col, currentPlayer)) {
        gameOver = true;
        updateStatus();//עידכון סטטוס שחקנים
        return;
    }
    //בדיקה אם הלוח לא מלא
    let isBoardFull = true; // מניחים בהתחלה שהלוח מלא
    for (let r = 0; r < ROWS; r++) {
        for (let c = 0; c < COLS; c++) {
            if (board[r][c] === 0) { // אם מצאנו 0- ריק
                isBoardFull = false; // הלוח לא מלא
                break; //צא מהלולאה הפנימית
            }
            if (!isBoardFull) { // אם הלוח כבר לא מלא, אפשר לצאת גם מהלולאה החיצונית
                break;
            }
        }
    }
    if (isBoardFull) { // אם הגענו לכאן ו-isBoardFull עדיין true, הלוח מלא
        gameOver = true;
        gameStatusElement.innerHTML = "התחל מחדש- הלוח מלא.";
        stopTimer();
        return;
    }
    currentPlayer = currentPlayer === 1 ? 2 : 1; // מחליף מ-1 ל-2 או מ-2 ל-1
    updateStatus(); // עדכן את הסטטוס להציג את השחקן החדש
}

// פונקציה לבדיקת ניצחון (תיקון)
//מקבלת את מיקום האסימון שהונח עכשיו ואת השחקן שהניח אותו, ומחליטה אם השחקן ניצח.
//הרעיון של הבדיקה פה בעצם זה סוג של רקורסיה שחוזרת על עצמה כי פעולה זו
//שולחת לעוד פעולה שסופרת סך הכל כמה יש ברצף מאותו שחקן ימין שמאל ואכסון
//0-אותה שורה או אותה עמודה 
//-1 שורה לפני או עמודה שמאלה
//1-שורה אחת אחרי עמודה ימינית 
//+1 של הנוכחי בודקת משני צידיו חוץ ממנו ואז מוסיפה אותו-}
function checkWin(row, col, player) {
    // בדיקה אופקית
    if (1 + countConsecutive(row, col, player, 0, 1) + countConsecutive(row, col, player, 0, -1) >= 4) return true;
    //רק למטה אין צורך למעלה כי כבר היה חוזר... בדיקה אנכית
    if (1 + countConsecutive(row, col, player, 1, 0) >= 4) return true;
    // בדיקה אלכסונית (למעלה-שמאל / למטה-ימין)
    if (1 + countConsecutive(row, col, player, 1, 1) + countConsecutive(row, col, player, -1, -1) >= 4) return true;
    // בדיקה אלכסונית (למעלה-ימין / למטה-שמאל)
    if (1 + countConsecutive(row, col, player, 1, -1) + countConsecutive(row, col, player, -1, 1) >= 4) return true;
    return false;//אם נתקל בשונה אז אין..
}

// פונקציה עזר לבדיקת רצפים
//בכל פעם מקדמת בהתאם (הוזזה ימינה או שמאלה למעלה או למטה)
// dRow, dCol לאיזה צד כיוון להתקדם בכל פעם 
function countConsecutive(row, col, player, dRow, dCol) {
    let count = 0;
    let r = row + dRow;
    let c = col + dCol;
    // או שלא מדובר בשחקן הזה ,שלא יחרוג מהמטריצה
    while (r >= 0 && r < ROWS && c >= 0 && c < COLS && board[r][c] === player) {
        count++;
        r += dRow;
        c += dCol;
    }
    return count;
}
// איפוס המשחק
function resetGame() {
    gameOver = false;//משחק חדש מתחיל
    currentPlayer = 1;//מתחיל משחקן 1
    createBoard(); // יוצר מחדש את הלוח
   document.body.style.backgroundImage=null;//שלא יהיה את הגיפ של הקונפטי

}
function button_back_func()
{
    window.location.href = "beforeHomePage.html"; 
}
// --- אתחול המשחק ---
createBoard();
resetButton.addEventListener('click', resetGame);
button_back.addEventListener('click',button_back_func);


