# Minigrowl-react
front-end for growl app

APIs
```
   /api/minigrowl/v1/commands
   /api/minigrowl/v1/sensors
   /api/minigrowl/v1/actuators
```
/api/minigrowl/v1/commands/queue/add


Command example:
```
{
        "name": "Turn intake Fan OFF",
        "targetActuator": 2,
        "val": "0"
}
```
