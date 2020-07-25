var X=0,
    Y = 1,
    R = 2,
    G = 3, 
    B = 4;

data = [
         [ "line", [ 10,10,255,0,0], [20,20,0,0,255], [30,30,0,255,0]],
	 [ "polygon", [100,100,0,255,255], [110,100,0,255,255], 
	              [110,110,0,255,255], [100,110,0,255,255]],
       ];



function DrawPolyLine(canvas, ary) {
    for(var p =1; p < ary.length-1; p++) {
        canvas.Bresenham(
	  ary[p][X],ary[p][Y], ary[p][R],ary[p][G],ary[p][B], 
	  ary[p+1][X],ary[p+1][Y], ary[p+1][R],ary[p+1][G],ary[p+1][B]) ;
    }
    return;
}

function DrawPolygon(canvas, ary) {
    DrawPolyLine(canvas, ary);

        var a = 1, b = ary.length-1;
        canvas.Bresenham(
	  ary[b][X],ary[b][Y], ary[b][R],ary[b][G],ary[b][B], 
	  ary[a][X],ary[a][Y], ary[a][R],ary[a][G],ary[a][B]) ;
    return;
}

function DrawIt(canvas) {
    var shape,point;

    for(shape=0; shape < data.length; shape ++) {
       console.log("drawing a ", data[shape][0]);
       if (data[shape][0] == "line") {
           DrawPolyLine(canvas, data[shape]);
       } else if (data[shape][0] == "polygon")  {
           DrawPolygon(canvas, data[shape]);
       }
    }
    return;
}

function Dragon(canvas) {
	console.log("Drawing Dragon");
    DrawPolyLine(canvas, dragon[0]);
    return;
}

function  Circle(canvas) {
   var t;
   var x1,y1;
   var x2,y2;
   var r = Math.min(canvas.Width()/2, canvas.Height()/2)*.9;
   var xc, yc;
   var step = 30;

   xc = Math.round(canvas.Width()/2);
   yc = Math.round(canvas.Height()/2);

   t = 0;

   x1 = xc + Math.round(r * Math.cos(t*Math.PI/180));
   y1 = yc + Math.round(r * Math.sin(t*Math.PI/180));
   for(t=step;t<360; t+= step) {
       x2 = xc + Math.round(r * Math.cos(t*Math.PI/180));
       y2 = yc + Math.round(r * Math.sin(t*Math.PI/180));
       canvas.Bresenham(x1, y1, 0,0,0, x2, y2 , 255, 0,0);
       x1 = x2;
       y1 = y2;
   }

   t = 360;
   x2 = xc + Math.round(r * Math.cos(t*Math.PI/180));
   y2 = yc + Math.round(r * Math.sin(t*Math.PI/180));
   canvas.Bresenham(x1, y1, 255,0,0, x2, y2 , 255, 0,0);

   canvas.Point(xc, yc, 255,0,0);
}

function LineTest(canvas) {

	// Start and end colors
	var Sred = 255;
	var Sgreen = 0;
	var Sblue = 0;
	var Ered = 	155;
	var Egreen = 42;
	var Eblue = 0;
	
   var xm = Math.round(canvas.Width() *.1);
   var ym = Math.round(canvas.Height() *.1);
   var xx = Math.round(canvas.Width() * .9);
   var yx = Math.round(canvas.Height() * .9);

   // draw a horizontal line left to right.
   canvas.Bresenham(xm,ym, 0,0,0, xx,ym , 0, 0, 0 );
   // draw a horizontal line right to left
   canvas.Bresenham(xx,yx, 0,0,0, xm, yx, 0, 0, 0 );

   // draw a vertical line top to bottom
   canvas.Bresenham (xm, yx, 0, 0, 0, xm, ym, 0,0,0);
   // draw a vertical line bottom to top.
   canvas.Bresenham (xx, ym, 0, 0, 0, xx, yx, 0,0,0);

   //four diagionals.
   canvas.Bresenham(xm,ym,0,0,0, xx,yx,0,0,0);
   canvas.Bresenham(xx,yx,0,0,0, xm,ym,0,0,0);

   canvas.Bresenham(xx,ym,0,0,0, xm,yx,0,0,0);
   canvas.Bresenham(xm,yx,0,0,0, xx,ym,0,0,0);

   var xc = Math.round(canvas.Width()/2);
   var yc = Math.round(canvas.Height()/2);;
   var r = Math.min(xc, yc)*.7; 
   var x,y;

   var t;
   
   for(t=0;t<360;t+=10) // 40 is good for testing.
	{
       x = xc + Math.round(r*Math.cos(t*Math.PI/180));
       y = yc + Math.round(r*Math.sin(t*Math.PI/180));
       canvas.Bresenham(xc, yc, Sred, Sgreen, Sblue, x,y, Ered, Egreen, Eblue);
   }
}


