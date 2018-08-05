var app = new Framework7({
  root: '#app', // App root element
  id: 'io.framework7.testapp', // App bundle ID
  name: 'Chatson', // App name
  theme: 'auto',
  routes:[{
           path: '/product/:id/',
           componentUrl: './pages/product.html',
  }]
});
var $$ = Dom7;
var messages = app.messages.create({
        el: '.messages',
        firstMessageRule: function (message, previousMessage, nextMessage) {
          if (message.isTitle) return false;
          if (!previousMessage || previousMessage.type !== message.type || previousMessage.name !== message.name) return true;
          return false;
        },
        lastMessageRule: function (message, previousMessage, nextMessage) {
          if (message.isTitle) return false;
          if (!nextMessage || nextMessage.type !== message.type || nextMessage.name !== message.name) return true;
          return false;
        },
        tailMessageRule: function (message, previousMessage, nextMessage) {
          if (message.isTitle) return false;
          if (!nextMessage || nextMessage.type !== message.type || nextMessage.name !== message.name) return true;
          return false;
        }
      });

      var messagebar = app.messagebar.create({
        el: '.messagebar'
      });

      // Response flag
      var responseInProgress = false;

      // Send Message
      $$('.send-link').on('click', function () {
        var text = messagebar.getValue().replace(/\n/g, '<br>').trim();
        // return if empty message
        if (!text.length) return;

        // Clear area
        messagebar.clear();

        // Return focus to area
        messagebar.focus();

        // Add message to messages
        messages.addMessage({
          text: text,
        });

        if (responseInProgress) return;
        // Receive dummy message
        receiveMessage(text);
      });

      function addMessageToChat(text){

                  messagebar.clear();

                  // Return focus to area
                  messagebar.focus();

                  // Add message to messages
                  messages.addMessage({
                    text: text,
                  });
                  messages.pageContentEl.scrollTop=messages.pageContentEl.scrollHeight;

                  messages.showTyping({
                                              header: person.name + ' is typing',
                                              avatar: person.avatar
                                            });


      }

      // Dummy response
      var answers = [
        'I cant understand.Say that again',
        'Can you say that again.',
        'Sorry. I couldnt get you.'
      ]

      function receiveMessage(message) {
        responseInProgress = true;
        messages.showTyping({
                            header: person.name + ' is typing',
                            avatar: person.avatar
                          });
        if(!cson.isConversationEnded()){

            cson.moveNext(message,function(){
              cson.askQuestion();
            });
        }else{
            setTimeout(function () {
              // Get random answer and random person
              var answer = answers[Math.floor(Math.random() * answers.length)];
              var person = people[Math.floor(Math.random() * people.length)];

              // Show typing indicator
              messages.showTyping({
                header: person.name + ' is typing',
                avatar: person.avatar
              });

              setTimeout(function () {
                // Add received dummy message
                messages.addMessage({
                  text: answer,
                  type: 'received',
                  name: person.name,
                  avatar: person.avatar
                });
                // Hide typing indicator
                messages.hideTyping();
                responseInProgress = false;
              }, 4000);
            }, 1000);
        }
      }


      var name=getURLParameter("appName");
      var person = {
                  name: name,
                  avatar: 'http://chatson.s3-website-us-east-1.amazonaws.com/images/logo.jpg'
                };//people[Math.floor(Math.random() * people.length)];

      function ask(question,runNLP,completed) {
        responseInProgress = true;
        messages.showTyping({
                                    header: person.name + ' is typing',
                                    avatar: person.avatar
        });

        setTimeout(function () {
          // Get random answer and random person
          var answer = question.text;
          if(runNLP){
            answer = classifier.categorize(answer.answer);//answers[Math.floor(Math.random() * answers.length)];
            if(answer=="unknown"){
              answer=answers[Math.floor(Math.random() * answers.length)];
            }else{
              if(gotoChat(answer)){
                 return;
              }
            }
          }

          // Show typing indicator


          setTimeout(function () {
            // Add received dummy message
            messages.addMessage({
              text: answer,
              type: 'received',
              name: person.name,
              avatar: person.avatar
            });
            if(question.components){
                 var last = $$($$('.messages').children('.message')[$$('.messages').children('.message').length-2])
                 last.find(".message-content").append(question.components);
            }
            if(question.buttons){
              var last = $$($$('.messages').children('.message')[$$('.messages').children('.message').length-2])
              last.find(".message-content").append(question.buttons);
            }
            messages.hideTyping();
            responseInProgress = false;
            messages.pageContentEl.scrollTop=messages.pageContentEl.scrollHeight+200;
            if(completed){
              completed();
            }
          }, 1000);
        }, 500);
      }
//      <iframe src="http://mozilla.github.io/pdf.js/web/viewer.html?file=http://www.tutorialspoint.com/javascript/javascript_tutorial.pdf"></iframe>

      function startConversation(){

            cson = new Chatson(data);
            cson.askQuestion();
      }
      var cson =null;
      var classifier = bayes();

      function start(){
                  classifier.learn('Hi', 'welcome');
                  classifier.learn('Welcome', 'welcome');
                  classifier.learn('Greetings!!', 'welcome');
                  classifier.learn('Hello!!', 'welcome');
                  classifier.learn('Hello', 'welcome');
                  classifier.learn('who are you', 'welcome');
                  classifier.learn('why are you', 'welcome');

                  classifier.learn('How are you?', 'fine');
                  classifier.learn('How do you do?', 'fine');
                  classifier.learn('How was your day?', 'fine');

                  classifier.learn('Contact customer care', 'contact');
                  classifier.learn('Customer care contact', 'contact');
                  classifier.learn('Talk to customer care', 'contact');
                  classifier.learn('Speak to customer care', 'contact');
                  classifier.learn('Discuss with customer care', 'contact');
                  classifier.learn('Escalate to customer care', 'contact');

                  classifier.learn('Have a great day ahead', 'bye');
                  classifier.learn('Good day ahead', 'bye');
                  classifier.learn('Take care', 'bye');
                  classifier.learn('Talk to you soon', 'bye');
                  classifier.learn('Bye', 'bye');
                  classifier.learn('good bye', 'bye');

                  app.request.get(getURLParameter("chatson"), function (data) {
                    var dataS=null;
                    eval("dataS="+data);
                    cson = new Chatson(dataS);
                    cson.begin();
                  });

      }
      start();
      function fetchLocation(){
      // DOM events for About popup
            $$('.popup-about').on('popup:open', function (e, popup) {
              console.log('About popup open');
            });
            $$('.popup-about').on('popup:opened', function (e, popup) {
              console.log('About popup opened');
            });

            // Create dynamic Popup
            var dynamicPopup = app.popup.create({
              content: '<div class="popup">'+
                          '<div class="navbar">'+
                              '<div class="navbar-inner sliding">'+
                                '<div class="left">'+
                                  '<a href="#" class="link back popup-close">'+
                                    '<i class="icon icon-back"></i>'+
                                    '<span class="ios-only">Back</span>'+
                                  '</a>'+
                                '</div>'+
                                '<div class="title">Select Location</div>'+
                                '<div class="right">'+
                                     '<a href="#" class="link back popup-close">'+
                                        '<i class="icon f7-icons">check_round</i>'+
                                        '<span class="ios-only">Done</span>'+
                                     '</a>'+
                                '</div>'+
                              '</div>'+
                            '</div>'+
                          '<div class="block" style="width:100%;height:100%;margin:0px;padding:0px">'+
                            '<iframe style="width:100%;height:100%;border:none" src="http://ec2-35-169-132-136.compute-1.amazonaws.com:8081/www/fusion/geo/geoeditor.html?lat=19.1998211&lon=72.84259399999996"></iframe>'+
                            '<p><a href="#" class="link popup-close">Close me</a></p>'+
                          '</div>'+
                        '</div>',
              // Events
              on: {
                open: function (popup) {
                  console.log('Popup open');
                },
                opened: function (popup) {
                  console.log('Popup opened');
                },
              }
            });
            // Events also can be assigned on instance later
            dynamicPopup.on('close', function (popup) {
              console.log('Popup close');
            });
            dynamicPopup.on('closed', function (popup) {
              console.log('Popup closed');
            });

            // Open dynamic popup
//            $$('.dynamic-popup').on('click', function () {
//
//            });
            dynamicPopup.open();
      }

      function getURLParameter(sParam){
        var sPageURL = window.location.search.substring(1);
        var sURLVariables = sPageURL.split('&');
        for (var i = 0; i < sURLVariables.length; i++)
          {
              var sParameterName = sURLVariables[i].split('=');
              if (sParameterName[0] == sParam){
                  return sParameterName[1];
                }
          }
    }
