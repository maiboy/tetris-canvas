/*
		判断游戏结束：在方块碰到下边其他方块时，看一下第一个数组与没有哪个元素不是0，如果有，游戏结束。
	*/
		var canvas = document.getElementById('canvas');
		//创建2d环境
		var gc = canvas.getContext('2d');
		//随机方块图形数据集合
		var arr = [
				[[1,1,1,1]],
				[[1,1],[1,1]],
				[[1,1,0],[0,1,1]],
				[[0,1,1],[1,1,0]],
				[[0,1,0],[1,1,1]],
				[[1,0,0],[1,1,1]],
				[[0,0,1],[1,1,1]]
			];
		var arr1 = [];
		for (var i = 0; i < 12; i++) {
		 	arr1.push(0);
		 } 
		var data = map(12,12);
		var y = 0;
		var x = 4;
		//保存一个随机出来的方块
		var matrix = mold();
		var timer = null;
		var onOff = false;
		//初始化渲染地图
		render(data,gc);

		create(matrix);
		auto(400);
		play();

		function auto(time){
			timer = setInterval(function(){
				fall();
			},time);
		}

		//方块变形
		function rotate(){
			var x = matrix[0].length;
			var y = matrix.length;
			var arr = [];
			//把arr变成一个二维数组
			for (var i = 0; i < x; i++) {
				arr.push([]);
			}
			for (var i = 0; i < y; i++) {
				for (var j = 0; j < x; j++) {
					arr[j][y-1-i] = matrix[i][j];//[0,0->0,1][1,0->0,0][1,2->2,0]
				}
			}
			if (collideTestX(1,arr)||collideTestX(-1,arr)||collideTest(arr)) {
				return;
			}
			matrix = arr;
		}

		function play(){
			document.onkeydown = function(ev){
				switch(ev.keyCode){
					case 37://左键，向左移动
						clearPre(matrix);
						
						if (!collideTestX(-1,matrix)) {
							x--;
						}
						create(matrix);
					break;
					case 39://右键，向右移动
						clearPre(matrix);
						if (!collideTestX(1,matrix)) {
							x++;
						}
						create(matrix);
					break;
					case 38://上键，方块变形
						clearPre(matrix);
						rotate();
						create(matrix);
					break;
					case 40://下键，加速方块向下移动
						if (onOff) {
							return;
						}
						onOff = true;
						clearInterval(timer);
						auto(100);
					break;
				}
			}
			document.onkeyup = function(ev){
				if (ev.keyCode == 40) {
					onOff = false;
					clearInterval(timer);
					auto(400);
				}
			}
		}
		//左右移动时检测是否到达地图边缘或者撞上其他方块
		function collideTestX(n,matrix1){
			//n等于1时向右，等于-1时向左
			var maxX = data[0].length - matrix1[0].length;
			if (x+n<0 || x+n>maxX) {
				return true;
			}
			
			if (n<0) {
				for (var i = 0; i < matrix1.length; i++) {
					var index = 0;
					while(!matrix1[i][index]){
						index++;
					}
					if (!data[i+y]||data[i+y][x+index-1]) {
						return true;
					}
				}
			}else{
				for (var i = 0; i < matrix1.length; i++) {
					var index = matrix1[0].length;
					while(!matrix1[i][index]){
						index--;
					}
					if (!data[i+y]||data[i+y][x+index+1]) {
						return true;
					}
				}
			}
			return false;
		}


		function fall(){
			//判断当方块移动到底部时停止，生成一个新的方块从顶部下落
			if (collideTest(matrix)) {
				clearLine();
				y = 0;
				x = 4;
				matrix = mold();
			}
			
			clearPre(matrix);
			y++;
			create(matrix);
		}
		//清除一整行
		function clearLine(){
			var y = data.length;
			var x= data[0].length;
			var n;
			for (var i = 0; i < y; i++) {
				n = true;
				for (var j = 0; j < x; j++) {
					if (!data[i][j]) {
						n = false;
					}
				}
				if (n) {
					data.splice(i,1);
					data.unshift([].concat(arr1));
				}
			}
		}
		//检测是否到达地图底部或者撞上其他方块
		function collideTest(matrix1){
			var len = matrix1.length;
			var arr = matrix1[len-1];
			var n;
			if (y + len >= data.length) {
				return true;
			}
			for (var i = 0; i < arr.length; i++) {
				n = len - 1;
				while(!matrix1[n][i]){
					n --;
				}
				if (data[y+n+1][x+i]) {
					return true;
				}
			}
			return false;
		}

		//在移动中清除上一个方块图形
		function clearPre(arr){
			for (var i = 0; i < arr.length; i++) {
				for (var j = 0; j < arr[i].length; j++) {
					if (arr[i][j]) {
						data[i+y][j+x] = 0;
					}
				}
			}
		}

		//将随机生成的方块图形数据渲染到地图中
		function create(arr){
			for (var i = 0; i < arr.length; i++) {
				for (var j = 0; j < arr[i].length; j++) {
					if (!data[i+y][j+x]) {
						data[i+y][j+x] = arr[i][j];
					}
				}
			}
			render(data,gc);
		}

		//随机生成一个方块数据
		function mold(){
			var num = Math.floor(Math.random()*7);
			return arr[num];
		}

		//创建地图方块
		function render(data,gc) {
			var w = 500/12-10;
			var h = w;
			var rLen = data.length;
			var cLen = data[0].length;
			for(var i = 0; i < rLen; i++){
				for (var j = 0; j < cLen; j++) {
					//填充颜色
					gc.fillStyle = data[i][j] == 0? '#1ae680':'yellow';
					//绘制方块
					gc.fillRect(j*(w+10)+5,i*(h+10)+5,w,h);

				}
			}
		}

		//创建地图数据
		function map(r,c){
			var data = [];
			for (var i = 0; i < r; i++) {
				data.push([]);
				for (var j = 0; j < c; j++) {
					data[i].push(0);
				}
			}
			return data;
		}