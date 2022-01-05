var gcd=function(a,b) {
	if (!b) {
		return a;
	}
	return gcd(b,a%b);
}

const tau=Math.PI*2;
var fig1,fig2,total,p,q,ratio,t=0;
var single,drawDots,drawPath,drawWheels,drawFig1,drawFig2;

function drawHypo(jcv) {
	let hypoPath={type:'line'};
	for(let t=0;t<=n;t+=1){
		let th=tau*p*t/n;
		let xcw=xc+r1*Math.sin(th);
		let ycw=yc-r1*Math.cos(th);

		let th2=th*r1/r2;
		hypoPath['x'+(t+1)]=xcw-dst*Math.sin(th2);
		hypoPath['y'+(t+1)]=ycw-dst*Math.cos(th2);
	}
	jcv.drawPath({strokeStyle:'#f63',strokeWidth:1.5,p1:hypoPath});
}

function drawFront(jcv) {
	initVars(jcv);
	jcv.clearCanvas();
	let th=tau*p*t/n;

	// all vertices
	let pvs=[];
	let xc0,yc0,txc0,tyc0;
	// center wheels
	for(let wh=0;wh<q;wh+=1){
		let th1=th+tau*wh/q;
		let xcw=xc+r1*Math.sin(th1);
		let ycw=yc-r1*Math.cos(th1);
		if (wh===0) {
			xc0=xcw;
			yc0=ycw;
		}
		let th2=th1*r1/r2;

		for (let s=0;s<p;s+=1) {
			let xd,yd;
			if (wh===0) {
				let th3=th2+tau*s/p;
				pvs[wh*p+s]=[xd=xcw-dst*Math.sin(th3),yd=ycw-dst*Math.cos(th3)];
			} else {
				pvs[wh*p+s]=[xd=pvs[s][0]+xcw-xc0,yd=pvs[s][1]+ycw-yc0];
			}
			// draw dots
			if( drawDots && !(single&&drawWheels&&wh&&s)) {
				jcv.drawArc({fillStyle:'rgba(0,0,0,0.4)',x:xd,y:yd,radius:6});
			}
		}
		// draw wheels
		if( drawWheels && !(single&&wh) ) {
			jcv.drawArc({fillStyle:'rgba(102,51,204,0.3)',x:xcw,y:ycw,radius:r2});
			if (single) {
				// draw second wheel
				let tth1=-tau*q*t/n;
				txc0=xc+dst*Math.sin(tth1);
				tyc0=yc-dst*Math.cos(tth1);
				jcv.drawArc({fillStyle:'rgba(51,153,255,0.3)',x:txc0,y:tyc0,radius:dst*r1/r2});
			}
		}
	}
	if (drawFig1) {
		let pfig1={strokeStyle:'#6633cc',strokeWidth:1.5};
		for(let wh=0;wh<q;wh+=1){
			if (single&&drawWheels&&wh) {
				continue;
			}
			let path={type:'line'};
			for (let s=1;s<=p+1;s+=1) {
				let pv=pvs[(wh%q)*p+(s%p)];
				path['x'+s]=pv[0];
				path['y'+s]=pv[1];
				if(single&&drawWheels){
					// draw radius
					pfig1['p'+(1+s)]={type:'line',x1:xc0,y1:yc0,x2:pv[0],y2:pv[1]};
				}
			}
			pfig1['p'+(wh+1)]=path;
		}
		jcv.drawPath(pfig1);
	}
	if (drawFig2) {
		let pfig2={strokeStyle:'#3399ff',strokeWidth:1.5};
		for(let s=0;s<p;s+=1){
			if (single&&drawWheels&&s) {
				continue;
			}
			let path={type:'line'};
			for (let wh=1;wh<=q+1;wh+=1) {
				let pv=pvs[(wh%q)*p+s];
				path['x'+wh]=pv[0];
				path['y'+wh]=pv[1];
				if(single&&drawWheels){
					// draw radius
					pfig2['p'+(1+wh)]={type:'line',x1:txc0,y1:tyc0,x2:pv[0],y2:pv[1]};
				}
			}
			pfig2['p'+(s+1)]=path;

		}
		jcv.drawPath(pfig2);
	}

}

function initVars(jcv) {
	n=total*63-1;
	dst=$('#distance').val();
	delay=$('#delay').val();
	
	q=total-p;
	ratio=p/total;

	rr=Math.floor(Math.min(jcv.height(),jcv.width())/2-2);
	xc=jcv.width()/2;
	yc=jcv.height()/2;

	r1=rr*q/total;
	r2=rr*p/total;

	// scale distance relatively to r1 and change from wheel center
	dst=r2-r1/153*dst;
}

function drawBack(jcv) {
	initVars(jcv);
	jcv.clearCanvas();
	if (single&&drawWheels&&dst>r2 ) {
		jcv.drawArc({strokeStyle:'#000',fillStyle:(p==fig1?'#eeffff':'#ffffee'),x:xc,y:yc,radius:dst*rr/r2});
	}
	jcv.drawArc({strokeStyle:'#000',fillStyle:(dst<r2?p==fig1?'#eeffff':'#ffffee':'white'),x:xc,y:yc,radius:rr});
	if (single&&drawWheels&&dst<r2 ) {
		jcv.drawArc({strokeStyle:'#000',fillStyle:'white',x:xc,y:yc,radius:dst*rr/r2});
	}
	if (drawPath) {
		drawHypo(jcv);
	}
}

function drawF() {
	drawDots=$('input[name="draw-points"]').is(':checked');
	drawFig1=$('input[name="draw-fig1"]').is(':checked');
	drawFig2=$('input[name="draw-fig2"]').is(':checked');
	p=fig1;
	drawFront($(cvfl));
	p=fig2;
	drawFront($(cvfr));
}

function drawB() {
	drawWheels=$('input[name="draw-wheels"]').is(':checked');
	single=$('input[name="single"]').is(':checked');
	drawPath=$('input[name="draw-path"]').is(':checked')
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
	if (stopped) {
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
			drawB();
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

	drawB();
	start();

});
