<!DOCTYPE html>
<html>
<head>
<title>DLA Generator</title>
<script type="text/javascript" src="DLAAdvanced.js"></script>
</head>
<body>

<h1>DLA</h1>

<script>
var WIDTH = 600;
var HEIGHT = 600;

var can = new DLABasic(WIDTH, HEIGHT);
<!--can.Run();-->
</script>
<p>
ForeGround Color:<select id="FGColor" onchange="can.DiffusionColor(this.value); can.Draw()">
    <option value="black">black</option>
	<option value="blue">blue</option>
	<option value="red">red</option>
	<option value="green">green</option>
	<option value="purple">purple</option>
	<option value="white">white</option>
	<option value="multi">rainbow</option>
    
</select>
Background Color:
<select id="BGColor" onchange="can.BGColor(this.value); can.Draw()">
    <option value="white">white</option>
	<option value="#f4d1ff">pink</option>
	<option value="#ffd1dc">rose</option>
	<option value="#dcffd1">grass</option>
	<option value="#d1fff4">teal</option>
    <option value="black">black</option>
</select>
Walking Color:
<select id="BGColor" onchange="can.WalkColor(this.value); can.Draw()">
    <option value="white">white</option>
	<option value="#f4d1ff">pink</option>
	<option value="#ffd1dc">rose</option>
	<option value="#dcffd1">grass</option>
	<option value="#d1fff4">teal</option>
    <option value="black">black</option>
</select>
<br>
Points:
<input
	type="text"
	name="Points"
	maxlength = "5"
	size = "5"
	id="Points"
	value ="10000"
	onchange="can.Points('Points')">

Max Steps:
<input
	type="text"
	name="Steps"
	maxlength = "5"
	size = "5"
	id="MSteps"
	value ="10000"
	onchange="can.Steps('MSteps')">
<button type = "button" onclick = "can.Run()">Recompute</button>
<button type = "button" onclick = "can.Draw()">Redisplay</button>
<p>
<h3>Problems Encountered</h3>
The first problem I encountered was simple character compatibility issues.  When I started this program, the only machine I had access to was my father's macbook.
It took several minutes just to access a plain text editor to work on the code, and then it turned out to be not so plain text.  Special quotes and dashes replaced plain ascii,
preventing my program from running.  It was obviously a simple fix once I had a decent development platform again, but it was time consuming. <br>
I then had problems getting my random points to connect to the central seed.  The first problem was that I forgot to plant the seed, but problems persisted once that was fixed.
I moved the code for making connections into a seperate function to aid diognostics, and began coloring the points the particles walked through, just to get  agood idea of what the problem was.
In the end, I had to remove some of the design space I wanted (being able to make connections more than 1 pixel away) in order to fix it.<br>
The last major problem I had is sadly foolish.  I wrote the distance formula as
<span style="white-space: nowrap">
&radic;<span style="text-decoration:overline;">&nbsp;(x-xc)<sup>2</sup> - (y-yc)<sup>2</sup>&nbsp;</span>
 when it should have been <span style="white-space: nowrap"></span>
&radic;<span style="text-decoration:overline;">&nbsp;(x-xc)<sup>2</sup> + (y-yc)<sup>2</sup>&nbsp;</span></span>.
I discovered this when I noticed that the radius was expanding too quickly, so most particles were unable to get close enought to the figure to connect.
I feel that I probably fixed many latent bugs in the process of looking for this one.

<br>

<h3>Interesting Techniques Employed</h3>
Instead of comparing the square root of (x-xc)<sup>2</sup> + (y-yc)<sup>2</sup> and the radius, I removed the square root and squared the radius instead,
since I didn't care about the actual distance. This was because finding the square root is far more expensive than simple multiplication, 
and since I performed this measurement every time a particle connected to the figure, I hoped optimizing the equation woul