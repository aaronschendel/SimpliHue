const SS3Client = require('simplisafe-ss3');
const AsyncPolling = require('async-polling');
const fs = require('fs');
const hue = require("node-hue-api");

// Pull in credentials from config files and create Hue and Simplisafe objects
const {ss3Client, hue_api, lightState} = authorize();

// Pull in away and alarm group IDs from config file
const {away_group_id, alarm_group_id} = JSON.parse(fs.readFileSync('hue_config.json', 'utf8')).light_groups;

// Begin polling to watch state changes for Simplisafe
beginPolling(ss3Client, hue_api, lightState, away_group_id, alarm_group_id);

function authorize() {
    var ss3_json = JSON.parse(fs.readFileSync('simplisafe_config.json', 'utf8'));
    const {username_ss, password} = ss3_json.credentials;
    var ss3Client = new SS3Client(username_ss, password);
    
    var hue_json = JSON.parse(fs.readFileSync('hue_config.json', 'utf8'));
    const {username_hue, host} = hue_json.huehub_creds;
    var HueApi = hue.HueApi;
    var lightState = hue.lightState;
    var hue_api = new HueApi(host, username_hue);

    return {ss3Client, hue_api, lightState};
}

function beginPolling(ss3Client, hue_api, state, away_group_id, alarm_group_id) {
    ss3Client.login()
        .then(function() {
            console.log('User ID: ' + ss3Client.userId);
            console.log('Sub ID: ' + ss3Client.subId);
            console.log('Token: ' + ss3Client.token);

            var previousState = '';

            AsyncPolling(function(end) {
                ss3Client.getAlarmState()
                    .then(function(alarmState) {
                        if (alarmState != previousState) {
                            console.log('Alarm state: ' + alarmState);
                            if (alarmState == 'ALARM') {
                                setLightsAlarm(hue_api, state, alarm_group_id);
                            } else if (alarmState == 'HOME') { 
                                setLightsAway(hue_api, state, away_group_id);
                            }
                            previousState = alarmState;
                        }
                    });
                    end();
            }, 1000).run(); // This checks the state of SimpliSafe every 1 second. Adjust if desired.

        }, function(err) {
            console.log('Login failed due to: ' + err.message);
            throw err;
        });
}
 
function setLightsAlarm(api, lightState, alarm_group_id) {
    state = lightState.create().turnOn();
    api.setGroupLightState(alarm_group_id, state.turnOn());

}
function setLightsAway(api, lightState, away_group_id) {
    state = lightState.create().turnOff();
    api.setGroupLightState(away_group_id, state.turnOff());  
}

