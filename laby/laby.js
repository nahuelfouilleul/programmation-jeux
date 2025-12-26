
function init_dots(type,level) {
  dots=[];
 
  if (type<3) {
    rows=10; cols=18;
  } else {
    rows=4; cols=12;
  }
  dots_space=48;
  move_length=12;
  dots_radius=9;
  line_width=18;
  endTime=null;

  if (level<2) {
    rows/=2;
    cols/=2;
    dots_space*=2;
    move_length*=2;
    dots_radius*=2;
    line_width*=2;
  } else if (level>2) {
    rows*=2;
    cols*=2;
    dots_space/=2;
    move_length/=2;
    dots_radius/=2;
    line_width/=2;
  }

  if (type<3) {
    goal=rows*cols-1;
  } else {
    goal=rows*cols-cols/2;
  }

  for ( i=0; i<rows; i+=1 ) {
    for ( j=0; j<cols; j+=1) {
      ngbs=[];
      x=0;
 
      if (i>0 && (type <3 || j%4==i%4) ) { ngbs[x++]=(i-1)*cols+j;}
      if (i<rows-1 && (type <3 || j%4==(i+1)%4)) { ngbs[x++]=(i+1)*cols+j;}
      if (type<3) {
        if (j>0&&(i+j)%4>0)      { ngbs[x++]=i*cols+j-1; }
        if (j<cols-1&&(i+j)%4<3) { ngbs[x++]=i*cols+j+1; }
      }else {
        //if (level<2) {
          ngbs[x++]=i*cols+(cols+j-1)%cols;
          ngbs[x++]=i*cols+(j+1)%cols;
        //}
      }

      if (type==2){
        if (i>0&&j>0&&i%2!=j%2&&(i+j+1)%4<2) { ngbs[x++]=(i-1)*cols+j-1;}
        if (i<rows-1&&j<cols-1&&i%2!=j%2&&(i+j)%4<2) { ngbs[x++]=(i+1)*cols+j+1;}
        if (i>0&&j<cols-1&&i%2!=j%2&&(4*cols+i-j)%4<2) { ngbs[x++]=(i-1)*cols+j+1;}
        if (i<rows-1&&j>0&&i%2!=j%2&&(4*cols+i-j+1)%4<2) { ngbs[x++]=(i+1)*cols+j-1;}
      }
 
      if (type<3) {
        dots[i*cols+j]=[dots_space*(j+.5),dots_space*(i+.5),ngbs];
      } else {
        dots[i*cols+j]=[500+dots_space*(i+2)*Math.cos(2*Math.PI*j/cols),300+dots_space*(i+2)*Math.sin(2*Math.PI*j/cols),ngbs];
      }
    }
  }
}

function generate() {
  hash_set = new Set(dots.map((n,i)=>i));
  rand_dot = Math.floor(Math.random()*dots.length);
  console.log("r dot:" + rand_dot);
  hash_set.delete(rand_dot);
  ngb_set = new Set(dots[rand_dot][2]);
  dots[rand_dot][2]=[];
  int_arr = Array.from( ngb_set.intersection( hash_set ) );
 
  while (int_arr.length>0) {
    rand_ngb = int_arr[Math.floor(Math.random()*int_arr.length)];
    hash_set.delete(rand_ngb);
    tmp_set = new Set();
    ngb_set.delete(rand_ngb);
    dots[rand_ngb][2].map( n => ( hash_set.has(n) ? ngb_set : tmp_set ).add(n) );
    tmp_arr = Array.from( tmp_set );
    dots[rand_ngb][2]=[ tmp_arr[Math.floor(Math.random()*tmp_arr.length)] ];
    int_arr = Array.from( ngb_set.intersection( hash_set ) );
  }
 
}

function init() {
  const canvas = document.getElementById("canvas");
  const ctx = canvas.getContext("2d");
 
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = "#555";
  ctx.strokeStyle = "#555";
 
  startTime=endTime=null;
  coups=0;

  init_dots(document.getElementById('type').value,document.getElementById('level').value);
  generate();
 
  for ( dot of dots ) {
    ctx.beginPath();
    ctx.arc(dot[0], dot[1], dots_radius, 0, 2 * Math.PI);
    ctx.fill();
    for ( ngb of dot[2] ) {
      ctx.beginPath();
      ctx.lineWidth = line_width;
      ctx.moveTo(dot[0], dot[1]);
      ctx.lineTo(dots[ngb][0], dots[ngb][1]);
      ctx.stroke();
    }
  }
 
  x = dots[goal][0];
  y = dots[goal][1];
  draw_player("#2f2");
 
  x = dots[0][0];
  y = dots[0][1];
  draw_player("#f22");
 
  document.body.onkeydown = canvas_onkeydown;
  document.body.onkeypress = canvas_onkeydown;
  document.body.onkeyup = canvas_onkeydown;
  document.body.onmousedown = canvas_onmousemove;
  document.body.onmousemove = canvas_onmousemove;
  document.body.onmouseup = canvas_onmousemove;
  document.body.ontouchmove = canvas_onmousemove;
  document.body.ontouchstart = canvas_onmousemove;
 
}
function draw_player(c) {
  const canvas = document.getElementById("canvas");
  const ctx = canvas.getContext("2d");
  ctx.strokeStyle = c;
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.arc(x, y, dots_radius*0.7, 0, 2 * Math.PI);
  ctx.stroke();
}

function control_move(tx,ty) {
  const canvas = document.getElementById("canvas");
  const ctx = canvas.getContext("2d");
  return Math.abs(ctx.getImageData(tx,ty,1,1).data[0]-125)<50;
}

function try_move(tx,ty) {
  if (control_move(tx,ty)) {
    draw_player("#dd2");
    x=tx;
    y=ty;
    coups += 1;
    draw_player("#f22");
    if ( coups === 1 ) {
      startTime=new Date();
    }
  }
  document.getElementById("count").innerHTML=coups;
  if (startTime) {
    document.getElementById("eltime").innerHTML=(new Date()-startTime)/1000;
  }
 
  if ( Math.abs(x-dots[goal][0])<move_length && Math.abs(y-dots[goal][1])<move_length*0.9 ) {
    endTime=new Date();
    document.getElementById("message").innerHTML="Bravo!";
  }
}

function canvas_onkeydown(event) {
  if ( endTime ) {
    return;
  }
  if (event.key === "ArrowUp") {
    try_move(x,y-move_length);
  } else if (event.key === "ArrowDown") {
    try_move(x,y+move_length);
  } else if (event.key === "ArrowLeft") {
    try_move(x-move_length,y);
  } else if (event.key === "ArrowRight") {
    try_move(x+move_length,y);
  }
}

function canvas_onmousemove(event) {
  if ( endTime ) {
    return;
  }
  ex = event.clientX || event.touches[0].clientX;
  ey = event.clientY || event.touches[0].clientY;
  document.getElementById('ex').innerHTML=ex;
  document.getElementById('ey').innerHTML=ey;
  if (!ex || !ey || ex > canvas.width || ey > canvas.height) {
    return;
  }
  if (ex>x) {
    try_move(x+move_length,y);
  } else {
    try_move(x-move_length,y);
  }
  if (ey>y) {
    try_move(x,y+move_length);
  } else {
    try_move(x,y-move_length);
  } 
}

