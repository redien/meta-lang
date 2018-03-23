
Nested rules
| rule  97
| start rule
> a
= [ [ 'a' ] ]

Nested several times
| third  97
| second third
| first  second
| start  first
> a
= [ [ [ [ 'a' ] ] ] ]

Right-recursive rules
| rule  97 rule
| rule  98
| start rule
> aab
= [ [ 'a', [ 'a', [ 'b' ] ] ] ]
