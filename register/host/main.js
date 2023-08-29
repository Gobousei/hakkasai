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
    var customer={};
    var orderp = document.getElementById("main");
    var truediv = document.getElementById('truediv');
    var numberp = document.getElementById('number');
    var order;
    var selector;

    /**-----------------------------------
     * -------FireBaseのインストール--------*/
    firebase.initializeApp(firebaseConfig);
    var db=firebase.database();


    var hostnumber = window.prompt('コードを入力してください','');
    if(hostnumber){
        mainselector();
        db.ref('register/'+hostnumber+'/err').on('value',function(obj){
            if(!obj.val()){
                document.getElementById('nocode').style.display = 'none';
            }else{
                error(obj.val());
            }
        })
        db.ref('register/'+hostnumber+'/check').on('value',function(obj){
            if(!obj){                
            }else{
                db.ref('register/'+hostnumber+'/check').remove();
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
        }else{
            var object = obj.val();
            conssold = object.cons;
            saltsold = object.salt;
            soldout = obj.val();
            if(!conssold){
                document.getElementById('soldoutcons').checked=false;
            }
            if(conssold =="sold"){
                document.getElementById('soldoutcons').checked=true;
            }
            if(!saltsold){
                document.getElementById('soldoutsalt').checked=false;
            }
            if(saltsold=="sold"){
                document.getElementById('soldoutsalt').checked=true;
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
        db.ref('register/'+hostnumber+'/err').remove();
    });
    code='';
  }

  function sold(){
    db.ref('current/customer/'+order).remove();
    soldlist.push(order);
    db.ref('soldlist').set(soldlist);
    if(selector=='しお'){
        salt = salt+ 1;
        db.ref('sold').update({salt});
        saltorder = saltorder - 1;
        console.log(saltorder);
        db.ref('order').update({saltorder});
    }else if(selector=='コンソメ'){
        cons = cons+1;
        db.ref('sold').update({cons});
        consorder = consorder - 1;
        db.ref('order').update({consorder});
    }
    document.getElementById('number').innerText ='QRコードを読込んでください';
    document.getElementById('truediv').style.display="none";
    code="";
    db.ref('register/'+hostnumber).update({"tocus":"a"});
    db.ref('register/'+hostnumber+'/order').remove();
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

        function mainselector(){
            db.ref('register/'+hostnumber+'/order').on('value',function (obj){
            truediv.style.display='none';
            order= obj.val();
            console.log(order);
            if(!order){
                numberp.innerText= 'コード読み取り中';
            }else{
                db.ref('current/customer/'+order).once('value',function(sle){
                    selector = sle.val();
                    if(!selector){
                        numberp.innerText= '未注文';
                    }else{
                        numberp.innerText = order;
                        truediv.style.display='block';
                        console.log(selector);
                        orderp.innerText=selector;
                    }
                })
            }
        });
        }