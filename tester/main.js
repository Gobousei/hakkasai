/**---------------------------------------
 * --------APIトークンなどの記述------------ */
const firebaseConfig = {
	apiKey: "AIzaSyBNhorPJIFWRMi6Pq4NIc8Asi-Iiabb4jI",
    authDomain: "biology-test-384608.firebaseapp.com",
    databaseURL: "https://biology-test-384608-default-rtdb.firebaseio.com",
    projectId: "biology-test-384608",
    storageBucket: "biology-test-384608.appspot.com",
    measurementId: "G-R6CEKT1NL2"
	
    
    };
    var code;
    var number;
    var checklist=[];
    let video  = document.createElement("video");
    let canvas = document.getElementById("canvas");
    let ctx    = canvas.getContext("2d");
    var facingMode= "user";
    


    /**-----------------------------------
     * -------FireBaseのインストール--------*/
    firebase.initializeApp(firebaseConfig);
    var db=firebase.database();
    
    db.ref('checklist').on('value',function(obj){
        if(!obj.val()){
            checklist=[];
        }else{
            checklist=obj.val();
        }
    })

    function check(){
        var firstTwoChars = Number(code.slice(0, 2));
        var nextTwoChars = Number(code.slice(2, 4));
        var bef = 4+nextTwoChars;
        var conversionidentification = code.slice(4,bef);
        var conversionnumber = code.slice(bef);
        var identification=parseInt(conversionidentification, firstTwoChars);
        number = parseInt(conversionnumber, firstTwoChars);
        if(identification==20230906){
            if (checklist.includes(number)) {
                return 'sude';
            } else {
                return "true";
            }
        }else{
            return 'code';
        }

	}

	function road(){
        var che = check();
        if(che=="true"){
            document.getElementById('result').style.display='block';
            document.getElementById('number').innerText=number;
        }else if(che=="code"){
		    var p = document.getElementById("error");
            document.getElementById('result').style.display='none';
            p.innerText='不正なコード';
            document.getElementById("nocode").style.display="block";
        }else if(che=="sude"){
            var p = document.getElementById("error");
            document.getElementById('result').style.display='none';
            p.innerText='重複';
            document.getElementById("nocode").style.display="block";
        }
	}

    function none(){
        roadqr();
    }

    function register(){
        checklist.push(number);
        db.ref('checklist').set(checklist);
        roadqr();
    }

    function reset(){
        db.ref('checklist').remove();
        location.reload();
    }


function roadqr(){
    document.getElementById('result').style.display='none';
    document.getElementById("nocode").style.display="none";
    
        const userMedia = {video: {facingMode}};
        navigator.mediaDevices.getUserMedia(userMedia).then((stream)=>{
            video.srcObject = stream;
            video.setAttribute("playsinline", true);
            video.play();
            const timerId = setInterval(function(){
                if(video.readyState === video.HAVE_ENOUGH_DATA){
                    canvas.height = video.videoHeight;
                    canvas.width = video.videoWidth;
                    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
                    let img = ctx.getImageData(0, 0, canvas.width, canvas.height);
                    let qcode = jsQR(img.data, img.width, img.height, {inversionAttempts: "dontInvert"});
                    if(qcode){
                        drawRect(qcode.location);// Rect
                        code = qcode.data;// Data
                        clearInterval(timerId);
                        road();
                    }else{
                    }
                }
              }, 250)
        });
    }
    
    
        function drawRect(location){
            drawLine(location.topLeftCorner,     location.topRightCorner);
            drawLine(location.topRightCorner,    location.bottomRightCorner);
            drawLine(location.bottomRightCorner, location.bottomLeftCorner);
            drawLine(location.bottomLeftCorner,  location.topLeftCorner);
        }
    
        function drawLine(begin, end){
            ctx.lineWidth = 4;
            ctx.strokeStyle = "#FF3B58";
            ctx.beginPath();
            ctx.moveTo(begin.x, begin.y);
            ctx.lineTo(end.x, end.y);
            ctx.stroke();
        }

        function change(){
            if(facingMode="user"){
                facingMode="environment";
            }else if(facingMode="environment"){
                facingMode = "user"
            }
        }
