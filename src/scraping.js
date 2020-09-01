let words = {};

let rows = [...document.getElementsByTagName('tr')];

rows.forEach((row) => {
    let cells = [...row.getElementsByTagName('td')];

    if(cells[2]) {

        let word = cells[0].innerHTML;
        let reading = cells[1].innerHTML;
        let separators = [', ', '; '];
        let meanings = cells[2].innerHTML.split(new RegExp(separators.join('|'), 'g'));

        meanings.forEach((meaning) => {
            meaning = meaning.replaceAll('"', '').replaceAll('(','').replaceAll(')','').trim().toLowerCase();
            words[""+meaning] = [word, reading, cells[2].innerHTML];
        });
    }
})


console.log(words);