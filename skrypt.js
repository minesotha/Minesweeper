var sec = 0;
var timeStarted=false;
var size;
var bombCount;
var board =[];
var isEndGame=false;
var  toReveal;


//funkcja updatujaca czas
function time()
{
    if(sec>-1){
        $('#time').html(sec++);
    }

}

//ustawienie planszy
function startGame()
{
size = prompt("Wybierz wielkość planszy: ", "5");
bombCount=prompt("Wybierz ilość bomb", "5");

	
	//jezeli bledne dane, pytaj do skutku
    if (size == null || size<5 || bombCount<5 ||bombCount>(size*size) ){
	startGame();
    }
	//inaczej rozpocznij nowa gre
	else{
		board=[];
		sec=0;
		if(timeStarted==true){
			//usuniecie starej planszy i wyzerowanie licznika
			$("#tablica tr").remove();
			sec=0;
		}
		else{
			//jezeli zupelnie nowa gra, ustawienie licznika
		setInterval(function(){time()},1000);
		}
		timeStarted = true;
		isEndGame=false;
		makeBoard();
	toReveal=size*size-bombCount;
	
		$('#toRev').html(toReveal);
	}
	
}


//utworzenie planszy
function makeBoard()
{

var table = document.getElementById("tablica");

for (i=0;i<size;i++)
{
var row = table.insertRow(i);

	for (j=0;j<size;j++)
		{
		var cell = row.insertCell(j);
		cell.id=(i)+"_"+(j);
		
//dodanie listenerow dla klikniec
	cell.addEventListener("click", mine, false);
	cell.addEventListener("dblclick", cellClick, false);

		}
}


//utworzenie niewidzialnej dla uzytkownika tablicy 2 wymiarowej, ktora bedzie przechowywac dane  liczbowe
board.length=size;
for (var i=0; i<board.length; i++){
var neu=[];
neu.length=size;
    board[i] = neu;
	
    for (var j=0; j<board[i].length; j++){
        board[i][j]=0;
    }
}

randomMines();
countNeighbors();
}


//losowanie min na planszy
function randomMines(){
    var tmp = 0;
    while(tmp<bombCount){
        var r = Math.floor(Math.random()*size);
        var c = Math.floor(Math.random()*size);
        if(board[r][c]!=-1){
            board[r][c]=-1;
            tmp++;
			console.log(r,c);
        }
    }
}

//zapelnienie reszty tablicy info o liczbie sasiadujacych min
function countNeighbors(){
    for (var i=0; i<board.length; i++){
        for (var j=0; j<board[i].length; j++){
           if(board[i][j]!=-1){
                board[i][j]=countN(i,j);
           }
        }
    }
}


//funkcja liczaca miny sasiadujace z krotka
function countN(r, c){
    var count=0;

    for(var i=r-1; i<=r+1; i++){
        for(var j=c-1; j<=c+1; j++){
            if(i>-1 && i<board.length && j>-1 && j<board[i].length){
                if(board[i][j]==-1){
                    count++;
                }
            }
        }
    }
    return count;
}


//sprawdzenie, czy z polem  sąsiadują 0
function checkZeros(r, c){
    for(var i=r-1; i<=r+1; i++){
        for(var j=c-1; j<=c+1; j++){
            if(i>-1 && i<board.length && j>-1 && j<board[i].length){
                if(board[i][j]==0){
					if($('#tablica').getCell(i,j).attr('class') != 'emptyN'){
                     $('#tablica').getCell(i,j).addClass('emptyN');
					$('#tablica').getCell(i,j).html(board[i][j]);
				var cur = document.getElementById(i+'_'+j);
		cur.removeEventListener("click", mine , false);
		cur.removeEventListener("dblclick", cellClick , false);
	
				$('#toRev').html(toReveal--);
					checkZeros(i, j);
					}
                }
            }
        }
    }
}


//obsluga klikniecia
function cellClick(obj){
		obj.currentTarget.removeEventListener("click", mine , false);
		obj.currentTarget.removeEventListener("dblclick", cellClick , false);
		
	if(isEndGame==false){
    var id = obj.currentTarget.id;
    var idR = id.substring(0, id.indexOf('_')); 
    var idC = id.substring(id.indexOf('_')+1, id.length);
    
    $('#'+id).removeClass();
	//kolorowanie odkrytych pol
    if(board[idR][idC]==-1){
        $('#'+id).addClass('mine');
    } 
	else if(board[idR][idC]==0){
		checkZeros(idR,idC);
    } 
	else {
	
		        $('#toRev').html(toReveal--);
		checkZeros(idR,idC);
        $('#'+id).addClass('empty');
    }

    $('#'+id).html(board[idR][idC]);
	
	if (toReveal == 0){
		alert("Kim jesteś? Jesteś zwycięzcą!")
		isEndGame=true;
	}

	//jezeli -1, czyli bomba>zakoncz gre, zablokuj ruch, odkryj bomby i zatrzymaj licznik
    if(board[idR][idC]==-1){
        alert('Koniec gry');
				showBombs();
        $('#time').html(sec);
		isEndGame=true;
        sec=-1;
    }
	}
}

//oznaczanie X typowanych bomb na planszy
function mine(obj){
	if(isEndGame==false){
    var id = obj.currentTarget.id;
    var idR = id.substring(0, id.indexOf('_')); 
    var idC = id.substring(id.indexOf('_')+1, id.length);
    $('#'+id).html('x');
    $('#'+id).removeClass();
    $('#'+id).addClass('black');
	}
}

//odkrycie wszystkich bomb po skonczonej grze
function showBombs(){

    for (var i=0; i<board.length; i++){
        for (var j=0; j<board[i].length; j++){
          if(board[i][j]==-1){
		$('#tablica').getCell(i,j).addClass('mine');
      $('#tablica').getCell(i,j).html(board[i][j]);
			}
			}
	}
}
//funkcja jquery zwracajaca komorke tablicy w miejscu x, y
jQuery.fn.getCell = function(x,y){
return jQuery( this[0].rows[x].cells[y] );
};
