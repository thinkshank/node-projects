
arr=[[],[]];

console.log(arr);
var level0 = function(id){


var a = function(){

	console.log("--> " + id + "==" + curr++);
	arr[[id][curr]] = 1;

	if(curr > 5){
		clearInterval(b);
		console.log(arr);
	}
}



var curr = 0;

b = setInterval(a,1000);	

};

for (i=0; i<10;i++){
	level0(i);
}
