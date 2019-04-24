# Protocol

Requests are composed of a code and optional parameters.
The code is **always** a 3 digit integer.
The parameters are separated by the `;` symbol.

Example:
`123 arg1;arg2` Will send the code "123" with 2 parameters: "arg1" and "arg2".

## Requests
#### Server to Client

| Code | Parameters | Meaning |
| :-: | :----------: | :----------: |
|**100**|  | Ask computer ID. |

#### Client to Server

| Code | Parameters | Meaning |
| :-: | ---------- | :----------: |
|**100**| 1. Client ID | Send computer ID to server |

## Errors
#### Server to client

| Code | Parameters | Meaning |
| :-: | :----------: | :----------: |
|**200**|  | Invalid client ID |

#### Client to Server
