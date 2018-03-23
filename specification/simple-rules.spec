
A single byte
| start 97
> a
= [ 'a' ]

Several bytes in a row
| start 97 98 99
> abc
= [ 'a', 'b', 'c' ]

Should prioritize the first rule when parsing
| start 97
| start 98
> a
= [ 'a' ]

Should try all alternatives
| start 97
| start 98
> b
= [ 'b' ]
