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
    this.RADIUS = 2; // How far away should the radius expand when it
	this.RadMod = 1;
    this.ITER = 10000; // Number of tries before the particle expires.
	this.POINTS = 10000; // Number of points to try and append to the figure.
   
	// Colors
	this.clear = "white";
	this.walk = "white";
	this.diff = "black";
	this.radColor = "red";
	this.multi = false;
	
	this.MultiRedS = 25;
	this.MultiRedE = 255;
	this.multiBlueS = 112;
	this.MultiBlueE = 0;
	this.MultiGreenS = 25;
	this.MultiGreenE = 69;
		
	// Establish the "Frame Buffer"
	this.pict = new Array(this.width);
	for (var i = 0; i < this.width; i++)
	{
		this.pict[i] = new Array(this.height);
		for (var j = 0; j < this.height; j++)
		{
			this.pict[i][j] = {'draw': 0, 'age': -1};
		}
	}
	// Place the seed 
	this.pict[Math.floor(width/2)][Math.floor(height/2)].draw = 1;
	this.pict[Math.floor(width/2)][Math.floor(height/2)].age = 0;

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
		var effRad = radius;
		var cenx = Math.floor(this.width/2);
		var ceny = Math.floor(this.height/2);
		var angle = 0;
        var curx = cenx; // Curent X
        var cury = ceny;
		var z = 0;
		var cen = Math.min(cenx, ceny);
		
		var points = 0
		//console.log("cenx: " + cenx + " | ceny: " + ceny);
		console.log("points = " + points + " | this.Points = " + this.POINTS);
        while ( points < this.POINTS)//radius < cen-1) // && points < 5000) 
		{
        	// Find position of new particle
            // Need polar equations 
			points++;
			//console.log("Created point " + points);

			angle = Math.random() * 2 * Math.PI;
			curx = Math.floor(effRad * Math.cos(angle) + cenx);
			cury = Math.floor(effRad * Math.sin(angle) + ceny);
			//console.log("New Point");// at " + curx + ", " + cury);
			
			for (var i = 0; i < this.ITER; i++)
			{
				// Check to see if the point is in range of the DLA
				if(this.Connect(curx, cury))
				{
					//console.log("Connection made");
					this.pict[curx][cury].draw = 1;
					this.pict[curx][cury].age = points;
					// Determines if the radius should be expanded
					if (( Math.floor((curx - cenx)*(curx - cenx) + (cury - ceny)*(cury - ceny))  >= Math.floor(radius*radius) ))
						{	
							if (radius < cen)
								radius++;
							if(radius >= 200)
								effRad = this.RadMod * radius;
							else
								effRad++;
						}
						
					// Break out of the for loop
					i = this.iter;
				}
			
				// Random Walk
				else
				{	
					//console.log("No Connection")
					this.pict[curx][cury].draw = 2;
					// Class Note - Should check all positions around it
					z = Math.floor(Math.random() * 8);
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
						i = this.ITER;
					}
				} 
			}
		}
		// Draw a line for the radius - troubleshooting
		/*for(var j = 1; j < effRad; j++)
		{
			this.pict[cenx-j][ceny].draw = 3
		}*/
		console.log("Run finished, Points: " + points);
		this.Draw(points);
		
		console.log("Radius: " + radius)
    },

    Draw: function(points)
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
					if(this.multi == true)
					{
						this.ctx.fillstyle = this.Multi(this.pict[i][j].age, points)
					}
					else
					{
						this.ctx.fillStyle = this.diff;
					}
					this.ctx.fillRect(i, j, 1, 1);
					one++;
					break;
				case 2:
					this.ctx.fillStyle = this.walk;
                    this.ctx.fillRect(i, j, 1, 1);
					two++;
					break;
				case 3:
					this.ctx.fillStyle = this.radColor;
                    this.ctx.fillRect(i, j, 1, 1);
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
				this.pict[i][j].age = -1;
			}
		}
		// Place the center seed
	this.pict[Math.floor(this.width/2)][Math.floor(this.height/2)].draw = 1;
	this.pict[Math.floor(this.width/2)][Math.floor(this.height/2)].age = 0;
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
			if(	this.pict[x-1][y].draw == 1||
				this.pict[x+1][y].draw == 1 ||
				this.pict[x][y-1].draw == 1 ||
				this.pict[x][y+1].draw == 1 ||
				this.pict[x-1][y-1].draw == 1 ||
				this.pict[x+1][y-1].draw == 1 ||
				this.pict[x-1][y+1].draw == 1 ||
				this.pict[x+1][y+1].draw == 1 								)
				{
					flag = true;
				}
		}
		return flag;
	},
	
	BGColor: function(color)
	{
		this.clear = color;
	},
	
	DiffusionColor: function(color)
	{
		if(color = "multi")
		{
			this.multi = true;
		}
		else	
			this.diff = color;
	},
		
	WalkColor: function(color)
	{
		this.walk = color;
	},
	
	Multi: function(age, points)
	{
		//console.log("getting color");
		var red = Math.floor(this.multiRedS * (1-(age/points * 360)) + this.multiRedE *(1-(age/points * 360)));
		var green = Math.floor(this.multiGreenS * (1-(age/points * 360)) + this.multiGreenE *(1-(age/points * 360)));
		var blue =  Math.floor(this.multiBlueS * (1-(age/points * 360)) + this.multiBlueE *(1-(age/points * 360)));
		console.log("Got Color: " + red + ", " + green + ", " + blue)
		return 'rgb('+ red + ', '+ green + ',' + blue +')';
	},
	
	Points: function(points)
	{
		var countNode = document.getElementById(points);
		var count = parseInt(countNode.value);
		if(count >1)
		{
			this.POINTS = count;
		}
	},
	
	Steps: function(steps)
	{
		var countNode = document.getElementById(steps);
		var count = parseInt(countNode.value);
		if(count >1)
		{
		this.ITER = count;
		}
	},
}
