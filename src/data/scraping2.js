let words = {};


let h2s = [...document.getElementsByTagName('h2')];
let lists = [...document.getElementsByTagName('ul')];
lists.splice(0,1);

h2s.forEach((h2, i) => {


    let word = h2.innerHTML;
    let list = lists[i];
    let items = list.getElementsByTagName('li');

    let reading = items[0].innerHTML;
    reading = reading.substring(4);


    // just only  use the first reading
    reading = reading.split(', ')[0];

    let meaning = "";
    if(items.length == 4) {
        meaning = items[2].innerHTML;
        meaning = meaning.substring(9);
    }
    else {
        meaning = items[1].innerHTML;
        meaning = meaning.substring(9);
    }

    let separators = [', ', '; '];
    let meanings = meaning.split(new RegExp(separators.join('|'), 'g'));

    meanings.forEach((m) => {
        m = m.replaceAll('"', '').replaceAll('(','').replaceAll(')','').trim().toLowerCase();
        words[""+m] = [word, reading, meaning];
    });

});


document.write( JSON.stringify(words));