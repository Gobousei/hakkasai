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
    const form = document.forms.dialog;
    var number;
    var code;
    var select;
    var soldlist=[];
    var consorder;
    var saltorder;
    let video  = document.createElement("video");
    let canvas = document.getElementById("canvas");
    let ctx    = canvas.getContext("2d");
    var facingMode= "user";
    window.onload = roadqr();
    


    /**-----------------------------------
     * -------FireBaseのインストール--------*/
    firebase.initializeApp(firebaseConfig);
    var db=firebase.database();
    db.ref('soldlist').on('value',function(obj){
        if(!obj.val()){
            soldlist=[];
        }else{
            soldlist=obj.val();
        }
    })
    db.ref('order/consorder').on('value',function(obj){
        if(!obj.val()){
            consorder=0;
        }else{
            consorder=Number(obj.val());
        }
    })
    
    db.ref('order/saltorder').on('value',function(obj){
        if(!obj.val()){
            saltorder=0;
        }else{
            saltorder=Number(obj.val());
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
            if (soldlist.includes(code)) {
                return 'sude';
            } else {
                return "true";
            }
        }else{
            return 'code';
        }

	}

    function mainselector(){
        var che = check();
        if(che=="true"){
        db.ref('current/customer').once('value',function(obj){
            if(!obj.val()){
                db.ref('current/customer').update({"damy":"a"});
                mainselector();
            }else{
            var object = obj.val();
            if (object.hasOwnProperty(code)) {
              document.getElementById('number').innerText='注文済みです';
              select = object[code];
              document.getElementById('main').innerText=select;
              document.getElementById('truediv').style.display="block";
              setTimeout( 
                async () => {
                    document.getElementById('truediv').style.display="none";
                    reset();
              }, 2000);
            } else {
              document.getElementById('number').innerText='ご注文をお伺いします';
              document.getElementById('falsediv').style.display="block";
            };
            };
        })
    }else{
        error(che);
    }
    }

  function error(a){
    var p = document.getElementById("error");
    if(a=='code'){
        p.innerText='もう一度読込んでください';
    }else if(a=='sude'){
        p.innerText='受け渡し済みです';
    }
    document.getElementById("nocode").style.display="block";
    form.yes.addEventListener("click", () => {
        document.getElementById("nocode").style.display="none";
        roadqr();
    });
    code='';
  }

  var type;
  function confirmf(sel){
    type=sel;
    document.getElementById('confirm').style.display='block';
    document.getElementById("toorder").innerText=`${sel}を注文します`
  }

  function cancel(){
    document.getElementById('confirm').style.display='none';
  }

  function neworder(){
    document.getElementById('confirm').style.display='none';
    var set ={};
    set[code]= type;
    db.ref('current/customer').set(set);
    if(type=='しお'){
        saltorder = saltorder+ 1;
        db.ref('order').update({saltorder});
    }else if(type=='コンソメ'){
        consorder = consorder+1;
        db.ref('order').update({consorder});
    }
    
    document.getElementById('falsediv').style.display="none";
    document.getElementById('number').innerText='注文を受け付けました';
    setTimeout( 
        async () => {
            reset();
      }, 2000);
  }

  function help(){
    db.ref().update({checker:"自動受付"});
    document.getElementById("error").innerText='お待ちください';
    document.getElementById('dialogok').value="解除";
    document.getElementById("nocode").style.display="block";
    form.yes.addEventListener("click", () => {
    db.ref('checker').remove();
        document.getElementById("nocode").style.display="none";
        document.getElementById('dialogok').value="OK";
        roadqr();
    });
  }

  function reset(){
    document.getElementById('number').innerText='QRコードを読み込んでください';
    document.getElementById('falsediv').style.display="none";
    roadqr();
  }

  function roadqr(){
    document.getElementById('number').innerText='QRコードを読込んでください';
    document.getElementById('falsediv').style.display="none";
    document.getElementById("nocode").style.display="none";
    canvas.style.display = 'block';
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
                        canvas.style.display = 'none';
                        drawRect(qcode.location);// Rect
                        code = qcode.data;// Data
                        clearInterval(timerId);
                        mainselector();
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