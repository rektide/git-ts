#!/usr/bin/node

if(process.argv.length < 3) {
     console.log("usage: "+process.argv[1]+' output_file')
     process.exit(1)
}

var exec= require('child_process').exec,
     fs= require('fs')
     spaces= /[\s]/,
     pieces= [null,null],
     outfile= process.argv[2]

exec('git log -n1', function(err,stdout,stdin) {
     if(err) process.exit(2)
     var head= stdout.split(spaces,2)[1]
     exec('git cat-file -p '+head,function(err,stdout_catfile,stderr_catfile) {
          if(err) process.exit(3)
          var tree= stdout.split(spaces,2)[1]
          console.log('|tree',tree,'|')
          exec('git ls-tree -r -t -l --full-name '+tree,function(err,stdout_tree,stdin_tree) {
               if(err) process.exit(4)
               var stream= fs.createWriteStream(outfile,{flags:'w',encoding:'utf8',mode:660})
			
               stream.write(head)
               stream.write("\n")
               stream.write(stdout_catfile)
               stream.write("\n")
               stream.end(stdout_tree)
          })
     })
})
