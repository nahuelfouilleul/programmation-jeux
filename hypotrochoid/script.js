var gcd=function(a,b) {
	if (!b) {
		return a;
	}
	return gcd(b,a%b);
}

const tau=Math.PI*2;
var fig1,fig2,total,p,q,ratio,t=0;

function drawHypo(jcv) {
	let hypoPath={type:'line'};
	for(let t=0;t<=n;t+=1){
		let th=tau*p*t/n;
		let xcw=xc+(r1-r2)*Math.sin(th);
		let ycw=yc-(r1-r2)*Math.cos(th);

		let angle2=th*(r1-r2)/r2;
		hypoPath['x'+(t+1)]=xcw-(r2-dst)*Math.sin(angle2);
		hypoPath['y'+(t+1)]=ycw-(r2-dst)*Math.cos(angle2);
	}
	jcv.drawPath({strokeStyle:'#f00',strokeWidth:.5,p1:hypoPath});
}

function drawFront(jcv) {
	initVars(jcv);
	jcv.clearCanvas();
	let th=tau*p*t/n;

	let single=$('input[name="single"]').is(':checked');

	// all vertices
	let pvs=[];
	let xc0,yc0;
	// center wheels
	for(let wh=0;wh<q;wh+=1){
		let angle=th+tau*wh/q;
		let xcw=xc+(r1-r2)*Math.sin(angle);
		let ycw=yc-(r1-r2)*Math.cos(angle);
		if (wh===0) {
			xc0=xcw;
			yc0=ycw;
		}
		let angle2=angle*(r1-r2)/r2;

		// draw wheels
		if( $('input[name="draw-wheels"]').is(':checked') && !(single&&wh) ) {
			jcv.drawArc({fillStyle:'rgba(120,120,120,0.2)',x:xcw,y:ycw,radius:r2});
		}
		for (let s=0;s<p;s+=1) {
			if (wh===0) {
				let angle3=angle2+tau*s/p;
				pvs[wh*p+s]=[xcw-(r2-dst)*Math.sin(angle3),ycw-(r2-dst)*Math.cos(angle3)];
			} else {
				pvs[wh*p+s]=[pvs[s][0]+xcw-xc0,pvs[s][1]+ycw-yc0];
			}
			// draw dots
			if( $('input[name="draw-points"]').is(':checked') && !(single&&(wh&&s))) {
				jcv.drawArc({fillStyle:'rgba(0,0,0,0.4)',x:pvs[wh*p+s][0],y:pvs[wh*p+s][1],radius:6});
			}
		}
	}
	// draw fig1
	if( $('input[name="draw-fig1"]').is(':checked')) {
		let fig1={strokeStyle:'#63c',strokeWidth:1};
		for(let wh=0;wh<q;wh+=1){
			if (single&&wh) {
				continue;
			}
			let path={type:'line'};
			for (let s=1;s<=p+1;s+=1) {
				let pv=pvs[wh*p+s%p];
				path['x'+s]=pv[0];
				path['y'+s]=pv[1];
			}
			fig1['p'+(wh+1)]=path;
		}
		jcv.drawPath(fig1);
	}

	// draw fig2
	if( $('input[name="draw-fig2"]').is(':checked')) {
		let fig2={strokeStyle:'#39f',strokeWidth:1};
		for(let s=0;s<p;s+=1){
			if (single&&s) {
				continue;
			}
			let path={type:'line'};
			for (let wh=1;wh<=q+1;wh+=1) {
				let pv=pvs[(wh%q)*p+s];
				path['x'+wh]=pv[0];
				path['y'+wh]=pv[1];
			}
			fig2['p'+(s+1)]=path;
		}
		jcv.drawPath(fig2);
	}

}

function initVars(jcv) {
	n=total*120;
	dst=$('#distance').val();
	delay=$('#delay').val();
	
	q=total-p;
	ratio=p/total;

	r1=Math.floor(Math.min(jcv.height(),jcv.width())/2-2);
	xc=jcv.width()/2;
	yc=jcv.height()/2;
	r2=r1*ratio;

	// scale distance relatively to r2
	dst=r1/153*dst;
}

function drawBack(jcv) {
	initVars(jcv);
	jcv.clearCanvas();
	jcv.drawArc({strokeStyle:'#000',fillStyle:(p==fig1?'#fff':'#ffc'),strokeWidth:1,x:xc,y:yc,radius:r1});
	if( $('input[name="draw-path"]').is(':checked')) {
		drawHypo(jcv);
	}
}

function drawF() {
	p=fig1;
	drawFront($(cvfl));
	p=fig2;
	drawFront($(cvfr));
}

function draw() {
	p=fig1;
	drawBack($(cvbl));
	p=fig2;
	drawBack($(cvbr));
	drawF();
}

function start() {
	stopped=false;
	t=0;
	setTimeout(step,delay)
}

function step() {
	if(stopped){
		return;
	}
	
	drawF();

	t+=1;t%=n;
	setTimeout(step,delay);
}

function stop() {
	stopped=true;
}

$(document).ready(function() {

	filterFig = fig => elem => {
		let jo = $(elem);
		let v = parseInt(jo.val());
		if (fig === 0 || v === 0 || gcd(fig,v) === 1) {
			jo.show();
		} else {
			jo.hide();
		}
	}

	function updateTotal() {
		if (fig1&&fig2) {
			$('#total').val(total=fig1+fig2);
			draw();
		}else{
			$('#total').val('');
		}
	}

	$('#fig1').on('change', function () {
		fig1=parseInt($(this).val());
		Array.prototype.forEach.call($('#fig2')[0].options, filterFig(fig1));
		updateTotal();
	});

	$('#fig2').on('change', function () {
		fig2=parseInt($(this).val());
		Array.prototype.forEach.call($('#fig1')[0].options, filterFig(fig2));
		updateTotal();
	});

	$('#fig1').val('3').change();
	$('#fig2').val('4').change();
	//fig1=3;fig2=4;updateTotal();
	draw();start();

});

