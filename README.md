# git-ts #

*git-ts* begins life as a *githooks*(5) implementation for reporting and recording commits to a publictimestamp.org timestamp server.  any un-garabage collected blobs will have their full paths recorded, making this tool suitable for usage of git as a *version management* system.

currently it is designed to be fired via the `post-commit` hook.

# implementation #

it timestamps the blob of the commit as well as the commit's fully pathed tree with filesizes. 

# future considerations #

+ a `post-receive` hook
+ audits atompub published
