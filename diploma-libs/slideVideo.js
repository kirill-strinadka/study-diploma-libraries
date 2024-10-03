// ________________class SlideRecordVideo_____________________
class SlideRecordVideo {
	constructor (videoElement, toolsElement, SRC1) {
		this.slideBlock = videoElement;
		this.toolsBlock = toolsElement;
		this.cmdArr = [];
		// создаем элемент видео 
		this.rVideo = document.createElement ('video');
		this.rVideo.src = SRC1;
		this.rVideo.style.width = '100%';
		this.rVideo.style.height = '100%';
		this.slideBlock.appendChild (this.rVideo);
		// создаем кнопку play-pause 
		this.playPauseBTN = document.createElement ('button');
		this.playPauseBTN.title = 'play';
		this.playPauseBTN.appendChild (document.createTextNode ('▶️'));
		this.togglePlayPause = this.togglePlayPause.bind(this);		
		this.playPauseBTN.onclick = this.togglePlayPause;
		this.toolsBlock.appendChild (this.playPauseBTN);
		// создаем кнопку begin 
		this.onsetBTN = document.createElement ('button');
		this.onsetBTN.title = 'begin';
		this.onsetBTN.appendChild (document.createTextNode ('⏪'));
		this.clickOnset = this.clickOnset.bind(this);		
		this.onsetBTN.onclick = this.clickOnset;
		this.toolsBlock.appendChild (this.onsetBTN);
	//	console.log (this.playPauseBTN.textContent);
	}
	
	start () { // начать запись манипуляций со Слайдом
		let date = new Date();
		this.t0 = date.getTime();
		console.log ('!t0='+this.t0);
	}
	
	togglePlayPause (){ // переключатель Play - Pause
		let a=this.playPauseBTN;
	  if (this.playPauseBTN.textContent === '▶️') {
			this.playPauseBTN.textContent = '⏸️';
			this.prepareCMD ('play');
		} else {
			this.playPauseBTN.textContent = '▶️';
			this.prepareCMD ('pause');
		}		
	}	
	
	clickOnset (){ // перемотка в начало 
			this.prepareCMD ('onset');
		}			
	
	prepareCMD (command) {
		let cmd = command;
		let arr = [];
		let date = new Date();
		console.log ('t0='+this.t0);
		console.log ('date=' + date);
		let t1 = date.getTime();
		console.log ('t1=' + t1);
		arr[0] = t1 - this.t0;
		arr[1] = cmd;
		this.cmdArr.push (arr);
		this.execCMD (cmd);
	}
		
	execCMD (cmd) {
		switch (cmd) {
			case 'play' :
				this.rVideo.play();
				break;
			case 'pause' :
				this.rVideo.pause();
				break;
			case 'onset' :
				this.rVideo.currentTime = 0;
		}				
	}	
	
	finish () { // завершить запись манипуляций со Слайдом
		this.rVideo.pause();
	}
	
	getControls () { // получить команды манипуляций со Слайдом
		return this.cmdArr;
	}
}
//________________________________________________________
class SlidePlayVideo {
	constructor (videoElement, SRC, Controls) {
		this.slideBlock = videoElement;
		this.cmdArr = Controls;
		// создаем элемент видео 
		this.rVideo = document.createElement ('video');
		this.rVideo.src = SRC;
		this.rVideo.style.width = '100%';
		this.rVideo.style.height = '100%';
		this.slideBlock.appendChild (this.rVideo);
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
		if (this.rVideo.paused == false) {
			this.rVideo.pause();
			this.pauseFLG = false;
		}	else {
			this.pauseFLG = true;
		}	
	}
		
	restart () {
		let stopInterval = this.interval;
		this.interval = stopInterval - (this.stopTime - this.startTime);		
		this.startTime = (new Date ()).getTime();
		this.setTimeID = setTimeout(this.nextCMD, this.interval);
		if (this.pauseFLG == false) {this.rVideo.play();}
		console.log(this.pauseFLG+'**'+this.rVideo.paused);
	}
	
	execCMD (cmd) {
//		console.log (cmd[1]);
		switch (cmd[1]) {
			case 'play' :
				this.rVideo.play();
				console.log ('!play');
				break;
			case 'pause' :
				console.log('!pause');
				this.rVideo.pause();
		}				
	}
}
