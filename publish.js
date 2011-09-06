var 	optimist= require('optimist')
		.alias({e:'email', hp:'homepage', home:'homepage', p:'person', pn: 'project_name', t:'type', d:'dry', x:'xml', h:'help', n:'name', a:'auto', s:'send', '?':'help'})
		.default('auto',true)
	argv= optimist.argv

if(argv.help) {
	console.log('Usage: '+argv._+' [-n <document_title>] [-e <email>] [-hp <homepage>] [-p <person>] [-pn <project_name>] [-u <url>] [-type {1,2,3}] [-url <target_url>] [-dry] [-send] [-xml] [-[no-]auto] [-help]')
	process.exit(0)
}

if(!argv.xml)
	argv.send= true

var path= require('path'), 
	exec= require('child_process').exec,
	fs= require('fs'),
	Q= require('q'),
	tmp= '.tmp.'+(Math.random() * Math.pow(2,53)),
	home= path.dirname(process.argv[1])

var auditBlock= Q.defer(), // block that has been generated
	hash= Q.defer(), // the hash from the first line of the auditBlock
	written= Q.defer(), // block has been written to a temp file
	prefs_person= Q.defer(),
	prefs_email= Q.defer(),
	prefs_pn= Q.defer(),
	prefs_name= Q.defer()

process.on('exit', function() {
	// clean up temp file on exit
	fs.unlink(tmp)
})

Q.join(written.promise, prefs_person.promise, prefs_email.promise, prefs_pn.promise, prefs_name.promise, function(writtenVal,personVal,emailVal,pnVal,nameVal){
	// build publictimestamp command to run
	var pts= [home+"/bin/publictimestamp","-action",null],
		promiseMap = {
			e: emailVal,
			p: personVal,
			pn: pnVal,
			d: nameVal
		}
		backMap = {
			h: 'homepage',
			u: 'u',
			url: 'url',
			t: 'type'
		}
	for(var i in promiseMap) {
		var promise= promiseMap[i]
		if(promise !== undefined && promise !== '')
			pts.push("-"+i,promise)
	}
	for(var i in backMap) {
		var val= argv[backMap[i]]
		if(val)
			pts.push("-"+i,val)
	}
	pts.push('-f',tmp)

	function runAction(act,stream,dry){
		pts[2]= act
		var target= pts.join(" ")
		if(dry)
			console.log(target)
		else
			exec(target,function(err,stdout,stderr){
				if(err) {
					console.log("timestamp failed", err)
					process.exit(3)
				}
				stream.write(stdout)
			})
	}

	if(argv.xml) 
		runAction('xml',process.stdout,!!argv.dry)
	if(argv.send)
		runAction('send',process.stdout,!!argv.dry)
	
})

var filterUrl = /.*:([\w-]+)\.git$/
function filterRemote(url) {
	return filterUrl.exec(url)[1]
}

function promiseFilter(promise,filter) {
	return function(recv){
		var val= filter(recv)
		promise.resolve(val)
		return val
	}
}

var capture= {},
	awaitCapture= 0

if(argv.person) prefs_person.resolve(argv.person)
else if(argv.auto && argv.person !== false) { capture['user.name']= prefs_person; ++awaitCapture }
else prefs_name.resolve("")

if(argv.email) prefs_email.resolve(argv.email)
else if(argv.auto && argv.email!== false) { capture['user.email']= prefs_email; ++awaitCapture } 
else prefs_email.resolve("")

if(argv.pn) prefs_pn.resolve(argv.pn)
else if(argv.auto && argv.pn !== false) { capture['remote.origin.url']= promiseFilter(prefs_pn,filterRemote); ++awaitCapture }
else prefs_pn.resolve("")

if(argv.name) prefs_name.resolve(argv.name)
else if(argv.name !== false)
	Q.when(hash.promise,function(hashVal) {
		prefs_name.resolve(hashVal)
	})


if(awaitCapture > 0)
	exec('git config -l',function(err,stdout,stderr) {
		var lines= stdout.split("\n")
		function doCapture(key,val) {
			var recv= capture[key]
			if(typeof recv == "function")
				val= recv(val,key)
			else
				recv.resolve(val)
			delete capture[key]
		}
		for(var i in lines) {
			var line= lines[i]
			for(var j in capture) {
				var match= line.indexOf(j,0) >= 0
				if(!match) continue
				var val= line.substring(j.length+1)
				doCapture(j,val)
				break
			}
		}
		for(var j in capture) {
			doCapture(j)
		}
	})

Q.when(auditBlock.promise,function(auditBlockVal) {
	// auditBlock value is now available, write to a temp file
	fs.writeFile(tmp,auditBlockVal,function(err) {
		if(err) process.exit(2)
		// resolve the temp file
		written.resolve(true)
	})
},function(){})


//TODO: modularize code such that we don't have to invoke as a child process.
exec('git-ts',function(err,stdout,stderr) {
	if(err) {
		console.log("failed to launch git-ts",err)
		process.exit(2)
	}
	var firstLine= stdout.split("\n",1)[0]
	hash.resolve(firstLine)
	auditBlock.resolve(stdout)
})
