let mots;
$.get('mots.txt',r=>mots=r.split(/\s+/));

let good=new Set();
let bad=new Set();

let nbRound;
function hint(){
	if (good.size+bad.size<4||good.size+bad.size===nbRound) {
		return;
	}
	nbRound=good.size+bad.size;
	let pat=$('#mot').text();
	let usedLetters=[...good,...bad].join('');
	pat=pat.replaceAll(/\W/g,'[^'+usedLetters+']');
	let re1=new RegExp('^'+pat+'$');
	let re2=new RegExp('['+$('#lettres').text()+']');
	$('#hint').text(mots.filter(x=>re1.test(x)&&!re2.test(x)));
}

$(document).bind('ready ajaxComplete', function() {

	let mot=mots[Math.floor(Math.random()*mots.length)];
  
	Array.from(mot).forEach((c,i)=>{
		$('#mot').append('<div id="l'+i+'"> </div>');
	});

	['AZERTYUIOP','QSDFGHJKLM','WXCVBN'].forEach((r,j)=>
		Array.from(r).forEach((c,i)=>{
			$('#clavier'+j).append('<div id="c'+c+'">'+c+'</div>');
			$('#c'+c).on('click',()=>give(c));
		})
	);
	
	$('body').on('keyup',keyup);
	$('#hintcont').on('mouseover',hint);

	function give(l) {
		if(!/^[A-Z]$/.test(l)||bad.size>10) {
			return;
		}
		if (mot.includes(l)) {
			reveal(l);
		} else {
			used(l);
		}
	}

	function keyup(e){
		give(e.key.toUpperCase());
	}

	function reveal(l){
		if ( good.has(l)) {
			return;
		}
		good.add(l);
		Array.from(mot).forEach((c,i)=>{
			if (c===l){
				$('#l'+i).text(l);
			}
		});
		if (/^\w+$/.test($('#mot').text())){
			$('#nbTry').text('BRAVO !');
		}
	}

	function used(l){
		if (bad.has(l)) {
			return;
		}
		bad.add(l);
		$('#lettres').append("<div>"+l+"</div>");
		let nbTry = 11-bad.size;
		$('#nbTry').text(nbTry<1?'PERDU ! le mot était '+mot:'Nombre d\'essais restants: '+nbTry);
		drawCanvas();
	}

});

function drawCanvas() {
	let canvas = $('#canvas');
	let nbe=bad.size;
	let obj1={fillStyle:'#fb6', strokeStyle:'#f81', strokeWidth:2, fromCenter:false};
	let obj2={fillStyle:'grey', cornerRadius:6};
	if (nbe===1) {
		canvas.drawRect(Object.assign(obj1,{x:25, y:270, width:350, height:20}));
	} else if (nbe===2) {
		canvas.drawRect(Object.assign(obj1,{x:40, y:25,  width:15,  height:245}));
	} else if (nbe===3) {
		canvas.drawRect(Object.assign(obj1,{x:40, y:10,  width:185, height:15}));
	} else if (nbe===4) {
		obj1['p1']={
			type: 'line',
			x1: 55,  y1: 70,
			x2: 55,  y2: 50,
			x3: 80,  y3: 25,
			x4: 100, y4: 25,
			x5: 55,  y5: 70,
		};
		canvas.drawPath(obj1);
	} else if (nbe===5) {
		canvas.drawRect({fillStyle:'chocolate', strokeWidth:2, x:195, y:25, fromCenter:false,
			width:10, height:30
		});
	} else if (nbe===6) {
		canvas.drawArc(Object.assign(obj2, {x:200, y:76, radius:18}));
	} else if (nbe===7) {
		canvas.drawRect(Object.assign(obj2, {x:200, y:121, width:26, height:52}));
	} else if (nbe===8) {
		canvas.drawRect(Object.assign(obj2, {x:180, y:121, width:12, height:50, rotate:30}));
	} else if (nbe===9) {
		canvas.drawRect(Object.assign(obj2, {x:220, y:121, width:12, height:50, rotate:-30}));
	} else if (nbe===10) {
		canvas.drawRect(Object.assign(obj2, {x:189, y:171, width:13, height:62, rotate:10}));
	} else if (nbe===11) {
		canvas.drawRect(Object.assign(obj2, {x:211, y:171, width:13, height:62, rotate:-10}));
	}
}