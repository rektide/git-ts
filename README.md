# git-ts #

**git-ts** begins life as a *githooks*(5) implementation for reporting and recording commits to a publictimestamp.org timestamp server.  any un-garabage collected blobs will have their full paths recorded, making this tool suitable for usage of git as a *version management* system.

currently it is designed to be fired via the `post-commit` hook.

# experimenting instructions #

+ `npm install git-ts`
+ use `git-ts` to get an audit block of the current commit.
+ use `git checkout <commit>` to assert old trees, and run `git-ts` and compare the audit block hashes to verify.

# installation instructions #

git-ts's primary mode is serving as a `post-commit` script; the `git-ts install` command sets this up for you if you're anywhere in a local git repository.

first, find a working `git-ts-publish` set of parameters: 

+ **use the `-dry` and `-help` commands to experiment!!!** git-ts-publish will publish otherwise!!!
+ inspect what data you want to publish first!
+ note how `git-ts-publish` attemtps to auto-detects fields such as person, email, project and name.
    + disable specific fields such as `--no-email`
    + disable auto-detect entirely with `--no-auto`
+ the `u` parameter will replace any `%s` found in the value with the commit object hash.

once you've arrived at a favorable set of parameters:

+ from anywhere within a git heirarchy, issue a `git-ts install` command i
    + if there is no `.git/hooks/post-commit`, it will be generated
    + if there is a already a `post-commit` file, the `.git/hooks/post-commit.git-ts-default` will forcibly be written.
+ the first parameter after `install` is a dedicated `-u` parameter. use `""` if undesired.
+ further parameters are passed verbatim

to use after install:

+ just commit as one normally would.

# implementation #

it timestamps the blob of the commit as well as the commit's fully pathed tree with filesizes. 

# future considerations #

+ a `post-receive` hook
+ audits atompub published
