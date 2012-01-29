/* Author: 

*/

var snakeToSwap = -1;
var ringTiles = new Array();

var snakeanimations = {
	'bigtail' : new $.gameQuery.Animation({ 
		imageURL: "img/bigtail.png",
		numberOfFrame: 1,
		delta: 100,
		rate: 0,
		type: $.gameQuery.ANIMATION_VERTICAL
	}),
	'bighead' : new $.gameQuery.Animation({ 
		imageURL: "img/bighead.png",
		numberOfFrame: 1,
		delta: 100,
		rate: 0,
		type: $.gameQuery.ANIMATION_VERTICAL
	}),
	'bigbody' : new $.gameQuery.Animation({ 
		imageURL: "img/bigbody.png",
		numberOfFrame: 1,
		delta: 100,
		rate: 0,
		type: $.gameQuery.ANIMATION_VERTICAL
	}),
	'earth' : new $.gameQuery.Animation({ 
		imageURL: "img/snakes.png",
		numberOfFrame: 1,
		delta: 100,
		rate: 0,
		offsety: 0*100,
		type: $.gameQuery.ANIMATION_HORIZONTAL
	}),
	'earthearth' : new $.gameQuery.Animation({ 
		imageURL: "img/snakes.png",
		numberOfFrame: 1,
		delta: 100,
		rate: 0,
		offsety: 1*100,
		type: $.gameQuery.ANIMATION_HORIZONTAL
	}),
	'earthwater' : new $.gameQuery.Animation({ 
		imageURL: "img/snakes.png",
		numberOfFrame: 1,
		delta: 100,
		rate: 0,
		offsety: 2*100,
		type: $.gameQuery.ANIMATION_HORIZONTAL
	}),
	'fire' : new $.gameQuery.Animation({ 
		imageURL: "img/snakes.png",
		numberOfFrame: 1,
		delta: 100,
		rate: 0,
		offsety: 3*100,
		type: $.gameQuery.ANIMATION_HORIZONTAL
	}),
	'earthfire' : new $.gameQuery.Animation({ 
		imageURL: "img/snakes.png",
		numberOfFrame: 1,
		delta: 100,
		rate: 0,
		offsety: 4*100,
		type: $.gameQuery.ANIMATION_HORIZONTAL
	}),
	'firefire' : new $.gameQuery.Animation({ 
		imageURL: "img/snakes.png",
		numberOfFrame: 1,
		delta: 100,
		rate: 0,
		offsety: 5*100,
		type: $.gameQuery.ANIMATION_HORIZONTAL
	}),
	'water' : new $.gameQuery.Animation({ 
		imageURL: "img/snakes.png",
		numberOfFrame: 1,
		delta: 100,
		rate: 0,
		offsety: 6*100,
		type: $.gameQuery.ANIMATION_HORIZONTAL
	}),
	'waterfire' : new $.gameQuery.Animation({ 
		imageURL: "img/snakes.png",
		numberOfFrame: 1,
		delta: 100,
		rate: 0,
		offsety: 7*100,
		type: $.gameQuery.ANIMATION_HORIZONTAL
	}),
	'waterwater' : new $.gameQuery.Animation({ 
		imageURL: "img/snakes.png",
		numberOfFrame: 1,
		delta: 100,
		rate: 0,
		offsety: 8*100,
		type: $.gameQuery.ANIMATION_HORIZONTAL
	}),
};


function setSnakeRotation(idx)
{
	var rotationAngle = 360 / SNAKES_IN_RING;
	var rot = rotationAngle * idx * -1;
	var snake = $("#tile"+idx+" .sprite");
	
	if($("#tile"+idx).hasClass("flipped")) {
		rot+=180;
	}

	snake.css("transform", "rotate("+rot+"deg)");
	snake.css("-ms-transform", "rotate("+rot+"deg)"); /* IE 9 */
	snake.css("-moz-transform", "rotate("+rot+"deg)"); /* Firefox */
	snake.css("-webkit-transform", "rotate("+rot+"deg)"); /* Safari and Chrome */
	snake.css("-o-transform", "rotate("+rot+"deg)"); /* Opera */
			
}

function setSnakeScaledRotation(idx, scalar)
{
	var rotationAngle = 360 / SNAKES_IN_RING;
	var rot = rotationAngle * idx * -1;
	var snake = $("#tile"+idx+" .sprite");

	if($("#tile"+idx).hasClass("flipped")) {
		rot+=180;
	}
	
	snake.css("transform", "rotate("+rot+"deg) scale("+scalar+", "+scalar+")");
	snake.css("-ms-transform", "rotate("+rot+"deg) scale("+scalar+", "+scalar+")"); /* IE 9 */
	snake.css("-moz-transform", "rotate("+rot+"deg) scale("+scalar+", "+scalar+")"); /* Firefox */
	snake.css("-webkit-transform", "rotate("+rot+"deg) scale("+scalar+", "+scalar+")"); /* Safari and Chrome */
	snake.css("-o-transform", "rotate("+rot+"deg) scale("+scalar+", "+scalar+")"); /* Opera */
}

// first time
function BuildRing()
{
	for(var i  = 0; i < SNAKES_IN_RING; i++) {
		var leftType = EMPTY;
		var rightType = EMPTY;

		/* the TAIL always starts at position 0 and the HEAD always starts at position 1 */
		if(i == 0) {
			leftType = rightType = TAIL;
		} else if (i == 1) {
			leftType = rightType = HEAD;
		}
		
		while (leftType == EMPTY && rightType == EMPTY)
		{
			if(Math.random() <= 0.40) {
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

function ConsumeMatches()
{
	var matchMade;
	
	do
	{
		matchMade = false;

		for(var i  = 0; i < SNAKES_IN_RING-1; i++) {
			var tile = ringTiles[i];
			var nextTile = ringTiles[i+1];

			if (tile.left == EMPTY && tile.right == EMPTY) continue;

			if (tile.left == WATER && nextTile.right == EARTH)
			{
				// WATER erodes EARTH
				nextTile.left = EMPTY;
				nextTile.right = EMPTY;
				matchMade = true;
			}
			else if (tile.left == EARTH && nextTile.right == FIRE)
			{
				// EARTH buries FIRE
				nextTile.left = EMPTY;
				nextTile.right = EMPTY;
				matchMade = true;
			}
			else if (tile.left == FIRE && nextTile.right == WATER)
			{
				// FIRE boils WATER
				nextTile.left = EMPTY;
				nextTile.right = EMPTY;
				matchMade = true;
			}
		}
	} while (matchMade);
}

function RebuildRing()
{
	for(var i  = 0; i < SNAKES_IN_RING; i++) {
		var pos = getPosOfSnake(i+(SNAKES_IN_RING/2));
		
		if($("#tile"+i).length == 0) {
			$("#ring").addGroup("tile"+i, { height: 100, width: 100});	
		}
		//center the tile
		//now move it based on pos.y and pos.x
		$("#tile"+i).css("top", (300+pos.x)+"px").css("left", (300+pos.y)+"px");
		
		var leftSnake = ringTiles[i].left;
		var rightSnake = ringTiles[i].right;
		
		var thesnake = null;
		var thetype = null;
		var h = 100;
		var w = 100;
		var left = leftSnake;
		var right = rightSnake;

		switch (Snake(left, right))
		{
			case Snake(HEAD, HEAD):
				thesnake = snakeanimations.bighead;
				thetype = "ouroborous";
				break;
			case Snake(TAIL, TAIL):
				thesnake = snakeanimations.bigtail;
				thetype = "ouroborous";
				break;
			case Snake(EMPTY, EMPTY):
				thesnake = snakeanimations.bigbody;
				thetype = "ouroborous";
				break;
			case Snake(EMPTY, WATER):
			case Snake(WATER, EMPTY):
				thesnake = snakeanimations.water;
				thetype ="water";
				break;
			case Snake(EMPTY, FIRE):
			case Snake(FIRE, EMPTY):
				thesnake = snakeanimations.fire;
				thetype ="fire";
				break;
			case Snake(EMPTY, EARTH):
			case Snake(EARTH, EMPTY):
				thesnake = snakeanimations.earth;
				thetype ="earth";
				break;
			case Snake(WATER, WATER):
				thesnake = snakeanimations.waterwater;
				thetype ="waterwater";
				break;
			case Snake(FIRE, FIRE):
				thesnake = snakeanimations.firefire;
				thetype ="firefire";
				break;
			case Snake(EARTH, EARTH):
				thesnake = snakeanimations.earthearth;
				thetype ="earthearth";
				break;
			case Snake(EARTH, FIRE):
			case Snake(FIRE, EARTH):
				thesnake = snakeanimations.earthfire;
				thetype ="earthfire";
				break;
			case Snake(EARTH, WATER):
			case Snake(WATER, EARTH):
				thesnake = snakeanimations.earthwater;
				thetype ="earthwater";
				break;
			case Snake(WATER, FIRE):
			case Snake(FIRE, WATER):
				thesnake = snakeanimations.waterfire;
				thetype ="waterfire";
				break;
		};

		$("#snake"+i).remove();
		$("#tile"+i).addSprite("snake"+i, {animation: thesnake, width: w, height: h});
		$("#tile"+i).attr("rel", i).addClass("tile").addClass(thetype);
		
		if(thetype == "ouroborous") {
			$("#tile"+i).unbind();
		}

		setSnakeRotation(i);
	}
}

var clicksound;
var transpose;
var colourchange;
$(document).ready(function(){

	var music = document.createElement('audio');
	music.setAttribute('src', 'ogg/music.ogg');
	music.volume=0.3;
	music.play();
	
	clicksound = document.createElement('audio');
	clicksound.setAttribute('src', 'ogg/click.ogg');
	clicksound.load();
	
	transpose = document.createElement('audio');
	transpose.setAttribute('src', 'ogg/transpose.ogg');
	transpose.load();
	
	colourchange = document.createElement('audio');
	colourchange.setAttribute('src', 'ogg/fwoof.ogg');
	colourchange.load();
	
	$("#playground").append("<img src='img/sound_on.png' id='sound' />");
	
	$("#sound").live("click", function(){
		if($(this).attr("src") == "img/sound_on.png") {
			clicksound.volume = 0;
			transpose.volume = 0;
			music.volume = 0;
			music.pause();
			colourchange.volume = 0;
			$(this).attr("src", "img/sound_off.png");
		} else {
			clicksound.volume = 1;
			transpose.volume = 1;
			music.volume = .3;
			music.play();
			colourchange.volume = 1;
			$(this).attr("src", "img/sound_on.png");
		}
	});
	
	$("#playground").playground({height: PLAYGROUND_HEIGHT, width: PLAYGROUND_WIDTH});
	
	//add the ring group
	$.playground().addGroup("ring", {
		width: PLAYGROUND_WIDTH, height: PLAYGROUND_HEIGHT
	});
	
	
	$.playground().startGame(function() { });

	BuildRing();
	RebuildRing();
	
	$(".tile:not(.ouroborous)").click(function(){
		if (snakeToSwap == -1)
		{
			// save it for next click swap
			snakeToSwap = $(this).attr("rel");
			setSnakeScaledRotation(snakeToSwap, 1.3);
			$(".tile.selected").removeClass("selected");
			$(this).addClass("selected");
		}
		else
		{
			var thisIdx = $(this).attr("rel");
			if(thisIdx != snakeToSwap) {
				var tmpTile = ringTiles[Number(thisIdx)];
				ringTiles[Number(thisIdx)] = ringTiles[Number(snakeToSwap)];
				ringTiles[Number(snakeToSwap)] = tmpTile;
				
				setSnakeRotation(thisIdx);
				setSnakeRotation(snakeToSwap);
				
				transpose.play();
			} else {
				if($("#tile"+snakeToSwap).hasClass("flipped")) {
					$("#tile"+snakeToSwap).removeClass("flipped");
				} else {
					$("#tile"+snakeToSwap).addClass("flipped");
				}
				colourchange.play();
				setSnakeRotation(thisIdx);
				setSnakeRotation(snakeToSwap);
			}

			$(".tile.selected").removeClass('.selected');
			RebuildRing();
			ConsumeMatches();
			snakeToSwap = -1;
		}
		
		/* debugging code */
		/*ringTiles[$(this).attr('rel')].left = EMPTY;
		ringTiles[$(this).attr('rel')].right = EMPTY;
		RebuildRing();*/
	});

	$(".tile:not(.ouroborous)").hover(
		// in
		function(){
			setSnakeScaledRotation($(this).attr("rel"), 1.1);
		},
		// out
		function(){
			var thisSnake = $(this).attr("rel");
			if (snakeToSwap != thisSnake)
			{
				setSnakeRotation(thisSnake);
			}
		}
	);


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
























