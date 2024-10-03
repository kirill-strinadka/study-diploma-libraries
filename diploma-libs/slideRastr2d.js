// ________________class SlideRecord2D_____________________
class SlideRecord2D {
	constructor (slideElement, toolsElement, slideSRC) {
		this.slideBlock = slideElement;
		this.toolsBlock = toolsElement;
		this.width1 = this.slideBlock.clientWidth;
		this.height1 = this.slideBlock.clientHeight;
		this.cmdArr = [];
		// создаем элемент 2D 
		this.slideCanvas = document.createElement('canvas');
		this.slideCanvas.width = this.width1;
		this.slideCanvas.height = this.height1;
//		this.slideCanvas.style.borderStyle= 'double';
		this.slideBlock.appendChild (this.slideCanvas);
		this.slideContext = this.slideCanvas.getContext ('2d');
		let slideImg = new Image ();
		slideImg.onload = (function () {this.slideContext.drawImage (slideImg, 0, 0, this.width1, this.height1)}).bind(this);
		slideImg.src = slideSRC;
//--tools
		this.thinPen = document.createElement ('button');
		this.thinPen.textContent = '❘';
		this.thinPen.setAttribute ('title','thin pen');
		this.toolsBlock.appendChild (this.thinPen);
		this.thinPen.onclick = (function() {this.penWidth = 3}).bind(this);
		
		this.mediumPen = document.createElement ('button');
		this.mediumPen.textContent = '❙';
		this.mediumPen.setAttribute ('title','medium pen');
		this.toolsBlock.appendChild (this.mediumPen);
		this.mediumPen.onclick = (function() {this.penWidth = 5}).bind(this);
		
		this.thickPen = document.createElement ('button');
		this.thickPen.textContent = '❚';
		this.thickPen.setAttribute ('title','thick pen');
		this.toolsBlock.appendChild (this.thickPen);
		this.thickPen.onclick = (function() {this.penWidth = 7}).bind(this);
		
		this.redPen = document.createElement ('button');
		this.redPen.textContent = '🟥';
		this.redPen.setAttribute ('title','red color');
		this.toolsBlock.appendChild (this.redPen);
		this.redPen.onclick = (function() {this.penColor = 'red'}).bind(this);
		
		this.greenPen = document.createElement ('button');
		this.greenPen.textContent = '🟩';
		this.greenPen.setAttribute ('title','green color');
		this.toolsBlock.appendChild (this.greenPen);
		this.greenPen.onclick = (function() {this.penColor = 'green'}).bind(this);

		this.bluePen = document.createElement ('button');
		this.bluePen.textContent = '🟦';
		this.bluePen.setAttribute ('title','blue color');
		this.toolsBlock.appendChild (this.bluePen);
		this.bluePen.onclick = (function() {this.penColor = 'blue'}).bind(this);		
//--
		this.onMouseDown = this.onMouseDown.bind(this);
		this.onMouseUp = this.onMouseUp.bind(this);
		this.onMouseMove = this.onMouseMove.bind(this);
		this.prepareCMD = this.prepareCMD.bind(this);
		this.execCMD = this.execCMD.bind(this);
	}
	
	start () { // начать запись манипуляций со Слайдом 
		let date = new Date();
		this.t0 = date.getTime();
		this.penColor = 'red';
		this.penWidth = '3';
		this.slideCanvas.addEventListener('mousedown', this.onMouseDown); // включаем реагирование на рисование заметок
	}	
	
	onMouseDown (event){
	//	let t1 = (new Date()).getTime;
		let XY = [event.offsetX, event.offsetY]; // записываем в объект начальное время и координаты старта
		this.prepareCMD ('beginPath');
		this.prepareCMD ('setPenColor', this.penColor); 
		this.prepareCMD ('setPenWidth', this.penWidth);
		this.prepareCMD ('moveTo', this.norm(XY));
		this.slideCanvas.addEventListener ('mousemove', this.onMouseMove);
		this.slideCanvas.addEventListener ('mouseup', this.onMouseUp);	
	}

	onMouseUp (event) {
		this.prepareCMD ('closePath');
		this.slideCanvas.removeEventListener ('mousemove', this.onMouseMove);		
	}
	
	onMouseMove (event) {
		let XY = [event.offsetX, event.offsetY];
		this.prepareCMD ('lineTo', this.norm(XY));
	}
	
	norm (XY){
		let xy = new Array ();
		xy[0] = Math.ceil (10000*XY[0]/this.width1);
		xy[1] = Math.ceil (10000*XY[1]/this.height1);
		return xy;
	}

	denorm (xy) {
		let XY = new Array ();
		XY[0] = Math.ceil (xy[0]*this.width1/10000);
		XY[1] = Math.ceil (xy[1]*this.height1/10000);
		return XY;
	}	
	
	prepareCMD (action, options) {
		let act = action;
		let command = [];
		let date = new Date();
		let t1 = date.getTime();
		command[0] = t1 - this.t0;
		command[1] = action;
		command[2] = options;
		this.cmdArr.push (command);
		this.execCMD (command);
	}
		
	execCMD (command) {
		let action = command [1];
		let options = command[2];
		let XY = new Array ();
		switch (action) {
			case 'beginPath' :
				this.slideContext.beginPath ();
				break;
			case 'moveTo' :
				XY = this.denorm (options);
				this.slideContext.moveTo (XY[0], XY[1]);
				break;	
			case 'lineTo' :
				XY = this.denorm (options);
				this.slideContext.lineTo (XY[0], XY[1]);
				this.slideContext.stroke ();
				break;
			case 'closePath' :
				this.slideContext.closePath ();
				break;
			case 'setPenColor' :
				this.slideContext.strokeStyle = options;
				break;
			case 'setPenWidth' :
				this.slideContext.lineWidth = options;
				break;				
		}				
	}	
	
	finish () { // завершить запись манипуляций со Слайдом
		this.prepareCMD ('closePath');
		this.slideCanvas.removeEventListener ('mousemove', this.onMouseMove);		
		this.slideCanvas.removeEventListener('mousedown', this.onMouseDown); 
	}
	
	getControls () { // получить команды манипуляций со Слайдом
		return this.cmdArr;
	}
}
//________________________________________________________
class SlidePlay2D {
	constructor (slideElement, slideSRC, Controls) {
		this.slideBlock = slideElement;
		this.slideBlock.innerHTML = ''; 
		this.width1 = this.slideBlock.clientWidth;
		this.height1 = this.slideBlock.clientHeight;
		this.cmdArr = Controls;
		// создаем элемент 2D 
		this.slideCanvas = document.createElement('canvas');
		this.slideCanvas.width = this.width1;
		this.slideCanvas.height = this.height1;
		this.slideBlock.appendChild (this.slideCanvas);
		this.slideContext = this.slideCanvas.getContext ('2d');
		let slideImg = new Image ();
		slideImg.onload = (function () {this.slideContext.drawImage (slideImg, 0, 0, this.width1, this.height1)}).bind(this);
		slideImg.src = slideSRC;
		
		this.execCMD = this.execCMD.bind(this);
		this.iCMD = 0;
		this.lastCMD = this.cmdArr.length-1;
		
		this.stop = this.stop.bind(this);
		this.restart = this.restart.bind(this);
		this.nextCMD = this.nextCMD.bind(this);
		
	}
		
  start(){
			console.log (this.cmdArr.length);			
		if (this.iCMD < this.lastCMD) {
			let cmd0 = this.cmdArr[this.iCMD];
			this.interval = cmd0[0];
			this.startTime = (new Date ()).getTime();
			this.setTimeID = setTimeout (this.nextCMD, this.interval);
		}			
	}	
	
	nextCMD () {
		console.log (this.iCMD);
		let cmd0 = this.cmdArr[this.iCMD];
		this.execCMD (cmd0);
		this.iCMD ++;
		if (this.iCMD < this.lastCMD) {
			let t0 = cmd0[0];
			let cmd1 = this.cmdArr[this.iCMD];
			let t1 = cmd1[0];
			this.interval = t1-t0;
			this.startTime = (new Date ()).getTime();
			this.setTimeID = setTimeout (this.nextCMD, this.interval);
		}
	}	
	
	stop (){		
		clearTimeout (this.setTimeID);
		this.stopTime = (new Date ()).getTime();
	}
		
	restart () {
		let stopInterval = this.interval;
		this.interval = stopInterval - (this.stopTime - this.startTime);		
		this.startTime = (new Date ()).getTime();
		this.setTimeID = setTimeout(this.nextCMD, this.interval);
	}
		
	execCMD (command) {
		let action = command [1];
		console.log (action);
		let options = command[2];
		let XY = new Array ();
		switch (action) {
			case 'beginPath' :
				this.slideContext.beginPath ();
				break;
			case 'moveTo' :
				XY = this.denorm (options);
				this.slideContext.moveTo (XY[0], XY[1]);
				break;	
			case 'lineTo' :
				XY = this.denorm (options);
				this.slideContext.lineTo (XY[0], XY[1]);
				this.slideContext.stroke ();
				break;
			case 'closePath' :
				this.slideContext.closePath ();
				break;
			case 'setPenColor' :
				this.slideContext.strokeStyle = options;
				break;
			case 'setPenWidth' :
				this.slideContext.lineWidth = options;
				break;				
		}				
	}	
		
	norm (XY){
		let xy = new Array ();
		xy[0] = Math.ceil (10000*XY[0]/this.width1);
		xy[1] = Math.ceil (10000*XY[1]/this.height1);
		return xy;
	}

	denorm (xy) {
		let XY = new Array ();
		XY[0] = Math.ceil (xy[0]*this.width1/10000);
		XY[1] = Math.ceil (xy[1]*this.height1/10000);
		return XY;
	}
}	

