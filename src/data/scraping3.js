
// single

let kanji = list.kanjilist.kanji;

let words = {};

kanji.forEach((item) => {

    let meanings = item.meaning.split(', ');

    meanings.forEach((meaning) => {

        delete item.compound;

        words[meaning.toLowerCase()] = item;
    });

});


document.write(JSON.stringify(words));








// compound

let kanji = list.kanjilist.kanji;

let words = {};

kanji.forEach((item) => {

    if(item.compound && item.compound.forEach) {

        item.compound.forEach((compound) => {
            let meanings = compound.translation.split(', ');
            meanings.forEach((meaning) => {

                words[meaning.toLowerCase()] = {
                    char: compound.kanji,
                    meaning: compound.translation,
                    kun: compound.kana
                }
            });

        });
        console.log(item.compound);

    }
});


document.write(JSON.stringify(words));