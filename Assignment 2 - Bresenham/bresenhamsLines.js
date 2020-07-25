/* Original Code pulled from "lineCanvas.js" by Dr. Bennett */

function Bresenham(width, height, locID) {

    if (width == undefined || width < 0) {
       width = 300;
    }

    if (height == undefined || height < 0) {
       height = 300;
    }

    var canvas = document.createElement('canvas')
        canvas.height = height;
        canvas.width = width;
	
	if(locID == undefined) {
        document.body.appendChild(canvas);
    } else {
        div = document.getElementById(locID);
        if (null == div) {
            document.body.appendChild(canvas);
        } else {
            div.appendChild(canvas);
        }
    }
	
	document.body.appendChild(canvas);

    this.width = width;
    this.height = height;
    this.clearColor = "#ffffff";
    this.ctx =  canvas.getContext("2d");

    this.x1 = Math.floor(this.width * .1);
    this.y1 = Math.floor(this.height * .1);
    this.x2 = Math.floor(this.width * .9);
    this.y2 = Math.floor(this.height * .9);
	
	return this;
}

Bresenham.prototype = {
	
    SetClearColor: function(color) {
        this.clearColor = color;
        return;
    },

    Clear: function() {
        this.ctx.fillStyle=this.clearColor;
        this.ctx.fillRect(0,0,this.width,this.height);

        return;
    },
	
	SetVar: function(id) {
       var node  = document.getElementById(id);
       var value = parseInt(node.value);
 
       if (id == "x1") {
          this.x1= Clamp(0, this.width, value);
       } else if (id == "x2") {
          this.x2= Clamp(0, this.width, value);
       } else if (id == "y1") {
          this.y1= Clamp(0, this.height, value);
       } else if (id == "y2") {
          this.y2= Clamp(0, this.height, value);
       }
	},
	
	PlotPoint: function(x,y) {
        y = this.height-y;
        this.ctx.fillStyle="#ff0000";
	this.ctx.fillRect(x,y,2,2);
    },
	
	Bresenhams()
	{
        var dx, dy, d;
		var x,y;

        dy = this.y2-this.y1;
		dx = this.x2-this.x1;

		if (dy > dx || dy<0)
		{
			console.log("Bresenham's only implemented for slope between 0 and 1");
			return;
		}

		d = 0
		y = this.y1;
		A = -2 * dx;
		B = 2 * dy;
		for(x = this.x1; x <= this.x2; x++)
		{
			this.PlotPoint(x,y);
			if (d >= 0)
			{
				d += A;
				y++;
			}
			d += B;
		}

		return;
    },

    Redisplay: function()
	{
		this.Clear();
		this.Bresenhams();
		return;
	},
};

function Clamp(low, high, value) {
   if (value < low) {
      value = low;
   }

   if (value > high) {
       value = high;
   }

   return value;
}