import $ from 'jquery';
import Utils from './Components/Utils';
import kanji from './data/kanji.json';

console.log("Kanject Loaded.");



    console.log("Kanject: Scanning words.");

    // remove any old containers
    $('.kan-container, .kan-spacer').remove();

    let elements = [...$('p')];
    elements.forEach((el) => {


        console.log()

        let words = $(el).text().toLowerCase().trim().split(' ');
        let wordsUpper = $(el).text().trim().split(' ');


        $(el).html('');


        words.forEach((word, i) => {




            if(kanji[word]) {
                console.log("Word found: " + word);
                console.log(kanji[word]);

                let symbol = kanji[word][0];
                let reading = kanji[word][1];

                


                // $('<div class="kan-spacer"></div>').appendTo(el);

                // $(`<div class="kan-container">
                //     <div class="kan-reading">` + reading + `</div>
                //     <div class="kan-symbol">` + symbol + `</div>
                //     <div class="kan-word">` + word + `</div>
                // </div>`).appendTo(el);

                $('<span style="text-decoration: underline;">'+wordsUpper[i]+'</span>').appendTo(el);
                $('<span> '+ symbol +'</span>').appendTo(el);
                $('<span> ('+ reading +') </span>').appendTo(el);

                $('<span> </span>').appendTo(el);

                $(`<div class="kan-container">
                     <div class="kan-reading">` + reading + `</div>
                     <div class="kan-symbol">` + symbol + `</div>
                     <div class="kan-word">` + word + `</div>
                 </div>`).insertAfter(el);


            }
            else {

                $('<span>'+wordsUpper[i]+'</span>').appendTo(el);
                $('<span> </span>').appendTo(el);


            }


        })

    });

    console.log("Kanject: Scan complete");




