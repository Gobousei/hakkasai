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
    var soldoutcons;
    var soldoutsalt;
    var soldout ={};
    var saltorder;
    let video  = document.createElement("video");
    let canvas = document.getElementById("canvas");
    let ctx    = canvas.getContext("2d");
    var facingMode= "user";
    window.onload = roadqr();
    var customer={};


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
    
    var salt;
    db.ref('sold/salt').on('value',function(obj){
        if(!obj.val()){
            salt=0;
        }else{
            salt=Number(obj.val());
        }
    })
    var cons;
    db.ref('sold/cons').on('value',function(obj){
        if(!obj.val()){
            cons=0;
        }else{
            cons=Number(obj.val());
        }
    })

    db.ref('checker').on('value',function(obj){
        if(!obj.val()){
            document.getElementById('checkout').style.display='none';
        }else{
            document.getElementById('checkout').style.display='block';
            document.getElementById('checkout').innerText=obj.val();
        }
    })

    
    db.ref('cooker').on('value',function(obj){
        if(!obj.val()){
            document.getElementById('cookout').style.display='none';
        }else{
            document.getElementById('cookout').style.display='block';
            document.getElementById('cookout').innerText=obj.val();
        }
    })
    db.ref('soldout').on('value', function(obj){
        if(!obj.val()){
            document.getElementById('soldoutsalt').checked=false;
            document.getElementById('soldoutcons').checked=false;
            document.getElementById('falsecons').style.display="block";
            document.getElementById('falsesalt').style.display="block";
        }else{
            var object = obj.val();
            conssold = object.cons;
            saltsold = object.salt;
            soldout = obj.val();
            if(!conssold){
                document.getElementById('soldoutcons').checked=false;
                document.getElementById('falsecons').style.display="block";
            }
            if(conssold =="sold"){
                document.getElementById('soldoutcons').checked=true;
                document.getElementById('falsecons').style.display="none";
            }
            if(!saltsold){
                document.getElementById('soldoutsalt').checked=false;
                document.getElementById('falsesalt').style.display="block";
            }
            if(saltsold=="sold"){
                document.getElementById('soldoutsalt').checked=true;
                document.getElementById('falsesalt').style.display="none";
            }
        }
    })

    db.ref('current/customer').on('value',function(obj){
        if(!obj.val()){
            customer = {};
        }else{
            customer=obj.val();
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
            if (soldlist.includes(number)) {
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
            if (object.hasOwnProperty(number)) {
              document.getElementById('number').innerText=number;
              select = object[number];
              document.getElementById('main').innerText=select;
              document.getElementById('truediv').style.display="block";
            } else {
              document.getElementById('number').innerText=number+'未注文';
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
        p.innerText='不正なコードです';
    }else if(a=='sude'){
        p.innerText='受け渡し済み';
    }
    document.getElementById("nocode").style.display="block";
    form.yes.addEventListener("click", () => {
        document.getElementById("nocode").style.display="none";
        roadqr()
    });
    code='';
  }

  function sold(){
    db.ref('current/customer/'+number).remove();
    soldlist.push(number);
    db.ref('soldlist').set(soldlist);
    if(select=='しお'){
        salt = salt+ 1;
        db.ref('sold').update({salt});
        saltorder = saltorder - 1;
        db.ref('order').update({saltorder});
    }else if(select=='コンソメ'){
        cons = cons+1;
        db.ref('sold').update({cons});
        consorder = consorder - 1;
        db.ref('order').update({consorder});
    }
    document.getElementById('number').innerText ='QRコードを読込んでください';
    document.getElementById('truediv').style.display="none";
    code="";
    roadqr()
  }
  
  function neworder(type){
    var set ={};
    set[number]= type;
    db.ref('current/customer').set(set);
    if(type=='しお'){
        saltorder = saltorder+ 1;
        db.ref('order').update({saltorder});
    }else if(type=='コンソメ'){
        consorder = consorder+1;
        db.ref('order').update({consorder});
    }
    document.getElementById('falsediv').style.display="none";
    mainselector();
  }


  function roadqr(){
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

        function soldall(type){
            var whitch = document.getElementById('soldout'+type).checked;
            if(whitch){
                var what;
                if(type=="salt"){
                    what = "しお"
                }else if(type=="cons"){
                    what = "コンソメ"
                }
                var result = window.confirm(what+'を売り切れにします');
                if(result){
                soldout[type] = "sold";
                db.ref().update({soldout});
                }else{
                    document.getElementById('soldout'+type).checked=false;
                    alert('キャンセルされました。')
                }
            }else{
                db.ref('soldout/'+type).remove();
            }
        }