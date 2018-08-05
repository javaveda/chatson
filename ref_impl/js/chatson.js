function Chatson(chatInfo){
  this.chats=chatInfo.chats;
  this.conversation=null;
  this.stepIndex=0;
  this.templator =Template7;
}

Chatson.prototype.setTemplator=function(templator){
  this.templator = templator;
}
Chatson.prototype.templator=function(){
  return (!this.templator) ? Template7 : this.templator ;
}

Chatson.prototype.moveNext=function(answer,callBack){
  var stepInfo = this.conversation.steps[this.stepIndex];
  stepInfo.answer = answer;
  var refConversation =this.conversation;
  if(stepInfo.next.end){
    endConversation(refConversation,stepInfo,function(endMessage,runNLP){
        if(endMessage && endMessage!=""){
          ask({text:endMessage},runNLP,function(){
              if(stepInfo.next.onEnd){
                stepInfo.next.onEnd(refConversation);
              }
           });
        }else{
          if(stepInfo.next.onEnd){
             stepInfo.next.onEnd(refConversation);
          }
        }
        this.ended=true;
        return false;
    });
  }else{
    this.stepIndex = stepInfo.next.index;
    callBack();
  }
}
Chatson.prototype.isConversationEnded=function(){
  return (this.ended)?true:false;
}
Chatson.prototype.begin=function(){
  var sChat =null;
  for(var k in this.chats){
      var chat = (this.chats)[k];
      if(chat.type=="start"){
          sChat=chat;
      }
  }
  if(sChat){
    this.stepIndex=0;
    this.conversation=sChat;
    this.askQuestion();
  }
}


Chatson.prototype.step=function(){
  return this.conversation.steps[this.stepIndex];
}
Chatson.prototype.stepQuestion=function(languageCode){
  var question={text:((this.conversation.steps[this.stepIndex]).question)[0].text};
  var stepInfo = (this.conversation.steps[this.stepIndex]);
  var html = "";
  if(stepInfo.buttons){
    question.buttons = getButtonsHtml(stepInfo);
  }
  if(stepInfo.components){
    question.components = getComponentsHtml(stepInfo,this.templator());
  }
  return question;
}
Chatson.prototype.askQuestion=function(languageCode){
  ask(this.stepQuestion());
}

Chatson.prototype.renderButtons=function(button){
  ask(this.stepQuestion());
}

function getButtonsHtml(stepInfo){
  var dataString = "";
  for(var k in stepInfo.buttons){
    dataString += getButton((stepInfo.buttons)[k]);
  }
  return '<p class="row">'+
        dataString+
        '</p>';
}

function getButton(button){
  var clickFunction = button.onclick;
  if(clickFunction.indexOf("chat:")!=-1){
    var conId = clickFunction.split(":")[1];
    clickFunction = "gotoChat('"+conId+"','"+button.text+"')"
  }
  return '<a href="#" style="margin-right:5px;font-size: 14px;text-transform: none;" class="button button-round button-outline" onclick="'+clickFunction+'">'+button.text+'</a>';
}


function getComponentsHtml(stepInfo,templator){
  var dataString = "";
  var sep = '<p class="row">';
  for(var k in stepInfo.components){
    dataString += (sep+getComponents((stepInfo.components)[k],templator) + '</p>');
    //sep="<br>";
  }
  return dataString;
//  '<p class="row">'+
//        dataString+
//        '</p>';
}

function getComponents(component,templator){
  var comp = new Component(component);
  return comp.html(templator);
  //return '<a href="#" style="margin-right:5px;font-size: 14px;text-transform: none;" class="button button-round button-outline" onclick="'+clickFunction+'">'+button.text+'</a>';
}

function goto(conId,text){
 return gotoChat(conId,text);
}
function gotoChat(conId,text){
  if(text){
    addMessageToChat(text);
  }
  var sChat =null;
  for(var k in cson.chats){
      var chat = (cson.chats)[k];
      if(chat.id==conId){
          sChat=chat;
      }
  }
  if(sChat){
    cson.stepIndex=0;
    cson.conversation=sChat;
    cson.askQuestion();
    return true;
  }else{
    return false;
  }

}

function endConversation(conversation,stepInfo,callBack){
    if(stepInfo.next.dataAPI){
      var transform =conversation;
      //Call transform if function if present.
      if(stepInfo.next.onBeforeUpdate){
        var funct = stepInfo.next.onBeforeUpdate;
        transform = funct(conversation);
      }
      send(stepInfo.next.dataAPI.url,stepInfo.next.dataAPI.method,transform,function(data){
        stepInfo.next.dataAPI.response=data;
        callBack(stepInfo.next.endMessage(data));
      },function(){
        callBack("Failed to process the request. Please try after some time later");
      });
    }else if(stepInfo.next.endMessage){
      callBack(stepInfo.next.endMessage());

    }else{
      callBack(stepInfo,true);

    }
}

function send(url,method,inJson,successCallBack,failCallBack) {
    // { username:'foo', password: 'bar' }
		app.request.postJSON(url,inJson, function (data) {
      successCallBack(data);
    },function (xhr, status) {
      failCallBack(xhr.responseText);
    });
}

/**Chatson Component renderer */
function Component(component){
  this.component = component;
}
Component.prototype.html=function(templator){
    var componentTemplate = this.template();
    console.log("componentTemplate :"+componentTemplate);
    var compiledTemplate = Template7.compile(componentTemplate);
    var temp= compiledTemplate(this.component.parameters);
    console.log(temp);
    return temp;
}
Component.prototype.template=function(){
  if(this.component.type=="slideShare"){
    return '<iframe src="{{url}}" width="{{width}}" height="{{height}}" frameborder="0" marginwidth="0" marginheight="0" scrolling="no" allowfullscreen="" webkitallowfullscreen="" mozallowfullscreen=""></iframe>';
  }

  if(this.component.type=="youTube"){
      return '<iframe src="{{url}}" width="{{width}}" height="{{height}}" frameborder="0" marginwidth="0" marginheight="0" scrolling="no" allowfullscreen="" webkitallowfullscreen="" mozallowfullscreen=""></iframe>';
  }

  if(this.component.type=="pdf"){
        return '<iframe src="http://mozilla.github.io/pdf.js/web/viewer.html?file={{url}}" width="{{width}}" height="{{height}}" frameborder="0" marginwidth="0" marginheight="0" scrolling="no" allowfullscreen="" webkitallowfullscreen="" mozallowfullscreen=""></iframe>';
  }

  if(this.component.type=="map"){
       return '<div class="mapouter"><div class="gmap_canvas"><iframe width="{{width}}" height="{{height}}" id="gmap_canvas" src="https://maps.google.com/maps?q={{address}}&t=&z=19&ie=UTF8&iwloc=&output=embed" frameborder="0" scrolling="no" marginheight="0" marginwidth="0"></iframe></div><style>.mapouter{overflow:hidden;height:{{heigth}}px;width:{{width}}px;}.gmap_canvas {background:none!important;height:{{heigth}}px;width:{{width}}px;}</style></div>';
  }

  if(this.component.type=="grid"){
      return '<div style="width:{{width}}px;height:{{height}}px" class="row grow card-1">'+
                  '<div class="col">Physics</div>'+
                  '<div class="col">Chemistry</div>'+
                  '<div class="col">Maths</div>'+
                  '<div class="col">Biology</div>'+
                  '<div class="col">GK</div>'+
                '</div>';
  }

  if(this.component.type=="question"){
        return '<div class="grow card-1">'+
                 '<div class="question">Video Screencast: How to get started with Framework7, VueJS and Webpack</div>'+
                 '<div class="answer"><span>1 ) </span>ABCDAA</div>'+
                 '<div class="answer"><span>2 ) </span>ABCDDD</div>'+
                 '<div class="answer"><span>3 ) </span>ABCDDD</div>'+
                 '<div class="answer"><span>4 ) </span>ABCD</div>'+
              '</div>';
  }
//
}
window.context=new Object();


