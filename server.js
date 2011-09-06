#!/usr/bin/node

var exec= require('child_process').exec,
     fs= require('fs')
     spaces= /[\s]/,
     pieces= [null,null]

// this first section, install, builds post-commit files.
if(process.argv[2] == 'install') {
	var path= require('path'),
		cwd= process.cwd()
		dir= cwd
	while(dir.length > 1) {
		var trial= null,
			git_dir= dir+"/.git/hooks"
		try {
			trial= fs.statSync(git_dir)
		} catch(ex) {
		}
		if(trial && trial.isDirectory) {
			dir= git_dir
			break;
		}
		dir= path.dirname(dir)
	}
	if(dir.length <= 1) {
		process.exit(1)
	}

	var dest= dir+"/post-commit"
	try{
		fs.statSync(dest)
		dest= dest+".git-js-default"
	}catch(ex){
	}

	fs.writeFileSync(dest,"#!/bin/sh\ngit-ts-publish")
	process.exit()
}

process.exit(99)

exec('git log -n1', function(err,stdout,stdin) {
     if(err) process.exit(2)
     var head= stdout.split(spaces,2)[1]
     exec('git cat-file -p '+head,function(err,stdout_catfile,stderr_catfile) {
          if(err) process.exit(3)
          var tree= stdout.split(spaces,2)[1]
          exec('git ls-tree -r -t -l --full-name '+tree,function(err,stdout_tree,stdin_tree) {
               if(err) process.exit(4)
               process.stdout.write(head)
               process.stdout.write("\n")
               process.stdout.write(stdout_catfile)
               process.stdout.write("\n")
               process.stdout.end(stdout_tree)
          })
     })
})
