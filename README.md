# Chatson


Chatson is a simple Chat Description Language with json and javascript. 
This is in early draft stage. Expecting contribution to this to make this a proper specification.

Defenitions are written in simple text file and can readily be used to integrate with websites.
  - Define Your Own Chat workflow
  - Integrate with backend systems from chat client.

### Chatson Sample

```sh
{
  "chats": [
    {
      "id": "nq",
      "name": "Welcome",
      "type": "start",
      "steps": [
        {
          "index": 0,
          "question": [
            {
              "language": "en",
              "text": "Welcome to sample chatson"
            }
          ],
          "components": [
            {
              "type": "slideShare",
              "parameters": {
                "url": "https://www.slideshare.net/slideshow/embed_code/key/Fr6pVEwNbfy8Lc",
                "width": "310",
                "height": "320"
              }
            },
            {
              "type": "youTube",
              "parameters": {
                "url": "https://www.youtube.com/embed/tgbNymZ7vqY?autoplay=1",
                "width": "310",
                "height": "320"
              }
            },
            {
              "type": "pdf",
              "parameters": {
                "url": "http://www.tutorialspoint.com/javascript/javascript_tutorial.pdf",
                "width": "310",
                "height": "320"
              }
            },
            {
              "type": "map",
              "parameters": {
                "address": "center point thrissur kerala",
                "width": "310",
                "height": "320"
              }
            }
          ],
          "buttons": [
            {
              "language": "en",
              "text": "New Quote",
              "onclick": "chat:nq",
              "type": "system"
            },
            {
              "language": "en",
              "text": "Contact Us",
              "onclick": "chat:cus",
              "type": "system"
            }
          ],
          "next": {
            "onBeforeUpdate": function(){
              
            },
            "end": true
          }
        }
      ]
    },
    {
      "id": "nq",
      "name": "New Quotation",
      "steps": [
        {
          "index": 0,
          "question": [
            {
              "language": "en",
              "text": "Enter item name"
            }
          ],
          "next": {
            "onBeforeUpdate": function(){
              
            },
            "index": 1
          }
        },
        {
          "index": 1,
          "question": [
            {
              "language": "en",
              "text": "Enter required brand name"
            }
          ],
          "next": {
            "onBeforeUpdate": function(){
              
            },
            "index": 2
          }
        },
        {
          "index": 2,
          "question": [
            {
              "language": "en",
              "text": "Enter required quantity"
            }
          ],
          "next": {
            "onBeforeUpdate": function(){
              
            },
            "index": 3
          }
        },
        {
          "index": 3,
          "question": [
            {
              "language": "en",
              "text": "Enter the shipping address"
            }
          ],
          "buttons": [
            {
              "language": "en",
              "text": "Select Location",
              "onclick": "fetchLocation()",
              "type": "system"
            }
          ],
          "next": {
            "end": true,
            "endMessage": function(response){
              return "Quotation Sent Successfully..."
            },
            "onBeforeUpdate": function(conversation){
              return conversation;
            },
            "dataAPI": {
              "url": "http://sample_server.com/requirements",
              "method": "POST"
            }
          }
        }
      ]
    },
    {
      "id": "cus",
      "name": "Contact Us",
      "steps": [
        {
          "index": 0,
          "question": [
            {
              "language": "en",
              "text": "Enter your email Id"
            }
          ],
          "next": {
            "onBeforeUpdate": function(){
              
            },
            "index": 1
          }
        },
        {
          "index": 1,
          "question": [
            {
              "language": "en",
              "text": "Enter contact phone"
            }
          ],
          "next": {
            "onBeforeUpdate": function(){
              
            },
            "index": 2
          }
        },
        {
          "index": 2,
          "question": [
            {
              "language": "en",
              "text": "Description"
            }
          ],
          "next": {
            "end": true,
            "endMessage": function(response){
              return "Posted to your query to our technical department.\nWe will assist you shortly."
            },
            "onBeforeUpdate": function(conversation){
              return conversation;
            },
            "dataAPI": {
              "url": "http://contact_server.com",
              "method": "POST"
            }
          }
        }
      ]
    }
  ]
}
```





