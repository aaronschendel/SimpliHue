# SimpliHue
SimpliHue integrates Simplisafe's undocumented API with Phillips Hue lights. This app will monitor the status of your SimpliSafe alarm system and turn on a group of lights if the alarm is triggered or turn off a group of lights if the alarm is set to Away.

# Requirements/Limitations
- This will only work with a SimpliSafe account with a single "Protected Location" (one house)
- You must be subscribed to the "Interactive" monitoring plan (the plan that gives you access to your system via the phone app)
- You must be using the "All New SimpliSafe" also known as SimpliSafe Version 3. It looks like this - http://simplisafe.com/files/blog/images/allnewsimplisafe.png
- This will only work as long as SimpliSafe keeps their API endpoints the same as they currently are. Due to this being an undocumented API this could break at any time without warning

# Configuration Files
Place all configuration files at the root directory
## simplisafe_config.json

```
{
    "credentials": {
        "username_ss": "john@doe.com",
        "password": "myp@ssw0rd"
    }
}
```
____
## hue_config.json
- username_hue
    - This is an auto-generated value by your Hue bridge when a user is registered. To register a user you can follow the documentation for the "node-hue-api" project here - https://github.com/peter-murray/node-hue-api#installation. Also, the Phillips Hue dev documentation to create a new user using the bridge IP address is here - https://developers.meethue.com/develop/get-started-2/ (free dev account required to view)
- host
    - This is the IP address of your Phillips Hue hub. If your bridge has signed into the meethue portal at any point, you can just visit http://meethue.com/api/nupnp to find this address. Note that the computer must be on the same network as the bridge for that URL to work.
- away_group_id
    - This is the id of the light group you would like to turn off when SimpliSafe is set to Away. 0 is the default group id for all lights.
- alarm_group_id
    - This is the id of the light group you would like to turn on when SimpliSafe Alarm is triggered. 0 is the default group id for all lights.
```
{
    "huehub_creds": {
        "username_hue": "your_generated_username",
        "host": "192.168.00.00"
    },
    "light_groups": {
        "away_group_id": "0",
        "alarm_group_id": "0"
    }
}
```