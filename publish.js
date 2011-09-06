var 	optimist= require('optimist')
		.alias({e:'email', hp:'homepage', home:'homepage', p:'person', pn: 'project_name', t:'type', d:'dry', x:'xml', h:'help'}),
	argv= optimist.argv

if(argv.help || process.argv.length < 5) {
	console.log('Usage: '+argv._+' [-e <email>] [-h <homepage>] [-p <person>] [-pn <project_name>] [-u <url>] [-t {1,2,3}] [-url <target_url>] [-dry] [-xml]')
	console.log(" at least one parameter required to commit, else this runs dry\n")
	if(argv.help)
		process.exit(1)
	argv.dry = true
	argv.xml = true
}

var path= require('path'), 
	exec= require('child_process').exec,
	fs= require('fs'),
	Q= require('q'),
	tmp= '.tmp.'+(Math.random() * Math.pow(2,53)),
	params= ['email','homepage','person','project_name','u','type','url','xml','dry'],
	home= path.dirname(process.argv[1])

process.on('exit', function() {
	// clean up temp file on exit
	fs.unlink(tmp)
})

var auditBlock= Q.defer(), // block has been generated
	written= Q.defer() // block has been written to a temp file

Q.when(auditBlock,function(auditBlockVal) {
	// auditBlock value is now available, write to a temp file
	fs.writeFile(tmp,auditBlockVal,function(err) {
		if(err) process.exit(2)
		// resolve the temp file
		written.resolve(true)
	})
},function(){})

Q.when(written,function(writtenVal){
	var pts= [home+"/bin/publictimestamp","-action",null]
	for(var i in params)
		if(argv[params[i]])
			pts.push("-"+i,argv[params[i]])
	pts.push('-f',tmp)

	function runAction(act,stream){
		pts[2]= act
		var target= pts.join(" ")
		exec(target,function(err,stdout,stderr){
			if(err) {
				console.log("timestamp failed", err)
				process.exit(3)
			}
			stream.write(stdout)
		})
	}

	if(argv.xml) {
		runAction('xml',process.stdout)
	} else if (!argv.dry) {
		runAction('send',process.stdout)
	}
})


//TODO: modularize code such that we don't have to invoke as a child process.
exec('git-ts',function(err,stdout,stderr) {
	if(err) {
		console.log("failed to launch git-ts",err)
		process.exit(2)
	}
	auditBlock.resolve(stdout)
})
