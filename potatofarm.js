var voteId = 0;
var originalTime = (new Date()).getTime();
var nation;
var rezzy;
var pw;
var dt;
var offset = 0;
var cont = true;
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
  bbCode = '~' + voteId + '~\%0D%0A\%0D%0AThere is a new [url=' + rezzy + '][u]resolution[/u][/url] to vote on!\%0D%0A\%0D%0A[b]Resolution name:[/b] '
    + rezzyXml.querySelector('NAME').innerHTML
    + '\%0D%0A[b]Debate thread:[/b] '
	  + dt.replaceAll('&', '\%26').replaceAll('?', '\%3F').replaceAll('=', '\%3D')
    + '\%0D%0A[b]Category:[/b] '
    + rezzyXml.querySelector('CATEGORY').innerHTML
    + (function(){
      // Check if SC resolution has nation target
      if(rezzyXml.querySelector('OPTION').innerHTML.split(':')[0] == 'N'){
        return '\%0D%0A[b]Nominee:[/b] [nation]' + rezzyXml.querySelector('OPTION').innerHTML.split(':')[1] + '[/nation]\%0D%0A';
      // Check if SC resolution has region target
      }else if(rezzyXml.querySelector('OPTION').innerHTML.split(':')[0] == 'R'){
        return '\%0D%0A[b]Nominee:[/b] [region]' + rezzyXml.querySelector('OPTION').innerHTML.split(':')[1] + '[/region]\%0D%0A';
      // Check for regular AoE/strength/etc
      }else if(isNaN(rezzyXml.querySelector('OPTION').innerHTML)){
        return ' (' + rezzyXml.querySelector('OPTION').innerHTML + ')\%0D%0A'
      }else if(rezzyXml.querySelector('CATEGORY').innerHTML == 'Declaration'){
	      return '\%0D%0A'
      }else if(rezzyXml.querySelector('OPTION').innerHTML == '0'){
        return ' (Mild)\%0D%0A' // Stupid API says 0 instead of Mild
      }else{
        // Has repeal target
        return ' ([url=https://www.nationstates.net/page=WA_past_resolution/id=' + (eval(rezzyXml.querySelector('OPTION').innerHTML) + 1).toString() + ']target[/url])\%0D%0A';
      }
    })()
    + '[b]Author:[/b] [nation]' + rezzyXml.querySelector('PROPOSED_BY').innerHTML + '[/nation]\%0D%0A'
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
        return '[b]Co-author:[/b] [nation]' + rezzyXml.querySelector('COAUTHOR > N').innerHTML + '[/nation]';
      }else{
        // There are no co-authors
        return '';
      }
    })()
    + '\%0D%0AYou are encouraged to cast a vote, or simply debate the resolution and its merits, by posting in this Regional Message Board below!\%0D%0A\%0D%0ANotes,\%0D%0A-You should not vote if you have voted on the WAA Forum (https://forum.thenorthpacific.org/forum/39609/). Only votes from current TNP WA nations will be counted! That said, ineligible voters are still free to engage in commentary or debate regarding the resolution.\%0D%0A\%0D%0A-To ensure that your vote is properly counted, add (without the quotes) "~' + voteId + ' For", "~' + voteId + ' Against", "~' + voteId + ' Abstain", or "~' + voteId + ' Present" to the very first line of your post, according to how you want your vote to be counted.\%0D%0A\%0D%0A-Please only vote on one resolution per post -- to vote on multiple resolutions, make two posts with one vote on each (double posting rules do not apply here).\%0D%0A\%0D%0AINSERTNOTIFSHERE[i]Telegram [nation]The Ice States[/nation] to be notified of future WA votes![/i]';  
  bbCode.replaceAll('  ', ' '); // Stupid NS HTML
  alert(bbCode)
}
// Define function to send RMB posts
var func3 = function(){
  // Add notifications only to BBCode for TNP Gameside Voting Box RMB
  var bbCode1 = bbCode.replace('INSERTNOTIFSHERE', '[spoiler=Notifications][quote=Notifications%3B12345]' + pings + '[/quote][/spoiler]\%0D%0A');

  // Post to TNP Gameside Voting Box
  var request3 = new XMLHttpRequest();
  request3.open('GET', 'https://www.nationstates.net/cgi-bin/api.cgi?c=rmbpost&nation=tnp_gameside_voting&region=tnp_gameside_voting_box&c=rmbpost&text=' + bbCode + '&mode=prepare', false);
  request3.setRequestHeader('User-Agent', 'Script Potato Baker by the Ice States in use by ' + nation);
  request3.setRequestHeader('X-Password', pw);
  while(originalTime + 650 > (new Date()).getTime()){}; 
  request3.send();
  originalTime = (new Date()).getTime();
  request4.open('GET', 'https://www.nationstates.net/cgi-bin/api.cgi?c=rmbpost&nation=tnp_gameside_voting&region=tnp_gameside_voting_box&c=rmbpost&text=' + bbCode + '&mode=execute&token=' + request3.responseXML.querySelector('SUCCESS').innerHTML, false);
  request4.setRequestHeader('User-Agent', 'Script Potato Baker by the Ice States in use by ' + nation);
  request4.setRequestHeader('X-Pin', request3.getResponseHeader('x-pin'));
  while(originalTime + 650 > (new Date()).getTime()){}; 
  request4.send();
  originalTime = (new Date()).getTime();
  
  // Amend post content for posting to TNP RMB itself
  bbCode2 = bbCode.replace('this Regional Message Board below', 'the Regional Message board of [region]TNP Gameside Voting[/region]');
  
  // Post to TNP RMB
  var request5 = new XMLHttpRequest();
  request5.open('GET', 'https://www.nationstates.net/cgi-bin/api.cgi?c=rmbpost&nation=tnp_gameside_voting&region=the_north_pacific&c=rmbpost&text=' + bbCode2 + '&mode=prepare', false);
  request5.setRequestHeader('User-Agent', 'Script Potato Baker by the Ice States in use by ' + nation);
  request5.setRequestHeader('X-Pin', request3.getResponseHeader('x-pin');
  while(originalTime + 650 > (new Date()).getTime()){}; 
  request5.send();
  originalTime = (new Date()).getTime();
  var request6 = new XMLHttpRequest();
  request6.open('GET', 'https://www.nationstates.net/cgi-bin/api.cgi?c=rmbpost&nation=tnp_gameside_voting&region=the_north_pacific&c=rmbpost&text=' + bbCode2 + '&mode=execute&token=' + request5.responseXML.querySelector('SUCCESS').innerHTML, false);
  request6.setRequestHeader('User-Agent', 'Script Potato Baker by the Ice States in use by ' + nation);
  request6.setRequestHeader('X-Pin', request3.getResponseHeader('x-pin'));
  while(originalTime + 650 > (new Date()).getTime()){}; 
  request6.send();
  originalTime = (new Date()).getTime();
  
  alert('Posted to RMBs of TNP Gameside Voting Box and The North Pacific.')
}
document.querySelector('BUTTON').onclick = function(){
	// Check that opening post and nation name values are entered
	nation = document.querySelector('#NAT').value;
	rezzy = document.querySelector('#REZZY').value;
	pw = document.querySelector('#PW').value;
  dt = document.querySelector('#DT').value;
	if(!nation){
		alert('No nation name entered.');
	}else if(!rezzy){
		alert('No resolution/proposal link entered.');
  }else if(!dt){
    alert('No debate thread entered.');
  }else if(!pw){
    alert('No password entered.');
	}else{
    // Find last opened vote
    while((voteId == 0) && cont){
      var request = new XMLHttpRequest();
      request.open('GET', 'https://www.nationstates.net/cgi-bin/api.cgi?region=tnp_gameside_voting_box&q=messages&limit=100&offset=' + offset + '&user_agent=Script Potato Baker by the Ice States in use by ' + nation, false);
      // Rate limit to avoid breaking API rules
      while(originalTime + 650 > (new Date()).getTime()){}; 
      request.send();
      originalTime = (new Date()).getTime();
      var posts = request.responseXML.querySelectorAll('POST');
      if(posts.length == 0){
        alert('Opening post not found.')
        cont = false;
      }else{
        for(var item = 0; item < posts.length; item++){
          if((posts[item].querySelector('NATION').innerHTML == 'tnp_gameside_voting') && cont){
            console.log(posts[item].querySelector('MESSAGE'))
            try{
              if(posts[item].querySelector('MESSAGE').innerHTML.split('~')[1] != (NaN || undefined)){
                voteId = Number.parseInt(posts[item].querySelector('MESSAGE').innerHTML.split('~')[1]);
                cont = false;
                alert('Found opening post; ID ' + posts[item].innerHTML.split('~')[1]);
              }
            }catch(e){
              // Probably does not have content because of being deleted or something
            }
          }
        }
        // Scan previous posts if opening post is not found
        offset += 100;
      }
    }
    // Actually execute all these functions
    func2();
    func3();
  }
}
