import $ from 'jquery';
import Utils from './Components/Utils';
import kanji from './data/kanji.json';

console.log("Kanject Loaded.");



setInterval(() =>  {
    console.log("Kanject: Scanning words.");

    // remove any old containers
    $('.kan-container, .kan-spacer').remove();

    let elements = [...$('p, span, h1, h2, h3, h4, h5, label')];
    elements.forEach((el) => {

        let words = $(el).text().toLowerCase().trim().split(' ');

        words.forEach((word) => {


            if(kanji[word]) {
                console.log("Word found: " + word);
                console.log(kanji[word]);

                let symbol = kanji[word][0];
                let reading = kanji[word][1];
                

                $('<div class="kan-spacer"></div>').appendTo(el);
                
                $(`<div class="kan-container">
                    <div class="kan-reading">` + reading + `</div>
                    <div class="kan-symbol">` + symbol + `</div>
                    <div class="kan-word">` + word + `</div>
                </div>`).appendTo(el);
            }


        })

    });

    console.log("Kanject: Scan complete");


}, 4000);

