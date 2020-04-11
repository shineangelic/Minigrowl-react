# Minigrowl-react
front-end for growl app

# APIs
```
   /api/minigrowl/v1/commands
   /api/minigrowl/v1/sensors
   /api/minigrowl/v1/actuators
```
/api/minigrowl/v1/commands/queue/add


## Command example:
```
{
        "name": "Turn intake Fan OFF",
        "targetActuator": 2,
        "val": "0"
}
```

## Sensors example:
```
[
    {
        "id": 17,
        "typ": "HUMIDITY",
        "val": "25.57002",
        "uinit": "PERCENT",
        "timeStamp": "2020-04-11T13:22:34.205+0000",
        "err": false
    },
    {
        "id": 21,
        "typ": "BAROMETER",
        "val": "1012.763",
        "uinit": "MILLIBAR",
        "timeStamp": "2020-04-11T13:22:20.353+0000",
        "err": false
    },
    {
        "id": 22,
        "typ": "TEMPERATURE",
        "val": "26.12",
        "uinit": "CELSIUS",
        "timeStamp": "2020-04-11T13:22:48.155+0000",
        "err": false
    },
    {
        "id": 33,
        "typ": "LIGHT",
        "val": "673",
        "uinit": "LUMEN",
        "timeStamp": "2020-04-11T13:23:02.023+0000",
        "err": false
    }
]
```

## Actuators example (w/ supported commands)
```
[
    {
        "id": 2,
        "typ": "FAN",
        "uinit": "CELSIUS",
        "timeStamp": "2020-04-11T13:26:25.983+0000",
        "val": "1",
        "err": false,
        "cmds": [
            {
                "name": "Turn ON intake Fan",
                "val": "1",
                "tgt": 2
            },
            {
                "name": "Turn intake Fan OFF",
                "val": "0",
                "tgt": 2
            }
        ]
    },
    {
        "id": 12,
        "typ": "LIGHT",
        "uinit": "CELSIUS",
        "timeStamp": "2020-04-11T13:25:58.109+0000",
        "val": "1",
        "err": false,
        "cmds": [
            {
                "name": "Switch lights ON",
                "val": "1",
                "tgt": 12
            },
            {
                "name": "Switch lights OFF",
                "val": "0",
                "tgt": 12
            }
        ]
    },
    {
        "id": 13,
        "typ": "FAN",
        "uinit": "CELSIUS",
        "timeStamp": "2020-04-11T13:26:11.987+0000",
        "val": "0",
        "err": false,
        "cmds": [
            {
                "name": "Turn ON outtake Fan",
                "val": "1",
                "tgt": 13
            },
            {
                "name": "Turn OFF outtake Fan",
                "val": "0",
                "tgt": 13
            }
        ]
    },
    {
        "id": 25,
        "typ": "HVAC",
        "uinit": "CELSIUS",
        "timeStamp": "2020-04-11T13:26:21.342+0000",
        "val": "1",
        "err": false,
        "cmds": [
            {
                "name": "Set Temperature",
                "val": "2",
                "tgt": 25
            },
            {
                "name": "Turn ON Hvac",
                "val": "1",
                "tgt": 25
            },
            {
                "name": "Turn OFF Hvac",
                "val": "0",
                "tgt": 25
            }
        ]
    }
]
```
