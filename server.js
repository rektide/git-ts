#!/usr/bin/node

var exec= require('child_process').exec,
     fs= require('fs')
     spaces= /[\s]/,
     pieces= [null,null]

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
