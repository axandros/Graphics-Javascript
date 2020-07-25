function DLABasic(width, height) {
    // Make sure width and height are properly defined
    if (width == undefined || width < 0) {
        width = 300;
    }
    if (height == undefined || height < 0) {
        height = 300;
    }

    // Make the canvas
    var canvas = document.createElement('canvas')
		canvas.height = height;
		canvas.width = width;

    // Add the canvas to the document
    document.body.appendChild(canvas);

    // Set up local variables
	this.ctx = canvas.getContext("2d");
	
	// Numerical Values
    this.width = width;
    this.height = height;
	this.RANGE = 1;	// How far should each particle look for a DLA connection?
    this.RADIUS = 2; // How far away should the radius expand when it
    this.ITER = 100; // Number of tries before the particle expires.
   
	// Colors
	this.clear = "cyan";
	this.walk = "white";
	this.diff = "black";
	
	// Establish the "Frame Buffer"
	this.pict = new Array(this.width);
	for (var i = 0; i < this.width; i++)
	{
		this.pict[i] = new Array(this.height);
		for (var j = 0; j < this.height; j++)
		{
			this.pict[i][j] = {'draw': 0};
		}
	}
	// Place the seed 
	this.pict[Math.floor(width/2)][Math.floor(height/2)].draw = 1;

    return this;
}

DLABasic.prototype =
{
   // Calculates a new DLA map, then draws the DLA
    Run: function()
	{
		this.Blank();
		// Variables
		var radius = this.RADIUS;
		var cenx = Math.floor(this.width/2);
		var ceny = Math.floor(this.height/2);
        var curx = cenx; // Curent X
        var cury = ceny;
        var pi = Math.PI;
		var z = 0;
		//console.log("radius: " + radius);
		//console.log("width: " + this.width);
		
		var points = 0
		console.log("cenx: " + cenx + " | ceny: " + ceny);
        while (radius < cenx-1 && points < 500) 
		{
        	// Find position of new particle
            // Need polar equations 
			points++;
			//console.log("Created point " + points);

			curx = Math.floor(radius * 0.75 * Math.floor(Math.cos( Math.random() * 2 * pi)) + cenx);
			cury = Math.floor(radius * 0.75 * Math.floor(Math.sin( Math.random() * 2 * pi)) + ceny);
			//console.log("New Point at " + curx + ", " + cury);
			
			for (var i = 0; i < this.ITER; i++)
			{
				// Check to see if the point is in range of the DLA
				//if( curx == cenx && cury == ceny)
				//	console.log("Hit center")
				if(this.Connect(curx, cury))
				{
					console.log("Connection made");
					this.pict[curx][cury].draw = 1;
					// Determines if the radius should be expanded
					if (
						Math.sqrt(
							Math.pow((curx - cenx), 2) - Math.pow((cury - ceny), 2)) >= (radius) 
						)
						// !!! This needs refinement - see hW notes on Mirkwood
						{	
						radius = radius + this.RADIUS;
						}
						
					// Break out of the for loop
					i = this.iter;
				}
			
				// Random Walk
				else
				{	
					console.log("No Connection")
					this.pict[curx][cury].draw = 2;
					// Class Note - Should check all positions around it
					z = Math.floor(Math.random() * 4);
					//Find the position of the next position to color.
					switch (z)
					{
						case 0: curx++; break;
						case 1: curx--; break;
						case 2: cury++; break;
						case 3: cury--; break;
						case 4: curx++; cury++;
							break;
						case 5: curx++; cury--;
							break;
						case 6: curx--; cury++;
							break;
						case 7: curx--; cury--;
							break;
						default:
							break;
					}
					
					// Check that the position hasn't left bounds
					if(curx < 0 || cury < 0 || cury >= this.height-1 || curx >= this.width-1)
					{
						// console.log("x: "+ curx + " | y: " + cury)
						i = this.ITER;
					}
				} 
			}
		}
		this.Draw();
		console.log("Run finished, Points: " + points);
    },

    Draw: function()
	{ // Draws the DLA on the canvas
		var one  = 0;
		var two = 0;
		for (var i = 0; i < this.width; i++)
		{
            for (var j = 0; j < this.height; j++)
			{
				switch (this.pict[i][j].draw)
				{
				case 1:
					this.ctx.fillStyle = this.diff;
                    this.ctx.fillRect(i, j, 1, 1);
					one++;
					break;
				case 2:
					this.ctx.fillStyle = this.walk;
                    this.ctx.fillRect(i, j, 1, 1);
					two++;
					break;
				case 0: default:
					this.ctx.fillStyle = this.clear;
                    this.ctx.fillRect(i, j, 1, 1);
					break;
				}
            }
        }
		console.log("Ones: " + one);
		console.log("Twos: " + two);
	},
	
	Blank: function()
	{ // Clears the pict array to 0
		for (var i = 0; i < this.width; i++)
		{
			for (var j = 0; j < this.height; j++)
			{
				this.pict[i][j].draw = 0;
			}
		}
		// Place the center seed
	this.pict[Math.floor(this.width/2)][Math.floor(this.height/2)].draw = 1;
    },
	
	Connect: function(x, y)
	{ // Checks if the given coordinates connect to DLA figure
		var flag = false; // Flag that is returned
		// Make sure none of the values are undefined
		if (x == undefined || x < 1 || x >= this.width-1 ||
			y == undefined || y < 1 || y >= this.height-1)
		{ }
		else
		{
			console.log("Checking connection: " + x + ", " +  y)
			/*if (dist == undefined || dist < 0) {
				dist = this.RANGE;
			} */
			 
			if(	this.pict[x-1][y].draw == 1||
				this.pict[x+1][y].draw == 1 ||
				this.pict[x][y-1].draw == 1 ||
				this.pict[x][y+1].draw == 1 /*||
				this.pict[x-1][y-1].draw == 1 ||
				this.pict[x+1][y-1].draw == 1 ||
				this.pict[x-1][y+1].draw == 1 ||
				this.pict[x+1][y+1].draw == 1 							*/	)
				{
					flag = true;
				}
		}
		//console.log("flag test");
		return flag;
	},
}
