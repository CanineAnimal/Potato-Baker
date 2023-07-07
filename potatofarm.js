var voteId = 0;
var originalTime = (new Date()).getTime();
document.querySelector('BUTTON').onclick = function(){
	// Check that opening post and nation name values are entered
	var nation = document.querySelector('#NAT').value;
	var rezzy = document.querySelector('#REZZY').value;
	var pw = document.querySelector('#PW').value;
	if(!nation){
		alert('No nation name entered.');
	}else if(!rezzy){
		alert('No resolution/proposal link entered.');
  }else if(!pw){
    alert('No password entered!');
	}else{
		// Define function to find last opened vote
		function func1(offset){
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
					if(posts[item].querySelector('NATION').innerHTML == 'TNP Gameside Voting'){
						try{
							if(Number.parseInt(posts[item].innerHTML.split('~')[1]) != NaN){
								voteId = Number.parseInt(posts[item].innerHTML.split('~')[1]);
        							cont = false;
                						break;
							}
						}catch(e){}
					}
				}
				// Scan previous posts if opening post is not found
				if(voteId == 0 && cont){
					func1(offset + 100, 0);
				}
			}
		}
    // Define function to make RMB post
    function func2(){
      voteId++;
      // Fetch pings
      var request1 = new XMLHttpRequest();
      request1.open('GET', 'https://www.nationstates.net/page=dispatch/id=1904210/raw=1', false);
      request1.setRequestHeader('User-Agent', 'Script Potato Baker by the Ice States in use by ' + nation);
			while(originalTime + 650 > (new Date()).getTime()){}; 
			request1.send();
			originalTime = (new Date()).getTime();
      var pings = (new DOMParser()).parseFromString(request1.responseText, 'text/html').querySelector('.dispatch > pre').innerHTML;
      var request2 = new XMLHttpRequest();
      request2.open('GET', rezzy, false);
      request2.setRequestHeader('User-Agent', 'Script Potato Baker by the Ice States in use by ' + nation);
      request2.send();
			while(originalTime + 6500 > (new Date()).getTime()){}; // Rate limit is much higher as this and the previous request scrape NS proper
			request2.send();
      rezzyHtml = (new DOMParser()).parseFromString(request2.responseText, 'text/html')
			originalTime = (new Date()).getTime();
      // Generate BBCode for RMB post
      bbCode = '~' + voteId + '~\n\nThere is a new [url=' + rezzy + '][u]'
        + rezzyHtml.querySelector('.WA_rtitle').textContent.split(' ')[0] + ' '
        + rezzyHtml.querySelector('.WA_rtitle').textContent.split(' ')[1]
        + ' resolution[/u][/url] to vote on!\n\n[b]Resolution name:[/b] '
        + rezzyHtml.querySelector('.WA_thing_header > h2').textContent
        + '\n[b]' + rezzyHtml.querySelector('.WA_thing_rbox > p').textContent.replace(':', ':[/b]') + '\n'
        + (function(){
          // Check if SC targeted resolution
          if(rezzyHtml.querySelectorAll('.WA_thing_rbox > p > .WA_leader')[1].textContent.indexOf('Nominee') != -1){
            return '[b]Nominee:[/b] ' + 
              (function(){
                // Has nominee; check if region or nation
                if(rezzyHtml.querySelectorAll('.WA_thing_rbox > p')[1].querySelectorAll('.nnameblock').length == 0){
                  return '[region]' + rezzyHtml.querySelectorAll('.WA_thing_rbox > p')[1].querySelector('.rlink').textContent + '[/region]\n';
                }else{
                  return '[nation]' + rezzyHtml.querySelectorAll('.WA_thing_rbox > p')[1].querySelector('.nnameblock').textContent + '[/nation]\n';
                }
              })()
          }else{
            // No nominee; print just type etc
            return '[b]' + request2.responseXML.querySelectorAll('.WA_thing_rbox > p')[1].textContent.replace(':', ':[/b]') + '\n'
          }
        })()
        + '[b]Author:[/b] [nation]' + request2.responseXML.querySelectorAll('.WA_thing_rbox > p')[2].querySelector('.nnameblock').textContent + '[/nation]\n'
        + (function(){
          // Check if the proposal has co-authors
          if(request2.responseXML.querySelectorAll('.WA_thing > p > .WA_leader').length > 0){
            // There are co-authors, so list them
            return '[b]'
              + request2.responseXML.querySelectorAll('.WA_thing > p')[request2.responseXML.querySelectorAll('.WA_thing > p').length - 1].textContent
              .replace(': ', ':[/b] [nation]')
              .replaceAll(', ', '[/nation], [nation]')
              + '[/nation]\n';
          }else{
            return ''
          }
        })()
        + '\nYou are encouraged to cast a vote, or simply debate the resolution and its merits, by posting in this Regional Message Board below!\n\nPlease note that you should not vote if you have voted on the WAA Forum (https://forum.thenorthpacific.org/forum/39609/). Only votes from current TNP WA nations will be counted! To ensure that your vote is properly counted, add (without the quotes) "~' + voteId + ' For", "~' + voteId + ' Against", "~' + voteId + ' Abstain", or "~' + voteId + ' Present" to the very first line of your post, according to how you want your vote to be counted.\n\n[spoiler=Notifications][quote=Notifications;00000]' + pings + '[/quote][/spoiler]\n[i]Telegram [nation]The Ice States[/nation] to be notified of future WA votes![/i]';  
      bbCode.replaceAll('  ', ' '); // Stupid NS HTML
      alert(bbCode)
    }
    // Define function to send RMB post
    var func3 = function(){
      var request3 = new XMLHttpRequest();
      request3.open('GET', 'https://www.nationstates.net/cgi-bin/api.cgi?c=rmbpost&nation=tnp_gameside_voting&region=tnp_gameside_voting_box&c=rmbpost&text=' + bbCode + '&mode=prepare', false);
      request3.setRequestHeader('User-Agent', 'Script Potato Baker by the Ice States in use by ' + nation);
      request3.setRequestHeader('X-Password', pw);
      request3.send();
      var request4 = new XMLHttpRequest();
      request4.open('GET', 'https://www.nationstates.net/cgi-bin/api.cgi?c=rmbpost&nation=tnp_gameside_voting&region=greater_dienstad&c=rmbpost&text=' + bbCode + '&mode=execute&token=' + request3.responseXML.querySelector('SUCCESS').innerHTML, false);
      request4.setRequestHeader('User-Agent', 'Script Potato Baker by the Ice States in use by ' + nation);
      request4.setRequestHeader('X-Pin', request3.getResponseHeader('x-pin'));
      request4.send();
		// Actually execute all these functions
		func1(0);
    document.querySelector('IFRAME').contentWindow.document.body.innerHTML += '<SCRIPT>func2();func3();</SCRIPT>';
  }
}
