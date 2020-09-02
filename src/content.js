import $ from 'jquery';
import Utils from './Components/Utils';

import n5single from './data/n5-single.json';
import n5compound from './data/n5-compound.json';

import n4compound from './data/n4-compound.json';

import n3single from './data/n3-single.json';
import n3compound from './data/n3-compound.json';

import n2single from './data/n2-single.json';
import n2compound from './data/n2-compound.json';

console.log("Kanject Loaded.");


browser.storage.local.get('settings').then((result) => {

    let settings = result.settings;

    // remove any old containers
    $('.kan-container, .kan-spacer').remove();

    let lastWordFound = false;
    let elements = [...$('p')];
    elements.forEach((el) => {


        let words = $(el).text().toLowerCase().trim().split(' ');
        let wordsUpper = $(el).text().trim().split(' ');


        $(el).html('');


        words.forEach((word, i) => {


            let item = null;

            if(n3compound[word]) {
                item = n3compound[word];
            }
            if(n3single[word]) {
                item = n3single[word];
            }
            if(n4compound[word]) {
                item = n4compound[word];
            }


            if(item && !lastWordFound) {

                let char = item.char;
                let reading = item.kun.split(', ')[0];

                let kan = $(`<div class="kan-container">
                    <span class="kan-char"> ` + char + `  </span>
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

                kan.find('.kan-char').on('click',() => {

                    browser.runtime.sendMessage({
                        action: "set_panel_url",
                        panel_url: "https://jisho.org/word/" + char
                    });

                });

                lastWordFound = true;

            }
            else {

                $('<span> '+wordsUpper[i]+' </span>').appendTo(el);
                lastWordFound = false;


            }


        })

    });

    console.log("Kanject: Scan complete");


});

