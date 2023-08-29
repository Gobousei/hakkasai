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
    var customer={};
    var soldlist=[];
    var soldoutcons;
    var soldoutsalt;
    var consorder;
    var saltorder;
    var order;
    var selector;
    let video  = document.createElement("video");
    let canvas = document.getElementById("canvas");
    let ctx    = canvas.getContext("2d");
    var facingMode= "user";
    var numberp = document.getElementById('number');
    var orderp = document.getElementById('main');
    var truediv = document.getElementById('truediv');
    var falsediv = document.getElementById('falsediv');

    /**-----------------------------------
     * -------FireBaseのインストール--------*/
    firebase.initializeApp(firebaseConfig);
    var db=firebase.database();

    var hostnumber = window.prompt('コードを入力してください','');
    if(hostnumber){
        db.ref('refister/'+hostnumber+'/order').on('value',function (obj){
            order = obj.val();
            reset();
            mainselector();
        });
        db.ref('register/'+hostnumber+'/err').on('value',function(obj){
            if(!obj.val()){
                document.getElementById('nocode').style.display = 'none';
                mainselector();
            }else{
                error(obj.val());
            }
        })
        db.ref('register/'+hostnumber+'/tocus').on('value',function(obj){
            if(!obj){                
        }else{
            order=false;
            db.ref('register/'+hostnumber+'/tocus').remove();
            mainselector();
        }
        })
    }
    


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

    db.ref('current/customer').on('value',function(obj){
        if(!obj.val()){
            customer = {};
        }else{
            customer=obj.val();
        }
    })

    db.ref('soldout').on('value', function(obj){
        if(!obj.val()){
            document.getElementById('falsecons').style.display="block";
            document.getElementById('falsesalt').style.display="block";
        }else{
            var object = obj.val();
            conssold = object.cons;
            saltsold = object.salt;
            soldout = obj.val();
            if(!conssold){
                document.getElementById('falsecons').style.display="block";
            }
            if(conssold =="sold"){
                document.getElementById('falsecons').style.display="none";
            }
            if(!saltsold){
                document.getElementById('falsesalt').style.display="block";
            }
            if(saltsold=="sold"){
                document.getElementById('falsesalt').style.display="none";
            }
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
        truediv.style.display = 'none';
        truediv.style.display = 'none';
        if(!order){
            roadqr();
        }else{
            db.ref('current/customer/'+order).once('value',function(sle){
                selector = sle.val();
                if(!selector){
                    falsediv.style.display = 'block';
                    numberp.innerText = '注文をお伺いします';
                }else{
                    truediv.style.display = 'block';
                    numberp.innerText = '少々お待ち下さい';
                    if(selector =="salt"){
                        orderp.innerText = 'しお';
                    }else if(selector=="cons"){
                        orderp.innerText='コンソメ';
                    }
                }
            })
        }
    }

    function reset(){
        document.getElementById('number').innerText='QRコードを読み込んでください';
        document.getElementById('falsediv').style.display="none";
        mainselector();
      }

      function roadqr(){
        document.getElementById('nocode').style.display='none';
        document.getElementById('number').innerText='QRコードを読込んでください';
        document.getElementById('falsediv').style.display="none";
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
                            var che = check();
                            if(che=='true'){
                                order = number;
                                mainselector();
                                db.ref('register/'+hostnumber).update({order});
                            }else{
                                var err = che;
                                db.ref('register/'+hostnumber).update({err});
                            }
                            clearInterval(timerId);
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

            var type;
            function confirmf(sel){
              type=sel;
              document.getElementById('confirm').style.display='block';
              document.getElementById("toorder").innerText=`${sel}を注文します`
            }

  function cancel(){
    console.log('cancel');
    document.getElementById('confirm').style.display='none';
  }


  function neworder(){
    document.getElementById('confirm').style.display='none';
    customer[number]= type;
    db.ref('current/customer').set(customer);
    if(type=='しお'){
        saltorder = saltorder+ 1;
        db.ref('order').update({saltorder});
    }else if(type=='コンソメ'){
        consorder = consorder+1;
        db.ref('order').update({consorder});
    }
    db.ref('register/'+hostnumber).update({"check":'a'});
    document.getElementById('falsediv').style.display="none";
    document.getElementById('number').innerText='注文を受け付けました';
  }

  function error(a){
    var p = document.getElementById("error");
    if(a=='code'){
        p.innerText='不正なコードです';
    }else if(a=='sude'){
        p.innerText='受け渡し済み';
    }
    document.getElementById("nocode").style.display="block";
    }