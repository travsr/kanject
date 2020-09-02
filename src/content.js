import $ from 'jquery';
import Utils from './Components/Utils';
import kanji from './data/kanji-full.json';

console.log("Kanject Loaded.");
console.log("Kanject: Scanning words.");

// remove any old containers
$('.kan-container, .kan-spacer').remove();


let lastWordFound = false;
let elements = [...$('p')];
elements.forEach((el) => {


    let words = $(el).text().toLowerCase().trim().split(' ');
    let wordsUpper = $(el).text().trim().split(' ');


    $(el).html('');


    words.forEach((word, i) => {

        if(kanji[word] && !lastWordFound) {

            let symbol = kanji[word][0];
            let reading = kanji[word][1];

            let kan = $(`<div class="kan-container">
                <span class="kan-symbol"> ` + symbol + `  </span>
                <div class="kan-reading">` + reading + `</div>
                <div class="kan-word"> ` + wordsUpper[i] + ` </div>
            </div>`);

            kan.on('mouseover', () => {
                kan.find('.kan-word').show();
                kan.find('.kan-reading').hide();
            });

            kan.on('mouseout', () => {
                kan.find('.kan-word').hide();
                kan.find('.kan-reading').show();
            });

            kan.appendTo(el);

            lastWordFound = true;

        }
        else {

            $('<span> '+wordsUpper[i]+' </span>').appendTo(el);
            lastWordFound = false;


        }


    })

});

console.log("Kanject: Scan complete");




