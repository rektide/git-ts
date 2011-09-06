# git-ts #

**git-ts** begins life as a *githooks*(5) implementation for reporting and recording commits to a publictimestamp.org timestamp server.  any un-garabage collected blobs will have their full paths recorded, making this tool suitable for usage of git as a *version management* and *change control* system.

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

it timestamps the object of commit, the blob of the commit, as well as the commit's fully pathed tree with filesizes. 

for example:

```0471cf8825969c8fc8f428afd3e6c23e4065786f
tree 913d9b38ed1a06236c042824c4cfd80c30e19490
parent 5179451d189a9c4cf42461b143e54c38f92eefe8
author rektide <rektide@voodoowarez.com> 1315301027 -0400
committer rektide <rektide@voodoowarez.com> 1315301027 -0400

Add second parameter to git-ts install to add url into post-commit script. %s is substituted for the commit blob.

100644 blob 1636d41c9ccc1fe4bb56b014b0bef725f24fec79 555	README.md
040000 tree e9e918ecaee01755fec99becdd68f5da54a5cbe6 -	bin
100755 blob 765ef9423c1ae049b3cf81c564d84812b3f12cc6 86	bin/git-ts
100755 blob 89e1c6a7072ef617fc8d723bff94fcfa4144ff83 93	bin/git-ts-publish
100755 blob 825097f24a3e7bd734f7e2ff7d3092e27d0a8639 116	bin/publictimestamp
040000 tree 2b72caa7cda79cd16c5b6349044f1ec903e83dc8 -	examples
100644 blob d45446451a1ac5edc7d5be5881e20739ba9d6eb8 244	examples/commit.cat
100644 blob 900e57be5ccdce573d5f7af8c3a55344073c37cf 163	examples/log.cat
100644 blob dc4971ce650bc620d500b187e4b9dfd9acf6705d 51	examples/ptb.url
100644 blob 44844e815d9b61a99d6f724e9bcd6e2d89edaa5e 133	examples/response.cat
100644 blob 15f0dca82f4598810173fd1d2813fd159e853132 668	examples/server_start.cat
100644 blob dac097849bde1a4fc5591f647b614c2e8a7d8f7f 2466	examples/server_start.hash.xml
100644 blob f62b13d4b2b2485a3f1e52a7b75295c4147c9ef6 382	examples/tree.cat
040000 tree 65661aa4fc07abcb783c2bb3fda5c1c8e626a667 -	lib
100644 blob ced4376aed82d90b1630ba76a302c7028adc7bb8 78	lib/publictimestamp-1.0-J1.6.jar.url
100644 blob 56990d045b9b8cb6c9349b1fb551652bd9ca9fcc 588	package.json
100644 blob 58a35075b844fdfa0116de7fdbbfda6d7481a2df 4270	publish.js
100755 blob 54cc6cdb9dd95458e62acfbb960490c34e59fb15 1484	server.js```

# future considerations #

+ a `post-receive` hook
+ audits and PTB remailers:
    + AtomPub
    + Twitter
    + Email
    + XMPP
    + IRC
