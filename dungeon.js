/*

TO DO:
Flood fill from "Important" rooms to ensure no direct paths to exit.

*/

var imgWall = "⬛";

var imgBlank = "⬜";

var imgDoor = "🚪";

function displayDungeon(dungeon){	
	// creates strings that use emojis to depict the dungeon layout 
	for (var i = 0; i < dungeon.length; i++){
		var asciiDung = "";
		for (var j = 0; j < dungeon[i].length; j++){
			var thisCellFill = "";
			if (dungeon[i][j] == 1){
				thisCellFill = imgBlank;
			} else if (dungeon[i][j] == 0){
				thisCellFill = imgWall;
			} else if (dungeon[i][j] == "D"){
				thisCellFill = imgDoor;
			} else {
				thisCellFill = "" + (dungeon[i][j]-1) +"⃣";
			}
			asciiDung += (thisCellFill);
		}
		console.log(asciiDung);
	}
}

function randInt(mn,mx){
	let range = mx-mn;
	let retVal = Math.floor(Math.random()*range) + mn;
	return retVal;
}

function connectRooms(dungeon, roomList){
	roomList = shuffle(roomList);
	var roomNum = 2;

	//expands the size of a given room (up to one unit in each direction)
	function expandRoom(rm){
		let xMin = randInt(-1,0);
		let xMax = randInt(1,2);
		let yMin = randInt(-1,0);
		let yMax = randInt(1,2);
		for (let n = xMin; n < xMax; n++){
			for (let p = yMin; p<yMax;p++){
				dungeon[rm.x+n][rm.y+p] = roomNum;
			}
		}
		roomNum++;
	}
	
	// Attaches each room to the next in the list by way of a hallway
	for (var i = 0; i < roomList.length-1; i++){
		var thisRoom = roomList[i];
		var partnerRoom = roomList[i+1];
		var x1 = thisRoom.x;
		var x2 = partnerRoom.x;
		var y1 = thisRoom.y;
		var y2 = partnerRoom.y;
		// in order for the for loop to work the x vals need to be sorted sm to lg
		if (x1 > x2){
			let tmpX = x1;
			x1 = x2;
			x2 = tmpX;
		}
		var cellFill = 1;
		for (var m = x1; m <= x2; m++){
			dungeon[m][y2] = cellFill;
		}
		// in order for the for loop to work the x vals need to be sorted sm to lg
		// AND the x vals need to be reset
		if (y1 > y2){
			let tmpY = y1;
			y1 = y2;
			y2 = tmpY;
		}
		x2 = partnerRoom.x;
		x1 = thisRoom.x;
		for (var m = y1; m <= y2; m++){
			dungeon[x1][m] = cellFill;
		}
	}

	let maxExpand = Math.min(9,roomList.length);
	for (let j = 0; j < maxExpand; j++){
		expandRoom(roomList[j]);
	}

	for (var n = 0; n < dungeon.length; n++){
		dungeon[0][n] = 0;
		dungeon[dungeon.length-1][n] = 0;
		dungeon[n][0] = 0;
		dungeon[n][dungeon.length-1] = 0;
	}
	var rnd = Math.random();
	if (rnd < 0.5){
		var low,high;
		if (rnd < .25){
			low = 0;
			high = roomList[roomList.length-1].x;
		} else {
			low = roomList[roomList.length-1].x;
			high = dungeon.length;
		}
		for (let i = low; i < high; i++){
			dungeon[i][roomList[roomList.length-1].y] = 1;
		}
	} else {
		var low,high;
		if (rnd < 0.75){
			low = 0;
			high = roomList[roomList.length-1].y;
		} else {
			low = roomList[roomList.length-1].y;
			high = dungeon.length;
		}
		for (let i = low; i < high; i++){
			dungeon[roomList[roomList.length-1].x][i] = 1;
		}
	}
	return dungeon;
}

function shuffle(a) {
    var j, x, i;
    for (i = a.length - 1; i > 0; i--) {
        j = Math.floor(Math.random() * (i + 1));
        x = a[i];
        a[i] = a[j];
        a[j] = x;
    }
    return a;
}

function createNameList(num){
	var overallDescriptions = [
		"Arched Brick Tunnels"
		,"Natural Caves"
		,"Rough Block Tunnels"
		,"Finely Crafted Stonework Tunnels"
		,"High Vaulted Chambers"
		,"Low Ceilinged Tunnels"
		,"Damp Earthy Tunnels"
		,"Geometrically Perfect Tunnels"
		,"Crumbling Ancient Tunnels"
	]

	var whichOverall = overallDescriptions[Math.floor(Math.random()*overallDescriptions.length)];
	console.log("General Aesthetic: " + whichOverall);

	var roomList = [
		"Barracks"
		,"Guard Room"
		,"War Room"
		,"Shitting Room"
		,"Well"
		,"Animal Pens"
		,"Zombie Pens"
		,"Altar"
		,"Scriptorium"
		,"Lab"
		,"Training Room"
		,"Torture Chamber"
		,"Fitting Room"
		,"Knitting Room"
		,"Sitting Room"
		,"Kitchens"
		,"Stalagmites"
		,"Natural Spring"
		,"Sacrificial Pit"
		,"Treasure Room"
		,"Animal Den"
		,"Entrance to Underdark"
		,"Blood Pools"
		,"Ceremonial Chamber"
		,"Music Hall"
		,"Mess Hall"
		,"Prison Cells"
		,"Crystal Caverns"
		,"Temple"
		,"Armoury"
	];
	roomList = shuffle(roomList);
	for (let i = 0; i < Math.min(num,9); i ++){
		console.log((i+1) + ": " + roomList[i]);
	}
}

function addDoors(dun){
	var doors = Math.floor(Math.random()*3)+1;
	var its = 1000;
	while (doors > 0 && its > 0){
		its--;
		var x = Math.floor(Math.random()*(dun.length-3))+1;
		var y = Math.floor(Math.random()*(dun.length-3))+1;
		if ((dun[x-1][y] === 0 
			&& dun[x+1][y] === 0
			&& dun[x][y-1] === 1
			&& dun[x][y+1] === 1)
			||
			(dun[x-1][y] === 1 
			&& dun[x+1][y] === 1
			&& dun[x][y-1] === 0
			&& dun[x][y+1] === 0)
		){
			dun[x][y] = "D";
			doors--;
		}
	}
	return dun;
}

function main(){

	var dungeonsize = Math.floor(Math.random()*6)+8;
	var dungeon = [];
	var roomList = [];
	for (var i = 0; i < dungeonsize; i++){
		var dungeonLayer = [];
		for (var j = 0; j < dungeonsize; j++){
			var thisCell = 0;
			dungeonLayer.push(thisCell);
		}
		dungeon.push(dungeonLayer);
	}
	while (roomList.length < 3){
		for (var i = 1; i < dungeonsize-1; i++){
			var dungeonLayer = [];
			for (var j = 1; j < dungeonsize-1; j++){
				if (Math.random(1)>0.96){
					dungeon[i][j] = 1;
					roomList.push({x:i,y:j});
				}
			}
		}
	}
	
	dungeon = connectRooms(dungeon, roomList);
	dungeon = addDoors(dungeon);

	displayDungeon(dungeon);
	createNameList(roomList.length);

	// TODO: make it tweet this shit
}

var second = 1000;
var minute = second*60;
var hour = minute * 60;
var day = hour * 24;

main();
setInterval(main,minute); // creates a new one every minute
