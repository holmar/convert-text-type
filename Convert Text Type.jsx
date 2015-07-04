/**
 * Convert Text Type
 * Adobe Illustrator script to convert Point text to Area text and vice versa.
 *
 * To install the script, place this file into the following folder:
 * Windows: C:\Program Files\Adobe\Adobe Illustrator [version]\Presets\Scripts
 * Mac: Applications/Adobe Illustrator [version]/Presets/Scripts
 *
 * Note: Depending on the application version and language, folder names may
 * be localized and the path may also include a region directory (e.g. en_US).
 *
 * @author Martin Holler
 * @version 1.0
 * @license MIT
 */

#target illustrator

(function () {
    'use strict';

    var AREAMAXWIDTH = 300;

    var _each = function (array, callback) {
        var i, len;

        if (typeof callback === 'function') {
            for (i = 0, len = array.length; i < len; i++) {
                callback(array[i], i);
            }
        }
    };

    try {
        if (app.documents.length) {
            _each(app.selection, function (item) {

                // check if the selected item is a text object and is either point or area text (ignore path text)
                if (item.typename === 'TextFrame' && (item.kind === TextType.POINTTEXT || item.kind === TextType.AREATEXT)) {
                    var layer = item.layer;
                    var textObject;
                    var boundingBox;

                    // if this is point text, create an area text object
                    if (item.kind === TextType.POINTTEXT) {
                        boundingBox = layer.pathItems.rectangle(item.top, item.left, item.width > AREAMAXWIDTH ? AREAMAXWIDTH : item.width, item.height);
                        textObject = layer.textFrames.areaText(boundingBox);

                    // if this is area text, create a point text object
                    } else {
                        textObject = layer.textFrames.pointText(item.position);
                    }

                    // move the contents of the original item to the new text object and then delete the original item
                    item.textRange.move(textObject, ElementPlacement.PLACEATEND);
                    textObject.position = item.position; // text positioning may be off after the content was moved, so reset it
                    item.remove();

                    // select the new text object
                    textObject.selected = false; // the element must be deselected first
                    textObject.selected = true;
                }
            });
        }
    } catch (err) {
        alert('Oops, something went wrong ...\n' + err + '\nLine: ' + err.line);
    }
}(app));
