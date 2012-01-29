/* Author: 

*/

var snakeToSwap = -1;
var ringTiles = new Array();

var snakeanimations = {
	'bigtail' : new $.gameQuery.Animation({ 
		imageURL: "img/bigtail.png",
		numberOfFrame: 1,
		delta: 100,
		rate: 1,
		type: $.gameQuery.ANIMATION_VERTICAL
	}),
	'bighead' : new $.gameQuery.Animation({ 
		imageURL: "img/bighead.png",
		numberOfFrame: 1,
		delta: 100,
		rate: 1,
		type: $.gameQuery.ANIMATION_VERTICAL
	}),
	'bigbody' : new $.gameQuery.Animation({ 
		imageURL: "img/bigbody.png",
		numberOfFrame: 1,
		delta: 100,
		rate: 1,
		type: $.gameQuery.ANIMATION_VERTICAL
	}),
	'water' : new $.gameQuery.Animation({ 
		imageURL: "img/singles.png",
		numberOfFrame: 4,
		delta: 100,
		rate: 150+Math.floor(Math.random()*10),
		offsety: 0*100,
		type: $.gameQuery.ANIMATION_HORIZONTAL
	}),
	'fire' : new $.gameQuery.Animation({ 
		imageURL: "img/singles.png",
		numberOfFrame: 4,
		delta: 100,
		rate: 150+Math.floor(Math.random()*10),
		offsety: 1*100,
		type: $.gameQuery.ANIMATION_HORIZONTAL
	}),
	'earth' : new $.gameQuery.Animation({ 
		imageURL: "img/singles.png",
		numberOfFrame: 4,
		delta: 100,
		rate: 150+Math.floor(Math.random()*10),
		offsety: 2*100,
		type: $.gameQuery.ANIMATION_HORIZONTAL
	}),
	'waterwater' : new $.gameQuery.Animation({ 
		imageURL: "img/doubles.png",
		numberOfFrame: 4,
		delta: 100,
		rate: 150+Math.floor(Math.random()*10),
		offsety: 0*100,
		type: $.gameQuery.ANIMATION_HORIZONTAL
	}),
	'waterfire' : new $.gameQuery.Animation({ 
		imageURL: "img/doubles.png",
		numberOfFrame: 4,
		delta: 100,
		rate: 150+Math.floor(Math.random()*10),
		offsety: 1*100,
		type: $.gameQuery.ANIMATION_HORIZONTAL
	}),
	'earthwater' : new $.gameQuery.Animation({ 
		imageURL: "img/doubles.png",
		numberOfFrame: 4,
		delta: 100,
		rate: 150+Math.floor(Math.random()*10),
		offsety: 2*100,
		type: $.gameQuery.ANIMATION_HORIZONTAL
	}),
	'firefire' : new $.gameQuery.Animation({ 
		imageURL: "img/doubles.png",
		numberOfFrame: 4,
		delta: 100,
		rate: 150+Math.floor(Math.random()*10),
		offsety: 3*100,
		type: $.gameQuery.ANIMATION_HORIZONTAL
	}),
	'earthfire' : new $.gameQuery.Animation({ 
		imageURL: "img/doubles.png",
		numberOfFrame: 4,
		delta: 100,
		rate: 150+Math.floor(Math.random()*10),
		offsety: 4*100,
		type: $.gameQuery.ANIMATION_HORIZONTAL
	}),
	'earthearth' : new $.gameQuery.Animation({ 
		imageURL: "img/doubles.png",
		numberOfFrame: 4,
		delta: 100,
		rate: 150+Math.floor(Math.random()*10),
		offsety: 5*100,
		type: $.gameQuery.ANIMATION_HORIZONTAL
	}),
};


function setSnakeRotation(idx)
{
	var rotationAngle = 360 / SNAKES_IN_RING;
	var rot = rotationAngle * idx * -1;
	var snake = $("#tile"+idx+" .sprite");

	snake.css("transform", "rotate("+rot+"deg)");
	snake.css("-ms-transform", "rotate("+rot+"deg)"); /* IE 9 */
	snake.css("-moz-transform", "rotate("+rot+"deg)"); /* Firefox */
	snake.css("-webkit-transform", "rotate("+rot+"deg)"); /* Safari and Chrome */
	snake.css("-o-transform", "rotate("+rot+"deg)"); /* Opera */
			
}

function setSnakeDoubleSizeRotation(idx)
{
	var rotationAngle = 360 / SNAKES_IN_RING;
	var rot = rotationAngle * idx * -1;
	var snake = $("#tile"+idx+" .sprite");

	snake.css("transform", "rotate("+rot+"deg) scale(2.0, 2.0)");
	snake.css("-ms-transform", "rotate("+rot+"deg) scale(2.0, 2.0)"); /* IE 9 */
	snake.css("-moz-transform", "rotate("+rot+"deg) scale(2.0, 2.0)"); /* Firefox */
	snake.css("-webkit-transform", "rotate("+rot+"deg) scale(2.0, 2.0)"); /* Safari and Chrome */
	snake.css("-o-transform", "rotate("+rot+"deg) scale(2.0, 2.0)"); /* Opera */
}

// first time
function BuildRing()
{
	for(var i  = 0; i < SNAKES_IN_RING; i++) {
		var leftType = EMPTY;
		var rightType = EMPTY;

		while (leftType == EMPTY && rightType == EMPTY)
		{
			if(Math.random() <= 0.60) {
				leftType = Math.floor(Math.random()*4);
				rightType = EMPTY;
			} else {
				leftType = Math.floor(Math.random()*4);
				rightType = Math.floor(Math.random()*4);
			}
		}

		ringTiles.push({left:leftType, right:rightType});
	}
}

function Snake(left, right)
{
	return left + 10*right;
}

function RebuildRing()
{
	for(var i  = 0; i < SNAKES_IN_RING; i++) {
		var pos = getPosOfSnake(i);
		$("#ring").addGroup("tile"+i, { height: 100, width: 100});	
		//center the tile
		$("#tile"+i).css("top", (300+pos.x)+"px").css("left", (300+pos.y)+"px");
		//now move it based on pos.y and pos.x
		if(i == Math.floor(SNAKES_IN_RING/2)) {
			//big tail
			$("#tile"+i).addSprite("snake"+i, {animation: snakeanimations.bigtail, width: 100, height: 100});
		} else if (i == Math.floor(SNAKES_IN_RING/2)+1) {
			//big head
			$("#tile"+i).addSprite("snake"+i, {animation: snakeanimations.bighead, width: 100, height: 100});
		} else {
			var leftSnake = ringTiles[i].left;
			var rightSnake = ringTiles[i].right;
			
			var thesnake = null;
			var h = 100;
			var w = 100;
			var left = leftSnake;
			var right = rightSnake;

			switch (Snake(left, right))
			{
				case Snake(EMPTY, WATER):
				case Snake(WATER, EMPTY):
					thesnake = snakeanimations.water;
					break;
				case Snake(EMPTY, FIRE):
				case Snake(FIRE, EMPTY):
					thesnake = snakeanimations.fire;
					break;
				case Snake(EMPTY, EARTH):
				case Snake(EARTH, EMPTY):
					thesnake = snakeanimations.earth;
					break;
				case Snake(WATER, WATER):
					thesnake = snakeanimations.waterwater;
					break;
				case Snake(FIRE, FIRE):
					thesnake = snakeanimations.firefire;
					break;
				case Snake(EARTH, EARTH):
					thesnake = snakeanimations.earthearth;
					break;
				case Snake(EARTH, FIRE):
				case Snake(FIRE, EARTH):
					thesnake = snakeanimations.earthfire;
					break;
				case Snake(EARTH, WATER):
				case Snake(WATER, EARTH):
					thesnake = snakeanimations.earthwater;
					break;
				case Snake(WATER, FIRE):
				case Snake(FIRE, WATER):
					thesnake = snakeanimations.waterfire;
					break;
			};

			$("#tile"+i).addSprite("snake"+i, {animation: thesnake, width: w, height: h});
			$("#tile"+i).attr("rel", i).addClass("tile");

			setSnakeRotation(i);
		}
	}
}

$(document).ready(function(){

	$("#playground").playground({height: PLAYGROUND_HEIGHT, width: PLAYGROUND_WIDTH});
	
	//add the ring group
	$.playground().addGroup("ring", {
		width: PLAYGROUND_WIDTH, height: PLAYGROUND_HEIGHT
	});
	
	
	$.playground().startGame(function() { });

	BuildRing();
	RebuildRing();
	
	$(".tile").click(function(){
		if (snakeToSwap == -1)
		{
			// save it for next click swap
			snakeToSwap = $(this).attr("rel");

			setSnakeDoubleSizeRotation(snakeToSwap);
		}
		else
		{
			var thisIdx = $(this).attr("rel");
			//alert("Swap " + snakeToSwap + " and " + thisIdx);
			
			var tmpTile = ringTiles[Number(thisIdx)];
			ringTiles[Number(thisIdx)] = ringTiles[Number(snakeToSwap)];
			ringTiles[Number(snakeToSwap)] = tmpTile;
			
			setSnakeRotation(thisIdx);
			setSnakeRotation(snakeToSwap);

			RebuildRing();
			snakeToSwap = -1;
		}
	});
	/*
	// this sets the id of the loading bar:
	$().setLoadBar("loadingBar", 400);
	
	//initialize the start button
	$("#startbutton").click(function(){
		$.playground().startGame(function(){
			$("#welcomeScreen").fadeTo(1000,0,function(){$(this).remove();});
		});
	});*/
});

// Function to restart the game:
function restartgame(){
	window.location.reload();
};
























