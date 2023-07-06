
var voteIds = [];
var votes = [];
var originalTime = (new Date()).getTime();
document.querySelector('BUTTON').onclick = function(){
	// Check that opening post and nation name values are entered
	var nation = document.querySelector('#NAT').value;
	var open = document.querySelector('#OPEN').value;
	if(!nation){
		alert('No nation name entered.');
	}else if(!open){
		alert('No opening RMB post entered.');
	}else{
		// Add loading text
		document.body.innerHTML += '<BR/><BR/><SPAN CLASS="OUTPUT">Loading...</SPAN>';
		// Define function to send request to NS API
		function func1(offset, voteId){
			var request = new XMLHttpRequest();
			request.open('GET', 'https://www.nationstates.net/cgi-bin/api.cgi?region=tnp_gameside_voting_box&q=messages&limit=100&offset=' + offset + '&user_agent=Script Potato Baker by the Ice States in use by ' + nation, false);
			// Rate limit to avoid breaking API rules
			while(originalTime + 650 > (new Date()).getTime()){}; 
			request.send();
			originalTime = (new Date()).getTime();
			var posts = request.responseXML.querySelectorAll('POST');
			var cont = true;
			if(posts.length == 0){
				alert('Opening post not found.')
			}else{
				for(var item = 0; item < posts.length; item++){
					if(voteId != 0){
						if(request.responseXML.querySelectorAll('MESSAGE')[item].innerHTML.toLowerCase().indexOf('<![cdata[~' + voteId + ' for') == 0){
							// Vote is valid; check that nation is WA and still in TNP
							var request1 = new XMLHttpRequest();
							request1.open('GET', 'https://www.nationstates.net/cgi-bin/api.cgi?nation=' + request.responseXML.querySelectorAll('NATION')[item].innerHTML + '&q=wa+region&user_agent=Script Potato Baker by the Ice States in use by ' + nation, false);
							while(originalTime + 650 > (new Date()).getTime()){}; 
							request1.send();
							originalTime = (new Date()).getTime();
							if((request1.responseXML.querySelector('UNSTATUS').innerHTML == 'WA Member' || request1.responseXML.querySelector('UNSTATUS').innerHTML == 'WA Delegate') && request1.responseXML.querySelector('REGION').innerHTML == 'The North Pacific'){
								//Nation can vote; check whether nation has already voted
								if(voteIds.indexOf(request.responseXML.querySelectorAll('NATION')[item].innerHTML) != -1){
									//Nation has already voted; remove previous vote
									votes[voteIds.indexOf(request.responseXML.querySelectorAll('NATION')[item].innerHTML)] = null;
									voteIds[voteIds.indexOf(request.responseXML.querySelectorAll('NATION')[item].innerHTML)] = null;
								}
								//Add vote
								votes[votes.length] = 1;
								voteIds[voteIds.length] = request.responseXML.querySelectorAll('NATION')[item].innerHTML;
							}
						}
						if(request.responseXML.querySelectorAll('MESSAGE')[item].innerHTML.toLowerCase().indexOf('<![cdata[~' + voteId + ' against') == 0){
							var request1 = new XMLHttpRequest();
							request1.open('GET', 'https://www.nationstates.net/cgi-bin/api.cgi?nation=' + request.responseXML.querySelectorAll('NATION')[item].innerHTML + '&q=wa+region&user_agent=Script Potato Baker by the Ice States in use by ' + nation, false);
							while(originalTime + 650 > (new Date()).getTime()){}; 
							request1.send();
							originalTime = (new Date()).getTime();
							if((request1.responseXML.querySelector('UNSTATUS').innerHTML == 'WA Member' || request1.responseXML.querySelector('UNSTATUS').innerHTML == 'WA Delegate') && request1.responseXML.querySelector('REGION').innerHTML == 'The North Pacific'){
								if(voteIds.indexOf(request.responseXML.querySelectorAll('NATION')[item].innerHTML) != -1){
									//Nation has already voted; remove previous vote
									votes[voteIds.indexOf(request.responseXML.querySelectorAll('NATION')[item].innerHTML)] = null;
									voteIds[voteIds.indexOf(request.responseXML.querySelectorAll('NATION')[item].innerHTML)] = null;
								}
								votes[votes.length] = -1;
								voteIds[voteIds.length] = request.responseXML.querySelectorAll('NATION')[item].innerHTML;
							}
						}
						if(request.responseXML.querySelectorAll('MESSAGE')[item].innerHTML.toLowerCase().indexOf('<![cdata[~' + voteId + ' abstain') == 0){
							// Vote is valid; check that nation is WA and still in TNP
							var request1 = new XMLHttpRequest();
							request1.open('GET', 'https://www.nationstates.net/cgi-bin/api.cgi?nation=' + request.responseXML.querySelectorAll('NATION')[item].innerHTML + '&q=wa+region&user_agent=Script Potato Baker by the Ice States in use by ' + nation, false);
							while(originalTime + 650 > (new Date()).getTime()){}; 
							request1.send();
							originalTime = (new Date()).getTime();
							if((request1.responseXML.querySelector('UNSTATUS').innerHTML == 'WA Member' || request1.responseXML.querySelector('UNSTATUS').innerHTML == 'WA Delegate') && request1.responseXML.querySelector('REGION').innerHTML == 'The North Pacific'){
								if(voteIds.indexOf(request.responseXML.querySelectorAll('NATION')[item].innerHTML) != -1){
									//Nation has already voted; remove previous vote
									votes[voteIds.indexOf(request.responseXML.querySelectorAll('NATION')[item].innerHTML)] = null;
									voteIds[voteIds.indexOf(request.responseXML.querySelectorAll('NATION')[item].innerHTML)] = null;
								}
								votes[votes.length] = 0;
								voteIds[voteIds.length] = request.responseXML.querySelectorAll('NATION')[item].innerHTML;
							}
						}
						if(request.responseXML.querySelectorAll('MESSAGE')[item].innerHTML.toLowerCase().indexOf('<![cdata[~' + voteId + ' present') == 0){
							//Remove previous vote, if any
							if(voteIds.indexOf(request.responseXML.querySelectorAll('NATION')[item].innerHTML) != -1){
								//Nation has already voted; remove previous vote
								votes[voteIds.indexOf(request.responseXML.querySelectorAll('NATION')[item].innerHTML)] = null;
								voteIds[voteIds.indexOf(request.responseXML.querySelectorAll('NATION')[item].innerHTML)] = null;
							}
						}
					}
					if(posts[item].id == open){
						try{
							if(Number.parseInt(posts[item].innerHTML.split('~')[1]) != NaN){
								voteId = Number.parseInt(posts[item].innerHTML.split('~')[1]);
							}else{
								cont = false;
							}
						}catch(e){
							cont = false;
						}
					}
				}
				// Scan previous posts if opening post is not found
				if(voteId == 0 && cont){
					func1(offset + 100, 0);
				}
				// Rescan newer posts if opening post was found in previous scans
				if(offset > 0 && cont){
					func1(offset - 100, voteId);
				}
			}
		}
		// Actually send the request
		try{
			func1(0, 0);
		}catch(e){
			// Try again if cannot run, otherwise throw error
			try{
				func1(0, 0);
			}catch(e){
				alert('Failed to process or receive response from the NS API.');
			}
		}
		//Update output
		var votesFor = 0;
		var votesAgainst = 0;
		var votesAbstain = 0;
		for(var item = 0; item < votes; item++){
			if(votes[item] == 1){
				votesFor++;
			}else if(votes[item] === 0){
				votesAbstain++;
			}else if(votes[item] == -1){
				votesAgainst++;
			}
		}
		document.querySelector('.OUTPUT').innerHTML = '<SPAN CLASS="FOR">0</SPAN> votes for; <SPAN CLASS="AGAINST">0</SPAN> votes against; and <SPAN CLASS="ABSTAIN">0</SPAN> votes to abstain.<BR/>Votes for:<UL CLASS="FOR"></UL><BR/>Votes against:<UL CLASS="AGAINST"></UL><BR/>Votes to abstain:<UL CLASS="ABSTAIN"></UL>';
		for(var item = 0; item < votes.length; item++){
			if(votes[item] == 1){
				document.querySelector('SPAN.FOR').innerHTML = Number.parseInt(document.querySelector('SPAN.FOR').innerHTML) + 1;
				document.querySelector('UL.FOR').innerHTML += '<LI>' + voteIds[item] + '</LI>';
			}else if(votes[item] === 0){
				document.querySelector('SPAN.ABSTAIN').innerHTML = Number.parseInt(document.querySelector('SPAN.ABSTAIN').innerHTML) + 1;
				document.querySelector('UL.ABSTAIN').innerHTML += '<LI>' + voteIds[item] + '</LI>';
			}else if(votes[item] == -1){
				document.querySelector('SPAN.AGAINST').innerHTML = Number.parseInt(document.querySelector('SPAN.AGAINST').innerHTML) + 1;
				document.querySelector('UL.AGAINST').innerHTML += '<LI>' + voteIds[item] + '</LI>';
			}
		}
	}
}
