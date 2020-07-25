function Canvas(locID) {

    var canvas = document.getElementById('canvas')
    height = canvas.height;
    width = canvas.width;

    this.width = width;
    this.height = height;
    this.clearColor = {"R":255, "G": 255, "B": 255}
    this.ctx =  canvas.getContext("2d");

    this.frameBuffer = new Array(this.width);
    for(var x = 0; x < this.width; x++) {
       this.frameBuffer[x] = new Array(this.height);
       for(var y=0; y < this.height; y++) {
           this.frameBuffer[x][y] = {"R": this.clearColor.R,
	            "G": this.clearColor.G, "B": this.clearColor.B};
       }
    }

    return this;
}

Canvas.prototype = {

    SetClearColor: function(r,g,b) {
        this.clearColor.R = r; 
        this.clearColor.G = g; 
        this.clearColor.B = b; 
        return;
    },

    Width: function() {
       return this.width;
    },

    Height: function() {
       return this.height;
    },

    Clear: function() {
        for(var x = 0; x < this.width; x++) {
            for(var y=0; y < this.height; y++) {
                this.frameBuffer[x][y].R = this.clearColor.R;
                this.frameBuffer[x][y].G = this.clearColor.G;
                this.frameBuffer[x][y].B = this.clearColor.B;
            }
	}
        return;
    },

    Redisplay: function() {
        for(var x = 0; x < this.width; x++) {
           for(var y=0; y < this.height; y++) {
	       color = "rgb(" + this.frameBuffer[x][y].R
	                      + ", " + this.frameBuffer[x][y].G
	                      + ", " + this.frameBuffer[x][y].B +")";
	       this.ctx.fillStyle = color;
	       this.ctx.fillRect(x,y,1,1);
           }
        }	
        return;
    },

    SetPoint: function(x,y, per,r1,g1,b1, r2, g2, b2) {
	//console.log("Per: " + per);
       if (x >= 0 && x < this.width && y > 0 && y <= this.height) {
	   y = this.height-y;
	   this.frameBuffer[x][y].R = this.CInterpol(r1, r2, per);
	   this.frameBuffer[x][y].G = this.CInterpol(g1, g2, per);
	   this.frameBuffer[x][y].B = this.CInterpol(b1, b2, per);
       } else {
          console.log("Set Point Error, ", x, y, r1, g1, b1);
       }
       return;
    },

    Point: function(x,y, r,g,b) {
        this.SetPoint(x,y, 1,r,g,b);
    },

    // for demo only, you need to replace this with Bresenham's
    // Does not deal with color properly
    Line: function(x1, y1, r1, g1, b1, x2, y2, r2, g2, b2) {
        var dx = x2-x1;
	var dy = y2-y1;
	var m = dy/dx; // may be NAN but will not be used.

	var x,y,dir;

	if (dx == 0 && dy == 0) 
	{ // attempt to draw a degenerate line (a point)
		this.SetPoint(x1, y1, 0, r1, g1, b1, r2, g2, b2);
	}
	else if (dx == 0)
	{ // no change in x, so it is a vertical line
	    var sy = Math.min(y1, y2);
	    var ey = Math.max(y1, y2);
	    for(y=sy; y <= ey; y++)
		{
	       this.SetPoint(x1,y, (y/(ey-sy)),r1,g1,b1, r2, g2, b2);
	    }
	}
	else if (dy == 0)
	{ // no change in y so it is a horizontal line.
	    var sx = Math.min(x1,x2);
	    var ex = Math.max(x1, x2);
	    for(x=sx; x <= ex; x++)
		{
	       this.SetPoint(x,y1, (x/(ex-sx)),r1,g1,b1, r2, g2, b2);
	    }
	}
	else if (Math.abs(dx) > Math.abs(dy) )
	{
	    if (dx < 0)
		{
	       dir  = -1;
	    }
		else 
		{
	       dir = 1;
	    }
	    for(x=x1; x!= x2; x+= dir) {
	       y = Math.round(y1+m*(x-x1));
	       this.SetPoint(x,y,(x/(x2-x1)),r1,g1,b1, r2, g2, b2);
	    }
	}
	else
	{
	    if (dy < 0) 
		{
	        dir = -1;
	    }
		else
		{
	        dir = 1;
	    }
	    for(y=y1; y != y2; y+= dir)
		{
	        x = Math.round(x1 + 1/m*(y-y1));
	        this.SetPoint(x,y, (y/(y2-y1)) ,r1,g1,b1, r2, g2, b2);
	    }
	}
        return;
    },

	// Bresenham's
	Bresenham: function(x1, y1, r1, g1, b1, x2, y2, r2, g2, b2)
	{
		console.log("Called Bresenham");
		var m = (y2 - y1)/(x2 - x1);
		
		if(Math.abs(m) <= 1)
		{	// X Major Order Correction (x1 < x2)
			if(x1 > x2)
			{
				var tempx = x2;
				var tempy = y2;
				x2 = x1;
				y2 = y1;
				x1 = tempx;
				y1 = tempy;
				
				var temp = r1;
				r1 = r2;
				r2 = temp;
				temp = g1;
				g1 = g2;
				g2 = temp;
				temp = b1;
				b1 = b2;
				b2 = temp;
			}
		}
		else
		{	// Y Major Order Correction (y1 < y2)
			if(y1 > y2)
			{
				var tempx = x2;
				var tempy = y2;
				x2 = x1;
				y2 = y1;
				x1 = tempx;
				y1 = tempy;
				
				var temp = r1;
				r1 = r2;
				r2 = temp;
				temp = g1;
				g1 = g2;
				g2 = temp;
				temp = b1;
				b1 = b2;
				b2 = temp;
			}
		}
		
		/*
		if(  ((dx > dy) && x1 > x2) || (!(dx > dy) && y1 > y2)  )
		{	// Make x1, x2 and x2, y2 so x1 < x2)
			var tempx = x2;
			var tempy = y2;
			x2 = x1;
			y2 = y1;
			x1 = tempx;
			y1 = tempy;
		}
		*/
		dy = (y2-y1);
		dx = (x2-x1); 
		
		var p = 0;
		
		var x, y;
		/*** Easy cases ***/
		if(dx == 0)
		{	// Vertical Line
			x = x1;
			for(y = y1; y < y2; y++)
			{
				this.SetPoint(x,y, ((y2-y)/(y2-y1)),r1,g1,b1, r2, g2, b2);
			}
		}
		else if(dy == 0)
		{	// Horizontal Line
			y = y1;
			for(x = x1; x < x2; x++)
			{
				this.SetPoint(x,y, ((x2-x)/(x2-x1)),r1,g1,b1, r2, g2, b2);
			}
		}
		else if(m == 1)
		{ // Positive 45 Line
			y = y1;
			for(x = x1; x < x2; x++, y++)
			{
				this.SetPoint(x,y, ((x2-x)/(x2-x1)),r1,g1,b1, r2, g2, b2);
			}
		}
		else if(m == -1)
		{	// Negative 45 Line
			y = y1;
			for(x = x1; x < x2; x++, y--)
			{
				this.SetPoint(x,y, ((x2-x)/(x2-x1)),r1,g1,b1, r2, g2, b2);
			}
		}
		else if(Math.abs(m) < 1 && m != 0)
		{	// X Major Cases
		
			y = y1;
			var A = -2 * dx;
			var B = 2 * dy;
			
			if(m > 0)
			{	// Positive Slope
				for(x = x1; x <= x2; x++)
				{ 
					this.SetPoint(x,y, ((x2-x)/(x2-x1)), r1,g1,b1, r2, g2, b2);
					if (p >= 0)
					{
						p += A;
						y++
					}
					p += B; 
				}
			}
			else
			{	// Negative Slope.
				//console.log("A = " + A)
				//console.log("B = " + B)
				//console.log(x1 + ", " + y1 + " through " + x2 + ", " + y2);
				for(x = x1; x <= x2; x++)
				{ 
					this.SetPoint(x,y, ((x2-x)/(x2-x1)), r1,g1,b1, r2, g2, b2);
					//console.log("Plot: " + x + ", " + y);
					//console.log("p = " + p);
					if (p >= 0)
					{
						p += A;
						y--;
					}
					p -= B; 
				}
			} 
		}
		
		else if(Math.abs(m) > 1)
		{	// Y Major Lines
			x = x1;
			var A = 2 * dy;
			var B = 2 * dx;
			

			if(m > 0)
			{	// Positive Slope
				for(y = y1; y <= y2; y++)
				{
					this.SetPoint(x,y, ((y2-y)/(y2-y1)), r1,g1,b1, r2, g2, b2);
					if (p >= 0)
					{
						p -= A;
						x++
					}
					p += B; 
				}
			}
			else
			{
				/*console.log("A = " + A);
				console.log("B = " + B);
				console.log(x1 + ", " + y1 + " through  " + x2 + ", " + y2);*/
				for(y = y1; y <= y2; y++)
				{ 
					this.SetPoint(x,y, ((y2-y)/(y2-y1)), r1,g1,b1, r2, g2, b2);
					if (p <= 0)
					{
						p += A;
						x--;
					}
					p += B; 
				} 
			}
		}
		return;
	},
	
	/* Linear Interpolation of Color from examples in notes */
	CInterpol: function(start, end, t)
	{
		if (end != undefined)
			return Clamp(0, 255, Math.floor(start * (1-t) + end*t));
		else
			return Clamp(0, 255, start)
	},
};

function Clamp(min, max, v) {
   return Math.max(min, Math.min(v,max));
}
