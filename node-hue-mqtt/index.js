"use strict"

const mqtt = require('mqtt')
const hue = require("node-hue-api")

/**
 * Configure MQTT
 */
const client = mqtt.connect('mqtt://localhost')
const allowedTopics = ['lights', 'config']
const allowedSubTopics = ['toggle', 'color', 'adduser']

/**
 * Configure Hue API
 */
const HueApi = hue.HueApi
const lightState = hue.lightState
const host = '192.168.2.129'
const name = 'Node API'
var username = '<username>' // Must currently be set before starting the API. Future versions of the API should manage this through the /config channel 
const api = new HueApi(host, username)
var state = lightState.create()

client.on('connect', function () {
  console.log('Client connected! Subscribing to /lights ...')
  client.subscribe('lights')
  
  // Uncomment to publish a color-message to the lights/color topic
  // client.publish('lights/color', '{"deviceID": "1", "color": [255, 0, 255], "state": "on"}')  

  // Uncomment to publish a toggle-message to the lights/toggle topic
  // client.publish('lights/toggle', '{"on": true}')  
})

client.on('message', function (topic, message) {
  if (allowedTopics.indexOf(topic) === -1) {
      return console.log('Skipping unhandled topic "' + topic + '" ...')
  }
  
  console.log('New Message:')
  console.log('-> ' + message.toString())
  handleMessage(topic, message)
  
  // Uncomment to end the client-session after receiving the first valid message
  // client.end()
})

function handleMessage(topic, message) {
    var topicPaths = topic.split('/')
    
    switch(topicPaths[0]) {
        // lights/#
        case 'lights': {
            if (topicPaths.length < 2 || allowedSubTopics.indexOf(topicPaths[1]) === -1) {
                return console.log('Trying to handle /lights without valid sub-topic. ')
            }
            var subTopic = topicPaths[1]
            
            switch (subTopic) {
                // lights/toggle
                case 'toggle': {
                    console.log('Handling lights/toggle ...')
                    
                    try {
                        const parsedMessage = JSON.parse(message)
                        
                        if (parsedMessage.on == null || typeof parsedMessage.on !== 'boolean') {
                            return console.log('Invalid toggle format, needs to be {"on": true|false}.')
                        }
                        
                        if (parsedMessage.on === true) {
                            state = state.on()
                        }  else {
                            state = state.off()
                        }
                    } catch(e) {
                        return console.log('Cannot parse message to valid JSON: ' + message)
                    }
                    break
                } 
                
                // lights/color
                case 'color': {
                    console.log('Handling lights/color ...')
                    
                    try {
                        const parsedMessage = JSON.parse(message)
                        
                        if (parsedMessage.color !== null && Array.isArray(parsedMessage.color) && parsedMessage.color.length === 3) {
                            const r = parsedMessage.color[0],
                                  g = parsedMessage.color[1],
                                  b = parsedMessage.color[2]
                                
                            state = state.on().rgb(r, g, b).shortAlert()
                        }  else {
                            return console.log('Invalid color format, needs to be {color: [r, g, b]}.')
                        }
                    } catch(e) {
                        return console.log('Cannot parse message to valid JSON: ' + message)
                    }
                    
                    break
                } 
                default: {
                    return console.log('Cannot handle sub-topic ' + subTopic)
                }
            }
        }
        case 'config': {
            if (topicPaths.length < 2 || allowedSubTopics.indexOf(topicPaths[1]) === -1) {
                return console.log('Trying to handle /lights without valid sub-topic. ')
            }
            var subTopic = topicPaths[1]
            
            switch (subTopic) {
                case 'adduser': {
                    function displayUserResult(user) {
                        console.log('Created new user:')
                        console.log(JSON.stringify(user, null, 2))
                        
                        username = user.username
                    }
                    
                    function displayError(error) {
                        console.log('Error creating new user:')
                        console.log(error)
                    }
                    
                    if (nodeUserExists()) {
                        return console.log('"Node API" User already exists')
                    }
                    
                    HueApi.registerUser(host, name)
                          .then(displayUserResult)
                          .fail(displayError)
                          .done();
                    break
                }
                default: {
                    return console.log('Cannot handle sub-topic ' + subTopic)
                }
            }
        }
        default: {
            return console.log('Cannot handle topic ' + topicPaths.join('/'))
        }
    }
}

function nodeUserExists() {
    function displayResult(result) {
        var devices = result.devices
        
        for (var i = 0; i < devices.length; i++) {
            if (devices[i].name === name) {
                return true
            }
        }
        
        return false
    }
    
    api.registeredUsers().then(displayResult).done()
}
