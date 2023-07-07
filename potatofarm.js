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
			request.open('GET', 'https://www.nationstates.net/cgi-bin/api.cgi?region=tnp_gameside_voting_box&q=messages&limit=100&offset=' + offset, false);
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
      request1.open('GET', 'https://www.nationstates.net/cgi-bin/api.cgi?q=dispatch;dispatchid=1904210&user_agent=Script Potato Baker by the Ice States in use by ' + nation, false);
      while(originalTime + 650 > (new Date()).getTime()){}; 
      request1.send();
      originalTime = (new Date()).getTime();
      pings = request1.responseXML.querySelector('TEXT').innerHTML.replace('<![CDATA[', '').replace(']]>', '');
      var rezzyId = rezzy.split('=')[rezzy.split('=').length - 1];
      if(rezzyId == 'ga'){
        var request2 = new XMLHttpRequest();
        request2.open('GET', 'https://www.nationstates.net/cgi-bin/api.cgi?wa=1&q=resolution&user_agent=Script Potato Baker by the Ice States in use by ' + nation, false);
		    while(originalTime + 650 > (new Date()).getTime()){};
			  request2.send();
        rezzyXml = request2.responseXML.querySelector('RESOLUTION');
      }else if(rezzyId == 'sc'){
        var request2 = new XMLHttpRequest();
        request2.open('GET', 'https://www.nationstates.net/cgi-bin/api.cgi?wa=2&q=resolution&user_agent=Script Potato Baker by the Ice States in use by ' + nation, false);
		    while(originalTime + 650 > (new Date()).getTime()){};
			  request2.send();
        rezzyXml = request2.responseXML.querySelector('RESOLUTION');
      }else{
        var request2 = new XMLHttpRequest();
        request2.open('GET', 'https://www.nationstates.net/cgi-bin/api.cgi?wa=0&q=proposals&user_agent=Script Potato Baker by the Ice States in use by ' + nation, false);
        request2.setRequestHeader('User-Agent', 'Script Potato Baker by the Ice States in use by ' + nation);
			  while(originalTime + 650 > (new Date()).getTime()){};
			  request2.send();
        rezzyXml = request2.responseXML.querySelector('#' + rezzyId);
      };
			originalTime = (new Date()).getTime();
      // Generate BBCode for RMB post
      bbCode = '~' + voteId + '~\n\nThere is a new [url=' + rezzy + '][u]resolution[/u][/url] to vote on!\n\n[b]Resolution name:[/b] '
        + rezzyXml.querySelector('NAME').innerHTML
        + '\n[b]Category:[/b]'
        + rezzyXml.querySelector('CATEGORY').innerHTML
        + (function(){
          // Check if SC resolution has nation target
          if(rezzyXml.querySelector('OPTION').innerHTML.split(':')[0] == 'N'){
            return '\n[b]Nominee:[/b] [nation]' + rezzyXml.querySelector('OPTION').innerHTML.split(':')[1] + '[/nation]\n';
          // Check if SC resolution has region target
          }else if(rezzyXml.querySelector('OPTION').innerHTML.split(':')[0] == 'R'){
            return '\n[b]Nominee:[/b] [region]' + rezzyXml.querySelector('OPTION').innerHTML.split(':')[1] + '[/region]\n';
          // Check for regular AoE/strength/etc
          }else if(isNaN(rezzyXml.querySelector('OPTION').innerHTML)){
            return ' (' + rezzyXml.querySelector('OPTION').innerHTML + ')\n'
          }else if(rezzyXml.querySelector('OPTION').innerHTML == '0'){
            return ' (Mild)\n' // Stupid API says 0 instead of Mild
          }else{
            // Has repeal target
            return ' ([url=https://www.nationstates.net/page=WA_past_resolution/id=' + rezzyXml.querySelector('OPTION').innerHTML + ']target[/url])\n';
          }
        })()
        + '[b]Author:[/b] [nation]' + rezzyXml.querySelector('PROPOSED_BY').innerHTML + '[/nation]\n'
        + (function(){
          // Check if the proposal has co-authors
          if(rezzyXml.querySelectorAll('COAUTHOR > N').length > 1){
            // There are multiple co-authors, so list them
            output_thingy = '[b]Co-authors:[/b] ';
            var jtem = 0;
            while(jtem < rezzyXml.querySelectorAll('COAUTHOR > N').length - 1){
              output_thingy += '[nation]' + rezzyXml.querySelectorAll('COAUTHOR > N')[jtem].innerHTML + '[/nation], ';
              jtem++;
            }
            output_thingy += '[nation]' + rezzyXml.querySelectorAll('COAUTHOR > N')[jtem].innerHTML + '[/nation]';
            return output_thingy;
          }else if(rezzyXml.querySelectorAll('COAUTHOR > N').length == 1){
            // There is one co-author, so list it
            return '[b]Co-author:[/b] ' + rezzyXml.querySelector('COAUTHOR > N').innerHTML
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
    }
    // Actually execute all these functions
		func1(0);
    func2();
    func3();
  }
}
